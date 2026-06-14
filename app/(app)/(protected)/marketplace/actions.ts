'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { marketplaceItem, marketplaceTransaction } from '@/lib/db/schema'
import { z } from 'zod'
import { eq } from 'drizzle-orm'

const createListingSchema = z.object({
  title: z.string().min(5, 'Judul minimal harus 5 karakter'),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive('Harga harus berupa angka positif')
  ),
  condition: z.string().min(1, 'Kondisi barang harus diisi'),
  category: z.string().min(1, 'Kategori harus dipilih'),
  description: z.string().min(10, 'Deskripsi minimal harus 10 karakter'),
  location: z.string().min(3, 'Lokasi serah terima minimal harus 3 karakter'),
})

const checkoutSchema = z.object({
  itemId: z.number(),
  paymentMethod: z.string().min(1, 'Metode pembayaran harus dipilih'),
  deliveryNote: z.string().min(5, 'Catatan serah terima (COD) minimal 5 karakter'),
})

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function createMarketplaceItem(
  formData: FormData
): Promise<ActionResponse<{ id: number; title: string; price: number; condition: string; category: string; description: string; imageUrl: string; location: string; sold: boolean; sellerId: string; createdAt: Date }>> {
  try {
    // 1. Authenticate User
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Tidak terautentikasi' }
    }

    // 2. Validate Text Data
    const rawData = {
      title: formData.get('title'),
      price: formData.get('price'),
      condition: formData.get('condition'),
      category: formData.get('category'),
      description: formData.get('description'),
      location: formData.get('location'),
    }

    const validation = createListingSchema.safeParse(rawData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((e: z.ZodIssue) => e.message).join(', '),
      }
    }

    const { title, price, condition, category, description, location } =
      validation.data

    // 3. Validate and Upload Image File
    const imageFile = formData.get('image') as File | null
    if (!imageFile || imageFile.size === 0) {
      return { success: false, error: 'Foto barang wajib diunggah' }
    }

    const ext = imageFile.name.split('.').pop() || 'jpg'
    const filename = `marketplace-${user.id}-${Date.now()}.${ext}`

    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('marketplace_images')
      .upload(filename, buffer, {
        contentType: imageFile.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, error: `Gagal mengunggah foto: ${uploadError.message}` }
    }

    // 4. Retrieve Public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('marketplace_images').getPublicUrl(filename)

    // 5. Insert to Database
    const [insertedItem] = await db
      .insert(marketplaceItem)
      .values({
        title,
        price,
        condition,
        category,
        description,
        imageUrl: publicUrl,
        location,
        sellerId: user.id,
        sold: false,
      })
      .returning()

    return { success: true, data: insertedItem }
  } catch (error: unknown) {
    console.error('Server action error:', error)
    const errMsg = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return { success: false, error: errMsg }
  }
}

export async function executeMarketplaceTransaction(input: {
  itemId: number
  paymentMethod: string
  deliveryNote: string
}): Promise<ActionResponse<{ transactionId: number }>> {
  try {
    // 1. Authenticate User
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Tidak terautentikasi' }
    }

    // 2. Validate Inputs
    const validation = checkoutSchema.safeParse(input)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((e: z.ZodIssue) => e.message).join(', '),
      }
    }

    const { itemId, paymentMethod, deliveryNote } = validation.data

    // 3. Atomically query, check status, write transaction and set sold = true
    const result = await db.transaction(async (tx) => {
      // Fetch item to verify ownership and sold status
      const [item] = await tx
        .select()
        .from(marketplaceItem)
        .where(eq(marketplaceItem.id, itemId))

      if (!item) {
        throw new Error('Barang tidak ditemukan')
      }

      if (item.sold) {
        throw new Error('Barang sudah terjual ke pembeli lain')
      }

      if (item.sellerId === user.id) {
        throw new Error('Anda tidak dapat membeli barang dagangan Anda sendiri')
      }

      // Insert transaction
      const [insertedTx] = await tx
        .insert(marketplaceTransaction)
        .values({
          itemId,
          buyerId: user.id,
          paymentMethod,
          deliveryNote,
          totalPrice: item.price,
        })
        .returning()

      // Set item to sold
      await tx
        .update(marketplaceItem)
        .set({ sold: true })
        .where(eq(marketplaceItem.id, itemId))

      return { transactionId: insertedTx.id }
    })

    return { success: true, data: result }
  } catch (error: unknown) {
    console.error('Checkout action error:', error)
    const errMsg = error instanceof Error ? error.message : 'Terjadi kesalahan server'
    return { success: false, error: errMsg }
  }
}
