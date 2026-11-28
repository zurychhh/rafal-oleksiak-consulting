// spec 51: wspolny pomiar kontrastu WCAG do page.evaluate (funkcja serializowana do przegladarki).
// contrastIn(rootSel, viewportOnly) → { n, unknown, bad[] }: kazdy widoczny tekst (wlasny wezel tekstowy, efektywna
// nieprzezroczystosc przodkow > 0,5) wobec tla zlozonego z warstw kolorow (alfa). Tekst, ktorego tlo przed pierwsza
// nieprzezroczysta warstwa ma background-image (gradient, obraz), liczy sie jako „nieznane” (INFO), nie jako PASS.
// Prog 4,5:1; 3:1 dla >= 24 px albo >= 18,66 px pogrubionego (WCAG 1.4.3).
function contrastIn(arg) {
  const [rootSel, viewportOnly] = arg
  const cache = new Map(); const cs = (n) => { let v = cache.get(n); if (!v) { const s = getComputedStyle(n); v = { bc: s.backgroundColor, bi: s.backgroundImage, o: +s.opacity }; cache.set(n, v) } return v }
  const rgba = (s) => {
    s = String(s); const m = s.match(/-?[\d.]+(?:e-?\d+)?/gi) || [0, 0, 0, 0]
    // color(srgb r g b / a) z color-mix: kanaly 0–1, nie 0–255 (recenzja 57)
    const k = /^color\(srgb/.test(s) ? 255 : 1
    return [+m[0] * k, +m[1] * k, +m[2] * k, m[3] === undefined ? 1 : +m[3]]
  }
  const over = (top, under) => { const a = top[3]; return [0, 1, 2].map((k) => top[k] * a + under[k] * (1 - a)).concat(1) }
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]) }
  const bg = (el) => {
    const st = []
    for (let n = el; n; n = n.parentElement) {
      const s = cs(n), c = rgba(s.bc)
      if (s.bi !== 'none') return null
      st.push(c); if (c[3] >= 1) break
    }
    let c = [255, 255, 255, 1]; for (let k = st.length - 1; k >= 0; k--) c = over(st[k], c); return c
  }
  const op = (el) => { let o = 1; for (let n = el; n; n = n.parentElement) o *= cs(n).o; return o }
  const roots = [...document.querySelectorAll(rootSel)]
  const bad = []; let n = 0, unknown = 0
  for (const el of roots.flatMap((r) => [...r.querySelectorAll('*')])) {
    if (!['P', 'H1', 'H2', 'H3', 'SPAN', 'B', 'STRONG', 'EM', 'A', 'BUTTON', 'LABEL', 'LI', 'DIV', 'SMALL', 'I', 'DT', 'DD', 'TD', 'TH', 'FIGCAPTION'].includes(el.tagName)) continue
    if (![...el.childNodes].some((t) => t.nodeType === 3 && t.textContent.trim())) continue
    if (el.closest('[hidden],.sr-only,.visually-hidden,[aria-hidden="true"] [hidden]')) continue
    const s = getComputedStyle(el), r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2 || s.visibility === 'hidden' || /inset\(50%\)/.test(s.clipPath)) continue
    const o = op(el); if (o <= 0.5) continue
    if (viewportOnly && (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth)) continue
    const b = bg(el); if (!b) { unknown++; continue }
    const fc = rgba(s.color); fc[3] *= o   // efektywna nieprzezroczystosc przodkow oslabia tekst (recenzja 57)
    const f = over(fc, b), L1 = lum(f), L2 = lum(b)
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05), sz = parseFloat(s.fontSize)
    const need = sz >= 24 || (sz >= 18.66 && +s.fontWeight >= 700) ? 3 : 4.5
    n++; if (ratio < need - 0.005) bad.push('"' + el.textContent.trim().slice(0, 26) + '" ' + ratio.toFixed(2) + ':1 < ' + need)
  }
  return { n, unknown, bad }
}
module.exports = { contrastIn }
