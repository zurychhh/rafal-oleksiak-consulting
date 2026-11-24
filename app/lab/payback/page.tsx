import type { Metadata, Viewport } from 'next'
import { SiteNav } from '../../components/SiteNav'
import { Payback } from './PaybackClient'
import '../../nawyko/nawyko.css'
import '../reward/reward.css'
import './payback.css'

// Podglad: noindex i poza sitemap.ts (decyzja o publikacji nalezy do Rafala).
const URL = 'https://oleksiakconsulting.com/lab/payback'
const TITLE = 'Customer payback calculator: which order breaks even'
const DESC =
  'Type the cost to win a customer, the margin per order and the days between orders: see which order, and which day, pays back a new customer. Nothing you type is sent.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  robots: { index: false, follow: false },
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
  name: 'Customer payback calculator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  description: DESC,
  url: URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  provider: { '@type': 'Person', name: 'Rafał Oleksiak', url: 'https://oleksiakconsulting.com' },
}

export default function PaybackPage() {
  return (
    <div className="nk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <a className="nk-skip" href="#main">
        Skip to content
      </a>
      <SiteNav current={null} className="nk-top nk-caps" />

      <main id="main">
        <Payback />
      </main>

      <footer className="nk-foot">
        <span>Rafał Oleksiak · Oleksiak Consulting</span>
        <nav aria-label="Footer">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">Home</a>
          <a href="/tools">Tools</a>
          <a href="/nawyko">Nawyko</a>
          <a href="/lab/reward">Reward cost</a>
          <a href="/lab/reminder">Reminder day</a>
          <a href="mailto:rafal@oleksiakconsulting.com">rafal@oleksiakconsulting.com</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </footer>
    </div>
  )
}
