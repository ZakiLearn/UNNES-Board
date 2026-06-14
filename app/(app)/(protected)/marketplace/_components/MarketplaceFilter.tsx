'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface MarketplaceFilterProps {
  initialSearch: string
  initialCategory: string
}

export default function MarketplaceFilter({
  initialSearch,
  initialCategory,
}: MarketplaceFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [search, setSearch] = useState(initialSearch)
  const [activeCategory, setActiveCategory] = useState(initialCategory)

  // Categories definition
  const categories = [
    { name: 'Semua', value: '' },
    { name: 'Buku', value: 'Buku', color: 'bg-sky' },
    { name: 'Gadget', value: 'Gadget', color: 'bg-mint' },
    { name: 'Kos', value: 'Kos', color: 'bg-orange' },
    { name: 'Fashion', value: 'Fashion', color: 'bg-cream' },
    { name: 'Jasa', value: 'Jasa', color: 'bg-white' },
  ]

  // Update query params helper
  const updateQuery = (searchText: string, categoryVal: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchText) {
      params.set('search', searchText)
    } else {
      params.delete('search')
    }

    if (categoryVal) {
      params.set('category', categoryVal)
    } else {
      params.delete('category')
    }

    startTransition(() => {
      router.push(`/marketplace?${params.toString()}`)
    })
  }

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== initialSearch) {
        updateQuery(search, activeCategory)
      }
    }, 400)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleCategoryClick = (categoryVal: string) => {
    setActiveCategory(categoryVal)
    updateQuery(search, categoryVal)
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="form-group max-w-xl">
        <div className="relative">
          <input
            type="text"
            className="w-full form-control pl-10 pr-4 py-3 border-2 border-neo-black rounded-lg shadow-neo-sm focus:outline-none"
            placeholder="🔍 Cari nama barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Badges */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="font-heading font-black text-neo-black text-sm uppercase mr-2">
          Kategori:
        </span>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value
          return (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.value)}
              className={`neo-badge cursor-pointer px-4 py-2 border-2 border-neo-black rounded-md font-heading font-bold text-sm transition-all shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none ${
                isActive
                  ? `${cat.color || 'bg-orange'} text-neo-black scale-105 shadow-none translate-x-[1px] translate-y-[1px]`
                  : 'bg-white text-neo-black/80'
              }`}
            >
              {cat.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
