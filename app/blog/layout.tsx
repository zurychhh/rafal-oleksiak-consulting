import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: 'Blog — Oleksiak Consulting',
  description: 'Insights on ecommerce conversion, CRM optimization, and marketing automation.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.blogWrapper}>
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
