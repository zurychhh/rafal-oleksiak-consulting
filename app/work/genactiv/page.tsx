import type { Metadata, Viewport } from 'next'
import { SiteNav } from '../../components/SiteNav'
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

// Rezerwa pod pasek cookies decydowana RAZ przed pierwszym malowaniem: bez zapisanej zgody (albo gdy localStorage rzuca)
// pasek sie pokaze, wiec <html> dostaje data-ga-consent-pending. Atrybut zostaje do konca wizyty (bez skoku ukladu po kliknieciu).
const CONSENT_JS =
  "try{if(localStorage.getItem('cookie-consent')===null)document.documentElement.setAttribute('data-ga-consent-pending','')}catch(e){document.documentElement.setAttribute('data-ga-consent-pending','')}"

// R4 p7: rezerwa wysokosci sceny przed hydratacja (wzor z /nawyko, spec 13). Warunek = setMode('scroll') w GenactivStory.
const PIN_JS =
  "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!navigator.webdriver&&innerHeight>=600)document.documentElement.setAttribute('data-ga-pin','')}catch(e){}"

export default function GenactivWork() {
  // font od pierwszej klatki: zamiana kroju po zaladowaniu przesuwala tekst (CLS)
  preload('/fonts/montserrat-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  return (
    <div className="ga">
      <script dangerouslySetInnerHTML={{ __html: CONSENT_JS + PIN_JS }} />
      <a className="ga-skip" href="#main">
        Skip to content
      </a>
      <SiteNav current={null} contact="#enquiry" className="ga-top" />
      <main id="main">
        <GenactivStory />
      </main>
      <footer className="ga-foot">
        <nav aria-label="Footer">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">Home</a>
          <a href="/tools">Tools</a>
          <a href="/nawyko">Nawyko</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </footer>
    </div>
  )
}
