import { supabase } from '@/lib/supabaseClient'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

export default async function MenuPage() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Gagal mengambil produk:', error)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-amber-600 font-semibold tracking-widest text-sm uppercase mb-2">Apa yang Kami Seduh</p>
        <h1 className="text-4xl font-extrabold text-stone-900 sm:text-5xl">Menu Kami</h1>
        <p className="mt-4 text-stone-500 text-lg max-w-2xl mx-auto">
          Minuman buatan tangan dari biji kopi pilihan terbaik. Pilih favorit Anda dan masukkan ke keranjang.
        </p>
      </div>

      {/* Grid Produk */}
      {!products || products.length === 0 ? (
        <div className="text-center py-24 card">
          <p className="text-4xl mb-4">☕</p>
          <p className="text-stone-500 text-lg font-medium">Belum ada produk tersedia.</p>
          <p className="text-stone-400 text-sm mt-2">Kembali lagi nanti — ada yang lezat sedang disiapkan!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
