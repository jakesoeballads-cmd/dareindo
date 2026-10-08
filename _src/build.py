#!/usr/bin/env python3
"""Menyusun halaman dareindo.com dalam tiga bahasa (ID, EN, DE).

Jalankan setelah mengubah apa pun di folder _src:

    python3 _src/build.py

Hasilnya ditulis ke index.html, <halaman>/index.html, en/... dan de/...
File hasil itu yang di-commit dan ditayangkan GitHub Pages. Jangan edit
langsung, karena akan tertimpa saat build berikutnya.

Isi setiap halaman ada di _src/pages/<halaman>/<bahasa>.html:
    title: Judul halaman
    description: Satu kalimat untuk mesin pencari
    ---
    <section>...</section>
Baris opsional "robots: noindex" di kepala menyembunyikan halaman dari
mesin pencari (dipakai selama halaman masih draf).
Gunakan {{base}} di depan tautan internal, misalnya href="{{base}}/benih/",
agar tautan tetap di bahasa yang sama. Gaya dan skrip khusus halaman ada di
style.css dan script.js di folder yang sama (dipakai semua bahasa).
Teks menu, footer, dan teks di skrip ada di _src/teks.json dan assets/situs.js.
"""
import html
import json
import pathlib

SRC = pathlib.Path(__file__).resolve().parent
ROOT = SRC.parent
BAHASA = ["id", "en", "de"]  # bahasa pertama tampil di akar situs (/)
DASAR = {"id": "", "en": "/en", "de": "/de"}
HALAMAN = ["beranda", "akar-bambu", "benih", "transparansi", "kontribusi", "kontak", "privasi", "syarat"]
DOMAIN = "https://dareindo.com"


def jalur(halaman):
    return "/" if halaman == "beranda" else f"/{halaman}/"


def baca_halaman(halaman, bahasa):
    teks = (SRC / "pages" / halaman / f"{bahasa}.html").read_text()
    kepala, isi = teks.split("\n---\n", 1)
    meta = dict(baris.split(": ", 1) for baris in kepala.strip().splitlines())
    return meta, isi.strip("\n")


def menu(t, bahasa, halaman):
    base = DASAR[bahasa]
    butir = []
    for kunci, slug in [("akar_bambu", "akar-bambu"), ("benih", "benih"), ("transparansi", "transparansi"), ("kontak", "kontak")]:
        cur = ' aria-current="page"' if halaman == slug else ""
        butir.append(f'      <li><a href="{base}/{slug}/"{cur}>{t["menu"][kunci]}</a></li>')
    cur = ' aria-current="page"' if halaman == "kontribusi" else ""
    butir.append(f'      <li><a class="btn btn-utama" href="{base}/kontribusi/"{cur}>{t["menu"]["kontribusi"]}</a></li>')
    pilih = []
    for b in BAHASA:
        cur = ' aria-current="true"' if b == bahasa else ""
        pilih.append(f'<a href="{DASAR[b]}{jalur(halaman)}" hreflang="{b}" lang="{b}"{cur} title="{TEKS[b]["nama_bahasa"]}">{b.upper()}</a>')
    butir.append(f'      <li class="bahasa" aria-label="{t["pilih_bahasa"]}">{"".join(pilih)}</li>')
    return "\n".join(butir)


def susun(halaman, bahasa):
    t = TEKS[bahasa]
    base = DASAR[bahasa]
    meta, isi = baca_halaman(halaman, bahasa)
    folder = SRC / "pages" / halaman
    gaya = (folder / "style.css").read_text().strip("\n") if (folder / "style.css").exists() else ""
    skrip = (folder / "script.js").read_text().strip("\n") if (folder / "script.js").exists() else ""
    judul = meta["title"] if halaman == "beranda" else f'{meta["title"]} · Daya Reforestasi Indonesia'
    url = DOMAIN + base + jalur(halaman)
    alternatif = "\n".join(
        f'<link rel="alternate" hreflang="{b}" href="{DOMAIN}{DASAR[b]}{jalur(halaman)}">' for b in BAHASA
    ) + f'\n<link rel="alternate" hreflang="x-default" href="{DOMAIN}{jalur(halaman)}">'

    keluaran = (SRC / "layout.html").read_text()
    pengganti = {
        "{{lang}}": bahasa,
        "{{judul}}": html.escape(judul, quote=True),
        "{{deskripsi}}": html.escape(meta["description"], quote=True),
        "{{url}}": url,
        "{{alternatif}}": alternatif,
        "{{robots}}": f'<meta name="robots" content="{meta["robots"]}">\n' if "robots" in meta else "",
        "{{gaya}}": f"<style>\n{gaya}\n</style>\n" if gaya else "",
        "{{menu}}": menu(t, bahasa, halaman),
        "{{isi}}": isi,
        "{{skrip}}": f"<script>\n{skrip}\n</script>\n" if skrip else "",
    }
    for kunci, nilai in t["tata_letak"].items():
        pengganti["{{t." + kunci + "}}"] = nilai
    for kunci, nilai in pengganti.items():
        keluaran = keluaran.replace(kunci, nilai)
    keluaran = keluaran.replace("{{base}}", base)
    if "{{" in keluaran:
        sisa = keluaran[keluaran.index("{{"):][:40]
        raise SystemExit(f"Penanda belum terisi di {bahasa}/{halaman}: {sisa}")
    return keluaran


TEKS = json.loads((SRC / "teks.json").read_text())

if __name__ == "__main__":
    for bahasa in BAHASA:
        for halaman in HALAMAN:
            tujuan = ROOT / DASAR[bahasa].lstrip("/") / jalur(halaman).lstrip("/") / "index.html"
            tujuan.parent.mkdir(parents=True, exist_ok=True)
            tujuan.write_text(susun(halaman, bahasa))
            print("ditulis", tujuan.relative_to(ROOT))
