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
            <h3 className={styles.bioTagline}>15 Years Turning Ecommerce Traffic into Revenue</h3>
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
                fetchPriority="high"
                quality={90}
              />
            </div>
          </div>

        </div>

        {/* 3 EXPERTISE BLOCKS - HORIZONTAL */}
        <div className={styles.expertiseBlocks}>

          {/* Block 1 */}
          <div className={styles.expertiseBlock}>
            <h3 className={styles.blockTitle}>15 Years in Ecommerce. Practitioner, Not Just Consultant.</h3>
            <p className={styles.blockContent}>
              I've led conversion and CRM strategy at Allegro, Accenture, Booksy, and mBank. Built 15-person teams, managed €2M+ budgets. I don't give presentations — I ship results: 11.5pp revenue growth, 102% YoY increase, 30% efficiency gains.
            </p>
          </div>

          {/* Block 2 */}
          <div className={styles.expertiseBlock}>
            <h3 className={styles.blockTitle}>From Zero to 12% Revenue: Full-Funnel Execution</h3>
            <p className={styles.blockContent}>
              I build from scratch — websites, automation programs, lifecycle systems. At Allegro and Booksy I took automation from 0% to 10%+ revenue in 18 months. UX, traffic optimization, CRM, automation — full-stack delivery with data as the first source of truth.
            </p>
          </div>

          {/* Block 3 */}
          <div className={styles.expertiseBlock}>
            <h3 className={styles.blockTitle}>Sharing What Works: Instructor at LABA & Collegium Da Vinci</h3>
            <p className={styles.blockContent}>
              I teach what I practice. Lead Instructor at LABA Business School (Warsaw), Guest Lecturer at Collegium Da Vinci. 200+ students trained on real-world automation frameworks — no theory, only battle-tested playbooks. Salesforce Marketing Cloud certified.
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
              <span className="gradient-number" style={{ fontSize: '40px' }}>€2M</span>
              <div className={styles.metricLabel}>managed</div>
            </div>
            <div className={styles.badge}>
              <span className="gradient-number" style={{ fontSize: '40px' }}>15-person</span>
              <div className={styles.metricLabel}>teams built</div>
            </div>
          </div>

          {/* Mission Statement */}
          <p className={styles.mission}>
            Mission: More conversions, less ad spend. Real actions, not presentations.
          </p>

        </div>

        </div> {/* End bioCard */}

      </div>
    </section>
  );
}
