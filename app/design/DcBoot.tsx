'use client'

import { useEffect } from 'react'
import { DC } from './generated'

/**
 * Uruchamia runtime Claude Design na szablonie <x-dc> wyrenderowanym przez serwer.
 *
 * PISANE RECZNIE — scripts/ship-design.mjs tego nie dotyka; zmienia sie tylko
 * ./generated.ts (szablon, skrypt, mapa zasobow).
 *
 * Kolejnosc ma znaczenie:
 *   1. window.__resources = mapa unpkg → /dc/…  (runtime pyta o nia, zanim siegnie
 *      do sieci; bez niej React przyszedlby z unpkg, a strona pobralaby siebie
 *      drugi raz przez fetch(location.href))
 *   2. <script src=runtime> — sam dociaga React 18 UMD z mapy i od razu bootuje,
 *      bo dokument nie jest juz w stanie „loading".
 *
 * Runtime nie umie sie odmontowac: raz zbootowany trzyma React 18 root, listenery
 * scrolla i style z <helmet> w <head>. Dlatego przejscie klienckie Z `/` i Z POWROTEM
 * na `/` konczy sie pelnym przeladowaniem — nastepna trasa dostaje czysty dokument,
 * a `/` zawsze bootuje na swiezym.
 */
export default function DcBoot() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    // Runtime juz raz zbootowal w tym dokumencie (powrot na `/` przez <Link>),
    // a szablon jest nowy — drugi boot na tym samym runtime nie jest wspierany.
    if (typeof w.__dcBoot === 'function' && !document.getElementById('dc-root')) {
      window.location.reload()
      return
    }
    // Przejecie prerenderu: zrzut z serwera zostaje na ekranie, dopoki runtime
    // nie narysuje tej samej tresci w #dc-root. Wtedy — w tym samym zadaniu,
    // przed malowaniem — przenosimy to, co ktos zdazyl wpisac, i zdejmujemy zrzut.
    // Tresc jest ta sama, wiec #dc-root wskakuje dokladnie w miejsce zrzutu.
    const page = document.getElementById('dc-page')
    const pres = () => Array.from(document.querySelectorAll<HTMLElement>('#dc-page .dc-pre'))
    const shown = pres().find((el) => el.getClientRects().length > 0)
    const need = shown ? shown.textContent?.length ?? 0 : 0
    let mo: MutationObserver | null = null
    let waitingFonts = false
    const takeover = (): boolean => {
      if (!pres().length) return true
      const root = document.getElementById('dc-root')
      if (!root || (root.textContent?.length ?? 0) < need * 0.9) return false
      // Runtime pisze krojem bez prefiksu zrzutu. Jesli ten jeszcze sie laduje,
      // przejecie narysowaloby tekst fontem zapasowym i przelamalo uklad —
      // czekamy na font i probujemy jeszcze raz.
      const specs = (DC.prerender?.fonts ?? []).map((x) => x.replace('"dcpre ', '"'))
      const missing = specs.filter((x) => !document.fonts.check(x, 'Aa\u0142'))
      if (missing.length) {
        if (!waitingFonts) {
          waitingFonts = true
          Promise.all(missing.map((x) => document.fonts.load(x, 'Aa\u0142')))
            .catch(() => undefined)
            .then(() => { waitingFonts = false; if (takeover()) mo?.disconnect() })
        }
        return false
      }
      if (shown) {
        shown.querySelectorAll<HTMLInputElement>('input[name]').forEach((src) => {
          const typed = src.type === 'checkbox' ? src.checked : src.value
          if (!typed) return
          const dst = Array.from(root.querySelectorAll<HTMLInputElement>(`input[name="${src.name}"]`))
            .find((el) => el.getClientRects().length > 0)
          if (!dst) return
          if (src.type === 'checkbox') dst.checked = src.checked
          else {
            dst.value = src.value
            dst.dispatchEvent(new Event('input', { bubbles: true }))
          }
        })
      }
      pres().forEach((el) => el.remove())
      return true
    }
    if (page && !takeover()) {
      mo = new MutationObserver(() => { if (takeover()) mo?.disconnect() })
      mo.observe(page, { childList: true, subtree: true })
    }

    // StrictMode w dev odpala efekt dwa razy; skrypt dokladamy raz.
    if (!document.querySelector('script[data-dc-runtime]')) {
      // Szablon przychodzi w bezwladnym <template>; runtime szuka <x-dc> w dokumencie
      // i czyta jego innerHTML, wiec skladamy go tu w tym samym miejscu.
      const src = document.getElementById('dc-src') as HTMLTemplateElement | null
      if (src && !document.querySelector('#dc-page x-dc')) {
        const x = document.createElement('x-dc')
        x.innerHTML = src.innerHTML
        src.after(x)
      }
      w.__resources = { ...DC.resources }
      const s = document.createElement('script')
      s.src = DC.runtime
      s.async = false
      s.dataset.dcRuntime = '1'
      document.body.appendChild(s)
    }
    return () => {
      // Odmontowanie przy zmianie trasy: po nawigacji klienckiej przeladowujemy
      // docelowa strone, zeby nie dziedziczyla stylow i listenerow runtime'u.
      // W StrictMode sciezka sie nie zmienia, wiec nic sie nie dzieje.
      // Kilka prob, bo router podmienia adres w okolicy commitu, nie przed nim.
      let done = false
      for (const ms of [0, 60, 250]) {
        setTimeout(() => {
          if (done || window.location.pathname === '/') return
          done = true
          window.location.reload()
        }, ms)
      }
    }
  }, [])

  return null
}
