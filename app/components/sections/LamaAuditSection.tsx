'use client'

import { trackEvent } from '@/app/lib/analytics'
import styles from './LamaAuditSection.module.css'

/**
 * LAMA (Lead Acquisition Maturity Assessment) - Dedicated Section
 *
 * Strategic placement: After AchievementsTicker, before FinalCTA
 * User journey: Saw process → Understand LAMA methodology → Scroll to contact
 *
 * Design: Purple gradient background with glass morphism cards
 * CTA: Scroll to contact form (#contact)
 */

const LAMA_STEPS = [
  {
    id: 'find',
    title: 'Find',
    icon: 'fa-magnifying-glass',
    gradient: 'linear-gradient(135deg, #0066FF, #00BFFF)',
    description: 'I analyze your SEO fundamentals - meta tags, H1 structure, robots.txt, and schema markup to ensure search engines can discover your site.',
    why: "If search engines can't find you, you don't exist"
  },
  {
    id: 'stay',
    title: 'Stay',
    icon: 'fa-bolt',
    gradient: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
    description: 'I measure your page speed, mobile optimization, and Core Web Vitals (LCP, CLS, FCP) using Google PageSpeed Insights API.',
    why: '1 second delay = 7% loss in conversions'
  },
  {
    id: 'understand',
    title: 'Understand',
    icon: 'fa-lightbulb',
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    description: 'My AI analyzes your messaging - H1 clarity, value proposition, navigation structure, and content readability.',
    why: "Confused visitors don't convert"
  },
  {
    id: 'trust',
    title: 'Trust',
    icon: 'fa-shield-halved',
    gradient: 'linear-gradient(135deg, #0066FF, #00BFFF)',
    description: 'I check your credibility signals - SSL certificate, privacy policy, contact information, testimonials, and trust badges.',
    why: 'No trust = no leads'
  },
  {
    id: 'convert',
    title: 'Convert',
    icon: 'fa-bullseye',
    gradient: 'linear-gradient(135deg, #EF4444, #F87171)',
    description: 'I assess your lead capture mechanisms - forms, CTA buttons, contact methods, and chat widgets across your site.',
    why: 'Great traffic without CTAs = missed opportunities'
  }
] as const

export default function LamaAuditSection() {
  const scrollToContact = () => {
    trackEvent({
      action: 'lama_cta_click',
      category: 'conversion',
      label: 'scroll_to_contact',
    })

    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section id="lama-audit" className={styles.lamaSection}>
      <div className={styles.container}>

        {/* Title + Subtitle */}
        <div className={styles.header}>
          <h2 className={styles.headline}>
            Free Website Audit: <span className={styles.highlight}>5 Ways</span><br />
            You're Losing Leads
          </h2>
          <p className={styles.subtitle}>
            I'll show you exactly where visitors are dropping off - and how to fix it in 30 days
          </p>
        </div>

        {/* Cards Grid */}
        <div className={styles.cardsGrid}>
          {LAMA_STEPS.map((step) => (
            <article key={step.id} className={styles.cardWrapper}>
              <div className={styles.cardBorder}>
                <div className={styles.card}>
                  <div
                    className={styles.icon}
                    style={{ background: step.gradient }}
                  >
                    <i className={`fa-solid ${step.icon}`}></i>
                  </div>
                  <h3 className={styles.cardTitle}>{step.title}</h3>
                  <p className={styles.cardDescription}>{step.description}</p>
                  <p className={styles.cardWhy}>{step.why}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Button - Arrow points DOWN */}
        <div className={styles.ctaContainer}>
          <button
            onClick={scrollToContact}
            className={styles.ctaButton}
            type="button"
          >
            Yes, Audit My Website (Free, 90 Seconds)
            <i className={`fa-solid fa-arrow-down ${styles.arrow}`}></i>
          </button>
        </div>

      </div>
    </section>
  )
}
