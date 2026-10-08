/* Lógica del ensayo. Normalmente no hace falta editar este archivo:
   los textos están en contenido.js y el diseño en estilos.css. */
(() => {
  const C = window.CONTENIDO;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- grano de película ---- */
  const cv = $('#grain'), cx = cv.getContext('2d');
  function grain() {
    cv.width = 220; cv.height = 140; const d = cx.createImageData(220, 140);
    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    cx.putImageData(d, 0, 0);
  }
  cv.style.width = '100%'; cv.style.height = '100%'; cv.style.imageRendering = 'pixelated';
  grain(); if (!reduce) setInterval(grain, 90);

  /* ---- fragmentos de voz en la pantalla inicial ---- */
  let fi = 0; const voz = $('#voz'); voz.textContent = C.frasesInicio[0] || '';
  if (!reduce && C.frasesInicio.length > 1) setInterval(() => { fi = (fi + 1) % C.frasesInicio.length; voz.textContent = C.frasesInicio[fi]; }, 3200);

  /* ---- puertas de cineastas ---- */
  $$('.frag').forEach(f => { f.innerHTML = (C.fragmentos[f.dataset.quien] || []).map(t => `<p>${esc(t)}</p>`).join(''); });
  $$('.puerta').forEach(p => {
    const b = p.querySelector('.abrir'), f = p.querySelector('.frag'), label = b.textContent;
    b.addEventListener('click', () => {
      const open = f.hidden; f.hidden = !open; b.setAttribute('aria-expanded', open);
      b.textContent = open ? 'Cerrar ↑' : label; requestAnimationFrame(layoutHilos);
    });
  });

  /* ---- hoja de contactos ---- */
  $('#contactos').innerHTML = C.cuadros.map((c, i) => {
    const f = 1440 * (i + 1) + i * 37;
    const tc = [Math.floor(f / 86400) % 24, Math.floor(f / 1440) % 60, Math.floor(f / 24) % 60, f % 24].map(n => String(n).padStart(2, '0')).join(':');
    return `<div class="cuadro"><span class="tcode">${tc}</span><div><b>${esc(c.titulo)}</b><br><small>${esc(c.texto)}</small></div></div>`;
  }).join('');

  /* ---- diagrama relacional ---- */
  const conceptos = {}, notas = {};
  C.conceptos.forEach(c => { conceptos[c.nombre] = c.con; notas[c.nombre] = c.nota; });
  const names = Object.keys(conceptos), R = 215, svg = $('#diag'), NS = 'http://www.w3.org/2000/svg';
  const pos = {}; names.forEach((n, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / names.length; pos[n] = [R * Math.cos(a), R * Math.sin(a)]; });
  const el = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  svg.append(el('circle', { class: 'ring', r: R, cx: 0, cy: 0 }), el('circle', { class: 'ring', r: R * .5, cx: 0, cy: 0, 'stroke-dasharray': '2 6' }));
  svg.append(el('polygon', { points: names.map(n => pos[n].join(',')).join(' '), class: 'ring' }));
  const edges = [], seen = new Set();
  names.forEach(a => conceptos[a].forEach(b => {
    if (!pos[b]) return; const k = [a, b].sort().join('|'); if (seen.has(k)) return; seen.add(k);
    const l = el('line', { class: 'edge', x1: pos[a][0], y1: pos[a][1], x2: pos[b][0], y2: pos[b][1] }); l.dataset.a = a; l.dataset.b = b; edges.push(l); svg.append(l);
  }));
  names.forEach(n => { const l = el('line', { class: 'edge', x1: 0, y1: 0, x2: pos[n][0], y2: pos[n][1], 'stroke-dasharray': '1 5' }); l.dataset.a = 'Voz'; l.dataset.b = n; edges.push(l); svg.append(l); });
  const nodos = {};
  names.forEach(n => {
    const [x, y] = pos[n]; const g = el('g', { class: 'nodo', tabindex: 0, role: 'button', 'aria-label': n });
    const anchor = Math.abs(x) < 20 ? 'middle' : (x > 0 ? 'start' : 'end');
    g.append(el('circle', { cx: x, cy: y, r: 7 }));
    const t = el('text', { x: x * 1.17 + (anchor === 'start' ? -8 : anchor === 'end' ? 8 : 0), y: y * 1.17 + 4, 'text-anchor': anchor }); t.textContent = n; g.append(t);
    g.addEventListener('click', () => sel(n)); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel(n); } });
    nodos[n] = g; svg.append(g);
  });
  const c = el('g', { class: 'nodo centro', tabindex: 0, role: 'button', 'aria-label': 'Voz' });
  c.append(el('circle', { cx: 0, cy: 0, r: 44 })); const ct = el('text', { x: 0, y: 7, 'text-anchor': 'middle' }); ct.textContent = 'Voz'; c.append(ct);
  c.addEventListener('click', () => sel('Voz')); svg.append(c);
  function sel(n) {
    Object.entries(nodos).forEach(([k, g]) => g.classList.toggle('on', k === n || (conceptos[n] || []).includes(k)));
    edges.forEach(e => e.classList.toggle('on', n === 'Voz' ? e.dataset.a === 'Voz' : (e.dataset.a === n || e.dataset.b === n) && e.dataset.a !== 'Voz'));
    $('#lectura').innerHTML = n === 'Voz'
      ? `<h3>Voz</h3><p>${esc(C.notaVoz)}</p>`
      : `<h3>${esc(n)}</h3><p>${esc(notas[n])}</p><p class="label" style="color:var(--muted)">Se cruza con: ${conceptos[n].map(esc).join(' · ')}</p>`;
  }
  sel('Voz');

  /* ---- películas: tres puertas ---- */
  $$('.peli').forEach(art => {
    const d = C.peliculas[art.dataset.peli]; if (!d) return;
    art.querySelector('.pantalla h3').textContent = d.titulo;
    art.querySelector('.pantalla .label').textContent = d.linea;
    const panel = art.querySelector('.panel'), bs = art.querySelectorAll('.puertas button');
    const links = (d.enlaces || []).map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.texto)} ↗</a>`).join(' · ');
    function show(p) {
      bs.forEach(b => b.setAttribute('aria-pressed', b.dataset.p === p));
      if (p === 'viaje') panel.innerHTML = `<p>La identidad entremedios.</p><div class="viaje">${d.viaje.map(s => `<span>${esc(s)}</span>`).join('<i>→</i>')}</div>`;
      else panel.innerHTML = `<p>${esc(d[p])}</p>` + (p === 'escuchar' && links ? `<p class="label">${links}</p>` : '');
    }
    bs.forEach(b => b.addEventListener('click', () => show(b.dataset.p))); show('ver');
  });

  /* ---- hilos que bajan, convergen y se abren ---- */
  const hilos = $('#hilos'), main = $('#descenso');
  let pA, pB, lenA = 1, lenB = 1;
  function rel(elm) { const r = elm.getBoundingClientRect(), m = main.getBoundingClientRect(); return { x: r.left - m.left, y: r.top - m.top, w: r.width, h: r.height }; }
  function layoutHilos() {
    const W = main.clientWidth, H = main.scrollHeight;
    hilos.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const a = rel($('#puertaA')), b = rel($('#puertaB')), narrow = W < 640;
    const xA = narrow ? 8 : a.x + a.w / 2, xB = narrow ? W - 8 : b.x + b.w / 2, y0 = a.y - 60;
    const ciu = rel($('#ciudad')), yCiu = ciu.y + ciu.h * .5;
    const cruce = rel($('.cruce .c')), cxm = cruce.x + cruce.w / 2, cyTop = cruce.y, cyBot = cruce.y + cruce.h;
    const fil = rel($('#filmar')), yFil = fil.y + fil.h, sala = rel($('.sala'));
    const pa = rel($('.peli.a .pantalla')), pb = rel($('.peli.b .pantalla'));
    const endA = [pa.x + pa.w / 2, pa.y - 8], endB = [pb.x + pb.w / 2, pb.y - 8];
    const route = (x, off, end) => `M ${x} ${y0} L ${x} ${yCiu} C ${x} ${cyTop - 80}, ${cxm + off} ${cyTop - 160}, ${cxm + off} ${cyTop}
      M ${cxm + off} ${cyBot} L ${cxm + off} ${yFil} C ${cxm + off} ${sala.y - 120}, ${end[0]} ${sala.y - 140}, ${end[0]} ${end[1]}`;
    hilos.innerHTML = '';
    const mk = (d, col, cls) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('stroke', col); if (cls) p.setAttribute('class', cls); hilos.append(p); return p; };
    const dA = route(xA, -3, endA), dB = route(xB, 3, endB);
    mk(dA, 'var(--hiloA)', 'base'); mk(dB, 'var(--hiloB)', 'base');
    pA = mk(dA, 'var(--hiloA)'); pB = mk(dB, 'var(--hiloB)');
    lenA = pA.getTotalLength(); lenB = pB.getTotalLength();
    pA.style.strokeDasharray = lenA; pB.style.strokeDasharray = lenB;
    onScroll();
  }

  /* ---- timecode + estación ---- */
  const FPS = 24, DUR = 47 * 60 * FPS; // 47 minutos: duración de un mediometraje
  const tcEl = $('#tc'), stEl = $('#st'), secs = $$('[data-st]');
  const fmt = f => [Math.floor(f / (3600 * FPS)), Math.floor(f / (60 * FPS)) % 60, Math.floor(f / FPS) % 60, f % FPS].map(n => String(n).padStart(2, '0')).join(':');
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    tcEl.textContent = fmt(Math.round(p * DUR));
    let cur = secs[0];
    for (const s of secs) if (s.getBoundingClientRect().top < innerHeight * .45) cur = s;
    stEl.textContent = cur.dataset.st;
    $$('.rail a').forEach(a => a.classList.toggle('on', a.dataset.s === cur.id));
    if (pA) {
      const m = main.getBoundingClientRect();
      const q = Math.min(1, Math.max(0, (innerHeight * .7 - m.top) / m.height));
      pA.style.strokeDashoffset = lenA * (1 - q); pB.style.strokeDashoffset = lenB * (1 - q);
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layoutHilos, 150); });
  layoutHilos();
  if (document.fonts) document.fonts.ready.then(layoutHilos);

  /* ---- muro vivo con giscus ---- */
  $('#preguntas').innerHTML = C.preguntasMuro.map(p => `<li>${esc(p)}</li>`).join('');
  const g = C.giscus || {};
  if (g.repo && g.repoId && g.category && g.categoryId) {
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js'; s.async = true; s.crossOrigin = 'anonymous';
    Object.entries({
      'data-repo': g.repo, 'data-repo-id': g.repoId, 'data-category': g.category, 'data-category-id': g.categoryId,
      'data-mapping': 'specific', 'data-term': 'Muro vivo', 'data-strict': '1', 'data-reactions-enabled': '1',
      'data-emit-metadata': '0', 'data-input-position': 'top', 'data-theme': 'transparent_dark', 'data-lang': 'es', 'data-loading': 'lazy'
    }).forEach(([k, v]) => s.setAttribute(k, v));
    $('.giscus').append(s);
  } else {
    $('#vacio').hidden = false;
  }
})();
