const rp = n => new Intl.NumberFormat(LOKAL).format(n);
/* Rupiah selalu bulat, jadi cukup ambil digitnya ("Rp 1.250.000" → 1250000). */
const rupiah = s => Number(String(s).replace(/[^\d]/g, '')) || 0;
/* Porsi bisa "12,5%" atau "0.125", tergantung format sel. */
const persen = s => {
  const t = String(s).trim(), n = parseFloat(t.replace(',', '.').replace(/[^\d.-]/g, ''));
  return isFinite(n) ? (t.includes('%') ? n : n * 100) : 0;
};
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
(async function transaksi(){
  if (!BUKU_KAS.transaksi) return;
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
    return;
  }
  /* Tanggal dari Google Sheets bisa "1/10/2026" atau "2026-10-01"; kunci bulan = "2026-10". */
  const kunciBulan = t => {
    let m = t.match(/^(\d{4})-(\d{1,2})/); if (m) return `${m[1]}-${m[2].padStart(2, '0')}`;
    m = t.match(/^\d{1,2}[\/.-](\d{1,2})[\/.-](\d{4})/); if (m) return `${m[2]}-${m[1].padStart(2, '0')}`;
    return '';
  };
  const namaBulan = k => new Date(k + '-01T00:00:00').toLocaleDateString(LOKAL, { month: 'long', year: 'numeric' });
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
})();
