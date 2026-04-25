# ☕ Hutatus Coffee — Artisanal Coffee Marketplace

Platform marketplace kopi artisanal modern yang dibangun dengan **Next.js 14**, **Tailwind CSS**, dan **Supabase**.

---

## 🚀 Fitur Utama

-   **Kategori & Filter Menu**: Tab filter interaktif untuk kategori Coffee, Non-Coffee, Dessert, dan Snack.
-   **Kustomisasi Produk**: Modal pilihan variasi (Size S/M/L, Gula, dan Es) dengan penyesuaian harga real-time.
-   **🛒 Advanced Cart System**: Mendukung multiple variasi untuk satu produk yang sama menggunakan composite unique key.
-   **Sistem Pembayaran Manual**: Dilengkapi QRIS (Click & Download) dan instruksi transfer bank.
-   **Konfirmasi WhatsApp**: Integrasi pesan otomatis ke Admin untuk mempercepat proses verifikasi.
-   **🔐 Admin Dashboard**: Portal manajemen produk dan pesanan yang diproteksi dengan PIN Keamanan 6-Digit.
-   **Riwayat Pesanan**: Pelanggan dapat melacak status pesanan dan mengakses kembali QRIS pembayaran melalui nomor telepon.

---

## 🛠️ Arsitektur & Alur Coding (Technical Flow)

### 1. State Management (Cart)
Keranjang belanja menggunakan **React Context API** (`CartContext.tsx`).
-   **Composite Key**: Setiap item di keranjang diidentifikasi dengan `cartKey` unik: `${id}__${size}__${sugar}__${ice}`. Ini memungkinkan pelanggan membeli dua cangkir kopi yang sama dengan pilihan gula yang berbeda.
-   **Price Resolution**: Harga akhir (`effectivePrice`) dihitung secara dinamis berdasarkan ukuran (Size) yang dikirim dari produk sebelum masuk ke state keranjang.

### 2. Database Schema (Supabase)
Tabel utama yang digunakan:
-   `products`: Menyimpan detail item, kategori, dan flag variasi (`has_size_option`, dll).
-   `orders`: Menyimpan metadata transaksi dan metode pembayaran.
-   `order_items`: Menyimpan detail item yang dipesan, lengkap dengan pilihan variasi pelanggan.
-   `customers`: Menyimpan database pelanggan berbasis nomor telepon (Unik).

### 3. Autentikasi Admin & Sesi
-   **PIN Verification**: Login admin (`/login`) melakukan POST ke API route `/api/admin/login`, memverifikasi PIN dari environment variable `ADMIN_PIN`.
-   **Secure Cookies**: Jika berhasil, server akan menetapkan cookie `admin_session=true` yang bersifat **HttpOnly**.
-   **Middleware-like Protection**: `AdminLayout` di Next.js akan mengecek keberadaan cookie ini menggunakan `cookies().get()` sebelum merender konten admin. Jika tidak ada, diarahkan kembali ke `/login`.

### 4. Navigasi Kondisional
Navbar pelanggan menggunakan `usePathname()` untuk mendeteksi rute. Navbar akan **disembunyikan** jika rute diawali dengan `/admin` atau `/login` untuk menjaga estetika Professional Admin Dashboard.

---

## ⚙️ Cara Konfigurasi (Setup)

### 1. Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PIN=252525
```

### 2. Update QRIS Payment
Ganti file di folder `/public/qris.png` dengan gambar QRIS asli Anda. Sistem akan otomatis memperbarui tampilan di halaman sukses tanpa perubahan kode.

### 3. WhatsApp Admin
Nomor WA Admin dapat diubah langsung di file `app/success/page.tsx` pada konstanta `waNumber`.

---

## 📦 Pengembangan Masa Depan
-   Integrasi Payment Gateway (Midtrans) untuk verifikasi pembayaran otomatis.
-   Upload Bukti Transfer langsung ke Supabase Storage.
-   Print struk pesanan otomatis untuk Admin.

---
&copy; 2026 **Hutatus Coffee**. Build with 🖤 by Antigravity.
