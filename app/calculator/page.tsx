import type { Metadata, Viewport } from 'next'
import { Enquiry } from '../nawyko/NawykoClient'
import { GapCalculator, SecondOrder } from './CalculatorClient'
import '../nawyko/nawyko.css'
import './calculator.css'

const URL = 'https://oleksiakconsulting.com/calculator'
const TITLE = 'Reorder gap calculator — what a shorter gap between orders is worth'
const DESC =
  'Type four numbers from your own store and drag the gap: see what a faster reorder adds in a year, what one day is worth, and how much reorder discount you can afford. Runs in the browser; nothing is sent.'

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

const ASSUMPTIONS = [
  [
    'It is an upper estimate.',
    'The formula assumes every reordering customer keeps the same rhythm for the whole year. Customers who leave during the year are not subtracted.',
  ],
  [
    'It prices the change. It does not promise it.',
    'The calculator says what a shorter gap is worth if you get there. It says nothing about whether your customers will move.',
  ],
  [
    'Order value stays the same.',
    'A discount used to pull the reorder forward lowers it. The “discount you can afford” line shows where that stops paying.',
  ],
  [
    'The two calculators are separate scenarios.',
    'A shorter gap and more second orders overlap. Do not add the two results together.',
  ],
] as const

/* Punkty odniesienia. Kazdy: co zmierzono, kto, kiedy, na kim — i czego NIE mowi.
   Zadna z tych liczb nie wchodzi do wzoru. Zrodla otwarte ponownie 21.11.2026
   (agencja/research/kalkulator-zrodla.md + agencja/research/kalkulator-weryfikacja.md).
   Przed wypuszczeniem na produkcje kliknac kazdy link w przegladarce — narzedzie odczytu zwraca tylko fragmenty. */
const REFS: ReadonlyArray<{ h: string; p: string; src: string; href: string }> = [
  {
    h: 'Subscribers leave early: in health and wellness, 26.5% cancel at the first renewals (cycles 2–3) and 7.5% from the sixth cycle on.',
    p: 'What it does not say: anything about customers who buy without a subscription, or about your brand. Recharge itself calls the figure a proxy for where cancellations concentrate.',
    src: 'Recharge, “Subscription churn is front-loaded”, July 2026. Subscriber-initiated cancellations per renewal cycle, brands on the Recharge platform, cycles from July 2025 to March 2026.',
    href: 'https://getrecharge.com/blog/subscription-churn-front-loaded-first-reorder/',
  },
  {
    h: '55% of US adults call themselves regular supplement users; 74% say they use supplements at all.',
    p: 'What it does not say: how many days of a pack are actually used. It is a self-description, not a measurement.',
    src: 'Ipsos for the Council for Responsible Nutrition, 2023. Online survey, 3,192 US adults, 9–14 August 2023.',
    href: 'https://www.ipsos.com/en-us/nine-ten-dietary-or-nutritional-supplement-users-agree-dietary-supplements-are-essential',
  },
  {
    h: 'At one large retailer, customers who used its app bought 33% more often than customers without it, over the 18 months after launch.',
    p: 'What it does not say: that an app shortens your gap. It is one retailer, and it compares customers who used the app with customers who did not.',
    src: 'Narang and Shankar, “Mobile App Introduction and Online and Offline Purchases and Product Returns”, Marketing Science 38(5), 2019; INFORMS release, 3 September 2019.',
    href: 'https://www.informs.org/News-Room/INFORMS-Releases/News-Releases/Do-those-Retail-Apps-Increase-Customer-Engagement-and-Sales-in-All-Channels-New-Research-Says-Yes-on-Both-Sales-and-Returns',
  },
]

