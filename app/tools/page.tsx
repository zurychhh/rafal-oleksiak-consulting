import type { Metadata, Viewport } from 'next'
import { SiteNav } from '../components/SiteNav'
import '../nawyko/nawyko.css'
import './tools.css'

// Spec 14: zbiorcza strona narzedzi. Podglad: noindex i poza sitemap.ts (decyzja o publikacji nalezy do Rafala).
const TITLE = 'Tools — five questions about your repeat customers'
const DESC =
  'Five one-screen calculators for brands people buy again: reorder gap, value of a day, customer payback, reward cost, reminder day.'

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

type Tool = { href: string; name: string; q: string; know: string; needs: string; cta: string }

// „Co wiesz po 30 sekundach” — z agencja/narzedzia.md; „needs” — pola samego narzedzia.
const TOOLS: Tool[] = [
  {
    href: '/tool',
    name: 'Reorder gap',
    q: 'Does the pack run out before the customer reorders?',
    know: 'The real gap between orders in your store, set against the days your pack lasts.',
    needs: 'Your order export (CSV) · counted in this browser',
    cta: 'Read your export',
  },
  {
    href: '/calculator',
    name: 'Value of a day',
    q: 'What is one day between orders worth?',
    know: 'What a shorter gap between orders adds in a year, in your currency.',
    needs: 'Repeat customers · average order value · days between orders',
    cta: 'Work out a day',
  },
  {
    href: '/lab/payback',
    name: 'Customer payback',
    q: 'Which order pays back a new customer?',
    know: 'The order number, and the day, on which a new customer has paid back what it cost to win them.',
    needs: 'Cost to win a customer · margin per order · days between orders',
    cta: 'Find the order',
  },
  {
    href: '/lab/reward',
    name: 'Reward cost',
    q: 'What can a loyalty reward cost and still pay off?',
    know: 'The highest yearly reward cost per customer that still pays back, and whether your reward idea fits.',
    needs: 'Average order value · margin per order · extra orders a year',
    cta: 'Price the reward',
  },
  {
    href: '/lab/reminder',
    name: 'Reminder day',
    q: 'Which day should the reorder reminder go out?',
    know: 'The day of the pack on which to send the reminder, so the next pack arrives before the last one ends.',
    needs: 'Days one pack lasts · days to doorstep · days to reorder',
    cta: 'Find the day',
  },
]

export default function ToolsPage() {
  return (
    <div className="nk">
      <a className="nk-skip" href="#main">
        Skip to content
      </a>
      <SiteNav current="tools" className="nk-top nk-caps" />

      <main id="main" className="tl">
        <section className="tl-head" aria-labelledby="tl-h1">
          <div className="nk-caps nk-lab">Tools · one question, one screen</div>
          <h1 className="nk-h1 tl-h1" id="tl-h1">
            Your own numbers show what the next order is worth.
          </h1>
          <p className="tl-sub">
            Each tool answers one question from figures you type, in about thirty seconds. Nothing you type is sent.
          </p>
        </section>

        <ol className="tl-list">
          {TOOLS.map((t, i) => (
            <li key={t.href} className="tl-card">
              <div className="tl-n nk-caps">
                {String(i + 1).padStart(2, '0')} · {t.name}
              </div>
              <h2 className="tl-q">{t.q}</h2>
              <p className="tl-know">{t.know}</p>
              <p className="tl-needs">
                <span className="nk-caps">You need</span> {t.needs}
              </p>
              <a className="tl-go" href={t.href}>
                {t.cta} <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ol>

        <section className="tl-end" aria-labelledby="tl-h2">
          <h2 className="tl-h2" id="tl-h2">
            Customers lapse between packs? Nawyko gives them a daily reason to come back to your brand.
          </h2>
          <a className="nk-cta" href="/nawyko">
            See Nawyko
          </a>
        </section>
      </main>

      <footer className="nk-foot">
        <span>Rafał Oleksiak · Oleksiak Consulting</span>
        <nav aria-label="Footer">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">Home</a>
          <a href="/tools" aria-current="page">
            Tools
          </a>
          <a href="/nawyko">Nawyko</a>
          <a href="mailto:rafal@oleksiakconsulting.com">rafal@oleksiakconsulting.com</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </footer>
    </div>
  )
}
