import styles from "./GradientBreaker.module.css";

export default function GradientBreaker() {
  return (
    <section className={styles.sectionBreaker}>
      <div className={styles.breakerContainer}>
        <div className={styles.gradientLine}>
          <span className={styles.lineCap}></span>
          <span className={styles.lineCapRight}></span>
        </div>
      </div>
    </section>
  );
}
