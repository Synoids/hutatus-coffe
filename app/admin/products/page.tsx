'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Product } from '@/lib/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: '', price: '', image_url: '' })
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
    setForm({ name: '', price: '', image_url: '' })
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const openEdit = (p: Product) => {
    setEditingProduct(p)
    setForm({ name: p.name, price: String(p.price), image_url: p.image_url || '' })
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = { name: form.name, price: parseFloat(form.price), image_url: form.image_url }

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
          <form id="form-produk" onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-stone-700 mb-2">Nama Produk</label>
              <input id="nama-produk" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" placeholder="cth. Caramel Latte" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Harga (Rp)</label>
              <input id="harga-produk" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" className="input-field" placeholder="cth. 45000" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">URL Gambar</label>
              <input id="url-gambar-produk" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
            <div className="sm:col-span-2 flex gap-4">
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
                <th className="px-6 py-4 font-semibold">Harga</th>
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
                  <td className="px-6 py-4 text-amber-700 font-semibold">
                    Rp {Number(p.price).toLocaleString('id-ID')}
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
