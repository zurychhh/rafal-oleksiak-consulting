import Image from "next/image";
import styles from "./Bio.module.css";

export default function Bio() {
  return (
    <section className={styles.bioSection} id="bio">
      <div className={styles.bioContainer}>

        {/* Bio Card with Animated Border */}
        <div className={styles.bioCard}>

        {/* TOP ROW: Name/Tagline LEFT + Photo RIGHT */}
        <div className={styles.topRow}>

          {/* LEFT: Name + Tagline */}
          <div className={styles.headerContent}>
            <h2 className={styles.bioName}>Rafał Oleksiak</h2>
            <h3 className={styles.bioTagline}>Transforming CRM & Automation into Revenue Engines</h3>
          </div>

          {/* RIGHT: Photo */}
          <div className={styles.photoColumn}>
            <div className={styles.photoContainer}>
              <Image
                src="/images/rafal-oleksiak.png"
                alt="Rafał Oleksiak - CRM and Marketing Automation Consultant"
                width={280}
                height={280}
                sizes="(max-width: 480px) 180px, (max-width: 768px) 220px, (max-width: 1024px) 260px, 280px"
                className={styles.bioPhoto}
                priority
              />
            </div>
          </div>

        </div>

        {/* 3 EXPERTISE BLOCKS - HORIZONTAL */}
        <div className={styles.expertiseBlocks}>

          {/* Block 1 */}
          <div className={styles.expertiseBlock}>
            <h3 className={styles.blockTitle}>8+ Years Leading CRM at €Billion-Scale Companies</h3>
            <p className={styles.blockContent}>
              I've led CRM strategy at Allegro (Poland's #1 marketplace), Accenture (global consulting), and Booksy (B2B SaaS). Built and managed 15-person teams, $2M+ budgets. Results: 11.5pp revenue growth, 102% YoY increase, 30% efficiency gains.
            </p>
          </div>

          {/* Block 2 */}
          <div className={styles.expertiseBlock}>
            <h3 className={styles.blockTitle}>From Zero to 12% Revenue: Building Automation Programs</h3>
            <p className={styles.blockContent}>
              I don't just consult – I build. I've launched 3 automation programs from scratch (Allegro, Booksy, Jameel Motors), taking them from 0% to 10%+ revenue contribution in 18 months. Full-stack delivery: strategy → implementation → optimization.
            </p>
          </div>

          {/* Block 3 */}
          <div className={styles.expertiseBlock}>
            <h3 className={styles.blockTitle}>Teaching Marketing Automation at Top Business Schools</h3>
            <p className={styles.blockContent}>
              Lead Instructor at LABA Business School (Warsaw), Guest Lecturer at Collegium Da Vinci. I created the marketing automation curriculum from scratch – now used by 200+ students. Salesforce Marketing Cloud certified.
            </p>
          </div>

        </div>

        {/* BOTTOM SECTION - CENTERED */}
        <div className={styles.bottomSection}>

          {/* Track Record Metrics */}
          <div className={styles.trackRecord}>
            <div className={styles.badge}>
              <span className="gradient-number" style={{ fontSize: '40px' }}>0.5% → 12%</span>
              <div className={styles.metricLabel}>revenue growth</div>
            </div>
            <div className={styles.badge}>
              <span className="gradient-number" style={{ fontSize: '40px' }}>$2M</span>
              <div className={styles.metricLabel}>managed</div>
            </div>
            <div className={styles.badge}>
              <span className="gradient-number" style={{ fontSize: '40px' }}>15-person</span>
              <div className={styles.metricLabel}>teams built</div>
            </div>
          </div>

          {/* Mission Statement */}
          <p className={styles.mission}>
            Mission: Turn your owned channels into your #1 revenue driver.
          </p>

        </div>

        </div> {/* End bioCard */}

      </div>
    </section>
  );
}
