'use client'

import { analytics, trackEvent } from '@/app/lib/analytics'

/**
 * Hero section dual-CTA with clear hierarchy:
 * - Primary: Book Consultation (high-intent, hot leads)
 * - Secondary: Free LAMA Audit (low-friction, cold leads)
 */
export default function HeroCTA() {
  const handlePrimaryClick = () => {
    analytics.trackHeroCTA()
  }

  const handleSecondaryClick = () => {
    trackEvent({
      action: 'hero_lama_cta_click',
      category: 'conversion',
      label: 'secondary_cta',
    })
  }

  const scrollToLama = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    handleSecondaryClick()
    const lamaSection = document.getElementById('lama-audit')
    if (lamaSection) {
      lamaSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* Primary CTA - Book Consultation (HIGH PRIORITY) */}
      <a
        href="https://calendly.com/rafaloleksiakconsulting/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="hero-cta-button"
        onClick={handlePrimaryClick}
      >
        Book Free Consultation
        <span>→</span>
      </a>

      {/* Secondary CTA - LAMA Audit (LOW FRICTION) */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-gray-400">
          Not ready yet?
        </p>
        <a
          href="#lama-audit"
          onClick={scrollToLama}
          className="text-sm font-medium text-[#9D4EDD] hover:text-[#00BFFF] transition-colors duration-300 flex items-center gap-2 group"
        >
          <span className="border-b border-[#9D4EDD] group-hover:border-[#00BFFF] transition-colors">
            Get a free website audit first
          </span>
          <span className="text-xs opacity-70">(90 seconds)</span>
        </a>
      </div>
    </div>
  )
}
