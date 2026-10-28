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

/* Buku (bagian 2): tulisan panjang dibuka per lembar */
(function buku(){
  const el = document.querySelector('.cerita');
  if (!el) return;
  const lembar = [...el.querySelectorAll('.lembar')];
  const sebelum = el.querySelector('.cerita-sebelum');
  const berikut = el.querySelector('.cerita-berikut');
  const posisi = el.querySelector('.cerita-posisi');
  let kini = 0;
  el.classList.add('cerita-js');
  lembar.forEach((l, i) => { l.style.zIndex = lembar.length - i; });
  function tampil() {
    lembar.forEach((l, i) => {
      l.classList.toggle('terbalik', i < kini);
      l.classList.toggle('aktif', i === kini);
      l.setAttribute('aria-hidden', i === kini ? 'false' : 'true');
    });
    sebelum.disabled = kini === 0;
    berikut.disabled = kini === lembar.length - 1;
    posisi.textContent = `${el.dataset.labelHalaman} ${kini + 1} / ${lembar.length}`;
  }
  function ke(n) { kini = Math.max(0, Math.min(lembar.length - 1, n)); tampil(); }
  sebelum.addEventListener('click', () => ke(kini - 1));
  berikut.addEventListener('click', () => ke(kini + 1));
  lembar.forEach(l => l.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    const r = l.getBoundingClientRect();
    ke(e.clientX - r.left < r.width * 0.3 ? kini - 1 : kini + 1);
  }));
  el.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { ke(kini + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { ke(kini - 1); e.preventDefault(); }
  });
  let x0 = null;
  el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) ke(kini + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  tampil();
})();
