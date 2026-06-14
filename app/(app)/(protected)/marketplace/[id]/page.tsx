import React from 'react'
import { db } from '@/lib/db'
import { marketplaceItem, profile } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  const itemId = Number(id)
  if (isNaN(itemId)) {
    notFound()
  }

  // 1. Fetch Item details with seller profile alias
  const itemWithSeller = await db
    .select({
      item: marketplaceItem,
      seller: profile,
    })
    .from(marketplaceItem)
    .leftJoin(profile, eq(marketplaceItem.sellerId, profile.id))
    .where(eq(marketplaceItem.id, itemId))
    .then((res) => res[0])

  if (!itemWithSeller || !itemWithSeller.item) {
    notFound()
  }

  const { item, seller } = itemWithSeller

  // 2. Fetch User Session
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user?.id === item.sellerId

  // Format date
  const formattedDate = new Date(item.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Helper untuk badge color neobrutalist berdasarkan category
  const getBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'buku':
        return 'bg-sky'
      case 'gadget':
        return 'bg-mint'
      case 'kos':
        return 'bg-orange'
      case 'fashion':
        return 'bg-cream'
      default:
        return 'bg-white'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 font-heading font-black text-neo-black hover:underline"
      >
        ← Kembali ke Pasar Kampus
      </Link>

      <div className="neo-card bg-white grid gap-8 md:grid-cols-2 p-6 sm:p-8">
        {/* Left: Product Image */}
        <div className="flex aspect-square w-full items-center justify-center bg-cream border-2 border-neo-black rounded-lg shadow-neo-sm overflow-hidden relative">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-8xl">📦</span>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <span className={`neo-badge ${getBadgeColor(item.category)} small`}>
                {item.category}
              </span>
              <span className="neo-badge bg-white small">{item.condition}</span>
            </div>
            <h1 className="text-3xl font-heading font-black text-neo-black uppercase tracking-tight">
              {item.title}
            </h1>
            <div className="text-3xl font-heading font-black text-neo-black bg-orange/20 border-2 border-neo-black inline-block px-4 py-2 rounded-md shadow-neo-sm">
              Rp {item.price.toLocaleString('id-ID')}
            </div>

            <div className="pt-6 border-t-2 border-neo-black/10 space-y-3 text-sm text-neo-black/80 font-semibold">
              <div className="flex items-center gap-2">
                <span>👤</span>
                <span>
                  Penjual:{' '}
                  <span className="font-heading font-black text-neo-black">
                    {seller?.aliasName || 'Anonim'}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Lokasi COD: {item.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🕒</span>
                <span>Diiklankan: {formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Conditional Action Button */}
          <div className="pt-6 border-t-2 border-neo-black/10">
            {isOwner ? (
              <div className="flex gap-4">
                <button className="flex-1 neo-btn bg-sky font-heading font-black">
                  ✏️ Edit Iklan
                </button>
                <button className="neo-btn bg-red-400 font-heading font-black text-neo-black">
                  🗑️ Hapus
                </button>
              </div>
            ) : (
              <Link
                href={`/marketplace/${item.id}/checkout`}
                className="block w-full neo-btn orange text-center font-heading font-black"
              >
                Beli Sekarang
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Description card */}
      <div className="neo-card bg-white space-y-4 p-6 sm:p-8">
        <h2 className="text-xl font-heading font-black text-neo-black uppercase">
          Deskripsi Barang
        </h2>
        <p className="text-neo-black/90 whitespace-pre-wrap leading-relaxed font-medium">
          {item.description}
        </p>
      </div>
    </div>
  )
}
