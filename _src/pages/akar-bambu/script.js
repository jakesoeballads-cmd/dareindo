/* Angka Akar Bambu dari bagian "C. Per Proyek" tab Ringkasan */
ringkasanSiap.then(rows => {
  if (!rows) return;
  document.querySelectorAll('[data-proyek]').forEach(dl => {
    const r = rows.find(r => (r[0] || '').trim() === dl.dataset.proyek && r[1] !== undefined && r[1].trim() !== '');
    if (!r) return;
    dl.querySelectorAll('[data-proyek-kol]').forEach(dd => {
      const v = (r[+dd.dataset.proyekKol] || '').trim();
      if (v) { dd.textContent = v; dd.classList.remove('kosong'); }
    });
  });
});
