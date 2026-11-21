import type { Metadata, Viewport } from 'next'
import { DayStrip, Enquiry, Scene, WhiteLabel } from './NawykoClient'
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

const REWARDS = [
  ['Free shipping', 'On the next order. The first reward on the list, and the easiest to reach.'],
  ['A stamp after 24 of 30 days', 'Six days of slack are built in. A missed morning does not cost the reward.'],
  ['A discount on the next pack', 'A code for the next pack, so the reward is only worth something on a reorder.'],
  ['Cashback on the next order', 'Counted toward the following order — one more reason to place it.'],
] as const

const BRAND_GETS = [
  [
    'A reason for the next order',
    'The reward lands when the pack is close to empty, and it is only worth something on the next purchase.',
  ],
  [
    'The real rhythm of use',
    'Across your customers you see which day a pack is actually finished, not the day the label assumes. That date is where reminders, ads and subscription cycles belong.',
  ],
  [
    'A channel you own',
    'A daily touchpoint with your logo on it that does not depend on an ad auction or an inbox.',
  ],
] as const

export default function Nawyko() {
  return (
    <div className="nk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <a className="nk-skip" href="#main">
        Skip to content
      </a>
      <header className="nk-top">
        {/* Zwykly <a>, nie <Link>: runtime strony glownej nie znosi nawigacji klienckiej (CLAUDE.md, DcBoot). */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="nk-caps" href="/">
          Rafał Oleksiak <span className="nk-hide">· Consultant</span>
        </a>
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
              Your customer confirms a purchase, scratches one card a day after their dose, and earns rewards they
              can see in advance.
            </p>
            <p className="nk-lede">You get a reason for the next order — and the real rhythm of use.</p>
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
        </section>

        <Scene />
        <p className="nk-demo nk-demo-after">
          Tovemi is a fictional brand invented for this demo. The screens show the mechanics, not a client.
        </p>

        <section className="nk-sec" aria-labelledby="nk-rewards">
          <div className="nk-two">
            <div>
              <div className="nk-caps nk-lab">Rewards</div>
              <h2 className="nk-h2" id="nk-rewards">
                Known in advance. Never random.
              </h2>
              <p className="nk-body">
                The customer sees the whole list on day one and knows exactly what earns what. That is the
                point: a reward you can count on is a reason to keep the routine.
              </p>
            </div>
            <ol className="nk-list">
              {REWARDS.map(([h, p], i) => (
                <li key={h}>
                  <span className="nk-n">0{i + 1}</span>
                  <div>
                    <h3>{h}</h3>
                    <p>{p}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="nk-sec" aria-labelledby="nk-brand">
          <div className="nk-two">
            <div>
              <div className="nk-caps nk-lab">For the brand</div>
              <h2 className="nk-h2" id="nk-brand">
                What you get out of it.
              </h2>
              <p className="nk-body">
                Curious where your reorder date sits today?{' '}
                <a href="/tool">Check your own gap — free</a>. It compares the days on the label with the days
                between real orders.
              </p>
            </div>
            <ol className="nk-list">
              {BRAND_GETS.map(([h, p], i) => (
                <li key={h}>
                  <span className="nk-n">0{i + 1}</span>
                  <div>
                    <h3>{h}</h3>
                    <p>{p}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="nk-sec" aria-label="White label">
          <WhiteLabel />
          <div className="nk-not">
            <div>
              <h3>No random rewards.</h3>
              <p>No draw, no wheel, no mystery box. Every reward is fixed before the customer starts.</p>
            </div>
            <div>
              <h3>No health claims.</h3>
              <p>The app counts days. It does not promise what the product will do.</p>
            </div>
            <div>
              <h3>No hidden rules.</h3>
              <p>What earns what is written on the screen. Nothing changes halfway through a pack.</p>
            </div>
          </div>
        </section>

        <section className="nk-sec" id="enquiry" aria-labelledby="nk-ask">
          <div className="nk-two">
            <div>
              <div className="nk-caps nk-lab">Enquiry</div>
              <h2 className="nk-h2" id="nk-ask">
                Would this fit your product?
              </h2>
              <p className="nk-body">
                Nawyko suits anything bought again on a rhythm: supplements, skincare, pet food, coffee. Send me
                your store and I will tell you plainly whether it does.
              </p>
            </div>
            <Enquiry />
          </div>
        </section>
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
