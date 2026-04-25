'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Product, ProductCategory } from '@/lib/types'
import ProductCard from '@/components/ProductCard'

const CATEGORIES: { key: ProductCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'Semua', icon: '🍽️' },
  { key: 'coffee', label: 'Coffee', icon: '☕' },
  { key: 'non-coffee', label: 'Non-Coffee', icon: '🧋' },
  { key: 'dessert', label: 'Dessert', icon: '🍰' },
  { key: 'snack', label: 'Snack', icon: '🍿' },
]

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })
    if (activeCategory !== 'all') {
      query = query.eq('category', activeCategory)
    }
    const { data, error } = await query
    if (error) console.error('Gagal mengambil produk:', error)
    setProducts(data ?? [])
    setLoading(false)
  }, [activeCategory])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-amber-600 font-semibold tracking-widest text-sm uppercase mb-2">Apa yang Kami Seduh</p>
        <h1 className="text-4xl font-extrabold text-stone-900 sm:text-5xl">Menu Kami</h1>
        <p className="mt-4 text-stone-500 text-lg max-w-2xl mx-auto">
          Minuman buatan tangan dari biji kopi pilihan terbaik. Pilih favorit Anda dan masukkan ke keranjang.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map(({ key, label, icon }) => (
          <button
            key={key}
            id={`kategori-${key}`}
            onClick={() => setActiveCategory(key)}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
              activeCategory === key
                ? 'bg-stone-900 text-white border-stone-900 shadow-lg'
                : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700'
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Grid Produk */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="aspect-square bg-stone-200" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-stone-200 rounded w-3/4" />
                <div className="h-7 bg-stone-200 rounded w-1/2" />
                <div className="h-10 bg-stone-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <div className="text-center py-24 card">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-stone-500 text-lg font-medium">Belum ada produk di kategori ini.</p>
          <p className="text-stone-400 text-sm mt-2">Coba kategori lain atau kembali lagi nanti!</p>
          <button
            onClick={() => setActiveCategory('all')}
            className="mt-6 btn-primary inline-block"
          >
            Lihat Semua Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
