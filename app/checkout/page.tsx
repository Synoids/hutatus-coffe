'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash')

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <p className="text-7xl mb-6">🛒</p>
        <h1 className="text-2xl font-bold text-stone-900 mb-4">Keranjang masih kosong</h1>
        <Link href="/menu" className="btn-primary inline-block">Kembali ke Menu</Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({
            product_id: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
          total_price: totalPrice,
          payment_method: paymentMethod,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat pesanan.')
      }

      clearCart()
      router.push(`/success?orderId=${data.orderId}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan tak terduga.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-extrabold text-stone-900 mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Formulir */}
        <div className="lg:col-span-2">
          <div className="card p-8">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Data Diri Anda</h2>
            <form id="form-checkout" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-stone-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="cth. Budi Santoso"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-stone-700 mb-2">
                  Nomor Telepon
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="cth. 08123456789"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="pt-4">
                <h2 className="text-sm font-semibold text-stone-700 mb-3">Metode Pembayaran</h2>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-amber-600 bg-amber-50 text-amber-900'
                        : 'border-stone-100 hover:border-stone-200 text-stone-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-1">💵</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-center">Tunai (COD)</span>
                  </label>
                  <label
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'transfer'
                        ? 'border-amber-600 bg-amber-50 text-amber-900'
                        : 'border-stone-100 hover:border-stone-200 text-stone-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={() => setPaymentMethod('transfer')}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-1">🏦</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-center">Transfer Bank</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                id="tombol-pesan"
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses Pesanan...
                  </>
                ) : (
                  'Buat Pesanan →'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Ringkasan Pesanan */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-stone-900 mb-5">Ringkasan Pesanan</h2>
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
              <span className="text-amber-700">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
