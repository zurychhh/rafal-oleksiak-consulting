import type { Metadata, Viewport } from 'next'
import { SiteNav } from '../components/SiteNav'
import { Calculator } from './CalculatorClient'
import '../nawyko/nawyko.css'
import './calculator.css'

const URL = 'https://oleksiakconsulting.com/calculator'
const TITLE = 'Reorder gap calculator — what a shorter gap between orders is worth'
const DESC =
  'Type three numbers from your own store and drag the gap between orders: see what a faster reorder adds in a year. Runs in the browser; nothing you type is sent.'

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
  '@type': 'WebApplication',
  name: 'Reorder gap calculator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  description: DESC,
  url: URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  provider: { '@type': 'Person', name: 'Rafał Oleksiak', url: 'https://oleksiakconsulting.com' },
}

export default function CalculatorPage() {
  return (
    <div className="nk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <a className="nk-skip" href="#main">
        Skip to content
      </a>
      <SiteNav current={null} contact="#enquiry" className="nk-top nk-caps" />

      <main id="main">
        <Calculator />
      </main>

      <footer className="nk-foot">
        <span>Rafał Oleksiak · Oleksiak Consulting</span>
        <nav aria-label="Footer">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">Home</a>
          <a href="/tools">Tools</a>
          <a href="/tool">Reorder gap tool</a>
          <a href="/nawyko">Nawyko</a>
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
