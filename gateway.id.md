---
title: "FATAH | Gateway Link Hub & Personal Portal"
description: "Portal link personal dan hub portofolio independen yang ultra-cepat, responsif, dan elegan, ditenagai oleh React 18, Vite, GSAP 3D motion, MUI Material Icons, dan Sveltia Headless CMS."
status: "active"
techStack:
  - React 18
  - Vite
  - GSAP 3
  - MUI Material Icons
  - Sveltia CMS
  - Cloudflare Pages
  - CSS3 Glassmorphism
startDate: "2026-07-23"
repoUrl: "https://github.com/fatahilah-mr/gateway"
demoUrl: "https://fatah.web.id"
heroImage: "/uploads/gateway-hero.png"
featured: true
references:
  - title: "Dokumentasi Sveltia CMS"
    url: "https://sveltiacms.dev"
  - title: "GSAP Documentation & Easing Guide"
    url: "https://gsap.com/docs/v3/"
  - title: "MUI Material Icons Library"
    url: "https://mui.com/material-ui/material-icons/"
  - title: "Cloudflare Pages & Functions Docs"
    url: "https://developers.cloudflare.com/pages/"
---

## 📌 1. Problem (Latar Belakang & Masalah)

Platform agregator tautan populer seperti Linktree atau Lnk.bio memiliki beberapa keterbatasan mendasar bagi seorang profesional pengembang web dan teknisi jaringan:
- **Keterbatasan Kustomisasi & Desain Standar:** Antarmuka bawaan terasa kaku, generic, dan kurang mencerminkan identitas *brand* personal berstandar tinggi.
- **Biaya Langganan (Subscription Fee):** Fitur-fitur penting seperti analisis mendalam, kustomisasi domain, ikon kustom, dan penghapusan *watermark* membutuhkan biaya langganan bulanan.
- **Masalah Performa & Dependency Lock-in:** Platform *hosted* pihak ketiga sering kali lambat dimuat di perangkat seluler dengan koneksi hemat data, serta rentan terhadap *downtime* atau perubahan kebijakan layanan di luar kendali kita.
- **Kebutuhan Pengelolaan Konten Tanpa Kode (*Zero-Code*):** Di sisi lain, membuat portal statis secara manual membuat perubahan link atau deskripsi harus melalui pengeditan kode (*hardcoded*) dan proses *deploy* ulang yang tidak praktis saat diakses melalui smartphone.

---

## 👤 2. Target User (Pengguna Utama)

1. **Rekruiter & Potential Clients:** Mengakses riwayat kerja, portofolio interaktif, dan resume profesional secara langsung dalam satu klik.
2. **Kolega & Komunitas Developer:** Menjangkau repositori GitHub, tulisan blog teknologi (`fatahmr.my.id`), dan jaringan sosial profesional (LinkedIn, Threads, X/Twitter).
3. **Pemilik Proyek (Fatahilah Miftahul Rahman):** Mengelola, mengedit, menambah, atau menghapus link dan konfigurasi bahasa/teks secara mandiri tanpa menyentuh satu baris kode pun melalui antarmuka CMS yang ramah seluler.

---

## 💡 3. Solution (Solusi yang Ditawarkan)

Membangun **FATAH Gateway**, sebuah aplikasi web *Single Page Application* (SPA) performa tinggi yang menggabungkan keindahan estetika modern dengan keandalan infrastruktur *serverless*:
- **Infrastruktur Gratis & Ultra Cepat:** Di-host di Cloudflare Pages Edge Network global yang didukung *Edge Serverless Functions* untuk autentikasi OAuth.
- **Headless CMS Berbasis Git (*Git-based CMS*):** Mengintegrasikan **Sveltia CMS** yang terhubung langsung dengan repositori GitHub. Setiap perubahan konten di CMS akan secara otomatis memicu perintah *commit* Git dan *build* otomatis di Cloudflare Pages.
- **Desain Glassmorphism & Animasi Mikro 3D:** Menggunakan kombinasi CSS custom modern dan GSAP untuk menciptakan animasi masuk yang *smooth*, respons interaktif tilt 3D saat *hover*, serta umpan balik membal (*bounce*) saat kartu diklik.
- **Dual Language & Dual Theme Native:** Fitur beralih bahasa (Indonesia 🇮🇩 & Inggris 🇬🇧) serta mode gelap/terang (*dark/light mode*) yang otomatis mengikuti preferensi sistem OS pengguna.

---

## ⭐ 4. Key Features (Fitur-Fitur Utama)

- **Zero-Code Content Management (Sveltia CMS Panel):** Kelola urutan tautan, ikon, judul, deskripsi bilingual, dan teks header/footer secara instan melalui dasbor `/admin/`.
- **GSAP 3D Interactive Cards:** Setiap kartu link memiliki fisika 3D yang merespons pergerakan kursor kursor/sentuhan layar dengan efek *transform perspective* yang halus.
- **MUI Material Icons Integration:** Pemetaan ikon terpusat menggunakan library resmi Google Material Design dengan 30+ pilihan ikon populer (termasuk ikon merek resmi seperti GitHub, LinkedIn, WhatsApp, YouTube, Instagram, Telegram, Threads, dll).
- **Infrastruktur OAuth GitHub Serverless:** Autentikasi CMS yang aman dan cepat menggunakan Cloudflare Pages Functions (`/api/auth`) tanpa bergantung pada server backend eksternal yang lambat.
- **Dynamic System Theme & Language Sync:** Perubahan bahasa dan tema dilakukan secara *real-time* tanpa *page reload*, dilengkapi *loader animation overlay* yang elegan.
- **Penanganan SEO & Canonical Lengkap:** Proteksi duplikasi halaman Google Search Console melalui penegakan *Canonical Tag* otomatis di tingkat HTML head, React state, HTTP Response Header, dan 301 Redirect Rules Cloudflare (`_redirects`).

