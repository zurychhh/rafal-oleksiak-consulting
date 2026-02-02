import type { Metadata } from 'next';
import RadarClient from './RadarClient';

export const metadata: Metadata = {
  title: 'RADAR — AI Competitor Intelligence Tool | Oleksiak Consulting',
  description:
    'AI-powered competitor analysis for ecommerce brands. RADAR scrapes competitor websites, analyzes strengths and weaknesses, and delivers strategic intelligence straight to your inbox.',
  keywords: [
    'AI competitor analysis',
    'competitor intelligence tool',
    'competitive analysis AI',
    'competitor website scraper',
    'strategic intelligence',
    'ecommerce competitor analysis',
    'competitor threat assessment',
    'market gap analysis',
  ],
  openGraph: {
    title: 'RADAR — AI Competitor Intelligence Tool',
    description:
      'Know your competitors before they know you. AI scrapes, analyzes, and delivers strategic intelligence on demand.',
    url: 'https://oleksiakconsulting.com/radar',
    siteName: 'Oleksiak Consulting',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RADAR — AI Competitor Intelligence',
    description:
      'AI-powered competitor analysis. Scrape, analyze, and outmaneuver.',
  },
  alternates: {
    canonical: 'https://oleksiakconsulting.com/radar',
  },
};

export default function RadarPage() {
  return <RadarClient />;
}
