# Sitemap & Rencana Workflow Teknis — dareindo.com

Draf 1 · 7 Oktober 2026

## Keputusan yang sudah diambil

| Topik | Keputusan |
| --- | --- |
| Badan hukum | PT (perseroan terbatas), impact-driven for-profit. Bukan yayasan atau NGO. |
| Domain | dareindo.com (DNS di Hostinger, website di GitHub Pages) |
| Lokasi Akar Bambu | Belum ada. Menunggu laporan/inisiasi warga lewat halaman Lapor Lahan. |
| Pembukuan | Dua lapis: pembukuan resmi internal (untuk pajak) + Buku Kas Publik di Google Sheets (lihat `Buku_Kas_Publik_Dareindo.xlsx`) |
| Foto | Sementara foto stok berlisensi bebas, diberi keterangan "Foto ilustrasi" |
| Email | halo@dareindo.com (email Hostinger) |

## Prinsip yang mengarahkan seluruh website

1. **For-profit, bukan yayasan.** Hindari kata "donasi" dan "sumbangan". Pakai "kemitraan", "investasi dampak", "pembelian hasil hutan", dan "kolaborasi".
2. **Transparansi radikal adalah identitas, bukan sekadar satu halaman.** Angka keuangan dan dampak muncul di beranda, halaman proyek, dan footer, selalu dengan tautan ke data aslinya.
3. **Masyarakat adalah mitra, bukan masalah.** Warga yang mengalihfungsikan lahan melakukannya karena tidak ada pilihan ekonomi lain. Dareindo hadir untuk menyediakan pilihan itu.

## Sitemap

```
dareindo.com (Beranda)                  /
│
├── Proyek                              /proyek
│   ├── Akar Bambu                      /proyek/akar-bambu
│   └── Benih                           /proyek/benih
│
├── Transparansi                        /transparansi
│   ├── Ringkasan Keuangan              (bagian di halaman)
│   ├── Arus Dana per Proyek            (bagian di halaman)
│   ├── Laporan Dampak                  (bagian di halaman)
│   └── Arsip Dokumen                   /transparansi/arsip
│
├── Lapor Lahan Kritis                  /lapor-lahan
│   └── Peta Laporan Publik             (bagian di halaman)
│
├── Kontak & Perusahaan                 /kontak
│
└── Halaman pendukung (footer)
    ├── Kebijakan Privasi               /privasi
    └── Syarat Penggunaan               /syarat
```

Kebijakan Privasi wajib ada karena formulir lapor lahan dan kontak mengumpulkan data pribadi (UU Pelindungan Data Pribadi No. 27/2022).

## Rincian per halaman

### 1. Beranda (storytelling)

Alur: krisis → ironi → jawaban → bukti → ajakan. Copywriting lengkap ada di `02-copywriting-beranda.md`.

| # | Bagian | Isi & tujuan |
| --- | --- | --- |
| 1 | Hero | "Tidak ada ekonomi tanpa ruang hidup yang lestari." Tombol: Lihat Proyek / Buka Pembukuan Kami |
| 2 | Pergeseran makna ekonomi | Ekonomi bukan lagi angka, melainkan nilai keseimbangan dan ukuran kelestarian |
| 3 | Krisis | Deforestasi, alih fungsi lahan, bencana, dengan data bersumber |
| 4 | Ironi di lapangan | Warga yang bergantung pada alih fungsi lahan, ditulis dengan empati |
| 5 | Jawaban kami | Ekonomi berbasis ekologi; PT impact-driven, bukan yayasan |
| 6 | Proyek | Kartu Akar Bambu dan Benih |
| 7 | Transparansi langsung | Angka utama dari Buku Kas Publik |
| 8 | Kolaborasi | Masyarakat, badan usaha, organisasi non-profit |
| 9 | Ajakan penutup | Laporkan lahan kritis / Jalin kemitraan |

### 2a. Akar Bambu

| Bagian | Isi |
| --- | --- |
| Hero proyek | Nama, tagline, status jujur: "Mencari lokasi pertama — laporkan lahan di dekat Anda" |
| Masalah | Lahan terlantar yang rawan longsor |
| Solusi | Hutan komoditas dengan konsep agroforestri |
| Tanaman | Bambu, katuk, vanili, dan tanaman asli setempat: fungsi ekologis + nilai ekonomi |
| Peran masyarakat | Warga sebagai pekerja yang dibimbing ahli agroforestri |
| Lini waktu | Laporan warga → survei → persiapan lahan → tanam → perawatan → panen |
| Lokasi | Peta lokasi (setelah lokasi pertama ditetapkan) |
| Angka proyek | Dana dan dampak khusus Akar Bambu dari Buku Kas Publik |
| Ajakan | Laporkan lahan, kemitraan, atau pembelian hasil panen |

### 2b. Benih

Benih adalah aplikasi web tersendiri (butuh login, database, pengelolaan acara). Di website Dareindo dibuat halaman perkenalan + daftar tunggu dulu; aplikasinya dibangun sebagai tahap terpisah.

