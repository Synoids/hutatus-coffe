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

  const waNumber = '6282312166701'
  const waMessage = order
    ? `Halo Admin Hutatus Coffee,
Saya sudah melakukan pembayaran.

ID Pesanan: ${orderId}
Total: Rp ${Number(order.total_price).toLocaleString('id-ID')}
Metode: Transfer

Mohon konfirmasi, terima kasih.`
    : ''

  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`

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
        <div className="card p-8 border-2 border-amber-100 bg-amber-50/50 mb-8 overflow-hidden">
          <h2 className="font-bold text-stone-900 text-lg mb-4 flex items-center gap-2">
            <span>💳</span> Pembayaran Transfer
          </h2>
          
          <div className="space-y-8">
            {/* QRIS Section */}
            <div className="text-center">
              <p className="text-sm font-bold text-stone-800 mb-4 tracking-wide uppercase">Scan QRIS untuk Pembayaran</p>
              
              <div className="group relative inline-block p-4 bg-white rounded-2xl shadow-md border border-amber-100 mb-4">
                <a 
                  href="/qris.png" 
                  target="_blank" 
                  className="block relative cursor-zoom-in"
                  title="Klik untuk memperbesar"
                >
                  <img 
                    src="/qris.png" 
                    alt="QRIS Hutatus Coffee" 
                    className="w-64 h-auto mx-auto rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-stone-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-opacity">
                      🔍 Klik untuk Perbesar
                    </span>
                  </div>
                </a>
              </div>

              <div className="flex flex-col items-center gap-3">
                <a 
                  href="/qris.png" 
                  download="QRIS-Hutatus-Coffee.png"
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-white border border-amber-200 px-4 py-2 rounded-lg hover:shadow-sm transition-all"
                >
                  📥 Simpan / Download QRIS
                </a>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Scan QR di atas untuk melakukan pembayaran sesuai total pesanan Anda.
                </p>
              </div>
            </div>

            <div className="relative">
               <div className="absolute inset-0 flex items-center" aria-hidden="true">
                 <div className="w-full border-t border-amber-200"></div>
               </div>
               <div className="relative flex justify-center text-xs uppercase">
                 <span className="bg-amber-50 px-2 text-stone-400 font-bold tracking-widest">Atau via Bank</span>
               </div>
            </div>

            {/* Bank Transfer Section */}
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

            {/* WhatsApp Confirmation */}
            <div className="text-center pt-2">
              <p className="text-xs text-stone-500 mb-4 font-medium italic">
                Setelah melakukan pembayaran, silakan konfirmasi melalui WhatsApp agar pesanan segera diproses.
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:-translate-y-1 w-full sm:w-auto"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Konfirmasi via WhatsApp
              </a>
            </div>
          </div>
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
