"use client";

import { useState } from "react";
import styles from "./Collaboration.module.css";
import StatsTicker from "../ui/StatsTicker";

export default function Collaboration() {
  const [activeTab, setActiveTab] = useState<'partnership' | 'project'>('partnership');

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
            {activeTab === 'partnership' && (
              <span className={styles.durationBadge}>6-12+ MONTHS</span>
            )}
            Strategic Partnership
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'project' ? styles.active : ''}`}
            onClick={() => setActiveTab('project')}
            role="tab"
            aria-selected={activeTab === 'project'}
          >
            {activeTab === 'project' && (
              <span className={styles.durationBadge}>2-6 MONTHS</span>
            )}
            Project-Based Engagement
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

              {/* CTA Button */}
              <button className={`${styles.ctaButton} ${styles.partnershipCta}`}>
                Explore Partnership
              </button>

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

              {/* CTA Button */}
              <button className={`${styles.ctaButton} ${styles.projectCta}`}>
                Discuss Your Project
              </button>

            </div>
          )}

        </div>

        {/* Pricing Statement */}
        <div className={styles.pricingContainer}>
          <p className={styles.pricingText}>
            Investment tailored to your needs and expected ROI. Book free consultation to discuss scope and pricing customized to your business goals.
          </p>
          <button className={styles.scheduleButton}>
            Schedule a Call
          </button>
        </div>

      </div>

    </section>
  );
}
