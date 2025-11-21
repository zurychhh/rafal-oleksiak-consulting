'use client'

import { analytics } from '@/app/lib/analytics'

/**
 * Hero section CTA button with analytics tracking
 */
export default function HeroCTA() {
  const handleClick = () => {
    analytics.trackHeroCTA()
  }

  return (
    <a
      href="https://calendly.com/rafaloleksiakconsulting/30min"
      target="_blank"
      rel="noopener noreferrer"
      className="hero-cta-button"
      onClick={handleClick}
    >
      Book Free Consultation
      <span>→</span>
    </a>
  )
}
