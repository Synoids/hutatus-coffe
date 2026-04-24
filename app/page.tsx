import Link from 'next/link'

export default function Home() {
  const features = [
    { icon: '☕', title: 'Disangrai dengan Sepenuh Hati', desc: 'Setiap biji kopi kami disangrai dalam jumlah kecil dengan perhatian penuh untuk menjaga rasa dan aroma terbaik.' },
    { icon: '🌱', title: 'Biji Kopi Pilihan', desc: 'Kami bekerja sama langsung dengan petani untuk menghadirkan kopi berkualitas dengan proses yang berkelanjutan.' },
    { icon: '🚀', title: 'Praktis & Cepat', desc: 'Pesan online tanpa ribet, kopi Anda siap dinikmati tanpa perlu menunggu lama.' },
  ]

  return (
    <>
      {/* ---- HERO ---- */}
      <section className="relative isolate overflow-hidden bg-stone-950 min-h-[88vh] flex items-center">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1920')" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-stone-950/60 via-transparent to-stone-950" />

        <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center relative z-10">
          <p className="text-amber-400 font-semibold tracking-widest text-sm uppercase mb-4 animate-pulse">
            Selamat Datang di Hutatus Coffee
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl leading-tight drop-shadow-lg">
            Temani Harimu <br />
            <span className="text-amber-400">dengan Secangkir Kopi</span>
          </h1>
          <p className="mt-8 text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Dari biji kopi pilihan hingga proses seduh yang penuh perhatian,
            kami menghadirkan pengalaman ngopi yang hangat, santai, dan berkesan di setiap tegukan.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/menu"
              className="rounded-xl bg-amber-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-amber-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-500/30 hover:shadow-xl"
            >
              Lihat Menu →
            </Link>
            <Link
              href="#fitur"
              className="rounded-xl border border-stone-500 px-8 py-4 text-base font-semibold text-stone-200 hover:border-amber-400 hover:text-amber-400 transition-all duration-300"
            >
              Tentang Kami
            </Link>
          </div>
        </div>
      </section>

      {/* ---- FITUR ---- */}
      <section id="fitur" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-stone-900 sm:text-4xl">Kenapa Hutatus Coffee?</h2>
            <p className="mt-4 text-stone-500 text-lg max-w-xl mx-auto">
              Kami percaya kopi yang enak bisa bikin hari terasa lebih baik.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((f) => (
              <div key={f.title} className="group card p-8 text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl mb-5">{f.icon}</div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA BANNER ---- */}
      <section className="bg-amber-700 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Mau Ngopi Sekarang?
          </h2>
          <p className="text-amber-100 mb-8 text-lg">
            Pilih menu favoritmu dan nikmati kopi terbaik tanpa ribet.
          </p>
          <Link
            href="/menu"
            className="inline-block bg-white text-amber-800 font-bold px-8 py-4 rounded-xl hover:bg-amber-50 transition-all duration-300 shadow-lg hover:-translate-y-1"
          >
            Lihat Menu
          </Link>
        </div>
      </section>
    </>
  )
}