import styles from "./CompanyCarousel.module.css";

export default function CompanyCarousel() {
  const companies = [
    { name: "Accenture", badge: null },
    { name: "McDonald's", badge: null },
    { name: "Booksy", badge: null },
    { name: "Mall", badge: null },
    { name: "mBank", badge: null },
    { name: "Travelist", badge: null },
    { name: "Collegium Da Vinci", badge: "LECTURER" },
    { name: "LABA", badge: "LECTURER" },
    { name: "Allegro", badge: null },
  ];

  return (
    <section className={styles.carouselSection}>
      <div className={styles.carouselContainer}>

        {/* Carousel Track - FIRST (brands scroll here) */}
        <div className={styles.carouselTrack}>

          {/* Logo Strip - Duplicated 3 times for seamless loop */}
          <div className={styles.logoStrip}>

            {/* First set */}
            {companies.map((company, index) => (
              <div key={`set1-${index}`} className={styles.logoWrapper}>
                <div className={styles.logoItem}>
                  <span className={styles.companyName}>{company.name}</span>
                  {company.badge && (
                    <span className={styles.badge}>{company.badge}</span>
                  )}
                </div>
                {/* Divider after each item except we'll handle in CSS */}
              </div>
            ))}

            {/* Second set (duplicate for seamless loop) */}
            {companies.map((company, index) => (
              <div key={`set2-${index}`} className={styles.logoWrapper}>
                <div className={styles.logoItem}>
                  <span className={styles.companyName}>{company.name}</span>
                  {company.badge && (
                    <span className={styles.badge}>{company.badge}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Third set (duplicate for seamless loop) */}
            {companies.map((company, index) => (
              <div key={`set3-${index}`} className={styles.logoWrapper}>
                <div className={styles.logoItem}>
                  <span className={styles.companyName}>{company.name}</span>
                  {company.badge && (
                    <span className={styles.badge}>{company.badge}</span>
                  )}
                </div>
              </div>
            ))}

          </div>

        </div>

        {/* Label Text - SECOND (below carousel) */}
        <p className={styles.carouselLabel}>
          Trusted by industry leaders across e-commerce, finance, SaaS, and enterprise
        </p>

      </div>
    </section>
  );
}
