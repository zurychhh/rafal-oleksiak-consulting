import Link from 'next/link';
import styles from './Accelerators.module.css';

const tools = [
  {
    id: 'auto-publish',
    status: 'live' as const,
    iconGradient: 'linear-gradient(135deg, #7B2CBF, #9D4EDD)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        <path d="M2 12l2-2" />
        <path d="M5 15l-2 2" />
        <circle cx="19" cy="19" r="2" />
      </svg>
    ),
    title: 'SEO Auto-Publish Engine',
    description:
      'AI writes, optimizes, and publishes SEO content on autopilot. Your blog grows organically while you focus on running your business.',
    features: [
      'AI-generated 1,500+ word articles with proper SEO structure',
      'Automatic publishing on schedule (daily, weekly, custom)',
      'Keyword targeting, meta tags, and readability optimization',
    ],
    href: '/auto-publish',
    ctaText: 'Explore Auto-Publish',
  },
  {
    id: 'ad-optimizer',
    status: 'progress' as const,
    iconGradient: 'linear-gradient(135deg, #0066FF, #00BFFF)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
        <path d="M13 15l2 2 4-4" />
      </svg>
    ),
    title: 'Ad Performance Optimizer',
    description:
      'AI-powered campaign analysis across Meta, Google, and LinkedIn. Automatically identifies underperforming ads and suggests budget reallocation.',
    features: [
      'Cross-platform campaign intelligence and budget optimization',
      'Creative performance scoring with AI recommendations',
      'Automated A/B testing insights and winner detection',
    ],
    href: null,
    ctaText: null,
  },
  {
    id: 'radar',
    status: 'progress' as const,
    iconGradient: 'linear-gradient(135deg, #EF4444, #F97316)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
      </svg>
    ),
    title: 'RADAR Competitor Intelligence',
    description:
      'AI scrapes and analyzes competitor websites. Get strategic intelligence on strengths, weaknesses, threats, and market gaps — delivered to your inbox.',
    features: [
      'Automated competitor website scraping and AI analysis',
      'Strengths, weaknesses, and threat level assessment per competitor',
      'Strategic action items and market gap identification',
    ],
    href: null,
    ctaText: null,
  },
  {
    id: 'crm-autopilot',
    status: 'progress' as const,
    iconGradient: 'linear-gradient(135deg, #10B981, #34D399)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'CRM Lifecycle Autopilot',
    description:
      'Automated customer journey orchestration. From lead scoring to churn prediction — your CRM works 24/7 with AI-driven workflows.',
    features: [
      'Predictive lead scoring that prioritizes high-intent prospects',
      'Automated lifecycle email sequences with dynamic personalization',
      'Churn risk detection 30 days before customers leave',
    ],
    href: null,
    ctaText: null,
  },
];

export default function Accelerators() {
  return (
    <section className={styles.acceleratorsSection} id="accelerators">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>Growth Accelerators</div>
          <h2 className={styles.headline}>Tools That Scale Your Revenue</h2>
          <p className={styles.subheadline}>
            Proprietary AI-powered tools built from real client challenges. Each one automates a
            revenue bottleneck so your team can focus on strategy, not operations.
          </p>
        </div>

        {/* Tools Grid */}
        <div className={styles.toolsGrid}>
          {tools.map((tool) => {
            const isLive = tool.status === 'live';
            const cardClass = `${styles.toolCard} ${isLive ? styles.toolCardActive : styles.toolCardBlurred}`;

            const cardContent = (
              <>
                {/* Coming Soon Overlay for blurred cards */}
                {!isLive && (
                  <div className={styles.comingSoonOverlay}>
                    <span className={styles.comingSoonBadge}>In Progress</span>
                    <span className={styles.comingSoonText}>Coming soon</span>
                  </div>
                )}

                <div className={styles.cardInner}>
                  {/* Status Badge */}
                  <div
                    className={`${styles.statusBadge} ${isLive ? styles.statusLive : styles.statusProgress}`}
                  >
                    <span
                      className={`${styles.statusDot} ${isLive ? styles.dotLive : styles.dotProgress}`}
                    />
                    {isLive ? 'Live' : 'In Progress'}
                  </div>

                  {/* Icon */}
                  <div className={styles.toolIcon} style={{ background: tool.iconGradient }}>
                    {tool.icon}
                  </div>

                  {/* Title */}
                  <h3 className={styles.toolTitle}>{tool.title}</h3>

                  {/* Description */}
                  <p className={styles.toolDescription}>{tool.description}</p>

                  {/* Features */}
                  <ul className={styles.featuresList}>
                    {tool.features.map((feature, i) => (
                      <li key={i} className={styles.featureItem}>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA label */}
                  {isLive && tool.ctaText && (
                    <span className={styles.toolCta}>
                      {tool.ctaText}
                      <span className={styles.toolCtaArrow}>&rarr;</span>
                    </span>
                  )}
                </div>
              </>
            );

            if (isLive && tool.href) {
              return (
                <Link key={tool.id} href={tool.href} className={`${cardClass} ${styles.toolCardLink}`}>
                  {cardContent}
                </Link>
              );
            }

            return (
              <article key={tool.id} className={cardClass}>
                {cardContent}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
