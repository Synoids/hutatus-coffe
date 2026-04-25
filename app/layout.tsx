import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hutatus Coffee — Kopi Artisanal Premium',
  description:
    'Nikmati kopi pilihan dengan cita rasa khas, diseduh dari biji terbaik dan diproses dengan penuh perhatian. Pesan dengan mudah untuk dinikmati di tempat atau dibawa pulang.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-stone-50 text-stone-900 antialiased`}>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="bg-stone-950 text-stone-400 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <h3 className="text-white font-bold text-xl mb-3">Hutatus Coffee</h3>
                <p className="text-sm leading-relaxed">
                  Kopi pilihan dengan karakter rasa yang khas. Kami menghadirkan pengalaman minum kopi yang hangat, santai, dan berkesan di setiap cangkir.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Menu Navigasi</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/menu" className="hover:text-amber-400 transition-colors">Menu</a></li>
                  <li><a href="/cart" className="hover:text-amber-400 transition-colors">Keranjang</a></li>
                  <li><a href="/transaksi" className="hover:text-amber-400 transition-colors">Riwayat Pesanan</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Lokasi & Jam Operasional</h4>
                <p className="text-sm leading-relaxed">
                  Jl. Kopi No. 123, Distrik Brew<br />
                  Buka setiap hari, 07.00 – 22.00 WIB
                </p>
              </div>
            </div>
            <div className="text-center text-xs text-stone-600 mt-12 flex flex-col items-center gap-2">
              <p>&copy; {new Date().getFullYear()} Hutatus Coffee. All rights reserved.</p>
              <a href="/login" className="hover:text-stone-500 transition-colors opacity-50 hover:opacity-100">
                Admin Area
              </a>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}