'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CoffeeIcon } from '@/components/Icons'

export default function LoginPage() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple security: verification via a lightweight API route
    // or direct check for this demo/small app
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })

      if (response.ok) {
        // Redirect to admin dashboard on success
        router.push('/admin')
      } else {
        const data = await response.json()
        setError(data.error || 'PIN yang Anda masukkan salah.')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-stone-500 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
          <div className="bg-amber-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <CoffeeIcon className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Hutatus Coffee
          </span>
        </Link>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <h1 className="text-xl font-bold text-white mb-2 text-center">Panel Admin</h1>
          <p className="text-stone-400 text-sm text-center mb-8">Masukkan PIN Keamanan untuk melanjutkan</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                maxLength={6}
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-center text-3xl tracking-[1em] text-amber-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-stone-700 placeholder:tracking-normal"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-900/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Memverifikasi...' : 'Masuk Dashboard →'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-stone-500 hover:text-stone-400 text-xs transition-colors">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