| Bagian | Isi |
| --- | --- |
| Hero | Logo Benih (benih yang mulai tumbuh) dan tagline |
| Masalah | Para penggiat lingkungan masih bergerak sendiri-sendiri |
| Fitur | Profil komunitas, membuat & mengikuti kegiatan, kategori (hutan, laut, sampah, dll.) |
| Cara kerja | Daftar → temukan/buat kegiatan → terhubung |
| Daftar tunggu | Formulir email untuk kabar peluncuran |

### 3. Transparansi Dana

| Bagian | Isi |
| --- | --- |
| Pernyataan sikap | Mengapa perusahaan for-profit membuka seluruh pembukuannya |
| Ringkasan keuangan | Pendapatan, biaya operasional, biaya proyek, laba, alokasi laba |
| Arus dana | Diagram alir dari sumber dana ke penggunaannya per proyek |
| Laporan dampak | Pohon, hektare, warga yang bekerja, pendapatan warga |
| Tabel transaksi | Bisa dicari dan difilter per bulan dan proyek |
| Arsip dokumen | Laporan bulanan, tahunan, dan audit (PDF) |
| Metodologi | Cara data dikumpulkan, siapa yang memeriksa, seberapa sering diperbarui |

Sumber data: Buku Kas Publik di Google Sheets, dipublikasikan sebagai CSV. Hanya data berstatus Terverifikasi yang tampil. Data pribadi tidak pernah ditampilkan (upah per peran, bukan per nama).

### 4. Lapor Lahan Kritis

| Bagian | Isi |
| --- | --- |
| Pengantar | Untuk apa laporan dipakai; laporan warga bisa menjadi lokasi Akar Bambu berikutnya |
| Peringatan darurat | Bukan layanan darurat. Ancaman longsor saat ini → BPBD setempat atau 112 |
| Formulir | Titik peta / GPS, foto, perkiraan luas, kondisi lahan, status kepemilikan, kontak pelapor (opsional/anonim) |
| Alur setelah lapor | Diterima → diverifikasi → disurvei → dirumuskan solusi → ditanam |
| Peta publik | Laporan terverifikasi + statusnya, tanpa data pribadi pelapor |

### 5. Kontak & Informasi Perusahaan

Identitas badan hukum (nama PT, NIB, alamat terdaftar), tim, kontak per keperluan (kemitraan, media, laporan lahan), formulir kontak, peta kantor, media sosial.

## Rencana workflow teknis

| Fase | Pekerjaan | Hasil | Status |
| --- | --- | --- | --- |
| 0. Fondasi | Identitas visual, gaya bahasa, materi | Panduan brand singkat | Gaya bahasa selesai (lihat copywriting) |
| 1. Arsitektur | Sitemap final dan wireframe | Kerangka tata letak | Sitemap selesai |
| 2. Copywriting | Naskah per halaman | Draf teks | Beranda: draf 1 selesai |
| 3. Desain UI | Design system + desain halaman | Desain HP & desktop | Belum |
| 4. Development | Membangun halaman | Website multi-halaman | Beranda v2 online; halaman lain belum |
| 5. Integrasi data | Transparansi + formulir lapor lahan | Fitur berfungsi | Template Buku Kas siap |
| 6. Uji kualitas | Kecepatan, HP, aksesibilitas, SEO | Daftar perbaikan selesai | Belum |
| 7. Peluncuran | Domain, Pages, cara update data | Website online | Domain dareindo.com terpasang |

## Rekomendasi teknologi

| Kebutuhan | Pilihan | Alasan |
| --- | --- | --- |
| Kerangka website | Astro | Website statis yang cepat, cocok untuk banyak halaman, gratis di GitHub Pages |
| Data transparansi | Google Sheets | Tim keuangan cukup mengisi spreadsheet; website membaca dan menampilkannya otomatis |
| Grafik | Chart.js | Ringan dan rapi di HP |
| Peta | Leaflet + OpenStreetMap | Gratis, tanpa biaya API |
| Formulir lapor lahan | Supabase | Menyimpan laporan dan foto (GitHub Pages tidak bisa menyimpan kiriman formulir) |
| Hosting & domain | GitHub Pages + dareindo.com (Hostinger DNS) | Gratis; repo harus publik untuk paket GitHub gratis |

## Rekomendasi pembukuan

**Lapis 1, pembukuan resmi (internal):** sebagai PT wajib sesuai standar akuntansi dan aturan pajak. Tahap awal cukup Google Sheets yang rapi; saat transaksi bertambah pindah ke software akuntansi Indonesia (Jurnal/Mekari, Accurate Online, atau Zahir). Konsultasikan standar yang berlaku (biasanya SAK EMKM untuk usaha mikro dan kecil) dengan akuntan.

**Lapis 2, Buku Kas Publik:** `Buku_Kas_Publik_Dareindo.xlsx` di folder ini. Tab Transaksi, Dampak, dan Ringkasan (otomatis). Dibaca langsung oleh halaman Transparansi.

## Yang masih dibutuhkan

- [ ] NIB dan alamat terdaftar PT
- [ ] Logo Dareindo dan logo Benih
- [ ] Kebijakan alokasi laba (sementara memakai kalimat umum)
- [ ] Foto lapangan asli (pengganti foto stok)
