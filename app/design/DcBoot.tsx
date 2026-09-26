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
    // StrictMode w dev odpala efekt dwa razy; skrypt dokladamy raz.
    if (!document.querySelector('script[data-dc-runtime]')) {
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
