import type { ReactNode } from 'react'
import './site-nav.css'

// Spec 14: jedna nawigacja dla tras recznych (/nawyko, /calculator, /tools, /lab/*, /work/genactiv).
// Zwykle <a>, nie <Link>: runtime strony glownej nie znosi nawigacji klienckiej (CLAUDE.md, DcBoot).
// `/` (eksport Claude Design) ma wlasny naglowek i tego komponentu nie uzywa.
export type SiteNavCurrent = 'consulting' | 'nawyko' | 'tools' | null

type Props = {
  current: SiteNavCurrent
  /** Kotwica formularza na tej stronie; bez niej Contact prowadzi do formularza /nawyko. */
  contact?: string
  /** Klasa naglowka strony (np. "nk-top nk-caps" albo "ga-top"), zeby zachowac jej wyglad. */
  className: string
  /** Drugi poziom: linki wewnatrz strony, widoczne od 1200 px. */
  children?: ReactNode
}

export function SiteNav({ current, contact = '/nawyko#enquiry', className, children }: Props) {
  const cur = (k: SiteNavCurrent) => (current === k ? ({ 'aria-current': 'page' } as const) : {})
  return (
    <header className={`sn ${className}`}>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className="sn-brand" href="/">
        Rafał Oleksiak
      </a>
      <nav className="sn-nav" aria-label="Main">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" {...cur('consulting')}>
          Consulting
        </a>
        <a href="/nawyko" {...cur('nawyko')}>
          Nawyko
        </a>
        <a href="/tools" {...cur('tools')}>
          Tools
        </a>
        <a href={contact}>Contact</a>
      </nav>
      {children ? (
        <nav className="sn-sub" aria-label="On this page">
          {children}
        </nav>
      ) : null}
    </header>
  )
}
