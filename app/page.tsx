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

/** Prerender pierwszego ekranu (scripts/design-prerender.mjs): jeden zrzut na
    kazdy przedzial szerokosci, w ktorym logika komponentu daje inny uklad.
    Wlasciwy wybiera media query; runtime po starcie zastepuje zrzut (DcBoot). */
function prerenderHtml(): string {
  const pre = DC.prerender
  if (!pre) return ''
  const mq = (r: { min: number; max: number | null }) =>
    [r.min > 0 ? `(min-width:${r.min}px)` : '', r.max != null ? `(max-width:${r.max + 0.98}px)` : '']
      .filter(Boolean).join(' and ')
  const pick = pre.buckets
    .map((b, i) => b.ranges.map((r) => {
      const q = mq(r)
      const rule = `#dc-page .dc-pre[data-dc-pre="${i}"]{display:block}`
      return q ? `@media ${q}{${rule}}` : rule
    }).join(''))
    .join('')
  const css = (pre.css + '\n#dc-page .dc-pre{display:none}' + pick +
    'html.dc-fonts-wait #dc-page .dc-pre{visibility:hidden}').replace(/<\/style/gi, '<\\/style')
  // Zrzut pokazuje sie dopiero z wlasciwym krojem: bez tego tekst lamie sie
  // najpierw fontem zapasowym i przeskakuje, gdy font dojdzie (CLS). Fonty sa
  // w <head> jako preload, wiec czekanie trwa tyle, co ich pobranie; gorny
  // limit 1,5 s — na bardzo wolnym laczu lepiej pokazac tekst niz nic. Bez JS
  // skrypt sie nie wykona, klasa nie powstanie i zrzut jest widoczny od razu.
  const wait =
    `(function(){var d=document.documentElement,f=document.fonts;if(!f||!f.load)return;` +
    `d.classList.add('dc-fonts-wait');var done=function(){d.classList.remove('dc-fonts-wait')};` +
    `setTimeout(done,1500);var L=${JSON.stringify(pre.fonts)};` +
    // te same kroje pod nazwa bez prefiksu — ich uzyje runtime; grzejemy je od razu,
    // zeby przejecie nie trafilo na font zapasowy
    `L.forEach(function(x){f.load(x.replace('"dcpre ','"'),'Aa\u0142').catch(function(){})});` +
    `Promise.all(L.map(function(x){return f.load(x,'Aa\u0142')})).then(done,done)})()`
  return (
    `<style id="dc-pre-css">${css}</style><script>${wait}</script>` +
    pre.buckets.map((b, i) => `<div class="dc-pre" data-dc-pre="${i}">${b.html}</div>`).join('')
  )
}

export default function Home() {
  // Runtime, React 18 UMD i fonty zaczynaja sie pobierac z <head>, zanim
  // hydratacja odpali DcBoot — runtime dostaje je potem z cache.
  // Fonty z wysokim priorytetem — na nie czeka zrzut pierwszego ekranu. Runtime
  // i React sa potrzebne dopiero po hydratacji, wiec nie moga zabierac im lacza.
  for (const href of DC.preload.fonts) preload(href, { as: 'font', type: 'font/woff2', crossOrigin: '', fetchPriority: 'high' })
  for (const src of DC.preload.scripts) preload(src, { as: 'script', fetchPriority: 'low' })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_LD) }}
      />
      {/* Najpierw prerender (widoczny od pierwszego bajtu, takze bez JS), potem
          szablon w <template> (bezwladny: jego <style> z @font-face swap nie dziala
          na zrzut, a surowe {{…}} nie trafiaja do tekstu strony) i logika text/x-dc.
          DcBoot przed startem runtime'u sklada z niego <x-dc> 1:1 jak w eksporcie. Runtime
          podmienia <x-dc> na #dc-root, a DcBoot zdejmuje prerender w tej samej
          klatce, w ktorej runtime skonczyl rysowac. React nie zaglada do srodka
          dangerouslySetInnerHTML. */}
      <div
        id="dc-page"
        dangerouslySetInnerHTML={{ __html: prerenderHtml() + '<template id="dc-src">' + DC.template + '</template>' + DC.script }}
      />
      <DcBoot />
      <LeadBridge />
    </>
  )
}
