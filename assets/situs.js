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
  return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
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
    if (ada && catatan) catatan.textContent = 'Diambil langsung dari Buku Kas Publik, dibuka ' + tanggalHariIni() + '.';
    return rows;
  } catch (e) {
    if (catatan) catatan.textContent = 'Data belum bisa dimuat. Coba muat ulang halaman ini.';
    return null;
  }
})();
