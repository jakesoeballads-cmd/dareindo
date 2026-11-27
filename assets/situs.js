/* Skrip bersama seluruh halaman dareindo.com. */

/* ---------- Pengaturan ----------
   Setelah Buku Kas Publik dipublikasikan dari Google Sheets
   (File → Bagikan → Publikasikan ke web → pilih tab → CSV),
   tempel tautan CSV setiap tab di bawah ini. Kosong = tampil "Menunggu".
   Beranda dan halaman Transparansi sama-sama membaca dari sini. */
const BUKU_KAS = {
  ringkasan: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFEwURfoZRNWM6t6sdLNmnYUJZv95Q8LGlpEDwdcxDd0BqPUvZhbA9CKNrwwjyn6XOewac-6QvbUHC/pub?gid=1024019384&single=true&output=csv",  // tab "Ringkasan"
  transaksi: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFEwURfoZRNWM6t6sdLNmnYUJZv95Q8LGlpEDwdcxDd0BqPUvZhbA9CKNrwwjyn6XOewac-6QvbUHC/pub?gid=1267839354&single=true&output=csv",  // tab "Transaksi"
};

/* ---------- Bahasa ----------
   Halaman tersedia dalam bahasa Indonesia (/), Inggris (/en/) dan Jerman (/de/).
   Teks yang muncul lewat skrip ada di sini; teks halaman ada di _src/pages. */
