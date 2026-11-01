const rp = n => new Intl.NumberFormat(LOKAL).format(n);
/* Rupiah selalu bulat, jadi cukup ambil digitnya ("Rp 1.250.000" → 1250000). */
const rupiah = s => Number(String(s).replace(/[^\d]/g, '')) || 0;
/* Porsi bisa "12,5%" atau "0.125", tergantung format sel. */
const persen = s => {
  const t = String(s).trim(), n = parseFloat(t.replace(',', '.').replace(/[^\d.-]/g, ''));
  return isFinite(n) ? (t.includes('%') ? n : n * 100) : 0;
};
/* Tanggal dari Google Sheets bisa "1/10/2026" atau "2026-10-01"; kunci bulan = "2026-10". */
const kunciBulan = t => {
  let m = t.match(/^(\d{4})-(\d{1,2})/); if (m) return `${m[1]}-${m[2].padStart(2, '0')}`;
  m = t.match(/^\d{1,2}[\/.-](\d{1,2})[\/.-](\d{4})/); if (m) return `${m[2]}-${m[1].padStart(2, '0')}`;
  return '';
};
const namaBulan = (k, gaya = 'long') => new Date(k + '-01T00:00:00').toLocaleDateString(LOKAL, { month: gaya, year: 'numeric' });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));

/* Arus dana per proyek & dampak: dari tab Ringkasan */
ringkasanSiap.then(rows => {
  if (!rows) return;
  const i = rows.findIndex(r => (r[0] || '').trim() === 'Proyek' && (r[1] || '').trim() === 'Uang Masuk');
  if (i >= 0) {
    const proyek = [];
    for (const r of rows.slice(i + 1)) { if (!(r[0] || '').trim()) break; proyek.push(r); }
    if (proyek.length) document.getElementById('tabel-proyek').innerHTML = proyek.map(r => {
      const porsi = (r[4] || '').trim(), p = Math.min(100, Math.max(0, persen(porsi)));
      return `<tr><td>${esc(r[0])}</td><td class="angka-sel">${esc(r[1] || '')}</td><td class="angka-sel">${esc(r[2] || '')}</td>` +
        `<td><div style="display:flex;gap:10px;align-items:center"><div class="batang" style="flex:1"><i style="width:${p}%"></i></div><span>${esc(porsi)}</span></div></td></tr>`;
    }).join('');
  }
  const j = rows.findIndex(r => (r[3] || '').trim() === 'Indikator' && (r[6] || '').trim() === 'Terverifikasi');
  if (j >= 0) {
    const dampak = [];
    for (const r of rows.slice(j + 1)) { if (!(r[3] || '').trim()) break; dampak.push(r); }
    if (dampak.length) document.getElementById('daftar-dampak').innerHTML = dampak.map(r =>
      `<div><dt>${esc(r[3])}</dt><dd>${esc(r[6] || '0')}<small>${esc(r[4] || '')}</small></dd></div>`).join('');
  }
});

