import React from 'react'
import { db } from '@/lib/db'
import { marketplaceItem } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CheckoutWizard from '../../_components/CheckoutWizard'

export const dynamic = 'force-dynamic'

interface CheckoutPageProps {
  params: Promise<{ id: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params
  const itemId = Number(id)
  if (isNaN(itemId)) {
    notFound()
  }

  // 1. Authenticate user auth session
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Fetch Item
  const [item] = await db
    .select()
    .from(marketplaceItem)
    .where(eq(marketplaceItem.id, itemId))

  if (!item) {
    notFound()
  }

  // 3. Prevent buying own items or already sold items
  if (item.sold || item.sellerId === user.id) {
    redirect('/marketplace')
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href={`/marketplace/${item.id}`}
        className="inline-flex items-center gap-2 font-heading font-black text-neo-black hover:underline text-sm"
      >
        ← Kembali ke Detail Barang
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-black text-neo-black uppercase tracking-tight">
          Simulasi Pembelian
        </h1>
        <p className="font-heading font-bold text-neo-black/80">
          Selesaikan detail checkout COD untuk barang ini.
        </p>
      </div>

      <div className="neo-card bg-white p-6 sm:p-8">
        <CheckoutWizard item={item} />
      </div>
    </div>
  )
}
