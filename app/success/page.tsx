import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { CheckCircleIcon } from '@/components/Icons'

interface SearchParams {
  orderId?: string
}

export default async function SuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const orderId = searchParams?.orderId

  let order = null
  if (orderId) {
    const { data } = await supabase
      .from('orders')
      .select('*, customers(name, phone), order_items(*, products(name))')
      .eq('id', orderId)
      .single()
    order = data
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      {/* Banner Sukses */}
      <div className="card p-10 text-center mb-8">
        <div className="flex justify-center mb-5">
          <CheckCircleIcon className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 mb-3">Pesanan Berhasil!</h1>
        <p className="text-stone-500 text-lg">
          Terima kasih, <strong>{order?.customers?.name || 'pelanggan setia'}</strong>!
          Kopi Anda sedang disiapkan. Kami akan segera menghadirkannya untuk Anda. ☕
        </p>
        {orderId && (
          <p className="mt-3 text-xs text-stone-400 font-mono break-all">
            ID Pesanan: {orderId}
          </p>
        )}
      </div>

      {/* Detail Pesanan */}
      {order && (
        <div className="card p-6 mb-8">
          <h2 className="font-bold text-stone-900 text-lg mb-4">Detail Pesanan</h2>
          <div className="space-y-2 text-sm">
            {order.order_items?.map((item: { id: string; products?: { name?: string }; quantity: number; price: number }) => (
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
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-stone-500">Status:</span>
            <span className={`badge-${order.status}`}>{order.status}</span>
          </div>
        </div>
      )}

      {/* Instruksi Pembayaran (Hanya jika Transfer) */}
      {order && order.payment_method === 'transfer' && (
        <div className="card p-8 border-2 border-amber-100 bg-amber-50/50 mb-8">
          <h2 className="font-bold text-stone-900 text-lg mb-4 flex items-center gap-2">
            <span>🏦</span> Instruksi Pembayaran
          </h2>
          <p className="text-sm text-stone-600 mb-6">
            Silakan lakukan transfer ke rekening berikut untuk menyelesaikan pesanan Anda:
          </p>
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4 border border-amber-100">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Bank</span>
              <span className="font-bold text-stone-900">BCA</span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">No. Rekening</span>
              <span className="font-mono font-bold text-amber-700 text-lg">1234567890</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Atas Nama</span>
              <span className="font-bold text-stone-900">Hutatus Coffee</span>
            </div>
          </div>
          <p className="mt-6 text-xs text-stone-400 text-center italic">
            *Pesanan akan diproses setelah bukti transfer dikonfirmasi oleh admin.
          </p>
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/menu" className="btn-secondary text-center flex-1">
          Pesan Lagi
        </Link>
        <Link href="/transaksi" className="btn-primary text-center flex-1">
          Lihat Semua Pesanan
        </Link>
      </div>
    </div>
  )
}
