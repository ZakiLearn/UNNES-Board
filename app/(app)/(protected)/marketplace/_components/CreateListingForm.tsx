'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createMarketplaceItem } from '../actions'

export default function CreateListingForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  // Client-side field errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form states
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState('Bekas (Sangat Baik)')
  const [category, setCategory] = useState('Buku')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (title.trim().length < 5) {
      newErrors.title = 'Judul minimal harus 5 karakter'
    }
    const numPrice = Number(price)
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = 'Harga harus berupa angka positif'
    }
    if (!location.trim() || location.trim().length < 3) {
      newErrors.location = 'Lokasi serah terima minimal harus 3 karakter'
    }
    if (description.trim().length < 10) {
      newErrors.description = 'Deskripsi minimal harus 10 karakter'
    }
    if (!image) {
      newErrors.image = 'Foto barang wajib diunggah'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('price', price)
    formData.append('condition', condition)
    formData.append('category', category)
    formData.append('location', location)
    formData.append('description', description)
    if (image) {
      formData.append('image', image)
    }

    try {
      const res = await createMarketplaceItem(formData)
      if (res.success) {
        showToast('Iklan berhasil dipublikasikan!', 'success')
        router.refresh()
        setTimeout(() => {
          router.push('/marketplace')
        }, 1500)
      } else {
        showToast(res.error || 'Gagal membuat iklan', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Terjadi kesalahan server', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Judul */}
        <div className="form-group md:col-span-2">
          <label className="form-label">Nama / Judul Barang</label>
          <input
            type="text"
            className="form-control"
            placeholder="Contoh: Buku Kalkulus Edisi 8 - Dale Varberg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-red-600 text-xs font-bold mt-1 uppercase tracking-wider">
              {errors.title}
            </p>
          )}
        </div>

        {/* Harga */}
        <div className="form-group">
          <label className="form-label">Harga (Rp)</label>
          <input
            type="number"
            className="form-control"
            placeholder="Contoh: 75000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && (
            <p className="text-red-600 text-xs font-bold mt-1 uppercase tracking-wider">
              {errors.price}
            </p>
          )}
        </div>

        {/* Kondisi */}
        <div className="form-group">
          <label className="form-label">Kondisi Barang</label>
          <select
            className="form-control"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="Baru">Baru</option>
            <option value="Bekas (Sangat Baik)">Bekas (Sangat Baik)</option>
            <option value="Bekas (Mulus)">Bekas (Mulus)</option>
            <option value="Bekas (Layak Pakai)">Bekas (Layak Pakai)</option>
            <option value="Jasa">Jasa</option>
          </select>
        </div>

        {/* Kategori */}
        <div className="form-group">
          <label className="form-label">Kategori</label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Buku">Buku & Akademik</option>
            <option value="Gadget">Gadget & Elektronik</option>
            <option value="Kos">Kost & Hunian</option>
            <option value="Fashion">Fashion & Aksesoris</option>
            <option value="Jasa">Jasa & Lainnya</option>
          </select>
        </div>

        {/* Lokasi */}
        <div className="form-group">
          <label className="form-label">Lokasi Serah Terima / COD</label>
          <input
            type="text"
            className="form-control"
            placeholder="Contoh: Fakultas MIPA / Depan Rektorat"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          {errors.location && (
            <p className="text-red-600 text-xs font-bold mt-1 uppercase tracking-wider">
              {errors.location}
            </p>
          )}
        </div>

        {/* Foto */}
        <div className="form-group md:col-span-2">
          <label className="form-label">Foto Produk Utama</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0])
              }
            }}
          />
          {errors.image && (
            <p className="text-red-600 text-xs font-bold mt-1 uppercase tracking-wider">
              {errors.image}
            </p>
          )}
        </div>

        {/* Deskripsi */}
        <div className="form-group md:col-span-2">
          <label className="form-label">Deskripsi Lengkap Barang</label>
          <textarea
            className="form-control min-h-36"
            placeholder="Jelaskan kondisi detail barang, alasan dijual, atau spesifikasi penunjang lainnya..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-red-600 text-xs font-bold mt-1 uppercase tracking-wider">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full neo-btn orange"
      >
        {loading ? 'Mempublikasikan...' : '➕ Pasang Iklan'}
      </button>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <div
            className={`neo-card border-2 border-neo-black p-4 flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-mint' : 'bg-red-400'
            }`}
          >
            <span className="font-heading font-black text-neo-black">
              {toast.type === 'success' ? '✅' : '❌'} {toast.message}
            </span>
          </div>
        </div>
      )}
    </form>
  )
}
