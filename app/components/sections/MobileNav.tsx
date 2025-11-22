"use client";
import { useState } from 'react';
import styles from './MobileNav.module.css';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    // Close menu and let browser handle anchor navigation
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button - Only visible on mobile/tablet */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.hamburgerBtn}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <span className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}></span>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <nav className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <a
              href="#revenue-driving-services"
              onClick={handleLinkClick}
              className={styles.mobileLink}
            >
              SERVICES
            </a>
            <a
              href="#transformation-results"
              onClick={handleLinkClick}
              className={styles.mobileLink}
            >
              WORK
            </a>
            <a
              href="#how-we-work"
              onClick={handleLinkClick}
              className={styles.mobileLink}
            >
              PROCESS
            </a>
            <a
              href="#lama-audit"
              onClick={handleLinkClick}
              className={styles.mobileLink}
            >
              FREE AUDIT
            </a>
            <a
              href="#contact"
              onClick={handleLinkClick}
              className={styles.mobileLink}
            >
              CONTACT
            </a>
            <a
              href="https://calendly.com/rafaloleksiakconsulting/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className={styles.mobileCTA}
            >
              BOOK CONSULTATION
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
