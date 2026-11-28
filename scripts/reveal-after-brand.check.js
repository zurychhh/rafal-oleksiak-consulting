/* PILNE 2 pkt 1 (Rafal 28.11.2026): stan karty dnia na /nawyko — uruchamiane na stronie (Chromium przez Playwright,
   WebKit przez Selenium). which = 'hero' | 'finale'. Wynik: status (tekst aria-live), gone (plotno schowane),
   cleared (udzial przezroczystych pikseli plotna = ile zdrapano), w/h plotna. */
(function (which) {
  const q = which === 'hero'
    ? { c: '.nk-hcard:not(.nk-fz-card) canvas.nk-canvas', s: '.nk-hstatus' }
    : { c: '.nk-fz-card canvas.nk-canvas', s: '.nk-fz-status' }
  const c = document.querySelector(q.c)
  const s = document.querySelector(q.s)
  if (!c || !s) return { missing: true }
  let cleared = -1
  try {
    const g = c.getContext('2d')
    const d = g.getImageData(0, 0, c.width, c.height).data
    let n = 0, z = 0
    for (let y = 0; y < c.height; y += 6) for (let x = 0; x < c.width; x += 6) { n++; if (d[(y * c.width + x) * 4 + 3] === 0) z++ }
    cleared = n ? z / n : 0
  } catch (e) { cleared = -2 }
  const r = c.getBoundingClientRect()
  return { status: (s.textContent || '').trim(), gone: c.classList.contains('is-gone'), cleared: Math.round(cleared * 1000) / 1000, w: Math.round(r.width), h: Math.round(r.height), x: r.left, y: r.top }
})
