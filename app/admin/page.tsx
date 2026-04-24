import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminDashboard() {
  const { data: products } = await supabase.from('products').select('*', { count: 'exact' })
  const { data: orders } = await supabase
    .from('orders')
    .select('*, customers(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(5)
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true })
  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const stats = [
    { label: 'Total Produk', value: products?.length ?? 0, icon: '☕', href: '/admin/products' },
    { label: 'Total Pesanan', value: totalOrders ?? 0, icon: '📦', href: '/admin/orders' },
    { label: 'Pesanan Menunggu', value: pendingOrders ?? 0, icon: '⏳', href: '/admin/orders' },
  ]

  const statusLabel: Record<string, string> = {
    pending: 'Menunggu',
    processing: 'Diproses',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-stone-900 mb-8">Dashboard</h1>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-6 hover:-translate-y-1 transition-transform block">
            <div className="text-4xl mb-3">{s.icon}</div>
            <p className="text-3xl font-extrabold text-stone-900">{s.value}</p>
            <p className="text-stone-500 text-sm mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Pesanan Terbaru */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-stone-900">Pesanan Terbaru</h2>
          <Link href="/admin/orders" className="text-sm text-amber-700 hover:underline font-semibold">Lihat semua →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b border-stone-100">
                <th className="pb-3 font-semibold">Pelanggan</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3 font-medium text-stone-900">{(order.customers as { name?: string })?.name || '—'}</td>
                  <td className="py-3 text-amber-700 font-semibold">Rp {Number(order.total_price).toLocaleString('id-ID')}</td>
                  <td className="py-3">
                    <span className={`badge-${order.status}`}>{statusLabel[order.status] || order.status}</span>
                  </td>
                  <td className="py-3 text-stone-400">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
