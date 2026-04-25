import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Hutatus Coffee — Admin',
}

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '🏠' },
  { label: 'Produk', href: '/admin/products', icon: '☕' },
  { label: 'Pesanan', href: '/admin/orders', icon: '📦' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check for admin session cookie
  const session = cookies().get('admin_session')
  
  if (!session || session.value !== 'true') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-950 text-stone-300 flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="px-6 py-6 border-b border-stone-800">
          <p className="text-amber-400 font-extrabold text-xl">Hutatus Coffee</p>
          <p className="text-stone-500 text-xs mt-1">Panel Admin</p>
        </div>
        <nav className="flex-1 py-6 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-800 hover:text-amber-400 transition-colors font-medium group"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-stone-800 flex flex-col gap-3">
          <Link href="/" className="text-stone-500 hover:text-amber-400 text-sm transition-colors">
            ← Kembali ke Situs
          </Link>
          {/* Logout button could go here */}
        </div>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1">
        <header className="bg-white border-b border-stone-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <p className="text-stone-500 text-sm">Masuk sebagai Admin</p>
          <div className="flex items-center gap-4">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <span className="text-xs font-bold text-stone-900 uppercase tracking-widest">Sesi Aktif</span>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
