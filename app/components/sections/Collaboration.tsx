"use client";

import { useState } from "react";
import styles from "./Collaboration.module.css";
import StatsTicker from "../ui/StatsTicker";

interface CollaborationProps {
  onSuccess?: () => void;
}

export default function Collaboration({ onSuccess }: CollaborationProps) {
  const [activeTab, setActiveTab] = useState<'partnership' | 'project' | 'quickwins'>('partnership');

  const partnershipBenefits = [
    {
      title: "Continuous Optimization",
      description: "Ongoing revenue growth strategies"
    },
    {
      title: "Strategic Intelligence",
      description: "Market insights and guidance"
    },
    {
      title: "Priority Support",
      description: "Rapid implementation and response"
    },
    {
      title: "Long-term Partnership",
      description: "Sustained transformation journey"
    }
  ];

  const projectBenefits = [
    {
      title: "Quick Wins Within 30 Days",
      description: "Measurable results from day one"
    },
    {
      title: "Measurable ROI",
      description: "Clear metrics and KPIs tracking"
    },
    {
      title: "Ready to Scale",
      description: "Complete automation infrastructure"
    },
    {
      title: "Growth Roadmap",
      description: "Strategic plan for expansion"
    }
  ];

  const quickWinsBenefits = [
    {
      title: "Immediate Value",
      description: "Actionable insights in single session"
    },
    {
      title: "No Long-term Commitment",
      description: "Pay per hour, scale as needed"
    },
    {
      title: "Tactical Solutions",
      description: "Focused problem-solving approach"
    },
    {
      title: "Expert Consultation",
      description: "8+ years experience on demand"
    }
  ];

  return (
    <section className={styles.collaborationSection} id="collaboration">

      {/* Stats Ticker */}
      <StatsTicker />

      {/* Main Container */}
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headline}>How We Can Work Together</h2>
          <p className={styles.subheadline}>
            Specializing in CRM strategy, Marketing Automation implementation, and end-to-end consulting project management. My ROI-driven approach combines technical expertise with business strategy to deliver measurable results.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className={styles.tabSwitcher}>
          <button
            className={`${styles.tabButton} ${activeTab === 'partnership' ? styles.active : ''}`}
            onClick={() => setActiveTab('partnership')}
            role="tab"
            aria-selected={activeTab === 'partnership'}
          >
            <span className={styles.durationBadge}>6-12+ MONTHS</span>
            Strategic Partnership
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'project' ? styles.active : ''}`}
            onClick={() => setActiveTab('project')}
            role="tab"
            aria-selected={activeTab === 'project'}
          >
            <span className={styles.durationBadge}>2-6 MONTHS</span>
            Project-Based Engagement
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'quickwins' ? styles.active : ''}`}
            onClick={() => setActiveTab('quickwins')}
            role="tab"
            aria-selected={activeTab === 'quickwins'}
          >
            <span className={styles.durationBadge}>1-3 HOURS</span>
            Quick Wins Consulting
          </button>
        </div>

        {/* Content Card */}
        <div className={styles.contentCard} role="tabpanel">

          {activeTab === 'partnership' && (
            <div className={styles.cardContent}>

              {/* Title with Badge */}
              <div className={styles.titleRow}>
                <h3 className={styles.cardTitle}>Strategic Partnership</h3>
                <span className={styles.recommendedBadge}>RECOMMENDED</span>
              </div>

              {/* Best For */}
              <p className={styles.bestFor}>
                Enterprises seeking ongoing optimization, 6-12+ month partnerships
              </p>

              {/* Description */}
              <p className={styles.description}>
                Continuous strategic guidance and optimization for companies committed to long-term automation excellence. Ongoing support to maximize revenue growth.
              </p>

              {/* Benefits */}
              <h4 className={styles.benefitsHeadline}>Partnership Advantages</h4>

              <div className={styles.benefitsGrid}>
                {partnershipBenefits.map((benefit, index) => (
                  <div key={index} className={styles.benefitItem}>
                    <div className={styles.benefitMarker}>✓</div>
                    <div className={styles.benefitContent}>
                      <h5 className={styles.benefitTitle}>{benefit.title}</h5>
                      <p className={styles.benefitDescription}>{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {activeTab === 'project' && (
            <div className={styles.cardContent}>

              {/* Title */}
              <h3 className={styles.cardTitle}>Project-Based Engagement</h3>

              {/* Best For */}
              <p className={`${styles.bestFor} ${styles.projectBestFor}`}>
                Companies with specific challenges, 2-6 month engagements
              </p>

              {/* Description */}
              <p className={styles.description}>
                Focused consulting projects with clear deliverables and timelines. Perfect for companies looking to solve specific automation challenges or implement new systems.
              </p>

              {/* Benefits */}
              <h4 className={`${styles.benefitsHeadline} ${styles.projectHeadline}`}>What You Get</h4>

              <div className={styles.benefitsGrid}>
                {projectBenefits.map((benefit, index) => (
                  <div key={index} className={styles.benefitItem}>
                    <div className={styles.benefitMarker}>✓</div>
                    <div className={styles.benefitContent}>
                      <h5 className={styles.benefitTitle}>{benefit.title}</h5>
                      <p className={styles.benefitDescription}>{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {activeTab === 'quickwins' && (
            <div className={styles.cardContent}>

              {/* Title with Badge */}
              <div className={styles.titleRow}>
                <h3 className={styles.cardTitle}>Quick Wins Consulting</h3>
                <span className={`${styles.recommendedBadge} ${styles.flexibleBadge}`}>FLEXIBLE</span>
              </div>

              {/* Best For */}
              <p className={styles.bestFor}>
                Perfect for businesses seeking immediate, actionable insights without long-term commitment
              </p>

              {/* Description */}
              <p className={styles.description}>
                Focused 1-3 hour consulting sessions delivering quick wins and tactical improvements. Get expert guidance on specific challenges, immediate optimization opportunities, and actionable recommendations you can implement right away.
              </p>

              {/* Benefits */}
              <h4 className={styles.benefitsHeadline}>Quick Wins Advantages</h4>

              <div className={styles.benefitsGrid}>
                {quickWinsBenefits.map((benefit, index) => (
                  <div key={index} className={styles.benefitItem}>
                    <div className={styles.benefitMarker}>✓</div>
                    <div className={styles.benefitContent}>
                      <h5 className={styles.benefitTitle}>{benefit.title}</h5>
                      <p className={styles.benefitDescription}>{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Custom Proposal Form */}
        <div className={styles.customProposalSection}>
          <div className={styles.proposalContainer}>
            <h3 className={styles.proposalTitle}>Not Sure What Support Is Best for You?</h3>
            <p className={styles.proposalSubtitle}>
              Describe your needs and I will contact you with the most efficient proposal suited to your goals.
            </p>

            <form 
              id="proposal-form"
              className={styles.proposalForm} 
              onSubmit={async (e) => {
              e.preventDefault();

              const form = e.currentTarget;
              const formData = new FormData(form);

              const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
              if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
              }

              try {
                const response = await fetch('/api/send-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    formType: 'proposal',
                    needs: formData.get('needs'),
                    website: formData.get('website'),
                    email: formData.get('email'),
                    marketing: formData.get('marketing') === 'on',
                  }),
                });

                if (response.ok) {
                  form.reset();
                  onSuccess?.();
                } else {
                  alert('Something went wrong. Please try again or email me directly at rafal@oleksiakconsulting.com');
                }
              } catch (error) {
                alert('Something went wrong. Please try again or email me directly at rafal@oleksiakconsulting.com');
                console.error('Network error:', error);
              } finally {
                if (submitButton) {
                  submitButton.disabled = false;
                  submitButton.textContent = 'Send Proposal Request';
                }
              }
            }}>

              {/* 2-Column Grid */}
              <div className={styles.formGrid}>

                {/* Left Column - Textarea */}
                <div className={`${styles.formColumn} ${styles.formColumnLeft}`}>
                  <div className={styles.formGroup}>
                    <label htmlFor="needs">Describe Your Needs *</label>
                    <textarea
                      id="needs"
                      name="needs"
                      rows={7}
                      placeholder="Tell me about your challenges, goals, and what you're looking to achieve..."
                      required
                    />
                  </div>
                </div>

                {/* Right Column - Stacked Inputs */}
                <div className={`${styles.formColumn} ${styles.formColumnRight}`}>
                  {/* Website URL */}
                  <div className={styles.formGroup}>
                    <label htmlFor="website">Your Website URL *</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      placeholder="https://yourwebsite.com"
                      required
                      autoComplete="url"
                      inputMode="url"
                    />
                  </div>

                  {/* Email */}
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Your Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your.email@company.com"
                      required
                      autoComplete="email"
                      inputMode="email"
                    />
                  </div>
                </div>

              </div>

              {/* Marketing Consent - Combined with LAMA Audit */}
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="marketing"
                  name="marketing"
                  className={styles.customCheckbox}
                />
                <label htmlFor="marketing" className={styles.checkboxLabel}>
                  <strong>Yes, send me a Free Website Audit</strong> (results in 90 seconds – 6 categories analyzed).
                  I also agree to receive marketing emails with best practices on lead acquisition, lead nurturing, CRM, and updates about my AI automation tools and offers.
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className={`${styles.ctaButton} ${styles.formSubmitButton}`}>
                Send Proposal Request
                <svg className={styles.arrowIcon} width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 3l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
