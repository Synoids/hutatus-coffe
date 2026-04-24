'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { TrashIcon } from '@/components/Icons'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <p className="text-7xl mb-6">🛒</p>
        <h1 className="text-3xl font-extrabold text-stone-900 mb-4">Keranjang Anda kosong</h1>
        <p className="text-stone-500 mb-10">Sepertinya Anda belum menambahkan apapun.</p>
        <Link href="/menu" className="btn-primary inline-block">
          Jelajahi Menu Kami
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-extrabold text-stone-900 mb-10">Keranjang Saya</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Daftar Item */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card p-5 flex items-center gap-5">
              <img
                src={item.image_url || 'https://images.unsplash.com/photo-1550133730-695473e544be?auto=format&fit=crop&q=80&w=200'}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-stone-900 truncate">{item.name}</h3>
                <p className="text-amber-700 font-semibold">
                  Rp {Number(item.price).toLocaleString('id-ID')}
                </p>
              </div>

              {/* Pengatur Jumlah */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  id={`kurang-qty-${item.id}`}
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:border-amber-400 hover:text-amber-700 font-bold transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  id={`tambah-qty-${item.id}`}
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:border-amber-400 hover:text-amber-700 font-bold transition-colors"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <p className="w-28 text-right font-bold text-stone-900 flex-shrink-0">
                Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}
              </p>

              {/* Hapus */}
              <button
                id={`hapus-item-${item.id}`}
                onClick={() => removeItem(item.id)}
                className="text-stone-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                aria-label="Hapus item"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}

          <button
            id="kosongkan-keranjang"
            onClick={clearCart}
            className="text-sm text-stone-400 hover:text-red-500 transition-colors mt-2"
          >
            Kosongkan seluruh keranjang
          </button>
        </div>

        {/* Ringkasan Pesanan */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Ringkasan Pesanan</h2>
            <div className="space-y-3 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-stone-600">
                  <span className="truncate pr-2">{item.name} × {item.quantity}</span>
                  <span className="flex-shrink-0">Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 mt-5 pt-5 flex justify-between font-extrabold text-stone-900 text-lg">
              <span>Total</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <Link
              id="lanjut-ke-checkout"
              href="/checkout"
              className="btn-primary block text-center mt-6"
            >
              Lanjut ke Checkout →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
