import styles from "./StatsTicker.module.css";

export default function StatsTicker() {
  const metrics = [
    { number: "+11.5pp", text: "revenue growth" },
    { number: "$2M", text: "automation budget" },
    { number: "15-person", text: "team" },
    { number: "102%", text: "YoY growth" },
    { number: "34%", text: "YoY increase" },
    { number: "5 FTE", text: "optimized" },
    { number: "0.3pp", text: "conversion lift" },
    { number: "8+", text: "years experience" },
    { number: "1.5pp", text: "traffic increase" },
    { number: "1.2pp", text: "CTR improvement" },
    { number: "30%", text: "efficiency gain" },
    { number: "14%", text: "cost reduction" }
  ];

  // Duplicate metrics 4 times for seamless loop
  const allMetrics = [...metrics, ...metrics, ...metrics, ...metrics];

  return (
    <div className={styles.tickerContainer}>
      <div className={styles.tickerContent}>
        {allMetrics.map((metric, index) => (
          <span key={index} className={styles.metricGroup}>
            <span className={styles.metric}>
              <span className={styles.tickerNumber}>{metric.number}</span>
              <span className={styles.tickerText}> {metric.text}</span>
            </span>
            <span className={styles.separator}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
