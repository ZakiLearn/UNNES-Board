'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { executeMarketplaceTransaction } from '../actions'

interface CheckoutWizardProps {
  item: {
    id: number
    title: string
    price: number
    imageUrl: string
    location: string
  }
}

export default function CheckoutWizard({ item }: CheckoutWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [deliveryNote, setDeliveryNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const formatRupiah = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (deliveryNote.trim().length < 5) {
      setError('Catatan serah terima (COD) minimal harus 5 karakter')
      return
    }
    setError('')
    setStep(2)
  }

  const handlePay = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await executeMarketplaceTransaction({
        itemId: item.id,
        paymentMethod,
        deliveryNote,
      })

      if (res.success) {
        setShowSuccess(true)
        setTimeout(() => {
          router.push(`/marketplace/receipt/${res.data.transactionId}`)
        }, 1500)
      } else {
        setError(res.error || 'Gagal memproses transaksi')
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan koneksi server')
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        {/* Bouncing success check container */}
        <div className="w-24 h-24 bg-mint border-4 border-neo-black rounded-full flex items-center justify-center shadow-neo animate-bounce">
          <span className="text-5xl">✅</span>
        </div>
        <h3 className="text-2xl font-heading font-black text-neo-black uppercase tracking-tight text-center">
          Transaksi Sukses!
        </h3>
        <p className="font-heading font-bold text-neo-black/70 text-center">
          Menyiapkan struk belanja kasir Anda...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Wizard Progress Indicators */}
      <div className="flex items-center gap-2">
        <span
          className={`neo-badge ${
            step === 1 ? 'bg-orange text-neo-black' : 'bg-white text-neo-black/60'
          } small font-bold border-2 border-neo-black`}
        >
          1. Isi Data COD
        </span>
        <span className="text-neo-black/40 font-black">➔</span>
        <span
          className={`neo-badge ${
            step === 2 ? 'bg-orange text-neo-black' : 'bg-white text-neo-black/60'
          } small font-bold border-2 border-neo-black`}
        >
          2. Rangkuman & Bayar
        </span>
      </div>

      {error && (
        <div className="neo-card bg-red-400 border-2 border-neo-black p-4 font-heading font-black text-neo-black uppercase tracking-wider text-sm">
          ⚠️ {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-6">
          <div className="space-y-4">
            {/* Delivery Note */}
            <div className="form-group">
              <label className="form-label">Catatan Serah Terima / COD</label>
              <textarea
                className="form-control min-h-24 w-full"
                placeholder="Contoh: Depan PKMU MIPA Jam 10 Pagi..."
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
              />
            </div>

            {/* Payment Method */}
            <div className="form-group">
              <label className="form-label">Metode Pembayaran (Simulasi)</label>
              <div className="grid grid-cols-3 gap-4">
                {['COD', 'Bank Transfer', 'E-Wallet'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`neo-badge py-3 border-2 border-neo-black font-heading font-black text-center cursor-pointer ${
                      paymentMethod === method
                        ? 'bg-mint scale-[1.03] shadow-none translate-y-[1px]'
                        : 'bg-white'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="w-full neo-btn orange font-heading font-black">
            Lanjut ➔
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="neo-card bg-cream border-2 border-neo-black p-6 space-y-4">
            <h3 className="text-lg font-heading font-black text-neo-black uppercase tracking-tight">
              Rangkuman Transaksi
            </h3>
            
            <div className="space-y-2 text-sm font-semibold text-neo-black/85">
              <div className="flex justify-between items-center border-b border-neo-black/10 pb-2">
                <span>Barang:</span>
                <span className="font-heading font-black text-neo-black">{item.title}</span>
              </div>
              <div className="flex justify-between items-center border-b border-neo-black/10 pb-2">
                <span>Harga:</span>
                <span className="font-heading font-black text-neo-black text-base">
                  {formatRupiah(item.price)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-neo-black/10 pb-2">
                <span>Metode Pembayaran:</span>
                <span className="font-heading font-black text-neo-black">{paymentMethod}</span>
              </div>
              <div className="flex justify-between items-start pt-2 flex-col gap-1">
                <span>Catatan Serah Terima:</span>
                <span className="font-medium text-neo-black bg-white px-3 py-2 border border-neo-black w-full rounded-sm">
                  {deliveryNote}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="neo-btn bg-white font-heading font-black text-neo-black"
            >
              Kembali
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handlePay}
              className="flex-1 neo-btn mint font-heading font-black text-neo-black text-center"
            >
              {loading ? 'Memproses Pembayaran...' : 'Konfirmasi & Bayar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
