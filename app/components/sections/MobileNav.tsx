"use client";
import { useState } from 'react';
import styles from './MobileNav.module.css';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');

    // If it's an external link (Calendly), just close menu and let it open
    if (href?.startsWith('http')) {
      setIsOpen(false);
      return;
    }

    // For anchor links, handle lazy-loaded sections
    if (href?.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);

      // Function to wait for element and scroll
      const scrollToElement = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close menu after scroll starts
          setTimeout(() => setIsOpen(false), 100);
        } else {
          // If element doesn't exist yet, wait for it to be lazy-loaded
          const observer = new MutationObserver(() => {
            const element = document.getElementById(targetId);
            if (element) {
              observer.disconnect();
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setTimeout(() => setIsOpen(false), 100);
            }
          });

          // Observe the entire document for changes
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });

          // Fallback: stop observing after 3 seconds
          setTimeout(() => {
            observer.disconnect();
            setIsOpen(false);
          }, 3000);
        }
      };

      scrollToElement();
    }
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
              href="#free-consultation"
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
