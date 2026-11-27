import type { Metadata, Viewport } from 'next'
import { preload } from 'react-dom'
import StopClient from './StopClient'
import './stop.css'

export const metadata: Metadata = {
  title: 'Stop writing to me · Oleksiak Consulting',
  description: 'Remove your address. One field, no questions, no confirmation loop.',
  alternates: { canonical: 'https://oleksiakconsulting.com/stop' },
  // Strona wypisu nie ma po co siedzieć w wynikach wyszukiwania.
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0D0F14',
}

export default function Stop() {
  // R42: /stop rysuje wszystko krojem Instrument Sans (--sans/--mono/--disp w globals.css). Preload tego jednego
  // pliku skraca okno podmiany kroju; skok przy pojawieniu sie paska cookies usunelo stop.css (min-height bez --consent-h).
  preload('/fonts/instrument-sans-400-600-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  return (
    <main className="stopwrap">
      <div className="lab">Oleksiak Consulting</div>
      <h1 className="stophead">Tell me to stop.</h1>
      <p className="stopsub">Put in the address you want removed. That is the whole form — no
        reason, no confirmation mail, no &ldquo;are you sure&rdquo;. I take it off everything I keep
        and I do not write to it again.</p>

      <StopClient />

      <p className="stopfoot">I only ever had your address because you wrote to me on this
        site. There is no list, no sequence and no third party, so there is nothing else to
        unsubscribe from. <a href="/privacy">Privacy policy</a>.</p>
    </main>
  )
}
