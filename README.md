# Dareindo — Daya Reforestasi Indonesia

Website resmi PT Daya Reforestasi Indonesia, perusahaan impact-driven di bidang pelestarian lingkungan dan pemberdayaan masyarakat. Online di **[dareindo.com](https://dareindo.com)** lewat GitHub Pages.

## Isi repo

| Lokasi | Isi |
| --- | --- |
| `index.html` | Beranda (versi 2, copywriting draf 2) |
| `akar-bambu/`, `benih/` | Halaman proyek Akar Bambu dan Benih |
| `transparansi/` | Halaman Transparansi: ringkasan keuangan, arus dana per proyek, dampak, tabel transaksi |
| `kontribusi/` | Beritahu kami lahan gundul atau rawan longsor, daftar sebagai kontributor, kemitraan (dikirim lewat email ke halo@dareindo.com) |
| `kontak/` | Kontak & identitas perusahaan |
| `privasi/`, `syarat/` | Kebijakan Privasi dan Syarat Penggunaan (draf: bagian kuning menunggu data PT dan tinjauan hukum; tersembunyi dari mesin pencari sampai final) |
| `en/`, `de/` | Versi bahasa Inggris dan Jerman dari semua halaman |
| `_src/` | Sumber semua halaman. Halaman HTML di atas dibuat dari sini |
| `assets/situs.css`, `assets/situs.js` | Gaya, menu, dan pembaca Buku Kas Publik yang dipakai semua halaman |
| `CNAME` | Domain kustom dareindo.com untuk GitHub Pages |
| `_dokumen/01-sitemap-dan-workflow.md` | Sitemap, rencana workflow teknis, rekomendasi teknologi & pembukuan |
| `_dokumen/02-copywriting-beranda.md` | Copywriting Beranda (draf 2) |
| `_dokumen/Buku_Kas_Publik_Dareindo.xlsx` | Template Buku Kas Publik untuk halaman Transparansi |

Folder `_dokumen` tidak ikut tampil di dareindo.com (folder berawalan `_` diabaikan oleh GitHub Pages), tetapi tetap bisa dibaca di GitHub karena repo ini publik.

## Menghubungkan Buku Kas Publik

Di Google Sheets: File → Bagikan → Publikasikan ke web → pilih tab **Ringkasan** → CSV, lalu ulangi untuk tab **Transaksi**. Tempel kedua tautan CSV di `BUKU_KAS` di bagian atas `assets/situs.js`. Beranda dan halaman Transparansi langsung membaca angka terbaru setiap kali dibuka.

## Mengubah isi halaman (3 bahasa)

Semua halaman dibuat dari folder `_src/`, lalu hasilnya di-commit. Jangan edit `index.html`, `en/`, `de/`, atau folder halaman secara langsung.

1. Ubah teks di `_src/pages/<halaman>/id.html`, lalu ubah juga `en.html` (Inggris) dan `de.html` (Jerman) di folder yang sama.
2. Teks menu dan footer ada di `_src/teks.json`. Teks yang muncul lewat skrip (pesan formulir, dsb.) ada di `TEKS` di `assets/situs.js`.
3. Jalankan `python3 _src/build.py` (cukup Python 3, tanpa instalasi tambahan), lalu commit semua file yang berubah.
