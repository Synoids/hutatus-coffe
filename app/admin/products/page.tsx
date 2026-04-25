'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Product, ProductCategory } from '@/lib/types'

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'coffee', label: '☕ Coffee' },
  { value: 'non-coffee', label: '🧋 Non-Coffee' },
  { value: 'dessert', label: '🍰 Dessert' },
  { value: 'snack', label: '🍿 Snack' },
  { value: 'other', label: '🍽️ Lainnya' },
]

const CATEGORY_BADGE: Record<ProductCategory, string> = {
  coffee: 'bg-amber-100 text-amber-800',
  'non-coffee': 'bg-sky-100 text-sky-800',
  dessert: 'bg-pink-100 text-pink-800',
  snack: 'bg-green-100 text-green-800',
  other: 'bg-stone-100 text-stone-600',
}

type FormState = {
  name: string
  price: string
  image_url: string
  category: ProductCategory
  has_size_option: boolean
  has_sugar_option: boolean
  has_ice_option: boolean
  size_price_small: string
  size_price_medium: string
  size_price_large: string
}

const DEFAULT_FORM: FormState = {
  name: '',
  price: '',
  image_url: '',
  category: 'coffee',
  has_size_option: false,
  has_sugar_option: false,
  has_ice_option: false,
  size_price_small: '',
  size_price_medium: '',
  size_price_large: '',
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const openAdd = () => {
    setEditingProduct(null)
    setForm(DEFAULT_FORM)
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const openEdit = (p: Product) => {
    setEditingProduct(p)
    setForm({
      name: p.name,
      price: String(p.price),
      image_url: p.image_url || '',
      category: p.category ?? 'other',
      has_size_option: p.has_size_option ?? false,
      has_sugar_option: p.has_sugar_option ?? false,
      has_ice_option: p.has_ice_option ?? false,
      size_price_small: p.size_price_small ? String(p.size_price_small) : '',
      size_price_medium: p.size_price_medium ? String(p.size_price_medium) : '',
      size_price_large: p.size_price_large ? String(p.size_price_large) : '',
    })
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      image_url: form.image_url,
      category: form.category,
      has_size_option: form.has_size_option,
      has_sugar_option: form.has_sugar_option,
      has_ice_option: form.has_ice_option,
      size_price_small: form.has_size_option && form.size_price_small ? parseFloat(form.size_price_small) : null,
      size_price_medium: form.has_size_option && form.size_price_medium ? parseFloat(form.size_price_medium) : null,
      size_price_large: form.has_size_option && form.size_price_large ? parseFloat(form.size_price_large) : null,
    }

    if (editingProduct) {
      await supabase.from('products').update(payload).eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert(payload)
    }

    setSaving(false)
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-stone-900">Produk</h1>
        <button id="tombol-tambah-produk" onClick={openAdd} className="btn-primary">
          + Tambah Produk
        </button>
      </div>

      {/* Formulir */}
      {showForm && (
        <div ref={formRef} className="card p-8 mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-6">
            {editingProduct ? 'Edit Produk' : 'Produk Baru'}
          </h2>
          <form id="form-produk" onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nama */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-stone-700 mb-2">Nama Produk</label>
                <input
                  id="nama-produk"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="input-field"
                  placeholder="cth. Caramel Latte"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Kategori</label>
                <select
                  id="kategori-produk"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
                  className="input-field"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Harga Base */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Harga (Rp) {form.has_size_option ? '— Harga Default / Fallback' : ''}
                </label>
                <input
                  id="harga-produk"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  min="0"
                  className="input-field"
                  placeholder="cth. 45000"
                />
              </div>

              {/* URL Gambar */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-stone-700 mb-2">URL Gambar</label>
                <input
                  id="url-gambar-produk"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Opsi Variasi */}
            <div className="border border-stone-100 rounded-xl p-5 space-y-4">
              <p className="text-sm font-bold text-stone-700">Opsi Variasi</p>

              {/* Toggle Size */}
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-semibold text-stone-800">Pilihan Size (S / M / L)</span>
                  <p className="text-xs text-stone-400">Aktifkan untuk produk kopi dengan ukuran berbeda</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, has_size_option: !form.has_size_option })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.has_size_option ? 'bg-amber-600' : 'bg-stone-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.has_size_option ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              {/* Harga per size */}
              {form.has_size_option && (
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { key: 'size_price_small' as const, label: 'Small (Rp)' },
                    { key: 'size_price_medium' as const, label: 'Medium (Rp)' },
                    { key: 'size_price_large' as const, label: 'Large (Rp)' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">{label}</label>
                      <input
                        type="number"
                        min="0"
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="input-field text-sm"
                        placeholder="cth. 32000"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Toggle Es */}
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-semibold text-stone-800">Pilihan Es (Hot / Less Ice / Normal)</span>
                  <p className="text-xs text-stone-400">Aktifkan untuk minuman dingin/panas</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, has_ice_option: !form.has_ice_option })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.has_ice_option ? 'bg-sky-500' : 'bg-stone-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.has_ice_option ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              {/* Toggle Gula */}
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-semibold text-stone-800">Pilihan Gula (Tanpa / Sedikit / Normal / Manis)</span>
                  <p className="text-xs text-stone-400">Aktifkan untuk produk yang bisa diatur manisnya</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, has_sugar_option: !form.has_sugar_option })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.has_sugar_option ? 'bg-amber-500' : 'bg-stone-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.has_sugar_option ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>
            </div>

            <div className="flex gap-4">
              <button id="simpan-produk" type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? 'Menyimpan...' : editingProduct ? 'Perbarui Produk' : 'Tambah Produk'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Produk */}
      <div className="card overflow-hidden">
        {loading ? (
          <p className="text-center py-16 text-stone-400">Memuat produk...</p>
        ) : products.length === 0 ? (
          <p className="text-center py-16 text-stone-400">Belum ada produk. Tambahkan di atas!</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr className="text-left text-stone-500">
                <th className="px-6 py-4 font-semibold">Produk</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="px-6 py-4 font-semibold">Opsi</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={p.image_url || 'https://images.unsplash.com/photo-1550133730-695473e544be?auto=format&fit=crop&q=80&w=100'}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="font-semibold text-stone-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CATEGORY_BADGE[p.category ?? 'other']}`}>
                      {CATEGORY_OPTIONS.find(c => c.value === (p.category ?? 'other'))?.label ?? '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-amber-700 font-semibold">
                    {p.has_size_option ? (
                      <span>
                        <span className="text-xs text-stone-400 block">Mulai dari</span>
                        Rp {Number(p.size_price_small || p.price).toLocaleString('id-ID')}
                      </span>
                    ) : (
                      `Rp ${Number(p.price).toLocaleString('id-ID')}`
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {p.has_size_option && <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">S/M/L</span>}
                      {p.has_ice_option && <span className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full">🧊 Es</span>}
                      {p.has_sugar_option && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">🍬 Gula</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button id={`edit-produk-${p.id}`} onClick={() => openEdit(p)} className="text-stone-500 hover:text-amber-700 font-medium transition-colors">Edit</button>
                    <button id={`hapus-produk-${p.id}`} onClick={() => handleDelete(p.id)} className="text-stone-500 hover:text-red-600 font-medium transition-colors">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