const BAHASA = ['id', 'en', 'de'].includes(document.documentElement.lang) ? document.documentElement.lang : 'id';
const LOKAL = { id: 'id-ID', en: 'en-GB', de: 'de-DE' }[BAHASA];
const TEKS = {
  id: {
    biaya_proyek: 'Biaya proyek',
    biaya_operasional: 'Biaya operasional',
    pajak: 'Pajak',
    masuk: 'Uang masuk',
    keluar: 'Uang keluar',
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
    biaya_proyek: 'Project costs',
    biaya_operasional: 'Operating costs',
    pajak: 'Tax',
    masuk: 'Money in',
    keluar: 'Money out',
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
    biaya_proyek: 'Projektkosten',
    biaya_operasional: 'Betriebskosten',
    pajak: 'Steuern',
    masuk: 'Eingänge',
    keluar: 'Ausgänge',
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
/* ---------- Istilah dari Buku Kas ----------
   Nama proyek, indikator dampak, satuan, jenis dan kategori datang dari Google Sheets
   dalam bahasa Indonesia. Di /en/ dan /de/ diterjemahkan lewat daftar ini.
   Istilah baru di spreadsheet yang belum ada di sini tetap tampil apa adanya.
   Akar Bambu dan Benih adalah nama proyek, jadi tidak diterjemahkan. */
const ISTILAH = {
  // Proyek
  'Lapor Lahan & Riset': ['Land tip-offs & research', 'Hinweise & Forschung'],
  'Umum Perusahaan': ['Company overheads', 'Allgemein (Unternehmen)'],
  // Indikator dampak
  'Pohon ditanam': ['Trees planted', 'Gepflanzte Bäume'],
  'Bibit diproduksi': ['Seedlings produced', 'Gezogene Setzlinge'],
  'Luas lahan dipulihkan': ['Land restored', 'Wiederhergestellte Fläche'],
  'Pekerja lokal terlibat (baru)': ['Local workers involved (new)', 'Beteiligte lokale Arbeitskräfte (neu)'],
  'Hari kerja warga': ['Workdays for local people', 'Arbeitstage der Anwohner'],
  'Laporan lahan diterima': ['Land tip-offs received', 'Eingegangene Hinweise'],
  'Lahan disurvei': ['Sites surveyed', 'Erkundete Flächen'],
  'Hasil panen': ['Harvest', 'Ernte'],
  'Penggiat terdaftar di Benih': ['People registered on Benih', 'Bei Benih registrierte Engagierte'],
  'Kegiatan lingkungan via Benih': ['Environmental activities via Benih', 'Umweltaktionen über Benih'],
  // Satuan ("batang" dipakai untuk pohon dan bibit)
  'batang': ['plants', 'Pflanzen'],
  'hektare': ['hectares', 'Hektar'],
  'orang': ['people', 'Personen'],
  'HOK': ['person-days', 'Personentage'],
  'laporan': ['tip-offs', 'Hinweise'],
  'lokasi': ['sites', 'Flächen'],
  'akun': ['accounts', 'Konten'],
  'kegiatan': ['activities', 'Aktionen'],
  // Jenis transaksi
  'Masuk': ['In', 'Eingang'],
  'Keluar': ['Out', 'Ausgang'],
  // Kategori transaksi
  'Modal Disetor Pemegang Saham': ['Paid-in share capital', 'Eingezahltes Stammkapital'],
  'Investasi Dampak': ['Impact investment', 'Impact-Investition'],
  'Kemitraan / CSR Perusahaan': ['Corporate partnership / CSR', 'Unternehmenspartnerschaft / CSR'],
  'Penjualan Hasil Panen': ['Harvest sales', 'Verkauf der Ernte'],
  'Penjualan Bibit': ['Seedling sales', 'Verkauf von Setzlingen'],
  'Jasa & Program': ['Services & programmes', 'Leistungen & Programme'],
  'Pendapatan Lain': ['Other income', 'Sonstige Einnahmen'],
  'Bibit & Material Tanam': ['Seedlings & planting materials', 'Setzlinge & Pflanzmaterial'],
  'Upah Pekerja Lapangan': ['Field workers\' wages', 'Löhne der Feldarbeiter'],
  'Honor Ahli & Pendamping': ['Experts & facilitators', 'Honorare für Fachleute & Begleiter'],
  'Survei & Riset Lahan': ['Land surveys & research', 'Flächenerkundung & Forschung'],
  'Sewa / Kompensasi Lahan': ['Land rent / compensation', 'Pacht / Entschädigung für Flächen'],
  'Transportasi & Logistik': ['Transport & logistics', 'Transport & Logistik'],
  'Peralatan Lapangan': ['Field equipment', 'Feldausrüstung'],
  'Pengembangan Teknologi': ['Technology development', 'Technologieentwicklung'],
  'Gaji Tim Inti': ['Core team salaries', 'Gehälter des Kernteams'],
  'Operasional Kantor': ['Office running costs', 'Bürokosten'],
  'Pemasaran & Komunikasi': ['Marketing & communications', 'Marketing & Kommunikation'],
  'Legal, Audit & Administrasi': ['Legal, audit & administration', 'Recht, Prüfung & Verwaltung'],
  'Pajak': ['Tax', 'Steuern'],
  'Pengeluaran Lain': ['Other expenses', 'Sonstige Ausgaben'],
};
const ISTILAH_KECIL = Object.fromEntries(Object.entries(ISTILAH).map(([k, v]) => [k.toLowerCase(), v]));
/* istilah('Pohon ditanam') → 'Trees planted' di /en/; di / tetap aslinya */
function istilah(s){
  const asli = String(s ?? '').trim();
  if (BAHASA === 'id') return asli;
  const v = ISTILAH_KECIL[asli.toLowerCase()];
  return v ? v[BAHASA === 'en' ? 0 : 1] : asli;
}

/* ---------- Angka dari Buku Kas ----------
   Google Sheets mengirim angka sebagai teks berformat ("Rp14,227,989", "12.5%", "0.").
   angkaLokal() membacanya lalu menulis ulang sesuai bahasa halaman:
   Rp 14.227.989 (id/de) atau Rp 14,227,989 (en). Teks yang bukan angka dibiarkan. */
function bacaAngka(t){
  t = t.replace(/[^\d.,]/g, '').replace(/[.,]+$/, '');
  if (!t) return NaN;
  const titik = t.lastIndexOf('.'), koma = t.lastIndexOf(',');
  if (titik >= 0 && koma >= 0) {
    const des = titik > koma ? '.' : ',';
    t = t.split(des === '.' ? ',' : '.').join('').replace(des, '.');
  } else if (koma >= 0 || titik >= 0) {
    const pemisah = koma >= 0 ? ',' : '.';
    const ribuan = new RegExp('^\\d{1,3}(\\' + pemisah + '\\d{3})+$').test(t) && (pemisah === ',' || t.split('.').length > 2);
    t = ribuan ? t.split(pemisah).join('') : t.replace(pemisah, '.');
  }
  return Number(t);
}
function angkaLokal(s){
  const asli = String(s ?? '').trim();
  if (!asli || asli === '-' || !/\d/.test(asli)) return asli;
  const negatif = /^\(|^-|^−/.test(asli);
  const n = bacaAngka(asli);
  if (!isFinite(n)) return asli;
  const tanda = negatif ? '−' : '';
  if (/rp/i.test(asli)) return tanda + 'Rp ' + new Intl.NumberFormat(LOKAL, { maximumFractionDigits: 0 }).format(n);
  if (asli.includes('%')) return tanda + new Intl.NumberFormat(LOKAL, { maximumFractionDigits: 1 }).format(n) + (BAHASA === 'de' ? '\u202F%' : '%');
  return tanda + new Intl.NumberFormat(LOKAL, { maximumFractionDigits: 2 }).format(n);
}

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
      if (v) { dd.textContent = angkaLokal(v); dd.classList.remove('kosong'); ada = true; }
    });
    if (ada && catatan) catatan.textContent = t('diambil', { tgl: tanggalHariIni() });
    return rows;
  } catch (e) {
    if (catatan) catatan.textContent = t('gagal_muat');
    return null;
  }
})();
