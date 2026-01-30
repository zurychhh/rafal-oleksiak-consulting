import styles from "./ExpertiseBreaker.module.css";

export default function ExpertiseBreaker() {
  const tags = [
    "◆ UX & Conversion Optimization",
    "◆ CRM Strategy",
    "◆ Marketing Automation",
    "◆ Traffic Optimization",
    "◆ Data Analytics",
    "◆ Lifecycle Management",
    "◆ Lead Generation",
    "◆ Process Automation",
    "◆ Paid → Free Traffic",
    "◆ AI/ML Integration",
    "◆ Omnichannel",
    "◆ Churn Prevention"
  ];

  return (
    <section className={styles.expertiseBreaker}>
      <div className={styles.scrollingContainer}>
        <div className={styles.tagsWrapper}>
          {/* First set of tags */}
          {tags.map((tag, index) => (
            <span key={`tag-1-${index}`} className={styles.tag}>
              {tag}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {tags.map((tag, index) => (
            <span key={`tag-2-${index}`} className={styles.tag}>
              {tag}
            </span>
          ))}
          {/* Triple for extra smooth infinite scroll */}
          {tags.map((tag, index) => (
            <span key={`tag-3-${index}`} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
