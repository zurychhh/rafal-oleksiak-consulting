import type { Metadata, Viewport } from 'next'
import { SiteNav } from '../../components/SiteNav'
import { Reward } from './RewardClient'
import '../../nawyko/nawyko.css'
import './reward.css'

// Podglad: noindex i poza sitemap.ts (decyzja o publikacji nalezy do Rafala).
const URL = 'https://oleksiakconsulting.com/lab/reward'
const TITLE = 'Reward cost calculator — how much a loyalty reward can cost (preview)'
const DESC =
  'Type order value, margin per order and the extra orders a reward brings: see the most a reward can cost per customer a year and still pay for itself. Nothing you type is sent.'

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
  name: 'Reward cost calculator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  description: DESC,
  url: URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  provider: { '@type': 'Person', name: 'Rafał Oleksiak', url: 'https://oleksiakconsulting.com' },
}

export default function RewardPage() {
  return (
    <div className="nk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <a className="nk-skip" href="#main">
        Skip to content
      </a>
      <SiteNav current={null} className="nk-top nk-caps" />

      <main id="main">
        <Reward />
      </main>

      <footer className="nk-foot">
        <span>Rafał Oleksiak · Oleksiak Consulting</span>
        <nav aria-label="Footer">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">Home</a>
          <a href="/tools">Tools</a>
          <a href="/nawyko">Nawyko</a>
          <a href="/lab/reminder">Reminder day</a>
          <a href="mailto:rafal@oleksiakconsulting.com">rafal@oleksiakconsulting.com</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </footer>
    </div>
  )
}
