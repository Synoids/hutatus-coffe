'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Order } from '@/lib/types'
import { ClockIcon, CheckCircleIcon } from '@/components/Icons'

const statusClasses: Record<string, string> = {
  pending: 'badge-pending',
  processing: 'badge-processing',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
}

const statusLabel: Record<string, string> = {
  pending: 'Menunggu',
  processing: 'Diproses',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
}

export default function TransaksiPage() {
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSearched(true)

    const { data: customers } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', phone)

    if (!customers || customers.length === 0) {
      setOrders([])
      setLoading(false)
      return
    }

    const customerIds = customers.map((c) => c.id)
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*, customers(name, phone), order_items(*, products(name, image_url))')
      .in('customer_id', customerIds)
      .order('created_at', { ascending: false })

    setOrders((ordersData as Order[]) || [])
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-stone-900">Riwayat Pesanan</h1>
        <p className="text-stone-500 mt-3 text-lg">Masukkan nomor telepon Anda untuk melihat pesanan sebelumnya.</p>
      </div>

      {/* Form Pencarian */}
      <div className="card p-8 mb-10">
        <form id="form-cari-transaksi" onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <input
            id="input-nomor-telepon"
            type="tel"
            placeholder="Nomor telepon Anda (cth. 08123456789)"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field flex-1"
          />
          <button
            id="tombol-cari-transaksi"
            type="submit"
            disabled={loading}
            className="btn-primary flex-shrink-0 disabled:opacity-60"
          >
            {loading ? 'Mencari...' : 'Cari Pesanan'}
          </button>
        </form>
      </div>

      {/* Hasil Pencarian */}
      {searched && !loading && (
        orders.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-stone-500 font-medium text-lg">Tidak ada pesanan yang ditemukan untuk nomor ini.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card p-6 hover:shadow-md transition-shadow group relative">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <p className="font-bold text-stone-900">{order.customers?.name}</p>
                    <p className="text-sm text-stone-400 font-mono mt-1 break-all">{order.id}</p>
                    <p className="text-sm text-stone-400 mt-1">
                      {order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '—'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={statusClasses[order.status] || 'badge-pending'}>
                      {order.status === 'completed'
                        ? <CheckCircleIcon className="w-3 h-3" />
                        : <ClockIcon className="w-3 h-3" />
                      }
                      {statusLabel[order.status] || order.status}
                    </span>
                    {/* Link ke halaman sukses/instruksi */}
                    <Link 
                      href={`/success?orderId=${order.id}`}
                      className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                    >
                      {order.status === 'pending' ? '💳 Lihat Instruksi Bayar' : '📄 Lihat Detail'}
                    </Link>
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t border-stone-100 pt-4">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-stone-600">
                      <span>{item.products?.name || 'Produk'} × {item.quantity}</span>
                      <span>Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 mt-4 pt-4 flex justify-between font-extrabold text-stone-900">
                  <span>Total</span>
                  <span className="text-amber-700">Rp {Number(order.total_price).toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
