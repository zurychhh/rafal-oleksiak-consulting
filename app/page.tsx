import type { Metadata, Viewport } from 'next'
import AuditClient from './AuditClient'
import './audit.css'

// Przeniesione z <head> design/production/index.html. Nadpisuje metadata
// z layoutu tylko dla tej trasy.
export const metadata: Metadata = {
  title: 'FMCG ecommerce, end to end · Oleksiak Consulting',
  description:
    'FMCG ecommerce, end to end — paid, search, storefront, CRM and loyalty for brands whose products run out.',
  alternates: { canonical: 'https://oleksiakconsulting.com/' },
  openGraph: {
    type: 'website',
    url: 'https://oleksiakconsulting.com/',
    title: 'Every pack runs out on a different day',
    description:
      'FMCG ecommerce, end to end — paid, search, storefront, CRM and loyalty for brands whose products run out.',
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
  jobTitle: 'FMCG ecommerce consultant — paid, search, storefront, CRM and loyalty',
  sameAs: ['https://www.linkedin.com/in/rafal-oleksiak/'],
  description:
    "Fifteen years of FMCG ecommerce end to end — paid media, search including AI answers, storefront conversion on Shopify, WooCommerce and bespoke platforms, CRM lifecycle and loyalty. Led Allegro's FMCG and recurring team building per-user next-pack prediction; built the mBank/mOkazje retention strategy on consumables; Booksy; currently Genactiv.",
  knowsAbout: [
    'FMCG ecommerce',
    'replenishment and repeat purchase',
    'paid media',
    'SEO and AI answers',
    'conversion rate optimisation',
    'Shopify',
    'WooCommerce',
    'CRM lifecycle',
    'subscription commerce',
    'loyalty programmes',
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
