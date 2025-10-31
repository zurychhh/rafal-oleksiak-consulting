import Image from "next/image";
import styles from "./Bio.module.css";

export default function Bio() {
  return (
    <section className={styles.bioSection} id="bio">
      <div className={styles.bioContainer}>

        {/* TOP ROW: Name/Tagline LEFT + Photo RIGHT */}
        <div className={styles.topRow}>

          {/* LEFT: Name + Tagline */}
          <div className={styles.headerContent}>
            <h1 className={styles.bioName}>Rafał Oleksiak</h1>
            <h2 className={styles.bioTagline}>Transforming CRM & Automation into Revenue Engines</h2>
          </div>

          {/* RIGHT: Photo */}
          <div className={styles.photoColumn}>
            <div className={styles.photoContainer}>
              <Image
                src="/images/rafal-oleksiak.png"
                alt="Rafał Oleksiak - CRM and Marketing Automation Consultant"
                width={280}
                height={280}
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
            <h3 className={styles.blockTitle}>Enterprise-Scale CRM & Automation Leadership</h3>
            <p className={styles.blockContent}>
              Over 8 years leading CRM and Marketing Automation strategy for international corporations including Allegro, Accenture, and Booksy. Experience managing cross-functional teams of up to 15 specialists and overseeing multi-million dollar automation budgets. Deep expertise in both B2C marketplace ecosystems and B2B subscription models, with proven ability to deliver measurable business impact at enterprise scale.
            </p>
          </div>

          {/* Block 2 */}
          <div className={styles.expertiseBlock}>
            <h3 className={styles.blockTitle}>Digital Transformation & Agile Delivery</h3>
            <p className={styles.blockContent}>
              Specialized in end-to-end MarTech transformation projects, from strategic planning through implementation and optimization. Built and scaled marketing automation practices from ground zero, establishing teams, processes, and technology foundations that became revenue-driving engines. Expert in Agile/Scrum methodologies for marketing technology projects.
            </p>
          </div>

          {/* Block 3 */}
          <div className={styles.expertiseBlock}>
            <h3 className={styles.blockTitle}>Marketing Automation Education & Industry Authority</h3>
            <p className={styles.blockContent}>
              Marketing Automation Lead Instructor at LABA Business School and Guest Lecturer at Collegium Da Vinci in partnership with Nowy Marketing. Author of comprehensive marketing automation curriculum covering strategy, implementation, and optimization. Certified Salesforce Marketing Cloud Specialist with additional credentials.
            </p>
          </div>

        </div>

        {/* BOTTOM SECTION - CENTERED */}
        <div className={styles.bottomSection}>

          {/* Track Record Metrics */}
          <div className={styles.trackRecord}>
            <div className={styles.badge}>
              <div className={styles.metricNumber}>0.5% → 12%</div>
              <div className={styles.metricLabel}>revenue growth</div>
            </div>
            <div className={styles.badge}>
              <div className={styles.metricNumber}>$2M</div>
              <div className={styles.metricLabel}>managed</div>
            </div>
            <div className={styles.badge}>
              <div className={styles.metricNumber}>15-person</div>
              <div className={styles.metricLabel}>teams built</div>
            </div>
          </div>

          {/* Mission Statement */}
          <p className={styles.mission}>
            Mission: Turn your owned channels into your #1 revenue driver.
          </p>

          {/* Certifications */}
          <p className={styles.certifications}>
            Certifications: Salesforce Marketing Cloud • Six Sigma & Lean • AMA 5-Day MBA • GAQM Team Leader
          </p>

          {/* CTA Button */}
          <a href="#contact" className={styles.bioCta}>See Full Experience</a>

        </div>

      </div>
    </section>
  );
}
