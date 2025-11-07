import styles from "./CaseStudiesSection.module.css";
import CertificationsTicker from "../ui/CertificationsTicker";

interface CaseStudy {
  badge: string;
  title: string;
  challenge: string;
  result: string;
  heroMetric: string;
  metricLabel: string;
  badges: string[];
}

export default function CaseStudiesSection() {
  const caseStudies: CaseStudy[] = [
    {
      badge: "ALLEGRO",
      title: "Building Enterprise-Scale Automation",
      challenge: "Untapped revenue opportunity in owned channels - automation delivering less than 1% of total company revenue",
      result: "Transformed automation into primary revenue driver, scaling from 0.5% to 12% of company revenue (+11.5pp growth). Built 15-person team and managed $2M budget while integrating AI/ML capabilities for predictive personalization.",
      heroMetric: "+11.5pp",
      metricLabel: "REVENUE GROWTH",
      badges: ["102% YoY Growth", "$2M Budget", "15-Person Team", "AI/ML Integration"]
    },
    {
      badge: "ALLEGRO",
      title: "Traffic & Conversion Excellence",
      challenge: "Fragmented customer communication across channels with suboptimal traffic and conversion performance",
      result: "Orchestrated omnichannel communication strategy delivering 34% year-over-year revenue growth and 1.2pp CTR improvement through cross-departmental alignment and data-driven optimization.",
      heroMetric: "34%",
      metricLabel: "YOY REVENUE GROWTH",
      badges: ["1.2pp CTR Lift", "1.5pp Traffic Increase", "Omnichannel Alignment", "Cross-departmental"]
    },
    {
      badge: "BOOKSY",
      title: "B2B SaaS Conversion Excellence",
      challenge: "Suboptimal conversion path limiting growth of SaaS subscription base",
      result: "Optimized full B2B funnel from prospect to paying customer, achieving 0.3pp conversion rate improvement while establishing CRM procedures that improved go-to-market efficiency by 30% and reduced costs by 14%.",
      heroMetric: "+0.3pp",
      metricLabel: "CONVERSION LIFT",
      badges: ["30% Efficiency Gain", "14% Cost Reduction", "B2B SaaS Expertise", "Full Funnel Optimization"]
    }
  ];

  return (
    <section className={styles.caseStudiesSection} id="transformation-results">

      {/* Certifications Ticker */}
      <CertificationsTicker />

      {/* Section Container */}
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headline}>Transformation Results</h2>
          <p className={styles.subheadline}>
            Real projects. Real numbers. Real growth.
          </p>
        </div>

        {/* Case Study Cards Grid */}
        <div className={styles.cardsGrid}>
          {caseStudies.map((study, index) => (
            <div key={index} className={styles.card}>

              {/* Company Badge */}
              <span className={styles.companyBadge}>
                {study.badge}
              </span>

              {/* Card Title */}
              <h3 className={styles.cardTitle}>{study.title}</h3>

              {/* Challenge Box */}
              <div className={styles.challengeBox}>
                <div className={styles.challengeLabel}>CHALLENGE:</div>
                <p className={styles.challengeText}>{study.challenge}</p>
              </div>

              {/* Result Box */}
              <div className={styles.resultBox}>
                <div className={styles.resultLabel}>RESULT:</div>
                <p className={styles.resultText}>{study.result}</p>
              </div>

              {/* Hero Metric */}
              <div className={styles.metricBackdrop}>
                <span className="gradient-number">{study.heroMetric}</span>
              </div>
              <div className={styles.metricLabel}>{study.metricLabel}</div>

              {/* Metrics Badges */}
              <div className={styles.metricsBadges}>
                {study.badges.map((badge, badgeIndex) => (
                  <span key={badgeIndex} className={styles.metricBadge}>
                    {badge}
                  </span>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