export default function Calculator() {
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
          Talk it through
        </a>
      </header>

      <main id="main">
        <section className="nk-hero gc-hero" aria-labelledby="gc-h1">
          <div>
            <div className="nk-caps nk-lab">Calculator · reorder gap · for brands people buy again</div>
            <h1 className="nk-h1" id="gc-h1">
              What is one day between orders worth?
            </h1>
          </div>
          <div>
            <p className="nk-lede">
              Type four numbers from your own store. Drag the gap. See what a faster reorder adds in a year.
            </p>
            <p className="gc-priv">Runs in your browser. Nothing you type in the calculator is sent anywhere.</p>
            <div className="nk-row">
              <a className="nk-cta" href="#gap">
                Start with the gap
              </a>
            </div>
          </div>
        </section>

        <section className="nk-sec" id="gap" aria-labelledby="gc-gap">
          <div className="nk-caps nk-lab">01 · A shorter gap</div>
          <h2 className="nk-h2" id="gc-gap">
            Same customers. Fewer empty days.
          </h2>
          <p className="nk-body">
            A pack lasts a fixed number of days. The next order usually arrives later. Every day in between is a day
            the customer is not using your product — and not paying for it.
          </p>
          <GapCalculator />
        </section>

        <section className="nk-sec" id="second" aria-labelledby="gc-second">
          <div className="nk-caps nk-lab">02 · The second order</div>
          <h2 className="nk-h2" id="gc-second">
            More first-time buyers who come back.
          </h2>
          <p className="nk-body">
            A separate question: what if a few more new customers out of every hundred placed a second order? Counted
            cautiously — one extra order each, nothing after it.
          </p>
          <SecondOrder />
        </section>

        <section className="nk-sec" aria-labelledby="gc-limits">
          <div className="nk-two">
            <div>
              <div className="nk-caps nk-lab">Read before you quote it</div>
              <h2 className="nk-h2" id="gc-limits">
                What the number assumes.
              </h2>
              <p className="nk-body">
                Every figure above comes from the fields you filled in. There is no market average inside the formula.
              </p>
            </div>
            <ol className="nk-list">
              {ASSUMPTIONS.map(([h, p], i) => (
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

        <section className="nk-sec" aria-labelledby="gc-refs">
          <div className="nk-two">
            <div>
              <div className="nk-caps nk-lab">Reference points</div>
              <h2 className="nk-h2" id="gc-refs">
                What has actually been measured.
              </h2>
              <p className="nk-body">
                Public data on reorder gaps is thin. I found no primary source for typical days between orders by
                category, so the calculator does not suggest one. These are the few figures with a named sample — and
                what each of them does not tell you.
              </p>
            </div>
            <ul className="gc-refs">
              {REFS.map((r) => (
                <li key={r.href}>
                  <h3>{r.h}</h3>
                  <p>{r.p}</p>
                  <p className="gc-src">
                    {r.src}{' '}
                    <a href={r.href} rel="noopener nofollow">
                      Source
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="gc-next">
            <a href="/tool">
              <span className="nk-caps nk-lab">Do not know your gap?</span>
              <h3>Measure it from an order export.</h3>
              <p>The free tool compares the days on your label with the days between real orders.</p>
              <span className="gc-go">Open the reorder gap tool</span>
            </a>
            <a href="/nawyko">
              <span className="nk-caps nk-lab">The app</span>
              <h3>Nawyko: a habit app with your logo on it.</h3>
              <p>One scratch card a day and rewards known in advance, redeemed on the next order. A separate product — none of the figures above are about it.</p>
              <span className="gc-go">See Nawyko work</span>
            </a>
          </div>
        </section>

        <section className="nk-sec" id="enquiry" aria-labelledby="gc-ask">
          <div className="nk-two">
            <div>
              <div className="nk-caps nk-lab">Enquiry</div>
              <h2 className="nk-h2" id="gc-ask">
                Want a second pair of eyes on your numbers?
              </h2>
              <p className="nk-body">
                Send me your store and I will tell you plainly whether the gap is worth going after. The numbers you
                typed in the calculator stay in your browser — they are not sent with this form.
              </p>
            </div>
            <Enquiry form="calculator" page="/calculator" title="Talk it through" />
          </div>
        </section>
      </main>

      <footer className="nk-foot">
        <span>Rafał Oleksiak · Oleksiak Consulting</span>
        <nav aria-label="Footer">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">Home</a>
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
