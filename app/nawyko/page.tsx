import type { Metadata, Viewport } from 'next'
import { DayStrip, Story } from './NawykoClient'
import { HeroGap } from '../calculator/HeroGap'
import './nawyko.css'

const URL = 'https://oleksiakconsulting.com/nawyko'
const TITLE = 'Nawyko — a white-label habit and loyalty app for brands people buy again'
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

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Nawyko',
  applicationCategory: 'BusinessApplication',
  description: DESC,
  url: URL,
  provider: { '@type': 'Person', name: 'Rafał Oleksiak', url: 'https://oleksiakconsulting.com' },
}

const PIN_JS =
  "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!navigator.webdriver&&innerHeight>=600)document.documentElement.setAttribute('data-nk-pin','')}catch(e){}"

export default function Nawyko() {
  return (
    <div className="nk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      {/* Spec 13: rezerwa wysokosci sceny przed hydratacja. Ten sam warunek co setMode('scroll') w Scene;
          bez niego wejscie z kotwica (#proof) skakalo o kilka ekranow po hydratacji (CLS 0,3–1,2). */}
      <script dangerouslySetInnerHTML={{ __html: PIN_JS }} />
      <a className="nk-skip" href="#main">
        Skip to content
      </a>
      <header className="nk-top">
        {/* Zwykly <a>, nie <Link>: runtime strony glownej nie znosi nawigacji klienckiej (CLAUDE.md, DcBoot). */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="nk-caps" href="/">
          Rafał Oleksiak <span className="nk-hide">· Consultant</span>
        </a>
        <nav className="nk-topnav nk-caps" aria-label="On this page">
          <a href="#how">How it works</a>
          <a href="#cashback">Cashback</a>
          <a href="#levels">Points</a>
          <a href="#exchange">Your costs</a>
          <a href="#proof">Proof</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="nk-caps nk-u" href="#enquiry">
          Ask about Nawyko
        </a>
      </header>

      <main id="main">
        <section className="nk-hero" aria-labelledby="nk-h1">
          <div>
            <div className="nk-caps nk-lab">Nawyko · white-label app for repeat-purchase brands</div>
            <h1 className="nk-h1" id="nk-h1">
              A habit app with your logo on it.
            </h1>
          </div>
          <div>
            <p className="nk-lede">
              An app under your brand that gives customers a reason to reorder — built and run for you.
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
