const $ = id => document.getElementById(id);
/* Label kolom diambil dari halaman, jadi email ikut bahasa halaman. */
const label = id => (document.querySelector(`label[for="${id}"]`)?.textContent || id).replace(/\s*\(.*\)\s*$/, '').trim();
const kirimEmail = (subjek, isi) => {
  location.href = 'mailto:halo@dareindo.com?subject=' + encodeURIComponent(subjek) + '&body=' + encodeURIComponent(isi);
};
const susun = baris => baris.filter(([, v]) => v && v.trim()).map(([k, v]) => `${k}: ${v.trim()}`).join('\n\n');

/* GPS perangkat */
$('tombol-gps').addEventListener('click', () => {
  if (!('geolocation' in navigator)) { $('status-gps').textContent = t('gps_tidak_didukung'); return; }
  $('status-gps').textContent = t('gps_mencari');
  navigator.geolocation.getCurrentPosition(p => {
    $('koordinat').value = p.coords.latitude.toFixed(6) + ', ' + p.coords.longitude.toFixed(6);
    $('status-gps').textContent = t('gps_ditemukan', { m: Math.round(p.coords.accuracy) });
  }, () => {
    $('status-gps').textContent = t('gps_gagal');
  }, { enableHighAccuracy: true, timeout: 15000 });
});

/* Tanpa nama: sembunyikan kolom kontak */
$('anonim').addEventListener('change', e => {
  $('kolom-kontak').hidden = e.target.checked;
  if (e.target.checked) { $('nama').value = ''; $('telepon').value = ''; }
});

/* Informasi lahan → email */
const formLahan = $('form-lahan');
formLahan.addEventListener('submit', e => {
  e.preventDefault();
  if (!$('lokasi').value.trim()) {
    $('galat').textContent = t('isi_lokasi'); $('galat').hidden = false; $('lokasi').focus(); return;
  }
  $('galat').hidden = true;
  const kondisi = [...formLahan.querySelectorAll('[name=kondisi]:checked')].map(c => c.value).join(', ');
  const teks = formLahan.dataset.judul.toUpperCase() + '\n\n' + susun([
    [label('lokasi'), $('lokasi').value],
    [label('koordinat'), $('koordinat').value],
    [label('peta'), $('peta').value],
    [$('judul-kondisi').textContent, kondisi],
    [label('luas'), $('luas').value],
    [label('kepemilikan'), $('kepemilikan').value],
    [label('cerita'), $('cerita').value],
    [formLahan.dataset.pelapor, $('anonim').checked ? formLahan.dataset.anonim : [$('nama').value, $('telepon').value].filter(v => v.trim()).join(' / ')],
  ]) + '\n\n' + formLahan.dataset.foto;
  $('teks-laporan').value = teks;
  $('cadangan').hidden = false;
  kirimEmail(formLahan.dataset.judul + ': ' + $('lokasi').value.trim(), teks);
});

$('tombol-salin').addEventListener('click', async () => {
  const el = $('teks-laporan');
  try { await navigator.clipboard.writeText(el.value); } catch { el.select(); document.execCommand('copy'); }
  $('tombol-salin').textContent = t('tersalin');
});

/* Pendaftaran kontributor → email */
const formKontributor = $('form-kontributor');
formKontributor.addEventListener('submit', e => {
  e.preventDefault();
  if (!$('k-nama').value.trim() || !$('k-email').value.trim()) {
    $('k-galat').textContent = t('isi_nama_email'); $('k-galat').hidden = false; return;
  }
  $('k-galat').hidden = true;
  const bidang = [...formKontributor.querySelectorAll('[name=bidang]:checked')].map(c => c.value).join(', ');
  kirimEmail(formKontributor.dataset.judul + ': ' + $('k-nama').value.trim(), susun([
    [label('k-nama'), $('k-nama').value],
    [label('k-email'), $('k-email').value],
    [label('k-telepon'), $('k-telepon').value],
    [label('k-domisili'), $('k-domisili').value],
    [$('judul-bidang').textContent, bidang],
    [label('k-pesan'), $('k-pesan').value],
  ]));
});
