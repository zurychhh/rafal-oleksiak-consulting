import styles from "./ExpertiseBreaker.module.css";

export default function ExpertiseBreaker() {
  const tags = [
    "◆ CRM Strategy",
    "◆ Marketing Automation",
    "◆ Data Analytics",
    "◆ Personalization",
    "◆ Lead Generation",
    "◆ Customer Lifecycle",
    "◆ Digital Transformation",
    "◆ AI/ML Integration",
    "◆ Omnichannel",
    "◆ Process Optimization",
    "◆ Churn Prevention",
    "◆ Behavioral Segmentation"
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
