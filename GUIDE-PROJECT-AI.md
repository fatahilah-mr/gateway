<system_instructions>
# AI GUIDELINE: WRITING PROJECTS

Dokumen ini berisi aturan eksplisit, skema frontmatter, dan panduan penulisan portofolio berbasis **Storytelling** (WHY, HOW, IMPACT) yang WAJIB diikuti AI atau CMS saat membuat/mengedit entri galeri proyek di repositori ini (`fmr.blog`).

---

## 1. FILE LOCATION & NAMING CONVENTION
- **Directory:** `src/content/projects/`
- **Filename:** `your-project-slug.id.md` atau `your-project-slug.en.md`
  - Gunakan format *kebab-case* huruf kecil untuk *slug*.
  - Tambahkan akhiran `.id.md` untuk Bahasa Indonesia atau `.en.md` untuk Bahasa Inggris agar sinkron dengan Sveltia CMS dan Astro i18n routing.

---

## 2. FRONTMATTER SCHEMA (YAML)
Setiap entri proyek WAJIB diawali dengan blok YAML frontmatter di antara pembatas `---`. 
Skema Zod yang berlaku (berdasarkan `src/content/config.ts`):

```yaml
---
# [REQUIRED] Judul proyek
title: "fmr.blog"

# [REQUIRED] Deskripsi singkat proyek (1-2 kalimat)
description: "Blog pribadi dan galeri proyek interaktif berbasis Astro 5 dan Sveltia CMS."

# [REQUIRED] Status proyek. Harus tepat: 'active', 'completed', atau 'archived'
status: "active"

# [REQUIRED] Array teknologi yang digunakan (cth: Astro 5, TypeScript, Cisco, MikroTik)
techStack:
  - Astro 5
  - TypeScript
  - Sveltia CMS
  - Cloudflare Pages

# [REQUIRED] Tanggal proyek dimulai (YYYY-MM-DD)
startDate: "2026-07-19"

# [OPTIONAL] URL ke repositori kode sumber (URL valid atau "")
repoUrl: "https://github.com/fatahilah-mr/blog"

# [OPTIONAL] URL ke live demo / situs berjalan (URL valid atau "")
demoUrl: "https://blog.fatah.web.id"

# [OPTIONAL] Path ke gambar sampul proyek. Harus disimpan di /public/uploads/
heroImage: "/uploads/project-cover.jpg"

# [OPTIONAL] Set true untuk menampilkan di halaman beranda / featured. Default: false
featured: true

# [OPTIONAL] Array sumber referensi / rujukan terkutip (otomatis masuk ke Collapsible Accordion)
references:
  - title: "Astro 5 Documentation"
    url: "https://docs.astro.build"
---
```

---

## 3. FILOSOFI & ATURAN PENULISAN (STORYTELLING)

Portofolio yang baik tidak hanya menampilkan hasil akhir, tetapi menceritakan **alasan di balik keputusan teknis, proses pemecahan masalah, dan dampak yang dihasilkan**.

### 💡 3 Pilar Utama:
1. **WHY (Mengapa):** Masalah spesifik apa yang sedang diselesaikan? Mengapa proyek ini penting?
2. **HOW (Bagaimana):** Bagaimana arsitektur dibangun, teknologi dipilih, dan tantangan teknis diatasi?
3. **IMPACT (Dampak):** Nilai tambah atau efisiensi apa yang dirasakan setelah proyek ini selesai?

---

## 4. ATURAN TATA LETAK & SYARAT TECHNICAL ASTRO
1. **Haram Menggunakan H1 (`#`) di Body:** JANGAN PERNAH menulis judul H1 (`# Judul Proyek`) di dalam body markdown. Layout Astro (`src/pages/projects/[slug].astro`) secara otomatis merender `title` dari frontmatter dalam header Double-Bezel khusus.
2. **Haram Menulis Referensi Manual di Body:** JANGAN PERNAH membuat daftar link referensi manual di bagian bawah body markdown. Selalu masukkan referensi ke dalam array `references:` di frontmatter agar di-render oleh komponen interaktif *Collapsible Accordion*.
3. **Tombol Aksi Otomatis:** Tautan `repoUrl` dan `demoUrl` dari frontmatter secara otomatis dirrender menjadi tombol aksi MUI (*Repository* & *Live Demo*).
4. **Format Media & Tabel:** Gunakan GitHub Flavored Markdown (GFM). Berikan *caption* ringkas di bawah setiap gambar screenshot demo.

