# 🚀 OmniSocial HQ — Social Media Management Dashboard (100% Free)

Dashboard manajemen media sosial modern berbasis web untuk mengelola **3 Project** yang terdiri dari **3 Akun Instagram** dan **1 Akun TikTok**. Dirancang untuk kolaborasi tim, perencanaan konten menyeluruh, pembuatan konten berbantuan AI, dan analisis metrik performa lengkap dengan fitur unduh data (CSV / Excel).

---

## 🌟 Fitur Utama

### 1. Multi-Project & Account Switcher
* **3 Project Terpisah**:
  * **Project 1:** Fashion & Apparel (`@aura.official` di Instagram + `@aura.daily` di TikTok)
  * **Project 2:** F&B Coffee House (`@kopititiktemu.id` di Instagram)
  * **Project 3:** Home Decor & Living (`@zenliving.home` di Instagram)
* Filter fleksibel: Tampilkan semua project gabungan atau pilih per project & per akun.

### 2. Content Planning & Editorial Pipeline (Detail)
* **Kanban Board Workflow**:
  * 💡 *Ide Konten*
  * ✍️ *Drafting*
  * 👀 *Review & Approval* (untuk Lead / Klien)
  * ⏰ *Terjadwal (Scheduled)*
  * ✅ *Tayang (Published)*
* **Tampilan Kalender & Daftar**: Visualisasikan tanggal tayang di kalender bulanan.
* **Modal Editor Konten Lengkap**:
  * Hook 3 detik pertama (headline stopper).
  * Copywriting caption lengkap & tagar (hashtags).
  * Format konten: Reels, TikTok Video, Feed Carousel, Single Post, Story.
  * Tautan asset visual (Google Drive, Canva, Figma).
  * Penugasan anggota tim (PIC) & tanggal/jam tayang.

### 3. AI Content Studio (Google Gemini API / Smart Templates)
* Generate hook viral, konsep slide carousel, naskah video TikTok, dan caption persuasif dalam hitungan detik.
* Pilihan tone of voice: *Casual & Relatable, Edukatif, Storytelling, Hard Selling, Humor*.
* Tombol 1-klik: **"Masukkan ke Planner"** langsung membuat draft konten di kalender.
* Terintegrasi dengan **Google Gemini Free Tier** (tanpa biaya) atau template pintar offline bawaan.

### 4. Analitik & Pencatatan Performa (Downloadable Data)
* Pencatatan metrik real: **Views, Reach, Likes, Komentar, Shares, Saves, & Engagement Rate (%)**.
* Grafik tren pertumbuhan followers harian per akun.
* Tabel performa interaktif dengan fitur sorting tiap kolom.
* **Fitur Ekspor**:
  * **Download CSV / Excel** untuk seluruh rencana konten.
  * **Download CSV / Excel** untuk metrik analitik performa.
  * Siap dicetak atau disimpan ke **PDF** untuk laporan ke klien.

### 5. Akses Tim & Kolaborasi (Zero Cost)
* Daftar anggota tim dengan role spesifik: *Social Media Lead, Video Editor, Copywriter, Graphic Designer, Client Reviewer*.
* Mode penyimpanan ganda:
  * **Lokal / Browser**: Data tersimpan otomatis di localStorage.
  * **Cloud Sync (Supabase Free Tier)**: PostgreSQL gratis selamanya agar seluruh tim bisa login dan edit bersamaan secara real-time dari laptop/HP masing-masing.

---

## 💻 Cara Menjalankan di Laptop

### Opsi 1: Lewat File `run.bat` (Termudah di Windows)
Cukup klik ganda (double-click) file `run.bat` di dalam folder ini. Browser akan otomatis dapat membuka `http://localhost:5173`.

### Opsi 2: Lewat Terminal / PowerShell
```bash
npm run dev
```
Buka browser di: `http://localhost:5173`

---

## 🌐 Cara Deploy Online Agar Bisa Diakses Tim (100% Gratis)

Kamu bisa mempublikasikan dashboard ini ke internet agar tim kamu bisa mengaksesnya dari mana saja lewat link seperti `https://namadashboard.vercel.app`:

1. Buat akun gratis di [Vercel](https://vercel.com) atau [Netlify](https://netlify.com).
2. Upload folder ini ke GitHub kamu.
3. Import repositori tersebut di Vercel/Netlify.
4. Klik **Deploy** — website akan langsung online dalam 1 menit tanpa biaya sepeser pun.

---

## 🔑 Mengaktifkan Fitur AI Gratis (Google Gemini)

1. Buka [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Login dengan akun Google kamu dan klik **Get API Key** (100% gratis).
3. Buka menu **Pengaturan & Cloud Sync** di dashboard OmniSocial, lalu paste API key kamu.
