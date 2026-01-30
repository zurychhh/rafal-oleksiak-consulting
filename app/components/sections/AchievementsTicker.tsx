import styles from "./AchievementsTicker.module.css";

export default function AchievementsTicker() {
  const achievements = [
    "Automation channel 0.5% → 12%",
    "Built 15-person team",
    "€2M budget managed",
    "102% YoY growth achieved",
    "Hebe MarTech transformation",
    "AI/ML integration",
    "B2B funnel +0.3pp",
    "30% efficiency improvement",
    "Cross-departmental alignment",
    "Enterprise-scale implementation",
    "Data-driven optimization",
    "Predictive modeling"
  ];

  return (
    <section className={styles.achievementsTicker}>
      <div className={styles.tickerWrapper}>
        <div className={styles.tickerContent}>
          {/* First set */}
          {achievements.map((achievement, index) => (
            <span key={`achievement-1-${index}`}>
              <span className={styles.tickerItem}>{achievement}</span>
              <span className={styles.tickerSeparator}>•</span>
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {achievements.map((achievement, index) => (
            <span key={`achievement-2-${index}`}>
              <span className={styles.tickerItem}>{achievement}</span>
              <span className={styles.tickerSeparator}>•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
