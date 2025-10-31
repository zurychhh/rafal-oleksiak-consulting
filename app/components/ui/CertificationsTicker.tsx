import styles from "./CertificationsTicker.module.css";

export default function CertificationsTicker() {
  const certifications = [
    "✅ Salesforce Marketing Cloud",
    "✅ Six Sigma & Lean",
    "✅ GAQM Team Leader",
    "✅ Scrum Master",
    "📚 AMA 5-Day MBA",
    "🎓 LABA Instructor",
    "🎓 Collegium Da Vinci Lecturer",
    "🌐 English: Business Level",
    "🏆 8+ Years Industry Leader"
  ];

  // Duplicate certifications 2 times for seamless loop
  const allCertifications = [...certifications, ...certifications];

  return (
    <div className={styles.tickerContainer}>
      <div className={styles.tickerContent}>
        {allCertifications.map((cert, index) => (
          <span key={index} className={styles.certGroup}>
            <span className={styles.certification}>{cert}</span>
            <span className={styles.separator}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
