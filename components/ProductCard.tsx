'use client'

import { useCart } from '@/context/CartContext'
import { Product } from '@/lib/types'
import { ShoppingCartIcon } from './Icons'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group card flex flex-col overflow-hidden h-full">
      {/* Gambar */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1550133730-695473e544be?auto=format&fit=crop&q=80&w=500'}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Konten */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-stone-900 mb-1">{product.name}</h3>
        <p className="text-2xl font-extrabold text-amber-700 mt-auto pt-3">
          Rp {Number(product.price).toLocaleString('id-ID')}
        </p>

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
          {added ? 'Ditambahkan! ✓' : 'Tambah ke Keranjang'}
        </button>
      </div>
    </div>
  )
}
