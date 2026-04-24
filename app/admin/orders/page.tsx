'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Order } from '@/lib/types'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Menunggu' },
  { value: 'processing', label: 'Diproses' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
]

const badgeClass: Record<string, string> = {
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, customers(name, phone), order_items(*, products(name))')
      .order('created_at', { ascending: false })
    setOrders((data as Order[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: status as Order['status'] } : o))
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-stone-900 mb-8">Semua Pesanan</h1>

      {loading ? (
        <p className="text-center py-20 text-stone-400">Memuat pesanan...</p>
      ) : orders.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-stone-500">Belum ada pesanan masuk.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card overflow-hidden">
              {/* Header Pesanan */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-stone-50 transition-colors"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="min-w-0">
                    <p className="font-bold text-stone-900 truncate">{order.customers?.name}</p>
                    <p className="text-xs text-stone-400 font-mono mt-0.5 truncate">{order.id}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <p className="font-bold text-amber-700 text-sm">
                    Rp {Number(order.total_price).toLocaleString('id-ID')}
                  </p>
                  {/* Pilih Status */}
                  <select
                    id={`status-pesanan-${order.id}`}
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`${badgeClass[order.status]} border-0 cursor-pointer focus:outline-none rounded-full py-1 pl-3 pr-7 text-xs font-semibold`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <span className="text-stone-400 text-xs">{expandedId === order.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Detail Item (Ekspandabel) */}
              {expandedId === order.id && (
                <div className="border-t border-stone-100 px-5 pb-5 pt-3">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Item Pesanan</p>
                  <div className="space-y-2">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-stone-700">
                        <span>{item.products?.name || 'Produk'} × {item.quantity}</span>
                        <span className="font-medium">Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-stone-100 text-sm text-stone-500">
                    📞 {order.customers?.phone || '—'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
