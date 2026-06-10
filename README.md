# UnnesBoard 🏠🌊💬

**UnnesBoard** adalah platform sosial digital interaktif dan terpercaya yang dirancang khusus untuk mahasiswa Universitas Negeri Semarang (UNNES). Mengusung desain **Neo-Brutalism** yang mencolok dan dinamis, platform ini memungkinkan mahasiswa untuk berinteraksi secara aman, berbagi keluh kesah secara anonim (menfess), mengikuti jajak pendapat harian (polling), serta memantau acara kampus yang akan datang.

---

## 🚀 Fitur Utama

### 1. 💬 Menfess Kampus (Anonim)
* Mengirim uneg-uneg atau pesan menfess secara 100% anonim menggunakan alias/nama samaran permanen yang di-assign secara otomatis atau diatur saat onboarding.
* Pemfilteran postingan secara dinamis berdasarkan hashtag kategori (`#Akademik`, `#Curhat`, `#Info`, `#Asmara`, `#Kantin`).

### 2. 💬 Komentar & Tanggapan Dinamis
* Setiap mahasiswa dapat menanggapi menfess dengan melayangkan komentar. Identitas komentator tetap terjaga menggunakan nama samaran permanen mereka.

### 3. 🔥 Ekspresi Anti-Spam (Reaksi)
* Mengekspresikan opini pada postingan secara cepat dengan reaksi emoji (`🔥`, `😂`, `❤️`).
* Sistem anti-spam memastikan setiap akun hanya dapat memberikan satu jenis reaksi per postingan.

### 4. 🌊 Tes Ombak Harian (Polling)
* Jajak pendapat kampus interaktif untuk melihat tren opini mahasiswa UNNES.
* Dilengkapi visualisasi persentase respons secara real-time setelah pengguna memilih, dengan opsi untuk mengubah atau membatalkan pilihan suara.

### 5. 📅 Carousel Acara Kampus (Upcoming Events)
* Widget slider horizontal otomatis di bagian atas feed yang menyajikan informasi acara kampus mendatang yang dikurasi dengan poster visual premium.
* Tombol navigasi manual (sebelumnya & berikutnya) dan dots indikator.

### 6. 🔐 Autentikasi Mahasiswa Resmi
* Terintegrasi dengan **Supabase Auth** dengan pembatasan domain wajib mahasiswa UNNES (`@students.unnes.ac.id`) untuk memelihara integritas komunitas.

---

## 🛠️ Tech Stack

### Frontend & Backend (Full-Stack)
* **Next.js 16.2.7 (App Router)** - Framework React modern dengan Server Actions dan Route Handlers.
* **React 19** - Library UI terbaru untuk render component yang cepat.
* **Tailwind CSS v4** - Styling visual dengan variabel utilitas modern.
* **Lucide React** - Set ikon vektor minimalis yang bersih.

### Database & ORM
* **Prisma ORM v6.8.0** - Toolkit database modern sebagai single source of truth untuk query database PostgreSQL.
* **Supabase PostgreSQL** - Relational database berbasis cloud.

### Keamanan & Middleware
* **Supabase Auth (GoTrue)** - Manajemen user dan otorisasi sesi terproteksi.
* **Next.js Middleware** - Proteksi rute aplikasi internal (`app/(protected)/*`) berbasis Supabase auth session.

---

## 🔮 Rencana Fitur Mendatang (Roadmap)

* **💬 Chat Real-Time (Websocket / Socket.io)**: Fitur perpesanan instan langsung (Direct Messages) antar mahasiswa secara real-time untuk diskusi kelompok atau transaksi jual beli barang bekas di Sekaran.
* **📰 Payload CMS**: Integrasi Content Management System headless untuk pengelolaan konten event kampus secara dinamis oleh administrator dan organisasi mahasiswa.

---

## ⚙️ Cara Menjalankan Project Secara Lokal

### 1. Kloning Repositori
```bash
git clone https://github.com/zakiLearn/UNNES-Board.git
cd UNNES-Board
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env` di direktori utama dan isi dengan kredensial Supabase Anda:
```env
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 4. Sinkronisasi Database (Prisma)
Generate Prisma Client dan push skema tabel ke database Supabase Anda:
```bash
npx prisma generate
npx prisma db push
```

### 5. Jalankan Seed Data
Untuk men-seed kategori (tags) dan polling default "Tes Ombak" ke database:
```bash
npx prisma db seed
```

### 6. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📦 Build Produksi
Untuk melakukan kompilasi proyek sebelum deployment:
```bash
npm run build
```
*(Catatan: Script build telah dioptimalkan untuk menjalankan `prisma generate` secara otomatis sebelum `next build` agar kompatibel penuh saat di-deploy ke Vercel).*
