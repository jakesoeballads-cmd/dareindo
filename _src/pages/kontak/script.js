document.getElementById('form-kontak').addEventListener('submit', e => {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  const galat = document.getElementById('galat');
  if (!v('nama') || !v('pesan-isi')) { galat.textContent = t('isi_nama_pesan'); galat.hidden = false; return; }
  galat.hidden = true;
  const dari = v('nama') + (v('lembaga') ? ' (' + v('lembaga') + ')' : '');
  location.href = 'mailto:halo@dareindo.com?subject=' + encodeURIComponent(v('keperluan') + ': ' + dari) +
                  '&body=' + encodeURIComponent(v('pesan-isi') + '\n\n' + dari);
});