/* Tabel transaksi: dari tab Transaksi, hanya baris Terverifikasi */
const transaksiSiap = (async function transaksi(){
  if (!BUKU_KAS.transaksi) return null;
  const tbody = document.getElementById('tabel-transaksi');
  const info = document.getElementById('jumlah-transaksi');
  let data;
  try {
    const rows = await ambilCSV(BUKU_KAS.transaksi);
    const h = rows.findIndex(r => r.includes('Tanggal') && r.includes('Status'));
    if (h < 0) throw new Error('kepala tabel tidak ditemukan');
    const kol = nama => rows[h].findIndex(c => c.trim().startsWith(nama));
    const K = { tgl: kol('Tanggal'), bukti: kol('No. Bukti'), jenis: kol('Jenis'), kat: kol('Kategori'), proyek: kol('Proyek'),
                ket: kol('Keterangan'), jml: kol('Jumlah'), tautan: kol('Tautan Bukti'), status: kol('Status') };
    data = rows.slice(h + 1)
      .filter(r => (r[K.status] || '').trim() === 'Terverifikasi' && (r[K.tgl] || '').trim() && !(r[K.ket] || '').includes('[CONTOH]'))
      .map(r => ({ tgl: r[K.tgl].trim(), bukti: r[K.bukti] || '', jenis: (r[K.jenis] || '').trim(), kat: r[K.kat] || '',
                   proyek: (r[K.proyek] || '').trim(), ket: r[K.ket] || '', jml: rupiah(r[K.jml]), tautan: (r[K.tautan] || '').trim() }));
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="8" class="muted">${esc(t('gagal_muat'))}</td></tr>`;
    return null;
  }
  const isiPilihan = (id, nilai, label) => {
    const sel = document.getElementById(id);
    [...new Set(nilai.filter(Boolean))].sort().forEach(v => sel.add(new Option(label(v), v)));
  };
  isiPilihan('saring-bulan', data.map(d => kunciBulan(d.tgl)), namaBulan);
  isiPilihan('saring-proyek', data.map(d => d.proyek), v => v);

  const amanUrl = u => /^https:\/\//.test(u) ? u : '';
  function gambar(){
    const q = document.getElementById('cari').value.trim().toLowerCase();
    const b = document.getElementById('saring-bulan').value;
    const p = document.getElementById('saring-proyek').value;
    const hasil = data.filter(d => (!b || kunciBulan(d.tgl) === b) && (!p || d.proyek === p) &&
      (!q || [d.bukti, d.kat, d.ket, d.proyek].join(' ').toLowerCase().includes(q)));
    tbody.innerHTML = hasil.length ? hasil.map(d => {
      const u = amanUrl(d.tautan);
      return `<tr><td style="white-space:nowrap">${esc(d.tgl)}</td><td>${esc(d.bukti)}</td>` +
        `<td class="${d.jenis === 'Masuk' ? 'jenis-masuk' : 'jenis-keluar'}">${esc(d.jenis)}</td><td>${esc(d.kat)}</td><td>${esc(d.proyek)}</td>` +
        `<td>${esc(d.ket)}</td><td class="angka-sel">${d.jenis === 'Keluar' ? '−' : ''}${rp(d.jml)}</td>` +
        `<td>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t('lihat'))}</a>` : '<span class="muted">-</span>'}</td></tr>`;
    }).join('') : `<tr><td colspan="8" class="muted">${esc(t('tidak_cocok'))}</td></tr>`;
    const masuk = hasil.filter(d => d.jenis === 'Masuk').reduce((a, d) => a + d.jml, 0);
    const keluar = hasil.filter(d => d.jenis === 'Keluar').reduce((a, d) => a + d.jml, 0);
    info.textContent = t('ringkas_transaksi', { n: hasil.length, masuk: rp(masuk), keluar: rp(keluar) });
  }
  ['cari', 'saring-bulan', 'saring-proyek'].forEach(id => document.getElementById(id).addEventListener('input', gambar));
  gambar();
  return data;
})();

/* Dasbor: kartu metrik dan dua grafik. Semuanya dari data Terverifikasi; tanpa data, tetap kosong. */
const ringkas = n => new Intl.NumberFormat(LOKAL, { notation: 'compact', maximumFractionDigits: 1 }).format(n);
const svg = (w, h, isi) => `<svg viewBox="0 0 ${w} ${h}" role="img">${isi}</svg>`;

