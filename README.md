# Dareindo — Daya Reforestasi Indonesia

Website resmi PT Daya Reforestasi Indonesia, perusahaan impact-driven di bidang pelestarian lingkungan dan pemberdayaan masyarakat. Online di **[dareindo.com](https://dareindo.com)** lewat GitHub Pages.

## Isi repo

| Lokasi | Isi |
| --- | --- |
| `index.html` | Beranda (versi 2, copywriting draf 2) |
| `proyek/` | Halaman Proyek: Akar Bambu dan Benih |
| `transparansi/` | Halaman Transparansi: ringkasan keuangan, arus dana per proyek, dampak, tabel transaksi |
| `lapor-lahan/` | Formulir Laporkan Lahan Kritis (dikirim lewat email ke halo@dareindo.com) |
| `kontak/` | Kontak & identitas perusahaan |
| `assets/situs.css`, `assets/situs.js` | Gaya, menu, dan pembaca Buku Kas Publik yang dipakai semua halaman |
| `CNAME` | Domain kustom dareindo.com untuk GitHub Pages |
| `_dokumen/01-sitemap-dan-workflow.md` | Sitemap, rencana workflow teknis, rekomendasi teknologi & pembukuan |
| `_dokumen/02-copywriting-beranda.md` | Copywriting Beranda (draf 2) |
| `_dokumen/Buku_Kas_Publik_Dareindo.xlsx` | Template Buku Kas Publik untuk halaman Transparansi |

Folder `_dokumen` tidak ikut tampil di dareindo.com (folder berawalan `_` diabaikan oleh GitHub Pages), tetapi tetap bisa dibaca di GitHub karena repo ini publik.

## Menghubungkan Buku Kas Publik

Di Google Sheets: File → Bagikan → Publikasikan ke web → pilih tab **Ringkasan** → CSV, lalu ulangi untuk tab **Transaksi**. Tempel kedua tautan CSV di `BUKU_KAS` di bagian atas `assets/situs.js`. Beranda dan halaman Transparansi langsung membaca angka terbaru setiap kali dibuka.
