'use client';

import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function DashboardHome() {
  const router = useRouter();

  return (
    <div className={styles.dashboardHome}>
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
          </svg>
        </div>
        <h2 className={styles.welcomeTitle}>Welcome to RADAR</h2>
        <p className={styles.welcomeDescription}>
          Your competitive intelligence dashboard. Run scans to analyze competitors,
          track changes over time, and discover strategic opportunities.
        </p>
        <button
          onClick={() => router.push('/radar/dashboard/scan')}
          className={styles.welcomeCta}
        >
          Run Your First Scan
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Stats placeholder - will be populated with real data in Phase 3 */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>Total Scans</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>Competitors Tracked</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>--</span>
          <span className={styles.statLabel}>Avg Threat Level</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>--</span>
          <span className={styles.statLabel}>Position</span>
        </div>
      </div>
    </div>
  );
}
