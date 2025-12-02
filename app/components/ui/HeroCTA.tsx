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
      label: 'scroll_to_lama',
    })
  }

  const scrollToLama = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    handleSecondaryClick()
    const lamaSection = document.getElementById('lama-audit')
    if (lamaSection) {
      lamaSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="hero-cta-container">
      {/* Primary CTA - Book Consultation (HIGH PRIORITY) */}
      <a
        href="https://calendly.com/rafaloleksiakconsulting/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="hero-cta-button"
        onClick={handlePrimaryClick}
      >
        Get Your Free Strategy Session
        <span>→</span>
      </a>

      {/* Secondary CTA - LAMA Audit (LOW FRICTION) - Now a proper button */}
      <button
        onClick={scrollToLama}
        className="hero-lama-cta"
        aria-label="Scroll to free LAMA audit section"
      >
        Get Free Website Audit
        <span className="hero-lama-arrow">↓</span>
      </button>
    </div>
  )
}