---

## 5. STRUKTUR STANDAR PORTOFOLIO (8 KOMPONEN UTAMA)

Setiap proyek WAJIB menggunakan struktur sub-judul `##` (H2) berikut:

1. **`## 📌 1. Problem (Latar Belakang & Masalah)`**
   - Gambaran jelas dan spesifik mengenai masalah nyata yang dihadapi oleh pengguna atau sistem.
2. **`## 👤 2. Target User (Pengguna Utama)`**
   - Siapa audiens atau profil pengguna yang membutuhkan solusi ini.
3. **`## 💡 3. Solution (Solusi yang Ditawarkan)`**
   - Pendekatan dan bentuk aplikasi/sistem yang dibangun untuk memecahkan masalah.
4. **`## ⭐ 4. Key Features (Fitur-Fitur Utama)`**
   - Daftar fitur unggulan yang langsung menyelesaikan masalah utama (bukan sekadar fitur umum seperti login/register).
5. **`## 🧱 5. Challenges & Lessons Learned (Tantangan Teknis & Pemecahan Masalah)`**
   - Kendala teknis utama (misal: *performance bottleneck*, *state management*, *network latency*) dan langkah logis/solusi yang diambil.
6. **`## 📈 6. Impact (Dampak & Hasil)`**
   - Perbandingan sebelum dan sesudah solusi diterapkan (kuantitatif/kualitatif).
7. **`## 🛠️ Tech Choices (Pilihan Teknologi & Alasan Teknis)`**
   - Daftar teknologi utama beserta **alasan teknis** pemilihannya (mengapa memilih teknologi A dibanding B).
8. **`## 🖼️ Screenshots & Visual Demo`**
   - Tangkapan layar produk dengan *caption* penjelasan di bawahnya.

---

## 📋 TEMPLATE MARKDOWN PROJECT (Siap Pakai / Copy-Paste)

```markdown
---
title: "Nama Proyek"
description: "Tagline atau deskripsi singkat proyek."
status: "completed"
techStack:
  - Teknologi 1
  - Teknologi 2
startDate: "2026-08-01"
repoUrl: "https://github.com/username/repo"
demoUrl: "https://demo.domain.com"
heroImage: "/uploads/cover.png"
featured: true
references:
  - title: "Dokumentasi Resmi"
    url: "https://docs.example.com"
---

## 📌 1. Problem
[Jelaskan masalah spesifik yang ingin diselesaikan melalui proyek ini.]

## 👤 2. Target User
[Sebutkan siapa pengguna utama dari sistem ini dan kebutuhan mereka.]

## 💡 3. Solution
[Jelaskan solusi yang ditawarkan dan pendekatan arsitektur yang digunakan.]

## ⭐ 4. Key Features
- **[Fitur 1]:** [Penjelasan fungsi dan manfaat bagi pengguna.]
- **[Fitur 2]:** [Penjelasan fungsi.]
- **[Fitur 3]:** [Penjelasan fungsi.]

## 🧱 5. Challenges & Lessons Learned
- **Tantangan Teknis:** [Jelaskan masalah teknis atau kendala yang dihadapi selama pengembangan.]
- **Solusi & Pemecahan:** [Jelaskan bagaimana kamu menyelesaikan masalah tersebut.]

## 📈 6. Impact
- **Sebelum:** [Kondisi atau kendala sebelum solusi diterapkan.]
- **Sesudah:** [Dampak positif, efisiensi, atau hasil kuantitatif/kualitatif setelah solusi berjalan.]

## 🛠️ Tech Choices
- **[Teknologi 1]:** [Alasan teknis pemilihan teknologi ini]
- **[Teknologi 2]:** [Alasan teknis pemilihan teknologi ini]

## 🖼️ Screenshots & Visual Demo
![Tampilan Utama](/uploads/demo-screenshot.png)
*Gambar 1: Tampilan antarmuka utama dari aplikasi.*
```
</system_instructions>
