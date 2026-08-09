# 🍄 SAJAK WORLD — Panduan Penggunaan

Laman web pembelajaran interaktif **Bahasa Melayu (Sajak)** bertema **Super Mario**
untuk murid **Tahun 4**.

---

## 📂 Struktur Fail

```
Google Site 3/
├── index.html          → Page 1: Laman Utama
├── profil.html         → Page 2: Profil Diri
├── objektif.html       → Page 3: Objektif Pembelajaran
├── set-induksi.html    → Page 4: Set Induksi (ruang video)
├── sajak.html          → Page 5: Nota Sajak (penuh)
├── aktiviti.html       → Page 6: 5 Aktiviti (1 & 2 siap; 3,4,5 ruang pautan)
├── pentaksiran.html    → Page 7: 5 Soalan KBAT
├── rumusan.html        → Page 8: Rumusan
├── css/style.css       → Reka bentuk tema Super Mario
├── js/main.js          → Navigasi, kesan, bunyi retro
├── js/aktiviti.js      → Logik Aktiviti 1 & 2
├── js/pentaksiran.js   → Logik kuiz KBAT
└── assets/             → (Letak gambar/foto anda di sini)
```

## ▶️ Cara Membuka Laman

**Cara mudah:** Klik dua kali fail **`index.html`** — ia akan terbuka dalam pelayar
(Chrome/Safari/Edge). Semua halaman, aktiviti dan bunyi berfungsi terus.

> 💡 Font pixel (Press Start 2P) dimuatkan daripada Google Fonts, jadi pastikan ada
> sambungan internet untuk paparan font terbaik. Tanpa internet pun laman tetap
> berfungsi (font biasa digunakan).

---

## ✏️ Perkara yang PERLU Anda Isi Sendiri

### 1. 📸 Gambar Anda (profil.html)
1. Letak foto anda ke dalam folder `assets/` (cth: `assets/gambar-saya.jpg`).
2. Buka `profil.html`, cari bahagian `<div class="photo-slot">`.
3. Padam blok `photo-slot` itu dan gantikan dengan:
   ```html
   <img src="assets/gambar-saya.jpg" alt="Muhammad Hazim"
        style="border:5px solid var(--ink);border-radius:14px;
               box-shadow:var(--shadow-hard);aspect-ratio:3/4;
               object-fit:cover;width:100%">
   ```

### 2. 🎬 Video (set-induksi.html)
1. Buka `set-induksi.html`, cari bahagian `<div class="placeholder">`.
2. Padam blok `placeholder` dan gantikan dengan kod embed YouTube:
   ```html
   <iframe src="https://www.youtube.com/embed/KOD_VIDEO_ANDA"
           title="Video Sajak" allowfullscreen></iframe>
   ```
   *(Dapatkan "KOD_VIDEO" daripada pautan YouTube selepas `watch?v=`)*

### 3. 🔗 Pautan Aktiviti 3, 4, 5 (aktiviti.html)
- **Aktiviti 3** = Quizizz, **Aktiviti 4** = Wordwall, **Aktiviti 5** = Kahoot!
- Bagi setiap satu, cari butang biru `▶️ Main ...` dan tukar `href="#"` kepada
  pautan sebenar anda, contohnya:
  ```html
  <a class="btn blue" href="https://quizizz.com/join?gc=XXXXXX" target="_blank" rel="noopener">▶️ Main Quizizz</a>
  ```

---

## 🎮 Kandungan Interaktif (Sudah Siap)

| Halaman | Ciri Interaktif |
|---|---|
| Aktiviti 1 | Kuiz aneka pilihan + maklum balas + skor + bunyi syiling 🪙 |
| Aktiviti 2 | Padanan gaya bahasa secara **seret & lepas** (drag & drop) + skor ⭐ |
| Pentaksiran | 5 soalan **KBAT** + markah + penilaian bintang ⭐ |
| Semua | Navigasi, animasi awan, bunyi retro (WebAudio), reka bentuk responsif 📱 |

