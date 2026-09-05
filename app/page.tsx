import type { Metadata, Viewport } from 'next'
import AuditClient from './AuditClient'
import './audit.css'

// Przeniesione z <head> design/production/index.html. Nadpisuje metadata
// z layoutu tylko dla tej trasy.
export const metadata: Metadata = {
  title: 'FMCG replenishment audit · Oleksiak Consulting',
  description:
    'For FMCG brands — supplements, food, beauty, household chemicals. Tell me what runs out and how long one pack lasts, and I price the gap between the empty pack and the next order.',
  alternates: { canonical: 'https://oleksiakconsulting.com/' },
  openGraph: {
    type: 'website',
    url: 'https://oleksiakconsulting.com/',
    title: 'Every pack runs out on a different day',
    description:
      'Two numbers, and I price the replenishment gap in your FMCG category — then rank the eighteen steps I would build, in order.',
    images: ['https://oleksiakconsulting.com/og.png'],
  },
  twitter: { card: 'summary_large_image' },
}

// Ta strona ma własny viewport: `viewport-fit=cover` i `interactive-widget`
// są częścią tego, co przeszło QA na dziewięciu szerokościach.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  themeColor: '#0D0F14',
}

const PERSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rafał Oleksiak',
  url: 'https://oleksiakconsulting.com/',
  jobTitle: 'FMCG replenishment and retention consultant',
  sameAs: ['https://www.linkedin.com/in/rafal-oleksiak/'],
  description:
    "Fifteen years on replenishment timing in FMCG ecommerce. Led Allegro's FMCG and recurring team building per-user next-pack prediction; built the mBank/mOkazje retention strategy on consumables; Booksy; currently Genactiv.",
  knowsAbout: [
    'FMCG ecommerce',
    'replenishment timing',
    'customer retention',
    'CRM lifecycle',
    'subscription commerce',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Oleksiak Consulting',
    url: 'https://oleksiakconsulting.com/',
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_LD) }}
      />
      <AuditClient />
    </>
  )
}
