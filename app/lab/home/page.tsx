import type { Metadata, Viewport } from 'next'
import { HomeLab } from './HomeLab'
import './home.css'

export const metadata: Metadata = {
  title: 'Oleksiak Consulting — retention for brands people buy again (preview)',
  description:
    'Consulting for repeat-purchase brands, Nawyko — a white-label habit and loyalty app — and free tools that measure the gap between orders.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F7F5F0',
}

export default function Page() {
  return <HomeLab />
}
