/* Skrip bersama seluruh halaman dareindo.com. */

/* ---------- Pengaturan ----------
   Setelah Buku Kas Publik dipublikasikan dari Google Sheets
   (File → Bagikan → Publikasikan ke web → pilih tab → CSV),
   tempel tautan CSV setiap tab di bawah ini. Kosong = tampil "Menunggu".
   Beranda dan halaman Transparansi sama-sama membaca dari sini. */
const BUKU_KAS = {
  ringkasan: "",  // tab "Ringkasan"
  transaksi: "",  // tab "Transaksi"
};

/* ---------- Bahasa ----------
   Halaman tersedia dalam bahasa Indonesia (/), Inggris (/en/) dan Jerman (/de/).
   Teks yang muncul lewat skrip ada di sini; teks halaman ada di _src/pages. */
const BAHASA = ['id', 'en', 'de'].includes(document.documentElement.lang) ? document.documentElement.lang : 'id';
const LOKAL = { id: 'id-ID', en: 'en-GB', de: 'de-DE' }[BAHASA];
const TEKS = {
  id: {
    diambil: 'Diambil langsung dari Buku Kas Publik, dibuka {tgl}.',
    gagal_muat: 'Data belum bisa dimuat. Coba muat ulang halaman ini.',
    tidak_cocok: 'Tidak ada transaksi yang cocok.',
    lihat: 'Lihat',
    ringkas_transaksi: '{n} transaksi · masuk Rp {masuk} · keluar Rp {keluar}',
    gps_tidak_didukung: 'Perangkat ini tidak mendukung GPS. Isi koordinat secara manual.',
    gps_mencari: 'Mencari lokasi...',
    gps_ditemukan: 'Lokasi ditemukan (akurasi sekitar {m} m).',
    gps_gagal: 'Lokasi tidak bisa diambil. Izinkan akses lokasi, atau isi koordinat secara manual.',
    isi_lokasi: 'Isi lokasi lahan terlebih dahulu.',
    isi_nama_pesan: 'Isi nama dan pesan terlebih dahulu.',
    isi_nama_email: 'Isi nama dan email terlebih dahulu.',
    tersalin: 'Tersalin',
  },
  en: {
    diambil: 'Taken directly from the Public Cash Book, opened {tgl}.',
    gagal_muat: 'The data could not be loaded. Try reloading this page.',
    tidak_cocok: 'No matching transactions.',
    lihat: 'View',
    ringkas_transaksi: '{n} transactions · in Rp {masuk} · out Rp {keluar}',
    gps_tidak_didukung: 'This device does not support GPS. Please enter the coordinates manually.',
    gps_mencari: 'Finding your location...',
    gps_ditemukan: 'Location found (accurate to about {m} m).',
    gps_gagal: 'Your location could not be read. Allow location access, or enter the coordinates manually.',
    isi_lokasi: 'Please fill in where the land is first.',
    isi_nama_pesan: 'Please fill in your name and message first.',
    isi_nama_email: 'Please fill in your name and email first.',
    tersalin: 'Copied',
  },
  de: {
    diambil: 'Direkt aus dem Öffentlichen Kassenbuch, abgerufen am {tgl}.',
    gagal_muat: 'Die Daten konnten nicht geladen werden. Bitte laden Sie die Seite neu.',
    tidak_cocok: 'Keine passenden Buchungen.',
    lihat: 'Ansehen',
    ringkas_transaksi: '{n} Buchungen · Eingang Rp {masuk} · Ausgang Rp {keluar}',
    gps_tidak_didukung: 'Dieses Gerät unterstützt kein GPS. Bitte geben Sie die Koordinaten von Hand ein.',
    gps_mencari: 'Standort wird gesucht...',
    gps_ditemukan: 'Standort gefunden (Genauigkeit etwa {m} m).',
    gps_gagal: 'Der Standort konnte nicht ermittelt werden. Erlauben Sie den Standortzugriff oder geben Sie die Koordinaten von Hand ein.',
    isi_lokasi: 'Bitte geben Sie zuerst an, wo die Fläche liegt.',
    isi_nama_pesan: 'Bitte geben Sie zuerst Ihren Namen und Ihre Nachricht ein.',
    isi_nama_email: 'Bitte geben Sie zuerst Ihren Namen und Ihre E-Mail-Adresse ein.',
    tersalin: 'Kopiert',
  },
};
/* t('kunci', {nama: nilai}) → teks dalam bahasa halaman */
function t(kunci, isi = {}){
  const teks = TEKS[BAHASA][kunci] ?? TEKS.id[kunci] ?? kunci;
  return teks.replace(/\{(\w+)\}/g, (_, k) => isi[k] ?? '');
}

/* Menu HP */
(function menuHP(){
  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  if (!menuBtn || !menu) return;
  menuBtn.addEventListener('click', () => {
    const buka = menu.classList.toggle('buka');
    menuBtn.setAttribute('aria-expanded', buka);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('buka'); menuBtn.setAttribute('aria-expanded', false);
  }));
})();
const tahun = document.getElementById('tahun');
if (tahun) tahun.textContent = new Date().getFullYear();

/* ---------- Buku Kas Publik ---------- */
function parseCSV(text){
  const out = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i+1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); out.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); out.push(row); }
  return out;
}

async function ambilCSV(url){
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(res.status);
  return parseCSV(await res.text());
}

function tanggalHariIni(){
  return new Date().toLocaleDateString(LOKAL, { day: 'numeric', month: 'long', year: 'numeric' });
}

/* Angka di elemen [data-kunci] (Beranda & Transparansi) diisi dari tab Ringkasan.
   Kunci → [kolom label, label di spreadsheet, kolom nilai]. */
const KUNCI_RINGKASAN = {
  pendapatan:  [0, 'Pendapatan usaha', 1],
  modal:       [0, 'Pendanaan & modal', 1],
  masuk:       [0, 'Total uang masuk', 1],
  proyek:      [0, 'Biaya proyek (langsung ke lapangan)', 1],
  operasional: [0, 'Biaya operasional', 1],
  pajak:       [0, 'Pajak', 1],
  keluar:      [0, 'Total uang keluar', 1],
  saldo:       [0, 'Saldo kas', 1],
  laba:        [0, 'Laba / (rugi) usaha', 1],
  porsi:       [0, 'Porsi pengeluaran untuk proyek', 1],
  pohon:       [3, 'Pohon ditanam', 6],
  pekerja:     [3, 'Pekerja lokal terlibat (baru)', 6],
};

/* Dipanggil sekali; halaman yang butuh baris mentah (mis. per proyek) memakai hasilnya. */
const ringkasanSiap = (async function bukuKas(){
  const elKunci = document.querySelectorAll('[data-kunci]');
  if (!BUKU_KAS.ringkasan) return null;
  const catatan = document.getElementById('buku-catatan');
  try {
    const rows = await ambilCSV(BUKU_KAS.ringkasan);
    const cari = (kol, label, ambil) => {
      const r = rows.find(r => (r[kol] || '').trim().toLowerCase() === label.toLowerCase());
      return r ? (r[ambil] || '').trim() : '';
    };
    let ada = false;
    elKunci.forEach(dd => {
      const k = KUNCI_RINGKASAN[dd.dataset.kunci];
      const v = k && cari(...k);
      if (v) { dd.textContent = v; dd.classList.remove('kosong'); ada = true; }
    });
    if (ada && catatan) catatan.textContent = t('diambil', { tgl: tanggalHariIni() });
    return rows;
  } catch (e) {
    if (catatan) catatan.textContent = t('gagal_muat');
    return null;
  }
})();
