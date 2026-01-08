'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <main className="min-h-screen bg-[#0D0D14] flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Payment Successful!
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-8">
          Your comprehensive website audit is being generated.
          You&apos;ll receive the full 100+ page PDF report in your inbox within <strong className="text-white">5 minutes</strong>.
        </p>

        {/* What's Next */}
        <div className="bg-[#16161F] border border-white/10 rounded-xl p-6 mb-8 text-left">
          <h2 className="text-white font-semibold mb-4 text-lg">What happens next?</h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7B2CBF]/20 text-[#9D4EDD] flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
              <span>Our AI is analyzing your website across 6 key categories</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7B2CBF]/20 text-[#9D4EDD] flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
              <span>A comprehensive PDF report is being generated with actionable recommendations</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7B2CBF]/20 text-[#9D4EDD] flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
              <span>Check your email (and spam folder) in 5 minutes</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7B2CBF]/20 text-[#9D4EDD] flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
              <span>Book a free strategy call to discuss findings and next steps</span>
            </li>
          </ul>
        </div>

        {/* Report Preview */}
        <div className="bg-[#16161F] border border-[#7B2CBF]/30 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center gap-3 text-gray-400 mb-4">
            <svg className="w-8 h-8 text-[#9D4EDD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-lg font-medium text-white">Your Report Includes:</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-[#06B6D4]">&#10003;</span>
              <span>ATTRACT Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#06B6D4]">&#10003;</span>
              <span>ENGAGE Score</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#06B6D4]">&#10003;</span>
              <span>CONVERT Audit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#06B6D4]">&#10003;</span>
              <span>EXPAND Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#06B6D4]">&#10003;</span>
              <span>ANALYZE Check</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#06B6D4]">&#10003;</span>
              <span>RETAIN Strategy</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://calendly.com/rafal-oleksiak/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            Book Free Strategy Call
          </Link>
          <Link
            href="/"
            className="px-8 py-4 border border-gray-600 text-white font-medium rounded-xl hover:bg-white/5 transition-colors"
          >
            Back to Homepage
          </Link>
        </div>

        {/* Session ID (for support) */}
        {sessionId && (
          <p className="mt-8 text-xs text-gray-600">
            Order Reference: {sessionId.slice(0, 24)}...
          </p>
        )}

        {/* Support Note */}
        <p className="mt-6 text-sm text-gray-500">
          Questions? Email{' '}
          <a href="mailto:rafal@oleksiakconsulting.com" className="text-[#9D4EDD] hover:underline">
            rafal@oleksiakconsulting.com
          </a>
        </p>
      </div>
    </main>
  );
}
