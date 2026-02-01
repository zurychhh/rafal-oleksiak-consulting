import type { Metadata } from 'next';
import { RadarClient } from './RadarClient';

export const metadata: Metadata = {
  title: 'RADAR - AI Competitor Intelligence | Oleksiak Consulting',
  description: 'Free AI-powered competitor analysis. Enter your website and up to 5 competitors — get instant strategic insights, threat assessment, and action items delivered to your inbox.',
  openGraph: {
    title: 'RADAR - AI Competitor Intelligence',
    description: 'Free AI-powered competitor analysis with instant strategic insights.',
    url: 'https://oleksiakconsulting.com/radar',
  },
};

export default function RadarPage() {
  return <RadarClient />;
}
