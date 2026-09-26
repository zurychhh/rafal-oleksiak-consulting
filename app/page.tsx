import type { Metadata, Viewport } from 'next'
import { preload } from 'react-dom'
import { DC } from './design/generated'
import DcBoot from './design/DcBoot'
import LeadBridge from './design/LeadBridge'
import './design/design-reset.css'

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
  // Runtime, React 18 UMD i fonty zaczynaja sie pobierac z <head>, zanim
  // hydratacja odpali DcBoot — runtime dostaje je potem z cache.
  for (const src of DC.preload.scripts) preload(src, { as: 'script' })
  for (const href of DC.preload.fonts) preload(href, { as: 'font', type: 'font/woff2', crossOrigin: '' })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_LD) }}
      />
      {/* Szablon <x-dc> i logika text/x-dc dokladnie tak, jak w eksporcie.
          Runtime podmienia <x-dc> na #dc-root; do tego czasu szablon jest ukryty
          (design-reset.css). React nie zaglada do srodka dangerouslySetInnerHTML. */}
      <div
        id="dc-page"
        dangerouslySetInnerHTML={{ __html: '<x-dc>' + DC.template + '</x-dc>' + DC.script }}
      />
      <noscript>
        <p style={{ padding: '24px 18px', font: '16px/1.5 system-ui,sans-serif', color: '#14161A' }}>
          This page needs JavaScript. Write to{' '}
          <a href="mailto:rafal@oleksiakconsulting.com">rafal@oleksiakconsulting.com</a>{' '}
          — EUR 2,500 net per month, two clients at a time.
        </p>
      </noscript>
      <DcBoot />
      <LeadBridge />
    </>
  )
}
