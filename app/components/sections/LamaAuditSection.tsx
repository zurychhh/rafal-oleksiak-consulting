'use client'

import { useState } from 'react'
import { trackEvent } from '@/app/lib/analytics'
import styles from './LamaAuditSection.module.css'

/**
 * LAMA (Lead Acquisition Maturity Agent) - Dedicated Section
 *
 * Strategic placement: After Case Studies, before Process Timeline
 * User journey: Saw results → Want to check own site → Understand process → Book consultation
 *
 * Design: Purple gradient background, centered layout, prominent input
 * CTA Hierarchy: This is a "soft CTA" (low friction, cold leads)
 */
export default function LamaAuditSection() {
  const [url, setUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) return

    // Track analytics
    trackEvent({
      action: 'lama_audit_section_submit',
      category: 'conversion',
      label: 'dedicated_section',
    })

    setIsSubmitting(true)

    // Scroll to FinalCTA section which has the full form with LAMA checkbox
    const finalCTA = document.getElementById('contact')
    if (finalCTA) {
      // Store URL in sessionStorage so FinalCTA can pre-fill it
      sessionStorage.setItem('lama_prefill_url', url)
      sessionStorage.setItem('lama_auto_check', 'true')

      finalCTA.scrollIntoView({ behavior: 'smooth', block: 'start' })

      // Reset after scroll
      setTimeout(() => {
        setIsSubmitting(false)
      }, 1000)
    }
  }

  return (
    <section id="lama-audit" className={styles.lamaSection}>
      <div className={styles.container}>

        {/* Emoji Journey Indicator */}
        <div className={styles.emojiJourney}>
          <span title="Find">🔍</span>
          <span className={styles.arrow}>→</span>
          <span title="Stay">⚡</span>
          <span className={styles.arrow}>→</span>
          <span title="Understand">💡</span>
          <span className={styles.arrow}>→</span>
          <span title="Trust">🛡️</span>
          <span className={styles.arrow}>→</span>
          <span title="Convert">🎯</span>
        </div>

        {/* Main Headline */}
        <h2 className={styles.headline}>
          Get Your Free Website Audit
        </h2>

        {/* Subheadline */}
        <p className={styles.subheadline}>
          See how your website performs across the 5 critical dimensions:<br />
          <span className={styles.dimensions}>Find · Stay · Understand · Trust · Convert</span>
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-website.com"
              className={styles.input}
              required
              disabled={isSubmitting}
              pattern="https?://.*"
              title="Please enter a valid URL starting with http:// or https://"
            />
            <button
              type="submit"
              className={styles.button}
              disabled={isSubmitting || !url.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze My Website
                  <span className={styles.arrow}>→</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Value Props */}
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>✓</span>
            <span className={styles.featureText}>No signup required</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>⚡</span>
            <span className={styles.featureText}>Results in 90 seconds</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🎁</span>
            <span className={styles.featureText}>Free forever</span>
          </div>
        </div>

        {/* Social Proof */}
        <p className={styles.socialProof}>
          Trusted by <strong>15+ companies</strong> including Allegro, Booksy, and Accenture
        </p>

      </div>
    </section>
  )
}
