"use client";
import { useState, useEffect } from 'react';
import styles from './MobileNav.module.css';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();

    // First, restore scroll ability
    document.body.style.overflow = 'unset';

    // Close menu
    setIsOpen(false);

    // Then scroll to target after a brief delay to ensure menu is closing
    setTimeout(() => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
              onClick={(e) => handleLinkClick(e, 'revenue-driving-services')}
              className={styles.mobileLink}
            >
              SERVICES
            </a>
            <a
              href="#transformation-results"
              onClick={(e) => handleLinkClick(e, 'transformation-results')}
              className={styles.mobileLink}
            >
              WORK
            </a>
            <a
              href="#how-we-work"
              onClick={(e) => handleLinkClick(e, 'how-we-work')}
              className={styles.mobileLink}
            >
              PROCESS
            </a>
            <a
              href="#free-consultation"
              onClick={(e) => handleLinkClick(e, 'free-consultation')}
              className={styles.mobileLink}
            >
              CONTACT
            </a>
            <a
              href="https://calendly.com/rafaloleksiakconsulting/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
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
