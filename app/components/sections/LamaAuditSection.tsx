'use client'

import { useState } from 'react'
import { trackEvent } from '@/app/lib/analytics'
import styles from './LamaAuditSection.module.css'

/**
 * LAMA (Lead Acquisition Maturity Agent) - Dedicated Section
 *
 * Strategic placement: After Case Studies, before Process Timeline
 * User journey: Saw results → Want to check own site → Get audit → Book consultation
 *
 * Design: Purple gradient background, centered layout, prominent input
 * CTA Hierarchy: This is a "soft CTA" (low friction, cold leads)
 *
 * REAL AUDIT: Calls /api/lama/audit directly and sends email with results
 */
export default function LamaAuditSection() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim() || !email.trim()) return

    // Track analytics
    trackEvent({
      action: 'lama_audit_submit',
      category: 'conversion',
      label: 'lama_section',
    })

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/lama/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          email,
          fullName: email.split('@')[0], // Use email prefix as fallback name
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Success!
        setSubmitStatus('success')
        trackEvent({
          action: 'lama_audit_success',
          category: 'conversion',
          label: `score_${data.auditResult?.overallScore || 0}`,
        })

        // Reset form after 3 seconds
        setTimeout(() => {
          setUrl('')
          setEmail('')
          setSubmitStatus('idle')
        }, 5000)
      } else {
        // API returned error
        setSubmitStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        trackEvent({
          action: 'lama_audit_error',
          category: 'conversion',
          label: 'api_error',
        })
      }
    } catch (error) {
      // Network error
      setSubmitStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
      trackEvent({
        action: 'lama_audit_error',
        category: 'conversion',
        label: 'network_error',
      })
      console.error('LAMA audit error:', error)
    } finally {
      setIsSubmitting(false)
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
              disabled={isSubmitting || submitStatus === 'success'}
              title="Enter your website URL (e.g., https://example.com)"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={styles.input}
              required
              disabled={isSubmitting || submitStatus === 'success'}
              title="Enter your email to receive the audit results"
            />
            <button
              type="submit"
              className={styles.button}
              disabled={isSubmitting || submitStatus === 'success' || !url.trim() || !email.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Analyzing...
                </>
              ) : submitStatus === 'success' ? (
                <>
                  ✓ Check Your Email!
                </>
              ) : (
                <>
                  Get Free Audit
                  <span className={styles.arrow}>→</span>
                </>
              )}
            </button>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className={styles.successMessage}>
              <p className={styles.successTitle}>✓ Audit Complete!</p>
              <p className={styles.successText}>
                We've analyzed your website and sent the results to <strong>{email}</strong>.
                <br />
                Check your inbox in ~90 seconds for your personalized audit report!
              </p>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className={styles.errorMessage}>
              <p className={styles.errorTitle}>⚠ Something went wrong</p>
              <p className={styles.errorText}>
                {errorMessage}
                <br />
                Need help? Email us at{' '}
                <a href="mailto:contact@oleksiakconsulting.com">
                  contact@oleksiakconsulting.com
                </a>
              </p>
            </div>
          )}
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
