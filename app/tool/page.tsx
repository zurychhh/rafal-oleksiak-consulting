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
import { BODY } from './body'
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
  },
}

export default function ToolPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: BODY }} />
      <Script src="/tool-runtime.js" strategy="afterInteractive" />
    </>
  )
}