---

## 🧱 5. Challenges & Lessons Learned (Tantangan Teknis & Pemecahan Masalah)

- **Tantangan 1: Masalah Blank Screen & Kompatibilitas Bundler pada Decap CMS**
  - *Kendala:* Implementasi awal menggunakan Decap CMS mengalami masalah *blank white screen* di lingkungan produksi Cloudflare Pages akibat konflik *module bundling* dan *router hash*.
  - *Solusi:* Melakukan migrasi penuh ke **Sveltia CMS**, alternatif modern yang lebih ringan, kompatibel penuh dengan skema `config.yml`, memiliki penanganan error UI yang jelas, serta proses inisialisasi yang jauh lebih cepat.

- **Tantangan 2: Performa Bundle & Kebocoran Ukuran Berkas akibat Library Ikon**
  - *Kendala:* Menggunakan library ikon umum secara naif menyebabkan *bundle size* membengkak hingga melibatkan lebih dari 1.700 modul JavaScript yang tidak terpakai.
  - *Solusi:* Melakukan migrasi ke `@mui/icons-material` dengan membuat *module mapper* terpusat (`src/data/iconMap.js`). Hasilnya, *bundle size* berkurang drastis menjadi hanya **315 modul** (~109 KB gzip JS) dan *build time* terpangkas menjadi ~10 detik.

- **Tantangan 3: Masalah "Duplicate Without User-Selected Canonical" di Google Search Console**
  - *Kendala:* Pergantian domain utama dari `links.fatahmr.my.id` ke `fatah.web.id` menyebabkan crawler Google mendeteksi duplikasi variasi URL (HTTP/HTTPS, WWW/Non-WWW, serta query parameter).
  - *Solusi:* Menerapkan *triple-layer canonical enforcement*:
    1. Menginjeksi `<link rel="canonical" href="https://fatah.web.id/" />` secara terpusat di `index.html` dan `SEOHead.jsx`.
    2. Menambahkan HTTP Header `Link: <https://fatah.web.id/>; rel="canonical"` di file `public/_headers`.
    3. Memasang aturan 301 Permanent Redirect di file `public/_redirects`.

---

## 📈 6. Impact (Dampak & Hasil)

- **Sebelum:** Bergantung pada platform pihak ketiga dengan opsi kustomisasi terbatas, atau pembaruan kode manual yang memakan waktu setiap kali ada tautan baru yang ingin ditambahkan.
- **Sesudah:**
  - **Kecepatan Memuat Halaman:** Skor Lighthouse mencapai 95+ di perangkat seluler dengan animasi 60 FPS yang mulus.
  - **Efisiensi Biaya:** 100% Bebas biaya langganan selamanya dengan performa *enterprise-grade* di Cloudflare Edge Network.
  - **Pengelolaan Konten 100% Zero-Code:** Menambah atau mengubah kartu tautan dapat dilakukan kurang dari 1 menit langsung dari *smartphone* via URL `/admin`.
  - **SEO & Identitas Digital Terkonsolidasi:** Terindeks secara sempurna di mesin pencari dengan domain kustom bersih `fatah.web.id`.

---

## 🛠️ Tech Choices (Pilihan Teknologi & Alasan Teknis)

- **React 18 & Vite:** Dipilih karena ekosistem komponen yang matang, *Hot Module Replacement* (HMR) yang sangat cepat saat pengembangan, serta kemampuan *tree-shaking* bundler Vite yang menghasilkan skrip produksi minimalis.
- **GSAP (GreenSock Animation Platform) 3:** Dipilih dibanding CSS Animations standar karena kontrol *timeline* animasi yang sangat presisi, kinerja GPU tinggi tanpa *jank*, dan modul fisika 3D/easing yang fleksibel.
- **Sveltia CMS:** Dipilih sebagai Headless CMS berbasis Git karena arsitekturnya yang tanpa backend (*serverless*), ringan, cepat, dan menggunakan format konfigurasi YAML yang intuitif.
- **MUI Material Icons (`@mui/icons-material`):** Dipilih untuk menggantikan ikon SVG manual karena standar visual Material Design Google yang konsisten, ketersediaan ribuan ikon profesional, dan kemudahan kustomisasi prop/CSS.
- **Cloudflare Pages & Functions:** Dipilih untuk infrastruktur *hosting* karena *global CDN deployment* super-cepat, dukungan gratis SSL, dan kemampuan menjalankan *serverless JavaScript functions* untuk OAuth handler.

---

## 🖼️ Screenshots & Visual Demo

![Tampilan Utama Gateway](/uploads/gateway-hero.png)
*Gambar 1: Antarmuka utama FATAH Gateway menampilkan kartu tautan interaktif dengan tema gelap/terang dan dukungan bilingual.*

![Sveltia CMS Admin Panel](/uploads/gateway-admin.png)
*Gambar 2: Dasbor Sveltia CMS (/admin/) untuk pengelolaan tautan dan konfigurasi konten tanpa kode.*
