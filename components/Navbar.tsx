'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ShoppingCartIcon, CoffeeIcon } from './Icons'
import { useState } from 'react'

export default function Navbar() {
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <CoffeeIcon className="w-7 h-7 text-amber-700 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-extrabold tracking-tight text-amber-900">
              Hutatus Coffee
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/menu" className="text-stone-600 hover:text-amber-800 font-medium transition-colors">
              Menu
            </Link>
            <Link href="/transaksi" className="text-stone-600 hover:text-amber-800 font-medium transition-colors">
              Pesanan Saya
            </Link>
            <Link href="/cart" className="relative flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors duration-300">
              <ShoppingCartIcon className="w-5 h-5" />
              <span className="font-semibold">Keranjang</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: cart icon + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/cart" className="relative p-2">
              <ShoppingCartIcon className="w-6 h-6 text-stone-700" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-stone-700" aria-label="Buka menu">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-stone-100">
            <Link href="/menu" onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-stone-700 hover:text-amber-800 font-medium">Menu</Link>
            <Link href="/transaksi" onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-stone-700 hover:text-amber-800 font-medium">Pesanan Saya</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
