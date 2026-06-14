import React from 'react'
import { db } from '@/lib/db'
import { marketplaceItem, marketplaceTransaction, profile } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface ReceiptPageProps {
  params: Promise<{ transactionId: string }>
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { transactionId } = await params
  const txId = Number(transactionId)
  if (isNaN(txId)) {
    notFound()
  }

  // Fetch transaction details with item, seller, and buyer
  const sellerAlias = db.$with('seller_alias').as(
    db.select({ id: profile.id, aliasName: profile.aliasName }).from(profile)
  )
  const buyerAlias = db.$with('buyer_alias').as(
    db.select({ id: profile.id, aliasName: profile.aliasName }).from(profile)
  )

  const transactionData = await db
    .with(sellerAlias, buyerAlias)
    .select({
      transaction: marketplaceTransaction,
      item: marketplaceItem,
      sellerName: sellerAlias.aliasName,
      buyerName: buyerAlias.aliasName,
    })
    .from(marketplaceTransaction)
    .leftJoin(marketplaceItem, eq(marketplaceTransaction.itemId, marketplaceItem.id))
    .leftJoin(sellerAlias, eq(marketplaceItem.sellerId, sellerAlias.id))
    .leftJoin(buyerAlias, eq(marketplaceTransaction.buyerId, buyerAlias.id))
    .where(eq(marketplaceTransaction.id, txId))
    .then((res) => res[0])

  if (!transactionData || !transactionData.transaction) {
    notFound()
  }

  const { transaction, item, sellerName, buyerName } = transactionData

  const formatRupiah = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`
  }

  const formattedDate = new Date(transaction.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className="max-w-md mx-auto space-y-6 py-6">
      {/* Back to Marketplace */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 font-heading font-black text-neo-black hover:underline text-sm"
      >
        ← Kembali ke Pasar Kampus
      </Link>

      {/* Retro Receipt Card Container */}
      <div className="relative bg-white border-4 border-neo-black shadow-neo rounded-none overflow-hidden font-mono text-neo-black">
        {/* Top Scallop / Serrated Edge */}
        <div className="h-4 bg-white border-b-2 border-dashed border-neo-black flex justify-between overflow-hidden select-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-transparent border-r-2 border-b-2 border-neo-black rotate-45 -translate-y-2 translate-x-1" />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black tracking-widest uppercase">
              PASAR KAMPUS
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider">
              UNNES BOARD RETRO RECEIPT
            </p>
            <p className="text-[10px] text-neo-black/60">
              SEMARANG, INDONESIA
            </p>
          </div>

          <div className="border-t-2 border-dashed border-neo-black/35 my-4" />

          {/* Details */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>WAKTU:</span>
              <span className="font-bold">{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span>NO. NOTA:</span>
              <span className="font-bold">TX-{transaction.id.toString().padStart(6, '0')}</span>
            </div>
            <div className="flex justify-between">
              <span>PEMBELI:</span>
              <span className="font-bold">{buyerName || 'Anonim'}</span>
            </div>
            <div className="flex justify-between">
              <span>PENJUAL:</span>
              <span className="font-bold">{sellerName || 'Anonim'}</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-neo-black/35 my-4" />

          {/* Items Purchased */}
          <div className="space-y-4">
            <div className="text-xs font-bold">DAFTAR BARANG:</div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between items-start">
                <span className="max-w-[70%] break-words">{item?.title || 'Barang Marketplace'}</span>
                <span className="font-bold">{formatRupiah(transaction.totalPrice)}</span>
              </div>
              <div className="text-[10px] text-neo-black/60 pl-2">
                * Kondisi: {item?.condition || 'Bekas'}
              </div>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-neo-black/35 my-4" />

          {/* Checkout Totals */}
          <div className="space-y-2 text-xs font-bold">
            <div className="flex justify-between text-sm">
              <span>TOTAL HARGA:</span>
              <span>{formatRupiah(transaction.totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>METODE BAYAR:</span>
              <span>{transaction.paymentMethod}</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-neo-black/35 my-4" />

          {/* Delivery Note */}
          <div className="space-y-2 text-xs">
            <div className="font-bold">CATATAN SERAH TERIMA (COD):</div>
            <div className="bg-cream/45 border-2 border-dashed border-neo-black p-3 text-[11px] leading-relaxed whitespace-pre-wrap">
              {transaction.deliveryNote}
            </div>
          </div>

          <div className="border-t-2 border-dashed border-neo-black/35 my-4" />

          {/* SVG Barcode Decoration */}
          <div className="flex flex-col items-center justify-center space-y-2 pt-2">
            <svg className="w-48 h-10" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
              {/* Zebra line barcode */}
              <rect x="0" y="0" width="1" height="20" fill="black" />
              <rect x="2" y="0" width="2" height="20" fill="black" />
              <rect x="5" y="0" width="1" height="20" fill="black" />
              <rect x="7" y="0" width="3" height="20" fill="black" />
              <rect x="11" y="0" width="1" height="20" fill="black" />
              <rect x="13" y="0" width="2" height="20" fill="black" />
              <rect x="17" y="0" width="1" height="20" fill="black" />
              <rect x="19" y="0" width="4" height="20" fill="black" />
              <rect x="24" y="0" width="1" height="20" fill="black" />
              <rect x="27" y="0" width="2" height="20" fill="black" />
              <rect x="30" y="0" width="1" height="20" fill="black" />
              <rect x="32" y="0" width="3" height="20" fill="black" />
              <rect x="37" y="0" width="1" height="20" fill="black" />
              <rect x="40" y="0" width="2" height="20" fill="black" />
              <rect x="43" y="0" width="4" height="20" fill="black" />
              <rect x="48" y="0" width="1" height="20" fill="black" />
              <rect x="51" y="0" width="2" height="20" fill="black" />
              <rect x="54" y="0" width="1" height="20" fill="black" />
              <rect x="56" y="0" width="3" height="20" fill="black" />
              <rect x="61" y="0" width="1" height="20" fill="black" />
              <rect x="63" y="0" width="2" height="20" fill="black" />
              <rect x="67" y="0" width="1" height="20" fill="black" />
              <rect x="69" y="0" width="4" height="20" fill="black" />
              <rect x="75" y="0" width="1" height="20" fill="black" />
              <rect x="77" y="0" width="2" height="20" fill="black" />
              <rect x="80" y="0" width="1" height="20" fill="black" />
              <rect x="82" y="0" width="3" height="20" fill="black" />
              <rect x="87" y="0" width="1" height="20" fill="black" />
              <rect x="89" y="0" width="2" height="20" fill="black" />
              <rect x="92" y="0" width="1" height="20" fill="black" />
              <rect x="94" y="0" width="3" height="20" fill="black" />
              <rect x="98" y="0" width="2" height="20" fill="black" />
            </svg>
            <span className="text-[9px] tracking-[6px] font-bold">
              *{transaction.id.toString().padStart(6, '0')}*
            </span>
          </div>

          {/* Footer message */}
          <div className="text-center text-[10px] pt-4 font-bold uppercase tracking-wider">
            *** TERIMA KASIH ***
          </div>
        </div>

        {/* Bottom Scallop / Serrated Edge */}
        <div className="h-4 bg-white border-t-2 border-dashed border-neo-black flex justify-between overflow-hidden select-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-transparent border-l-2 border-t-2 border-neo-black rotate-45 translate-y-2 -translate-x-1" />
          ))}
        </div>
      </div>
    </div>
  )
}
