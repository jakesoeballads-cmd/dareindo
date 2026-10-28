/* Garis kontur bukit (bagian 2): digambar sekali saat terlihat */
(function kontur(){
  const svg = document.getElementById('kontur');
  const NS = 'http://www.w3.org/2000/svg';
  const cx = 250, cy = 265, rings = 9;
  const paths = [];
  for (let i = 0; i < rings; i++) {
    const r = 34 + i * 25, pts = [];
    for (let a = 0; a <= 64; a++) {
      const t = a / 64 * Math.PI * 2;
      const wob = 1 + 0.10 * Math.sin(3 * t + i * .5) + 0.06 * Math.cos(5 * t - i * .3) + 0.04 * Math.sin(7 * t + i);
      pts.push([cx + Math.cos(t) * r * wob * 1.08, cy + Math.sin(t) * r * wob * .86 - i * 2]);
    }
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let k = 1; k < pts.length; k++) d += `L${pts[k][0].toFixed(1)},${pts[k][1].toFixed(1)}`;
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d + 'Z');
    svg.appendChild(p); paths.push(p);
  }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  paths.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  const io = new IntersectionObserver(es => {
    if (!es[0].isIntersecting) return;
    paths.forEach((p, i) => {
      p.style.transition = `stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1) ${i * 0.12}s`;
      p.style.strokeDashoffset = 0;
    });
    io.disconnect();
  }, { threshold: .35 });
  io.observe(svg);
})();

/* Buku antik (bagian 2): sampul dibuka, lalu lembar dibalik satu per satu */
(function buku(){
  const el = document.querySelector('.cerita');
  if (!el) return;
  const sumber = el.querySelector('.cerita-halaman');
  const halaman = [...sumber.children];
  const buku = document.createElement('div');
  buku.className = 'cerita-buku';
  el.appendChild(buku);
  el.classList.add('cerita-js');
  const lebar = matchMedia('(min-width: 760px)');
  let daun = [], kini = 0, mode = '';

  function muka(sisi, isi) {
    const m = document.createElement('div');
    m.className = 'muka ' + sisi;
    if (isi) m.appendChild(isi);
    return m;
  }
  function kertas(kelas) {
    const d = document.createElement('div');
    d.className = 'halaman ' + kelas;
    return d;
  }
  function susun() {
    mode = lebar.matches ? 'ganda' : 'tunggal';
    halaman.forEach(h => sumber.appendChild(h));
    buku.textContent = '';
    buku.className = 'cerita-buku ' + mode;
    const kiri = document.createElement('div'); kiri.className = 'dasar kiri';
    const kanan = document.createElement('div'); kanan.className = 'dasar kanan';
    kiri.appendChild(kertas('endpaper')); kanan.appendChild(kertas('endpaper'));
    kiri.firstChild.style.cssText = kanan.firstChild.style.cssText = 'position:absolute;inset:0';
    if (mode === 'ganda') buku.appendChild(kiri);
    buku.appendChild(kanan);
    // Dua halaman per lembar (depan dan belakang) di layar lebar, satu halaman per lembar di HP
    const urut = mode === 'ganda' ? [halaman[0], kertas('endpaper'), ...halaman.slice(1)] : halaman;
    daun = [];
    const langkah = mode === 'ganda' ? 2 : 1;
    for (let i = 0; i < urut.length; i += langkah) {
      const d = document.createElement('div');
      d.className = 'daun';
      d.appendChild(muka('depan', urut[i]));
      d.appendChild(muka('belakang', mode === 'ganda' ? urut[i + 1] : null));
      d.addEventListener('transitionend', e => { if (e.target === d && e.propertyName === 'transform') lapis(); });
      buku.appendChild(d);
      daun.push(d);
    }
    const pertama = halaman.find(h => h.classList.contains('isi'));
    if (pertama) pertama.classList.add('pertama');
    kini = Math.min(kini, maks());
    tampil(true);
  }
  function maks() { return mode === 'ganda' ? daun.length : daun.length - 1; }
  function lapis() {
    const n = daun.length;
    daun.forEach((d, i) => { d.style.zIndex = i < kini ? i + 1 : n - i + n; });
  }
  function tampil(langsung) {
    daun.forEach((d, i) => {
      const balik = i < kini;
      if (!langsung && balik !== d.classList.contains('terbalik')) d.style.zIndex = 100;
      d.classList.toggle('terbalik', balik);
      d.classList.toggle('atas', i === kini);
      const kiriTampak = mode === 'ganda' && i === kini - 1;
      d.querySelector('.depan').setAttribute('aria-hidden', i === kini ? 'false' : 'true');
      d.querySelector('.belakang').setAttribute('aria-hidden', kiriTampak ? 'false' : 'true');
    });
    buku.classList.toggle('tertutup', kini === 0);
    buku.classList.toggle('tamat', mode === 'ganda' && kini === daun.length);
    if (langsung) lapis();
  }
  function ke(n) {
    n = Math.max(0, Math.min(maks(), n));
    if (n === kini) return;
    kini = n; tampil(false);
  }
  buku.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    const r = buku.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    if (mode === 'ganda') ke(kini + (x < 0.5 && kini > 0 ? -1 : 1));
    else ke(kini + (x < 0.3 && kini > 0 ? -1 : 1));
  });
  el.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { ke(kini + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { ke(kini - 1); e.preventDefault(); }
  });
  let x0 = null;
  buku.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  buku.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) ke(kini + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  lebar.addEventListener('change', susun);
  susun();
})();
