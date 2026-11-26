// R40 (26.11): tool.css jest globalnym arkuszem (Next nie hashuje zwyklych .css), a po nawigacji klienckiej z /tool
// zostaje w dokumencie — `body{font-family:Instrument Sans}`, `h1{...}` i zmienne :root zmienialy inne trasy
// (css-leak-check: /tool -> /work/genactiv). Zawezamy caly arkusz do strony z #orders, nie dotykajac regul:
//   :root{...}  -> :root:has(#orders){...}
//   reszta      -> html:has(#orders){ ...reszta... }   (zagniezdzenie CSS; build splaszcza je do `html:has(#orders) body`)
// Kazda regula dostaje ten sam przyrost specyficznosci, wiec kolejnosc wewnatrz narzedzia sie nie zmienia.
// Uzycie: import { scopeToolCss } (ship-tool.mjs) albo `node scripts/tool-css-scope.mjs app/tool/tool.css` (w miejscu).
import { readFileSync, writeFileSync } from 'node:fs'
export const MARK = '/* R40-SCOPED */'
export function scopeToolCss(css) {
  if (css.includes(MARK)) return css
  if (/@(keyframes|font-face|property|import|layer|charset)/.test(css)) throw new Error('tool.css: at-rule, ktorej nie wolno zagniezdzic — rozszerz tool-css-scope.mjs')
  const m = css.match(/(^|\n)(\s*):root\s*\{[^}]*\}/)
  let root = ''
  if (m) { root = m[0].replace(/:root\s*\{/, ':root:has(#orders){'); css = css.replace(m[0], '\n') }
  return `${MARK}\n${root.trim()}\nhtml:has(#orders){\n${css}\n}\n`
}
if (process.argv[1] && process.argv[1].endsWith('tool-css-scope.mjs')) {
  const f = process.argv[2]; if (!f) { console.error('usage: tool-css-scope.mjs <file>'); process.exit(2) }
  writeFileSync(f, scopeToolCss(readFileSync(f, 'utf8'))); console.log('scoped', f)
}
