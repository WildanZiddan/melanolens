# MelanoLens - AI-Powered Melanoma Early Screening Assistant

MelanoLens adalah platform asisten penapisan (*screening*) awal melanoma berbasis kecerdasan buatan (*Computer Vision*) yang dirancang untuk mendukung transparansi diagnostik klinis. Platform ini mengintegrasikan standar medis ABCDE dengan visualisasi *Attention Maps* guna membantu tenaga medis maupun masyarakat dalam melakukan deteksi dini risiko kanker kulit secara objektif.

Proyek ini dikembangkan menggunakan **Next.js (App Router)**, **TypeScript**, dan **Tailwind CSS** sebagai bagian dari pemenuhan tugas akademik di **Politeknik Astra**.

---

## 🚀 Fitur Utama & Kebermanfaatan Sistem

### Standardisasi Klinis ABCDE
Sistem melakukan ekstraksi fitur morfologi lesi kulit berdasarkan parameter medis:

- **Asymmetry** — Ketidaksimetrisan bentuk
- **Border** — Pinggiran lesi yang tidak rata atau kabur
- **Color** — Gradasi warna yang tidak seragam
- **Diameter** — Ukuran jaringan lesi
- **Evolving** — Perubahan karakteristik dari waktu ke waktu

### Transparansi AI (*Explainable AI*)
Menyajikan hasil kalkulasi probabilitas yang dilengkapi dengan visualisasi peta atensi (*Attention Maps* / *Heatmap*) untuk menunjukkan area interpretasi model *Deep Learning*.

### Split-Screen Authentication
Alur masuk (*Login*) dan pendaftaran (*Sign Up*) yang aman dan responsif, terintegrasi dengan **NextAuth**.

### Dashboard Klinis
Antarmuka pengguna yang bersih untuk melihat riwayat skrining, hasil analisis citra dermoskopi, serta laporan perkembangan lesi pasien.

### Robust Type-Checking
Dibangun penuh menggunakan **TypeScript** untuk memastikan keamanan data dan meminimalkan *bug* saat *runtime*.

---

## 🛠️ Spesifikasi Teknologi (*Tech Stack*)

| Kategori | Teknologi |
|---|---|
| Frontend Framework | Next.js 14+ (App Router) & React |
| Language | TypeScript |
| Styling | Tailwind CSS & Tailwind Components |
| Authentication | NextAuth.js |
| State Management | React Hooks & Context API |
| Deployment | Vercel |

---

## 💻 Langkah Pengembangan Lokal (*Local Development*)

Pastikan **Node.js** sudah terinstall di perangkat.

### 1. Clone atau Masuk ke Folder Project

```bash
cd melanolens
```

### 2. Install Dependencies

Unduh seluruh library yang tercatat pada `package.json`.

```bash
npm install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka:

```text
http://localhost:3000
```

di browser untuk melihat hasilnya.

### 4. Build untuk Produksi

Sebelum deployment ke Vercel, lakukan build:

```bash
npm run build
```

---

## 🚀 Deployment

MelanoLens dapat dideploy menggunakan **Vercel** untuk *production build* yang cepat dan optimal.

```bash
vercel deploy
```

---

## 🛡️ Disclaimer Medis

> **PENTING:**  
> MelanoLens merupakan alat penapisan awal (*screening tool*) berbasis komputasi dan **TIDAK MENGGANTIKAN** diagnosis medis formal dari dokter spesialis kulit (*dermatolog*). Segala hasil indikasi yang dihasilkan sistem wajib dikonsultasikan lebih lanjut kepada fasilitas kesehatan atau dokter spesialis terkait.
