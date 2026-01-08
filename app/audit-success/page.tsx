// Audit Success Page
// Displayed after successful Stripe payment

import { Suspense } from 'react';
import { Metadata } from 'next';
import SuccessContent from './SuccessContent';

export const metadata: Metadata = {
  title: 'Audit Ordered Successfully | Rafal Oleksiak Consulting',
  description: 'Your full website audit report is being generated and will be sent to your email shortly.',
  robots: 'noindex', // Don't index thank you pages
};

export default function AuditSuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SuccessContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0D0D14] flex items-center justify-center">
      <div className="animate-pulse text-white text-lg">Loading...</div>
    </div>
  );
}
