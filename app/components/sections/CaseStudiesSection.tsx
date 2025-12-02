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
      title: "From 0.5% to 12%: Scaling Allegro's Automation Revenue",
      challenge: "Allegro's marketing automation generated just 0.5% of total revenue despite €50M+ investment. Leadership demanded 10x growth or shutdown.",
      result: "Scaled automation from 0.5% to 12% revenue contribution in 18 months. Built 15-person team. Managed $2M budget. 102% YoY growth.",
      heroMetric: "+11.5pp",
      metricLabel: "REVENUE GROWTH",
      badges: ["102% YoY Growth", "$2M Budget", "15-Person Team", "AI/ML Integration"]
    },
    {
      badge: "ALLEGRO",
      title: "34% Revenue Growth Through Omnichannel Strategy",
      challenge: "Customer touchpoints siloed across 8 channels. No single customer view. Rates lagged 15-20% behind benchmarks.",
      result: "Unified 8 channels. Delivered 34% YoY revenue, 1.2pp CTR, 1.5pp traffic growth. Cross-departmental alignment became best practice.",
      heroMetric: "34%",
      metricLabel: "YOY REVENUE GROWTH",
      badges: ["1.2pp CTR Lift", "1.5pp Traffic Increase", "Omnichannel Alignment", "Cross-departmental"]
    },
    {
      badge: "BOOKSY",
      title: "30% Efficiency + 14% Cost Reduction in B2B Funnel",
      challenge: "B2B funnel broken: 60% drop-off at demo request, 40% no-show rate, 90-day sales cycles. Growth stalled at 15% YoY.",
      result: "Rebuilt funnel: drop-off 60%→35%, no-show 40%→18%, cycle 90→62 days. Result: 0.3pp conversion, 30% efficiency, 14% cost reduction. Global standard.",
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
          <h2 className={styles.headline}>Proven Results</h2>
          <p className={styles.subheadline}>
            11.5pp revenue growth. 34% YoY increase. 30% efficiency gain. These aren't projections - they're results.
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
