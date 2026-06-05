# 🏫 UnnesBoard (ZonaKampus)

**UnnesBoard** (sebelumnya ZonaKampus) adalah papan buletin digital dan ruang komunitas interaktif mahasiswa **Universitas Negeri Semarang (UNNES)**. Aplikasi ini dirancang dengan gaya desain **Neo-brutalism** modern, menghadirkan estetika premium yang responsif, ceria, dan interaktif bagi mahasiswa untuk berjejaring secara anonim.

---

## ✨ Fitur Utama

- **📨 Live Campus Feed (Menfess)**: Kirim curhatan, pertanyaan, atau pesan secara anonim dengan sensor kata kasar otomatis (*profanity filter*) dan berikan reaksi emotikon interaktif.
- **🌊 Tes Ombak (Interactive Polling)**: Buat dan ikuti jajak pendapat kampus secara *real-time* untuk mengukur opini mahasiswa terkait berbagai isu perkuliahan.
- **📡 Radar Event**: Temukan info acara kampus terbaru seperti webinar, hackathon, donor darah, dan program kemahasiswaan lainnya secara visual.
- **📱 Desain Neo-brutalism & Responsif**: Tampilan dengan warna kontras tinggi, bayangan tebal bergaya retro-modern, serta tata letak adaptif (optimal di perangkat *mobile* maupun *desktop*).

---

## 📂 Struktur Proyek

Proyek ini menggunakan Next.js App Router dengan penataan folder modular berdasarkan konteks fitur:

```text
UNNES-Board/
├── public/                 # Aset statis (gambar, ikon, logo)
├── src/
│   ├── app/                # Router, layout, dan gaya desain utama
│   │   ├── globals.css     # Sistem desain Neo-brutalism (CSS Variables & utilitas)
│   │   ├── layout.js       # Layout dasar halaman (SEO Meta tags)
│   │   └── page.js         # Logika dashboard utama dan interaksi state
│   └── components/         # Komponen React yang didekatkan berdasarkan fiturnya
│       ├── layout/         # Komponen kerangka halaman global
│       │   └── Header.js   # Navigasi atas & status pengguna online
│       └── features/       # Komponen spesifik fitur/domain aplikasi
│           ├── event/      # Komponen untuk event kampus
│           │   └── EventRadar.js
│           ├── menfess/    # Komponen pengiriman & kartu menfess
│           │   ├── MenfessCard.js
│           │   └── MenfessForm.js
│           └── poll/       # Komponen jajak pendapat (polling)
│               └── PollWidget.js
├── jsconfig.json           # Konfigurasi path alias (@/*)
├── package.json            # Daftar dependensi dan script aplikasi
└── next.config.mjs         # Konfigurasi Next.js
```

---

## 🚀 Memulai Aplikasi

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi secara lokal:

### 1. Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di perangkat Anda.

### 2. Instalasi Dependensi
Jalankan perintah berikut di terminal untuk memasang seluruh paket yang dibutuhkan:
```bash
npm install
```

### 3. Mode Pengembangan (Development Server)
Jalankan server lokal pada port default (`http://localhost:3000`):
```bash
npm run dev
```

### 4. Build untuk Produksi
Gunakan perintah berikut untuk mengoptimalkan aplikasi sebelum dideploy ke lingkungan produksi:
```bash
npm run build
```
Untuk menjalankan hasil build:
```bash
npm run start
```

---

## 🎨 Sistem Desain & Estetika
Aplikasi ini memanfaatkan estetika **Neo-brutalism** dengan menggunakan:
- Warna primer berkarakter tajam (`--accent-orange`, `--accent-blue`, dll).
- Garis tepi tebal bernuansa retro (`--border-stroke`).
- Efek bayangan tegas (`--box-shadow-neo`) dengan efek mikro-animasi pada aksi hover/click.