import type { Metadata, Viewport } from 'next'
import { preload } from 'react-dom'
import { ChapterBar } from './ChapterBar'
import { SiteNav } from '../components/SiteNav'
import { DayStrip, HeroApp, Story } from './NawykoClient'
import { HeroGap } from '../calculator/HeroGap'
import './nawyko.css'
import { FAQ, FEATURES } from './content'

const URL = 'https://oleksiakconsulting.com/nawyko'
const TITLE = 'Nawyko — a white-label habit and loyalty app for brands people buy again'
const H1 = 'A habit app with your logo on it.'
const LEDE = 'An app under your brand that gives customers a reason to reorder — built and run for you.'

const DESC =
  'The customer confirms a purchase, scratches one card a day after their dose, builds a streak and earns rewards known in advance. The brand gets a reason for the next order and the real rhythm of use.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: URL,
    siteName: 'Oleksiak Consulting',
    images: ['https://oleksiakconsulting.com/og.png'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F7F5F0',
}

/* Kolejka wiedzy pkt 4 (R4 p7): jeden graf zamiast luznego obiektu — strona, produkt, FAQ i ta sama osoba co na `/`
   (@id #person), zeby odpowiedzi AI laczyly Nawyko z autorem. Kazdy tekst w znaczniku jest widoczny na stronie
   (FEATURES, FAQ z ./content; DESC = podtytul hero). Bez offers/aggregateRating: ceny i ocen nie ma na stronie,
   wiec Google nie pokaze wyniku rozszerzonego — swiadomie, nie zmyslamy ich. */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': URL + '#webpage',
      url: URL,
      isPartOf: { '@id': 'https://oleksiakconsulting.com/#website' },
      name: H1,
      description: LEDE,
      about: { '@id': URL + '#app' },
      mainEntity: { '@id': URL + '#app' },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': URL + '#app',
      name: 'Nawyko',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'iOS, Android',
      description: LEDE,
      url: URL,
      featureList: [...FEATURES],
      provider: { '@id': 'https://oleksiakconsulting.com/#person' },
    },
    {
      '@type': 'Person',
      '@id': 'https://oleksiakconsulting.com/#person',
      name: 'Rafał Oleksiak',
      url: 'https://oleksiakconsulting.com',
    },
    {
      '@type': 'FAQPage',
      '@id': URL + '#faq',
      isPartOf: { '@id': URL + '#webpage' },
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

// Spec 20: rozdzialy paska — te same nazwy co w drugim poziomie nawigacji (≥ 1200 px), plus Privacy.
const CHAPTERS = [
  { id: 'how', label: 'How it works' },
  { id: 'cashback', label: 'Cashback' },
  { id: 'levels', label: 'Points' },
  { id: 'exchange', label: 'Your costs' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'proof', label: 'Proof' },
  { id: 'faq', label: 'FAQ' },
  { id: 'finale', label: 'One morning' },
]

const PIN_JS =
  "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!navigator.webdriver&&innerHeight>=600)document.documentElement.setAttribute('data-nk-pin','')}catch(e){}"

const BRAND_WAIT_JS =
  "try{var b=JSON.parse(localStorage.getItem('oc-brand-v1')||'{}');if(b&&b.name)document.documentElement.setAttribute('data-brand-wait','');setTimeout(function(){document.documentElement.removeAttribute('data-brand-wait')},3000)}catch(e){}"

export default function Nawyko() {
  // Spec 15 A2: font gotowy przed pierwszym malowaniem (font-display:optional w nawyko.css) — wejscie z kotwica bez skoku.
  preload('/fonts/instrument-sans-400-600-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  preload('/fonts/instrument-sans-400-600-latin-ext.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  return (
    <div className="nk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      {/* Spec 13: rezerwa wysokosci sceny przed hydratacja. Ten sam warunek co setMode('scroll') w Scene;
          bez niego wejscie z kotwica (#proof) skakalo o kilka ekranow po hydratacji (CLS 0,3–1,2). */}
      <script dangerouslySetInnerHTML={{ __html: PIN_JS }} />
      {/* Spec 26 / R23: zapisana marka odwiedzajacego — nazwy w telefonach ukryte do hydratacji (zero migniecia nazwy demo). */}
      <script dangerouslySetInnerHTML={{ __html: BRAND_WAIT_JS }} />
      <a className="nk-skip" href="#main">
        Skip to content
      </a>
      <SiteNav current="nawyko" contact="#enquiry" className="nk-top nk-caps">
        <a href="#how">How it works</a>
        <a href="#cashback">Cashback</a>
        <a href="#levels">Points</a>
        <a href="#exchange">Your costs</a>
        <a href="#proof">Proof</a>
        <a href="#faq">FAQ</a>
      </SiteNav>
      <ChapterBar chapters={CHAPTERS} afterId="top" ctaHref="#enquiry" ctaLabel="Ask about Nawyko" className="nk-caps" />

      <main id="main">
        <section className="nk-hero" id="top" aria-labelledby="nk-h1">
          <div className="nk-hero-head">
            <div className="nk-caps nk-lab">Nawyko · white-label app for repeat-purchase brands</div>
            <h1 className="nk-h1" id="nk-h1">
              {H1}
            </h1>
          </div>
          <HeroApp />
          <div className="nk-hero-body">
            <p className="nk-lede">
              {LEDE}
            </p>
            <p className="nk-lede">
              Customers scratch one card a day for rewards known up front. You get a reason for the next order and see the real rhythm of use.
            </p>
            <div className="nk-row">
              <a className="nk-cta" href="#enquiry">
                Ask about Nawyko
              </a>
              <a className="nk-cta nk-ghost" href="#how">
                See it work
              </a>
            </div>
          </div>
          <DayStrip />
          <HeroGap />
        </section>

        <Story />
      </main>

      <footer className="nk-foot">
        <span>Rafał Oleksiak · Oleksiak Consulting</span>
        <nav aria-label="Footer">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">Home</a>
          <a href="/tools">Tools</a>
          <a href="/tool">Reorder gap tool</a>
          <a href="/calculator">Gap calculator</a>
          <a href="mailto:rafal@oleksiakconsulting.com">rafal@oleksiakconsulting.com</a>
          <a href="https://www.linkedin.com/in/rafa%C5%82-oleksiak-3b322981/" rel="noopener">
            LinkedIn
          </a>
          <a href="/privacy">Privacy</a>
        </nav>
      </footer>
    </div>
  )
}
