# 🏫 UnnesBoard (ZonaKampus)

> **UnnesBoard** (sebelumnya ZonaKampus) adalah papan buletin digital, pasar loak kemahasiswaan, dan ruang obrolan anonim interaktif untuk civitas akademika **Universitas Negeri Semarang (UNNES)**. 

Aplikasi ini mengadopsi gaya desain **Neo-brutalism** retro-modern dengan warna kontras yang berani, garis tepi tebal, drop-shadow tegas, serta micro-animations interaktif untuk memikat pengguna Gen-Z.

---

## ✨ Fitur & Demonstrasi Interaktif

1. **🔒 Pembagian Akses Rute (Auth Route Groups)**
   - **Guest Area (`(public)`)**: Halaman depan statis ([Landing Page](file:///d:/code/UNNES-Board/src/app/(public)/page.js)), [Login](file:///d:/code/UNNES-Board/src/app/(public)/login/page.js), dan [Register](file:///d:/code/UNNES-Board/src/app/(public)/register/page.js) dengan navigasi tombol minimalis.
   - **Protected Area (`(protected)`)**: Area dashboard utama yang diproteksi client-side session checker. Pengguna luar akan otomatis diredirect kembali ke halaman masuk.

2. **📨 Live Campus Feed (Menfess)**
   - Mengirim pesan/curhatan secara anonim ke target tertentu.
   - **Profanity Filter**: Sensor kata kasar otomatis secara langsung (*real-time*) sebelum menfess diterbangkan.
   - Reaksi emoji interaktif (🔥, 😂, ❤️) serta laci komentar (*comments tray*) dinamis di setiap kartu menfess.

3. **🌊 Tes Ombak (Interactive Polling)**
   - Widget jajak pendapat interaktif untuk mengumpulkan suara dan konsensus mahasiswa terkait isu hangat di kampus dengan visual persentase *real-time*.

4. **📡 Radar Event Kampus**
   - Banner karosel horizontal di atas feed yang menampilkan webinar, kompetisi/hackathon, aksi sosial, dan tautan pendaftaran langsung.

5. **🏛️ Explore Communities & Boards**
   - **Official Boards**: Akses ke mading digital organisasi resmi seperti BEM KM, HIMA, dan UKM.
   - **Unofficial Boards**: Direktori klub hobi (olahraga, kuliner, gaming) dengan fitur *Join/Leave Group*.

6. **💬 Direct Messages (DM) Anonim**
   - Fitur kirim pesan pribadi langsung dengan daftar chat aktif dan jendela obrolan interaktif yang dilengkapi fitur *simulated auto-reply*.

7. **🛍️ Sekaran Marketplace (Pasar Loak)**
   - Platform jual beli barang bekas kosan (buku, rice cooker, sepeda, jaket) dengan sistem COD Sekaran.
   - Form tambah barang interaktif dilengkapi ikon ilustrasi emoji.

---

## 🛠️ Tech Stack & Konfigurasi

- **Core**: [React 18](https://react.dev/) & [Next.js 14 (App Router)](https://nextjs.org/)
- **State Management**: React Context ([AuthContext](file:///d:/code/UNNES-Board/src/context/AuthContext.js)) untuk simulasi sesi login pengguna.
- **Styling**: Vanilla CSS dengan variabel CSS custom ([globals.css](file:///d:/code/UNNES-Board/src/app/globals.css)) untuk kemudahan kustomisasi tema warna Neo-brutalism.
- **Penyimpanan**: `localStorage` API untuk menyimpan status auth, daftar postingan menfess, hasil voting jajak pendapat, dan daftar barang marketplace secara lokal pada browser.
- **Konfigurasi Path**: [jsconfig.json](file:///d:/code/UNNES-Board/jsconfig.json) untuk pemetaan import path bersih menggunakan alias `@/components/...`.

---

## 📂 Struktur Proyek Terkini

```text
UNNES-Board/
├── public/                 # Aset statis (gambar, logo, dll)
├── src/
│   ├── app/                # Router utama dan gaya dasar
│   │   ├── globals.css     # Palet warna Neo-brutalism, layout global & font
│   │   ├── layout.js       # Global root wrapper & Provider
│   │   │
│   │   ├── (public)/       # 🔒 RUTE GUEST (Belum Login)
│   │   │   ├── layout.js   # Navigasi atas (Login / Daftar)
│   │   │   ├── page.js     # Landing page & Mockup Feed
│   │   │   ├── login/
│   │   │   │   └── page.js # Formulir Masuk
│   │   │   └── register/
│   │   │       └── page.js # Formulir Pendaftaran
│   │   │
│   │   └── (protected)/    # 🔓 RUTE USER (Sudah Login)
│   │       ├── layout.js   # Sidebar navigasi desktop, BottomNav mobile, proteksi login
│   │       ├── feed/
│   │       │   └── page.js # Dashboard utama (Events, Post Menfess, Thread list, Poll)
│   │       ├── explore/
│   │       │   └── page.js # Direktori komunitas kampus resmi & hobi
│   │       ├── messages/
│   │       │   └── page.js # Panel obrolan pribadi/DM
│   │       ├── marketplace/
│   │       │   └── page.js # Pasar loak barang mahasiswa
│   │       ├── notifications/
│   │       │   └── page.js # Update aktivitas (like, comment, dll)
│   │       ├── profile/
│   │       │   └── page.js # Profil pengguna & daftar postingan saya
│   │       └── communities/
│   │           └── create/
│   │               └── page.js # Form usulan komunitas baru
│   │
│   ├── components/         # Komponen React Modular
│   │   ├── layout/         # Kerangka layout (GuestHeader, Sidebar, BottomNav)
│   │   ├── landing/        # HeroSection & StaticMockupFeed halaman depan
│   │   └── features/       # Komponen spesifik fitur/domain (feed, explore, messages, dll)
│   └── context/
│       └── AuthContext.js  # Manajemen login simulasi local-storage
├── jsconfig.json           # Path Aliases Config
├── .gitignore              # Git Ignore Rules
├── package.json            # Scripts & dependencies
└── next.config.mjs         # Next.js Config
```

---

## 🚀 Memulai Aplikasi Secara Lokal

### 1. Prasyarat
Instal [Node.js](https://nodejs.org/) versi LTS di komputer Anda.

### 2. Pemasangan Dependensi
Buka terminal di dalam folder projek ini, lalu ketik:
```bash
npm install
```

### 3. Jalankan Mode Pengembangan (Local Dev Server)
Jalankan perintah berikut:
```bash
npm run dev
```
Buka browser Anda dan akses halaman di [http://localhost:3000](http://localhost:3000).

### 4. Build untuk Produksi
Untuk mengecek performa optimal dan kompilasi static pages:
```bash
npm run build
npm run start
```

---

## 🎨 Palet Warna Desain (Neo-brutalism)
- **Background Utama**: `#F8E6A0` (Cream Kuning Cerah)
- **Aksen Primer**: `#FFA62B` (Orange Menyala)
- **Aksen Sekunder**: `#2E5AA7` (Biru Tua Kontras)
- **Aksen Mint**: `#A3E6B5` (Hijau Mint Lembut)
- **Tepi & Stroke**: `#1A1A1A` (Garis Hitam Tebal 2px)