/* Donat alokasi uang keluar, dari tab Ringkasan */
ringkasanSiap.then(rows => {
  if (!rows) return;
  const nilai = label => {
    const r = rows.find(r => (r[0] || '').trim().toLowerCase() === label.toLowerCase());
    return r ? rupiah(r[1]) : 0;
  };
  const bagian = [
    [t('biaya_proyek'), nilai('Biaya proyek (langsung ke lapangan)'), '#2E7D32'],
    [t('biaya_operasional'), nilai('Biaya operasional'), '#9ACB8B'],
    [t('pajak'), nilai('Pajak'), '#B88A5A'],
  ];
  const total = bagian.reduce((a, b) => a + b[1], 0);
  if (!total) return;
  const R = 70, K = 2 * Math.PI * R;
  let geser = 0;
  const lingkar = bagian.filter(b => b[1]).map(([, v, warna]) => {
    const panjang = v / total * K;
    const c = `<circle cx="100" cy="100" r="${R}" fill="none" stroke="${warna}" stroke-width="28" stroke-dasharray="${panjang} ${K - panjang}" stroke-dashoffset="${-geser}" transform="rotate(-90 100 100)"/>`;
    geser += panjang;
    return c;
  }).join('');
  document.getElementById('grafik-alokasi').innerHTML =
    `<div style="max-width:220px;margin:0 auto;width:100%">${svg(200, 200, lingkar)}</div>` +
    `<ul class="legenda">${bagian.map(([n, v, w]) => `<li><i style="background:${w}"></i>${esc(n)}<b>${new Intl.NumberFormat(LOKAL, { style: 'percent', maximumFractionDigits: 1 }).format(v / total)}</b></li>`).join('')}</ul>`;
});

/* Kartu uang masuk/keluar bulan terakhir dan batang arus kas enam bulan, dari tab Transaksi */
transaksiSiap.then(data => {
  if (!data || !data.length) return;
  const perBulan = {};
  data.forEach(d => {
    const k = kunciBulan(d.tgl); if (!k) return;
    const b = perBulan[k] ||= { masuk: 0, keluar: 0 };
    if (d.jenis === 'Masuk') b.masuk += d.jml; else if (d.jenis === 'Keluar') b.keluar += d.jml;
  });
  const bulan = Object.keys(perBulan).sort();
  if (!bulan.length) return;
  const akhir = bulan[bulan.length - 1];
  const isiKartu = (id, n) => { const el = document.getElementById(id); el.textContent = 'Rp ' + rp(n); el.classList.remove('kosong'); };
  isiKartu('metrik-masuk', perBulan[akhir].masuk);
  isiKartu('metrik-keluar', perBulan[akhir].keluar);
  document.querySelectorAll('.metrik-bulan').forEach(el => el.textContent = namaBulan(akhir));

  /* Enam bulan berturut-turut sampai bulan terakhir, termasuk bulan tanpa transaksi */
  const enam = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(akhir + '-01T00:00:00'); d.setMonth(d.getMonth() - i);
    enam.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  const maks = Math.max(1, ...enam.map(k => Math.max(perBulan[k]?.masuk || 0, perBulan[k]?.keluar || 0)));
  const W = 600, H = 240, kiri = 56, bawah = 28, atas = 10, tinggi = H - bawah - atas, lebar = (W - kiri) / 6;
  let isi = '';
  [0, .5, 1].forEach(f => {
    const y = atas + tinggi * (1 - f);
    isi += `<line x1="${kiri}" x2="${W}" y1="${y}" y2="${y}" stroke="#E3E8DF"/><text x="${kiri - 8}" y="${y + 4}" text-anchor="end">${ringkas(maks * f)}</text>`;
  });
  enam.forEach((k, i) => {
    const b = perBulan[k] || { masuk: 0, keluar: 0 }, x = kiri + i * lebar + lebar * .2, bw = lebar * .28;
    const batang = (v, dx, warna) => { const h = v / maks * tinggi; return `<rect x="${x + dx}" y="${atas + tinggi - h}" width="${bw}" height="${h}" rx="3" fill="${warna}"><title>${esc(namaBulan(k))}: Rp ${rp(v)}</title></rect>`; };
    isi += batang(b.masuk, 0, '#2E7D32') + batang(b.keluar, bw + 4, '#B88A5A') +
      `<text x="${x + bw + 2}" y="${H - 8}" text-anchor="middle">${esc(namaBulan(k, 'short'))}</text>`;
  });
  document.getElementById('grafik-arus').innerHTML = svg(W, H, isi) +
    `<ul class="legenda baris-legenda"><li><i style="background:#2E7D32"></i>${esc(t('masuk'))}</li><li><i style="background:#B88A5A"></i>${esc(t('keluar'))}</li></ul>`;
});
