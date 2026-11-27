import type { Metadata } from 'next';
import Link from 'next/link';
import { preload } from 'react-dom';
import styles from './blog.module.css';
import './blog-reset.css';

export const metadata: Metadata = {
  title: 'Blog — Oleksiak Consulting',
  description: 'Insights on ecommerce conversion, CRM optimization, and marketing automation.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Oleksiak Consulting',
    description: 'Insights on ecommerce conversion, CRM optimization, and marketing automation.',
    url: '/blog',
    type: 'website',
    images: ['/og.png'],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Naglowki bloga sa w Poppins 600/700 z font-display:swap — bez preloadu podmiana kroju
  // ok. 180 ms po wejsciu przesuwala logo, tytul i stan pusty (clsscroll-390 0,0135, 26.11).
  preload('/fonts/poppins-700-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  preload('/fonts/poppins-600-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  return (
    <div className={`${styles.blogWrapper} blog-root`}>
      <header className={styles.blogHeader}>
        <div className={styles.blogHeaderInner}>
          <Link href="/" className={styles.blogLogo}>
            Oleksiak Consulting
          </Link>
          <nav className={styles.blogNav}>
            <Link href="/" className={styles.blogNavLink}>Home</Link>
            <Link href="/blog" className={styles.blogNavLink}>Blog</Link>
            <Link href="/#contact" className={styles.blogNavLink}>Contact</Link>
          </nav>
        </div>
      </header>
      <main className={styles.blogMain}>{children}</main>
      <footer className={styles.blogFooter}>
        <p>&copy; {new Date().getFullYear()} Oleksiak Consulting. All rights reserved.</p>
      </footer>
    </div>
  );
}
