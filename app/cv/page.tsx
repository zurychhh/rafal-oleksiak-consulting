import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { DC } from './generated'
import DcPage, { type DcExport } from '../design/DcPage'

// /cv — eksport Claude Design przenoszony przez scripts/ship-design.mjs --route cv.
// Ten plik jest PISANY RECZNIE: metadata i JSON-LD. Tresc siedzi w ./generated.ts.
// Zasady tresci tej trasy: profil „cv" w scripts/content-rules.test.mjs.

export const metadata: Metadata = {
  title: 'Rafał Oleksiak — CV',
  description:
    'Rafał Oleksiak advises FMCG e-commerce brands on everything bought again — paid, search, storefront, CRM and loyalty.',
  alternates: { canonical: 'https://oleksiakconsulting.com/cv' },
  openGraph: {
    type: 'profile',
    url: 'https://oleksiakconsulting.com/cv',
    title: 'Rafał Oleksiak — CV',
    description:
      'Rafał Oleksiak advises FMCG e-commerce brands on everything bought again — paid, search, storefront, CRM and loyalty.',
    images: ['https://oleksiakconsulting.com/og.png'],
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F7F5F0',
}

// Ta sama osoba co na `/` — to samo @id. Kanoniczny, pelny Person stoi na stronie
// glownej; tu tylko odwolanie z sameAs do LinkedIna, zeby wyszukiwarka nie widziala
// dwoch roznych osob o tym samym nazwisku.
const PERSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://oleksiakconsulting.com/#person',
  name: 'Rafał Oleksiak',
  url: 'https://oleksiakconsulting.com/',
  sameAs: ['https://www.linkedin.com/in/rafa%C5%82-oleksiak-3b322981/'],
  mainEntityOfPage: 'https://oleksiakconsulting.com/cv',
}

export default function CvPage() {
  const dc = DC as DcExport | null
  if (!dc) notFound()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_LD) }} />
      <DcPage dc={dc} path="/cv" />
    </>
  )
}
