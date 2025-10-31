import styles from "./SectionBreaker.module.css";

export default function SectionBreaker() {
  return (
    <section id="section-breaker-1" className={styles.sectionBreaker}>
      <div className={styles.breakerContainer}>
        <div className={styles.breakerBadgeLeft}></div>
        <div className={styles.breakerLine}></div>
        <div className={styles.breakerBadgeRight}></div>
      </div>
    </section>
  );
}
