'use client'

import styles from "./Footer.module.css";
import { analytics } from '@/app/lib/analytics'

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
              Increasing conversions through UX optimization, marketing automation,
              and data-driven CRM for ecommerce and scale-up companies.
            </p>

            <div className={styles.socialLinks}>
              <a
                href="https://www.linkedin.com/in/rafa%C5%82-oleksiak-3b322981/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <span>in</span>
              </a>
              <a
                href="mailto:rafal@oleksiakconsulting.com"
                className={styles.socialLink}
                aria-label="Email"
              >
                <span>@</span>
              </a>
            </div>

            {/* Contact Information */}
            <div className={styles.contactInfo}>
              <p className={styles.contactItem}>
                <a href="mailto:rafal@oleksiakconsulting.com" className={styles.contactLink}>
                  rafal@oleksiakconsulting.com
                </a>
              </p>
              <p className={styles.contactItem}>
                <a href="tel:+48571903167" className={styles.contactLink}>
                  +48 571 903 167
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Services</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="#revenue-driving-services" className={styles.footerLink}>
                  CRM Strategy
                </a>
              </li>
              <li>
                <a href="#revenue-driving-services" className={styles.footerLink}>
                  Marketing Automation
                </a>
              </li>
              <li>
                <a href="#revenue-driving-services" className={styles.footerLink}>
                  Email Automation
                </a>
              </li>
              <li>
                <a href="#revenue-driving-services" className={styles.footerLink}>
                  Customer Retention
                </a>
              </li>
              <li>
                <a href="#revenue-driving-services" className={styles.footerLink}>
                  Analytics & Optimization
                </a>
              </li>
              <li>
                <a href="#revenue-driving-services" className={styles.footerLink}>
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
                <a href="#transformation-results" className={styles.footerLink}>
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#how-we-work" className={styles.footerLink}>
                  Methodologies
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
                <a href="#free-consultation" className={styles.footerLink}>
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="https://calendly.com/rafaloleksiakconsulting/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                  onClick={() => analytics.trackCalendlyClick('footer')}
                >
                  Book Consultation
                </a>
              </li>
              <li>
                <a href="/privacy" className={styles.footerLink}>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © 2026 Rafał Oleksiak. All rights reserved.
            {' · '}
            <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
