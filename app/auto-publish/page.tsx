import type { Metadata } from 'next';
import AutoPublishClient from './AutoPublishClient';

export const metadata: Metadata = {
  title: 'Auto-Publish — AI-Powered SEO Content Engine | Oleksiak Consulting',
  description:
    'Automated SEO blog publishing for ecommerce brands. AI writes, optimizes, and publishes content that ranks — on autopilot. Start your free trial.',
  keywords: [
    'AI SEO tool',
    'automated blog publishing',
    'AI content writer',
    'SEO automation',
    'ecommerce blog',
    'content marketing automation',
    'auto-publish blog posts',
    'AI blog generator',
  ],
  openGraph: {
    title: 'Auto-Publish — AI-Powered SEO Content Engine',
    description:
      'Stop writing blog posts. Let AI publish content that ranks. Automated SEO content engine for ecommerce brands.',
    url: 'https://oleksiakconsulting.com/auto-publish',
    siteName: 'Oleksiak Consulting',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auto-Publish — AI SEO Content Engine',
    description:
      'Automated SEO blog publishing for ecommerce. AI writes, optimizes, publishes.',
  },
  alternates: {
    canonical: 'https://oleksiakconsulting.com/auto-publish',
  },
};

export default function AutoPublishPage() {
  return <AutoPublishClient />;
}
