'use client'

import { useCart } from '@/context/CartContext'
import { Product } from '@/lib/types'
import { ShoppingCartIcon } from './Icons'
import { useState } from 'react'
import ProductModal from './ProductModal'

interface ProductCardProps {
  product: Product
}

const CATEGORY_BADGE: Record<string, { label: string; color: string }> = {
  coffee: { label: '☕ Coffee', color: 'bg-amber-100 text-amber-800' },
  'non-coffee': { label: '🧋 Non-Coffee', color: 'bg-sky-100 text-sky-800' },
  dessert: { label: '🍰 Dessert', color: 'bg-pink-100 text-pink-800' },
  snack: { label: '🍿 Snack', color: 'bg-green-100 text-green-800' },
  other: { label: '🍽️ Lainnya', color: 'bg-stone-100 text-stone-600' },
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const needsModal = product.has_size_option || product.has_sugar_option || product.has_ice_option
  const badge = CATEGORY_BADGE[product.category] ?? CATEGORY_BADGE['other']

  const startingPrice = product.has_size_option && product.size_price_small
    ? product.size_price_small
    : product.price

  const handleAddToCart = () => {
    if (needsModal) {
      setShowModal(true)
    } else {
      addItem(product)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    }
  }

  return (
    <>
      <div className="group card flex flex-col overflow-hidden h-full">
        {/* Gambar */}
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1550133730-695473e544be?auto=format&fit=crop&q=80&w=500'}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Category Badge */}
          <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${badge.color}`}>
            {badge.label}
          </span>
        </div>

        {/* Konten */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-stone-900 mb-1">{product.name}</h3>

          <div className="mt-auto pt-3">
            {product.has_size_option ? (
              <div>
                <p className="text-xs text-stone-400 font-medium">Mulai dari</p>
                <p className="text-2xl font-extrabold text-amber-700">
                  Rp {startingPrice.toLocaleString('id-ID')}
                </p>
              </div>
            ) : (
              <p className="text-2xl font-extrabold text-amber-700">
                Rp {Number(product.price).toLocaleString('id-ID')}
              </p>
            )}
          </div>

          {/* Variasi icons */}
          {needsModal && (
            <div className="flex gap-1.5 mt-2">
              {product.has_size_option && (
                <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-medium">S/M/L</span>
              )}
              {product.has_ice_option && (
                <span className="text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-medium">🧊 Es</span>
              )}
              {product.has_sugar_option && (
                <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">🍬 Gula</span>
              )}
            </div>
          )}

          <button
            id={`tambah-keranjang-${product.id}`}
            onClick={handleAddToCart}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 active:scale-95 ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-stone-900 text-white hover:bg-amber-600'
            }`}
          >
            <ShoppingCartIcon className="w-4 h-4" />
            {added ? 'Ditambahkan! ✓' : needsModal ? 'Pilih Variasi' : 'Tambah ke Keranjang'}
          </button>
        </div>
      </div>

      {showModal && (
        <ProductModal product={product} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
