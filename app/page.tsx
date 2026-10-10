import type { Metadata, Viewport } from 'next'
import { DC } from './design/generated'
import DcPage from './design/DcPage'

// Strona glowna = eksport Claude Design hostowany lokalnie (scripts/ship-design.mjs).
// Ten plik jest PISANY RECZNIE: metadata, JSON-LD i osadzenie szablonu. Tresc
// strony siedzi w ./design/generated.ts i zmienia sie tylko przez ship-design.
//
// Metadata nadpisuje layout tylko dla tej trasy.
export const metadata: Metadata = {
  title: 'FMCG ecommerce, end to end · Oleksiak Consulting',
  description:
    'FMCG ecommerce, end to end — paid, search, storefront, CRM and loyalty for brands whose products run out.',
  alternates: { canonical: 'https://oleksiakconsulting.com/' },
  openGraph: {
    type: 'website',
    url: 'https://oleksiakconsulting.com/',
    title: "You don't pay twice for the same customer.",
    description:
      'FMCG ecommerce, end to end — paid, search, storefront, CRM and loyalty for brands whose products run out.',
    images: ['https://oleksiakconsulting.com/og.png'],
  },
  twitter: { card: 'summary_large_image' },
}

// Viewport jak w szablonie Claude Design (width=device-width, initial-scale=1);
// kolor paska przegladarki = tlo projektu.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F7F5F0',
}

const PERSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  // To samo @id na /cv — jedna osoba, kanoniczny opis tutaj.
  '@id': 'https://oleksiakconsulting.com/#person',
  name: 'Rafał Oleksiak',
  url: 'https://oleksiakconsulting.com/',
  jobTitle: 'FMCG ecommerce consultant — paid, search, storefront, CRM and loyalty',
  sameAs: ['https://www.linkedin.com/in/rafa%C5%82-oleksiak-3b322981/'],
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
      {/* Prerender, szablon, runtime i most formularzy — wspolne dla tras z ship-design. */}
      <DcPage dc={DC} path="/" />
    </>
  )
}
