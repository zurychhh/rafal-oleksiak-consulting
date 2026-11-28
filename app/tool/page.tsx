// app/tool/page.tsx
//
// Trasa narzedzia. Markup i skrypt sa przenoszone ze zrodla przez
// scripts/ship-tool.mjs — ten plik tylko je podaje i nie zawiera tresci.
//
// Skrypt idzie z /public jako osobny plik, nie inline: dokladnie tak samo jak
// app/audit-runtime.js na stronie glownej, zeby dalo sie go kopiowac bajt w bajt
// bez ani jednej adnotacji dopisanej dla kompilatora.

import type { Metadata } from 'next'
import Script from 'next/script'
import { preload } from 'react-dom'
import { BODY } from './body'
import ToolLeadBridge from './ToolLeadBridge'
import './tool.css'
// Po tool.css, nie przed: reset zdejmuje przycinanie narzucone przez
// critical.css i przy rownej specyficznosci decyduje kolejnosc.
import './tool-reset.css'

export const metadata: Metadata = {
  title: 'What the pack says, against what your buyers do',
  description:
    'Days of supply off the label, against the gap between orders in your own export. ' +
    'Runs in your browser on a pasted order export — no install, no account.',
  alternates: { canonical: '/tool' },
  openGraph: {
    title: 'What the pack says, against what your buyers do',
    description:
      'Days of supply off the label, against the gap between orders in your own export.',
    url: '/tool',
    type: 'website',
    // Wlasny openGraph nadpisuje caly obiekt z layoutu, wiec obraz trzeba podac jeszcze raz.
    images: ['/og.png'],
  },
}

export default function ToolPage() {
  // R43: hero /tool (h1#hl, lede, CTA) rysuje Instrument Sans, etykiety IBM Plex Mono 400. Bez preloadu krój przychodzil
  // ~170 ms po pierwszym malowaniu i h1 przechodzil z 323 na 242 px wysokosci — wysrodkowany hero skakal o 40 px
  // (clsscroll-1440 0,0105, zmierzone: zdarzenie layout-shift w tej samej klatce co `loadingdone` Instrument Sans).
  // Lista = kroje, ktore trasa naprawde rysuje (bramka font-preload).
  preload('/fonts/instrument-sans-400-600-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  preload('/fonts/ibm-plex-mono-400-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: BODY }} />
      <Script src="/tool-runtime.js" strategy="afterInteractive" />
      {/* Formularz #tool-enquiry → /api/lead. Bez formularza w markupie nic nie robi. */}
      <ToolLeadBridge />
    </>
  )
}
