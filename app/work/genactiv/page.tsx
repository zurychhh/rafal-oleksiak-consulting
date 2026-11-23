import type { Metadata, Viewport } from 'next'
import { preload } from 'react-dom'
import { GenactivStory } from './GenactivClient'
import './genactiv.css'

const TITLE = 'GENACTIV — every box, a daily reason to come back'
const DESC =
  'The GENACTIV app for its customers: confirm the purchase, scratch one card a day, collect rewards known in advance.'

// noindex + brak w sitemap.ts do zgody GENACTIV na referencje i startu aplikacji w sklepach (spec realizacja-genactiv.md).
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0e0b0c',
}

export default function GenactivWork() {
  // font od pierwszej klatki: zamiana kroju po zaladowaniu przesuwala tekst (CLS)
  preload('/fonts/montserrat-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  return (
    <div className="ga">
      <a className="ga-skip" href="#main">
        Skip to content
      </a>
      <header className="ga-top">
        {/* Zwykly <a>, nie <Link>: runtime strony glownej nie znosi nawigacji klienckiej (CLAUDE.md, DcBoot). */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">Rafał Oleksiak</a>
        <span className="ga-top-tag">Work · GENACTIV</span>
      </header>
      <main id="main">
        <GenactivStory />
      </main>
      <footer className="ga-foot">
        <nav aria-label="Footer">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">Home</a>
          <a href="/nawyko">Nawyko</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </footer>
    </div>
  )
}
