'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Product, CupSize, SugarLevel, IceLevel, SIZE_LABELS, SUGAR_LABELS, ICE_LABELS } from '@/lib/types'

interface ProductModalProps {
  product: Product
  onClose: () => void
}

const SIZES: CupSize[] = ['small', 'medium', 'large']
const SUGARS: SugarLevel[] = ['no-sugar', 'less-sugar', 'normal-sugar', 'sweet']
const ICES: IceLevel[] = ['hot', 'less-ice', 'normal-ice']

function getSizePrice(product: Product, size: CupSize): number {
  if (size === 'small' && product.size_price_small) return product.size_price_small
  if (size === 'medium' && product.size_price_medium) return product.size_price_medium
  if (size === 'large' && product.size_price_large) return product.size_price_large
  return product.price
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<CupSize>('medium')
  const [selectedSugar, setSelectedSugar] = useState<SugarLevel>('normal-sugar')
  const [selectedIce, setSelectedIce] = useState<IceLevel>('normal-ice')
  const [added, setAdded] = useState(false)

  const currentPrice = product.has_size_option
    ? getSizePrice(product, selectedSize)
    : product.price

  const handleAdd = () => {
    addItem(product, {
      size: product.has_size_option ? selectedSize : undefined,
      sugarLevel: product.has_sugar_option ? selectedSugar : undefined,
      iceLevel: product.has_ice_option ? selectedIce : undefined,
    })
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      onClose()
    }, 900)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Product header */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1550133730-695473e544be?auto=format&fit=crop&q=80&w=600'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-white/40 transition"
            aria-label="Tutup"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-4">
            <h2 className="text-xl font-extrabold text-white">{product.name}</h2>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Size Selector */}
          {product.has_size_option && (
            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Ukuran</p>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((size) => {
                  const price = getSizePrice(product, size)
                  const isActive = selectedSize === size
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 px-2 rounded-xl border-2 text-center transition-all ${
                        isActive
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-stone-100 hover:border-stone-200 text-stone-600'
                      }`}
                    >
                      <span className="block text-sm font-bold">{SIZE_LABELS[size]}</span>
                      <span className="block text-xs mt-0.5 text-stone-500">
                        Rp {price.toLocaleString('id-ID')}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Ice Level Selector */}
          {product.has_ice_option && (
            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Tingkat Es</p>
              <div className="flex flex-wrap gap-2">
                {ICES.map((ice) => (
                  <button
                    key={ice}
                    onClick={() => setSelectedIce(ice)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                      selectedIce === ice
                        ? 'border-sky-500 bg-sky-50 text-sky-800'
                        : 'border-stone-100 hover:border-stone-200 text-stone-600'
                    }`}
                  >
                    {ICE_LABELS[ice]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sugar Level Selector */}
          {product.has_sugar_option && (
            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Tingkat Gula</p>
              <div className="flex flex-wrap gap-2">
                {SUGARS.map((sugar) => (
                  <button
                    key={sugar}
                    onClick={() => setSelectedSugar(sugar)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                      selectedSugar === sugar
                        ? 'border-amber-500 bg-amber-50 text-amber-800'
                        : 'border-stone-100 hover:border-stone-200 text-stone-600'
                    }`}
                  >
                    {SUGAR_LABELS[sugar]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer: price + CTA */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <div>
              <p className="text-xs text-stone-400">Total</p>
              <p className="text-2xl font-extrabold text-amber-700">
                Rp {currentPrice.toLocaleString('id-ID')}
              </p>
            </div>
            <button
              id={`modal-tambah-${product.id}`}
              onClick={handleAdd}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-stone-900 text-white hover:bg-amber-600'
              }`}
            >
              {added ? '✓ Ditambahkan!' : 'Tambah ke Keranjang'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
