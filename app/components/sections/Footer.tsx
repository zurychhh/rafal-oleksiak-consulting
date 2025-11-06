import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer id="site-footer" className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Grid */}
        <div className={styles.grid}>
          {/* Column 1: Brand */}
          <div className={styles.brandColumn}>
            <div className={styles.logo}>
              <span className={styles.logoText}>OLEKSIAK CONSULT</span>
              <div className={styles.dots}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
            </div>

            <p className={styles.description}>
              Transforming CRM & Marketing Automation into revenue engines for
              enterprise and scale-up companies.
            </p>

            <div className={styles.socialLinks}>
              <a
                href="https://www.linkedin.com/in/rafal-oleksiak"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <span>in</span>
              </a>
              <a
                href="mailto:contact@oleksiakconsulting.com"
                className={styles.socialLink}
                aria-label="Email"
              >
                <span>@</span>
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Services</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="#services" className={styles.footerLink}>
                  CRM Strategy
                </a>
              </li>
              <li>
                <a href="#services" className={styles.footerLink}>
                  Marketing Automation
                </a>
              </li>
              <li>
                <a href="#services" className={styles.footerLink}>
                  Email Automation
                </a>
              </li>
              <li>
                <a href="#services" className={styles.footerLink}>
                  Customer Retention
                </a>
              </li>
              <li>
                <a href="#services" className={styles.footerLink}>
                  Analytics & Optimization
                </a>
              </li>
              <li>
                <a href="#services" className={styles.footerLink}>
                  Team Training
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Work */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Work</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="#case-studies" className={styles.footerLink}>
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#process" className={styles.footerLink}>
                  Methodologies
                </a>
              </li>
              <li>
                <a href="#case-studies" className={styles.footerLink}>
                  Client Results
                </a>
              </li>
              <li>
                <a href="#case-studies" className={styles.footerLink}>
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Company</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="#bio" className={styles.footerLink}>
                  About Rafał
                </a>
              </li>
              <li>
                <a href="#bio" className={styles.footerLink}>
                  Teaching & Speaking
                </a>
              </li>
              <li>
                <a href="#final-cta-form" className={styles.footerLink}>
                  Contact
                </a>
              </li>
              <li>
                <a href="#final-cta-form" className={styles.footerLink}>
                  Book Consultation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © 2025 Rafał Oleksiak. All rights reserved.
          </p>

          <div className={styles.legalLinks}>
            <a href="#" className={styles.legalLink}>
              Privacy Policy
            </a>
            <a href="#" className={styles.legalLink}>
              Terms of Service
            </a>
            <a href="#" className={styles.legalLink}>
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