---

## 🌐 Jika Mahu Muat Naik ke Internet
Laman ini fail statik (HTML/CSS/JS) — boleh dihoskan percuma di:
- **Netlify Drop** (seret folder ke netlify.com/drop)
- **GitHub Pages**
- **Google Sites** — guna pilihan *Embed → Code* bagi setiap halaman
  (nota: kesan `sticky`/latar mungkin berbeza sedikit di dalam iframe).

---

© 2026 **DUNIA SAJAK** — Muhammad Hazim Bin Mohamad

---

## 🌟 CIRI EDISI ULTRA (Baharu!)

| Ciri | Cara Guna |
|---|---|
| 🪙 **Sistem Syiling** | Ketik mana-mana **blok ?** untuk kumpul syiling (3 kali → blok habis). Jawab aktiviti/pentaksiran dengan betul pun dapat syiling. Jumlah disimpan & dipapar di HUD atas. |
| ⭐ **Star Power** | Setiap 20 syiling → kilauan pelangi seluruh skrin! |
| 👤 **Nama Pemain** | Klik nama di HUD (atas kiri) untuk tukar nama — disimpan kekal. |
| ★ **Kiraan Bintang** | HUD menunjukkan bilangan "world" yang telah dilawati (maks 8). |
| 🔊 **Suis Bunyi** | Butang di HUD untuk hidup/matikan semua bunyi retro. |
| 🌙 **Mod Underground** | Butang bulan di HUD — tukar seluruh laman kepada dunia bawah tanah SMB (langit berbintang, bata biru)! Disimpan kekal. |
| 🏃 **Bar Kemajuan Mario** | Bila menatal ke bawah, Mario kecil berlari di bahagian atas skrin menunjukkan % bacaan halaman — sampai bendera 🚩 = tamat! |
| 👾 **Goomba** | Klik goomba dalam adegan level untuk memijaknya (+3 syiling, muncul semula selepas 6 saat). |
| 🌺 **Pokok Piranha** | Muncul dari paip hijau secara berkala — hiasan klasik SMB. |
| 🗺️ **Peta Level** | Di Laman Utama — world yang dilawati bertanda bintang emas. |

> 💾 Semua kemajuan (syiling, nama, bintang, mod) disimpan dalam pelayar murid
> (localStorage) — setiap murid ada kemajuan sendiri di komputer masing-masing.

### Tambahan terkini
| Ciri | Penerangan |
|---|---|
| 🎆 **Adegan Kemenangan** | Halaman Rumusan kini ada adegan "Stage Clear" penuh — istana, bendera & bunga api piksel. |
| 🏞️ **Adegan Mini** | Set Induksi ada adegan level kecil dengan blok syiling, paip piranha & goomba. |
| 🎵 **Muzik Latar** | Butang 🎵 di HUD — melodi chiptune 8-bit asli yang bergelung. Lalai: MATI (sesuai untuk kelas). |
| 🐢 **Koopa Terbang** | Koopa bersayap terbang melintasi skrin sekali-sekala — **klik untuk +5 syiling!** |
| ✨ **Kilauan Butang** | Semua butang ada kesan kilauan sapuan bila hover; huruf tajuk besar melompat bila disentuh tetikus. |

### Status terkini (sudah dipasang!)
- ✅ **Video Set Induksi**: YouTube `P67wqpOHOkE` telah dibenamkan dalam bingkai "📺 SAJAK TV".
- ✅ **Aktiviti 3 — Detektif Sajak**: kuiz analisis interaktif terbina dalam (sajak asli "Sahabat Sejati" + 5 soalan).
- ✅ **Aktiviti 4 & 5**: kuiz **Wayground** dibenamkan terus dalam bingkai "mesin arked" + butang Buka Skrin Penuh.
- ℹ️ Fail CSS/JS kini guna `?v=3` — jika anda mengubah kod, naikkan nombor ini (cth. `?v=4`) supaya pelayar murid memuat versi terbaru.
