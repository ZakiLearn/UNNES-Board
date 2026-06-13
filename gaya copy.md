# Panduan Gaya Desain UNNES-Board (Design System)

Proyek **UNNES-Board** menggunakan konsep desain **Neo-Brutalisme** (Neobrutalism). Gaya ini ditandai dengan penggunaan warna-warna cerah/kontras yang dikombinasikan dengan garis batas (stroke) hitam yang tebal, bayangan (shadow) tanpa blur (hard shadow), dan tipografi yang tegas.

---

## 1. Palet Warna (Color Palette)

Berikut adalah warna-warna utama yang dikonfigurasi dalam `tailwind.config.js` dan variabel CSS (`globals.css`):

| Nama Warna | Kode Hex | Variabel CSS | Kelas Tailwind | Deskripsi / Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Cream** | `#F8E6A0` | `--bg-cream` | `bg-cream` | Warna latar belakang utama situs/aplikasi. |
| **Orange** | `#FFA62B` | `--accent-orange` | `bg-orange` | Warna aksen utama, digunakan untuk tombol default. |
| **Blue** | `#2E5AA7` | `--accent-blue` | `bg-blue` | Warna aksen biru, memberikan kesan formal/akademis. |
| **Sky** | `#86C5FF` | `--accent-sky` | `bg-sky` | Warna biru muda cerah, digunakan untuk badge atau tombol sekunder. |
| **Mint** | `#A3E6B5` | `--accent-mint` | `bg-mint` | Warna hijau mint, biasanya untuk notifikasi/toast sukses atau elemen positif. |
| **Neo-Black** | `#1A1A1A` | `--color-black` | `text-neo-black` / `border-neo-black` | Warna hitam pekat untuk teks, border tebal, dan bayangan brutalist. |
| **White** | `#FFFFFF` | `--bg-white` | `bg-white` | Warna dasar kartu/container konten. |
| **Dark-White** | `#F9F9F9` | `--bg-dark-white`| `bg-dark-white` | Warna putih redup untuk latar belakang alternatif. |

---

## 2. Tipografi (Typography)

Menggunakan dua font Google yang diimpor di `globals.css`:

1. **Heading Font**: `Outfit` (sans-serif)
   - Diatur dengan variabel `--font-heading` (`font-heading` di Tailwind).
   - Digunakan untuk semua tag heading (`h1` sampai `h6`).
   - Karakter: Sangat tebal (`font-extrabold` atau `font-black`) dan rapat (`tracking-tight`).

2. **Body Font**: `Plus Jakarta Sans` (sans-serif)
   - Diatur dengan variabel `--font-body` (`font-body` di Tailwind).
   - Digunakan untuk teks isi, deskripsi, formulir, dan tombol.

---

## 3. Efek & Layout Neo-Brutalis (Borders, Shadows, and Transitions)

Ciri khas neobrutalisme pada proyek ini dibangun menggunakan konfigurasi berikut:

* **Batas (Border/Stroke)**:
  - Menggunakan garis tegas berwarna Neo-Black dengan ketebalan **2px**.
  - CSS: `border: 2px solid var(--color-black)` atau `border-2 border-neo-black`.
* **Sudut (Border Radius)**:
  - **Large (`rounded-lg`)**: `24px` (digunakan pada kartu utama/card).
  - **Medium (`rounded-md`)**: `16px` (digunakan pada tombol, toast).
  - **Small (`rounded-sm`)**: `8px` (digunakan pada input formulir, scrollbar, badge).
* **Bayangan Keras (Hard Shadow)**:
  - **Shadow Utama (`shadow-neo`)**: `4px 4px 0px 0px #1A1A1A`
  - **Shadow Hover (`shadow-neo-hover`)**: `2px 2px 0px 0px #1A1A1A`
  - **Shadow Kecil (`shadow-neo-sm`)**: `2px 2px 0px 0px #1A1A1A`
* **Transisi (Transitions)**:
  - Transisi cepat menggunakan kurva bezier khusus untuk memberikan efek memantul yang organik: `0.15s cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 4. Komponen & Kelas Utama (CSS Components)

Berikut beberapa kelas CSS kustom yang didefinisikan dalam `@layer components` pada `globals.css`:

### Kartu (Neo-Card)
* `.neo-card`: Kartu standar berlatar putih dengan border hitam tebal dan bayangan neo.
* `.neo-card.interactive`: Memiliki efek hover bergerak turun sedikit ke arah bayangan (`translate-x-[2px] translate-y-[2px]`) dan bayangannya mengecil (`shadow-neo-hover`).

### Tombol (Neo-Button)
Semua tombol memiliki interaksi khas: saat di-*hover* akan bergeser ke bawah-kanan, dan saat di-*click* (*active*) akan turun sepenuhnya menempel ke bidang dasar (`translate-x-[4px] translate-y-[4px] shadow-none`).
* `.neo-btn`: Tombol dasar berlatar warna Orange.
* `.neo-btn.blue`: Tombol berlatar warna Blue dengan teks putih.
* `.neo-btn.sky`: Tombol berlatar warna Sky dengan teks hitam.
* `.neo-btn.mint`: Tombol berlatar warna Mint dengan teks hitam.
* `.neo-btn.small`: Tombol ukuran kecil (`text-xs` dengan padding lebih rapat).

### Badge (Neo-Badge)
* `.neo-badge`: Badge teks kecil (`text-xs`) dengan border hitam tipis berlatar Sky, biasanya dipakai untuk label kategori atau status.

### Formulir (Form Styles)
* `.form-group`: Pengelompok baris input (`margin-bottom: 1rem`).
* `.form-label`: Label input teks kapital tebal (`font-heading font-extrabold text-sm`).
* `.form-control`: Bidang input teks/textarea berlatar putih dengan border hitam, bayangan neo kecil, dan efek fokus yang dinamis.

### Toast / Notifikasi
* `.toast-container`: Wadah notifikasi melayang di kanan bawah layar.
* `.toast`: Elemen notifikasi berlatar warna Mint dengan animasi masuk meluncur ke atas (`slideIn`).
