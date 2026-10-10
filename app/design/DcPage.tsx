import { preload } from 'react-dom'
import DcBoot from './DcBoot'
import LeadBridge from './LeadBridge'
import './design-reset.css'

/**
 * Strona z Claude Design — wspolny mechanizm dla kazdej trasy przenoszonej
 * przez scripts/ship-design.mjs (`/` bez --route, inne trasy z --route <nazwa>).
 * PISANE RECZNIE. Trasa podaje swoj eksport (./generated.ts) i swoja sciezke;
 * metadata i JSON-LD zostaja w page.tsx danej trasy.
 */

/** Ksztalt eksportu z generated.ts (zapisywany przez ship-design). */
export interface DcExport {
  readonly runtime: string
  readonly resources: Readonly<Record<string, string>>
  readonly preload: { readonly scripts: readonly string[]; readonly fonts: readonly string[] }
  readonly template: string
  readonly script: string
  readonly prerender?: {
    readonly css: string
    readonly fonts: readonly string[]
    readonly buckets: readonly {
      readonly ranges: readonly { readonly min: number; readonly max: number | null }[]
      readonly html: string
    }[]
  } | null
}

/** Prerender pierwszego ekranu (scripts/design-prerender.mjs): jeden zrzut na
    kazdy przedzial szerokosci, w ktorym logika komponentu daje inny uklad.
    Wlasciwy wybiera media query; runtime po starcie zastepuje zrzut (DcBoot). */
function prerenderHtml(dc: DcExport): string {
  const pre = dc.prerender
  if (!pre) return ''
  const mq = (r: { min: number; max: number | null }) =>
    [r.min > 0 ? `(min-width:${r.min}px)` : '', r.max != null ? `(max-width:${r.max + 0.98}px)` : '']
      .filter(Boolean).join(' and ')
  const pick = pre.buckets
    .map((b, i) => b.ranges.map((r) => {
      const q = mq(r)
      const rule = `#dc-page .dc-pre[data-dc-pre="${i}"]{display:block}`
      return q ? `@media ${q}{${rule}}` : rule
    }).join(''))
    .join('')
  const css = (pre.css + '\n#dc-page .dc-pre{display:none}' + pick +
    'html.dc-fonts-wait #dc-page .dc-pre{visibility:hidden}').replace(/<\/style/gi, '<\\/style')
  // Zrzut pokazuje sie dopiero z wlasciwym krojem: bez tego tekst lamie sie
  // najpierw fontem zapasowym i przeskakuje, gdy font dojdzie (CLS). Fonty sa
  // w <head> jako preload, wiec czekanie trwa tyle, co ich pobranie; gorny
  // limit 1,5 s — na bardzo wolnym laczu lepiej pokazac tekst niz nic. Bez JS
  // skrypt sie nie wykona, klasa nie powstanie i zrzut jest widoczny od razu.
  const wait =
    `(function(){var d=document.documentElement,f=document.fonts;if(!f||!f.load)return;` +
    `d.classList.add('dc-fonts-wait');var done=function(){d.classList.remove('dc-fonts-wait')};` +
    `setTimeout(done,1500);var L=${JSON.stringify(pre.fonts)};` +
    // te same kroje pod nazwa bez prefiksu — ich uzyje runtime; grzejemy je od razu,
    // zeby przejecie nie trafilo na font zapasowy
    `L.forEach(function(x){f.load(x.replace('"dcpre ','"'),'Aał').catch(function(){})});` +
    `Promise.all(L.map(function(x){return f.load(x,'Aał')})).then(done,done)})()`
  return (
    `<style id="dc-pre-css">${css}</style><script>${wait}</script>` +
    pre.buckets.map((b, i) => `<div class="dc-pre" data-dc-pre="${i}">${b.html}</div>`).join('')
  )
}

export default function DcPage({ dc, path }: { dc: DcExport; path: string }) {
  // Runtime, React 18 UMD i fonty zaczynaja sie pobierac z <head>, zanim
  // hydratacja odpali DcBoot — runtime dostaje je potem z cache.
  // Fonty z wysokim priorytetem — na nie czeka zrzut pierwszego ekranu. Runtime
  // i React sa potrzebne dopiero po hydratacji, wiec nie moga zabierac im lacza.
  for (const href of dc.preload.fonts) preload(href, { as: 'font', type: 'font/woff2', crossOrigin: '', fetchPriority: 'high' })
  for (const src of dc.preload.scripts) preload(src, { as: 'script', fetchPriority: 'low' })

  return (
    <>
      {/* Najpierw prerender (widoczny od pierwszego bajtu, takze bez JS), potem
          szablon w <template> (bezwladny: jego <style> z @font-face swap nie dziala
          na zrzut, a surowe {{…}} nie trafiaja do tekstu strony) i logika text/x-dc.
          DcBoot przed startem runtime'u sklada z niego <x-dc> 1:1 jak w eksporcie. Runtime
          podmienia <x-dc> na #dc-root, a DcBoot zdejmuje prerender w tej samej
          klatce, w ktorej runtime skonczyl rysowac. React nie zaglada do srodka
          dangerouslySetInnerHTML. */}
      <div
        id="dc-page"
        dangerouslySetInnerHTML={{ __html: prerenderHtml(dc) + '<template id="dc-src">' + dc.template + '</template>' + dc.script }}
      />
      <DcBoot
        runtime={dc.runtime}
        resources={dc.resources}
        fonts={dc.prerender?.fonts ?? []}
        path={path}
      />
      <LeadBridge />
    </>
  )
}
