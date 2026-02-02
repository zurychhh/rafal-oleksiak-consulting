'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

interface Report {
  id: string;
  createdAt: string;
  url: string;
  competitivePosition: 'leading' | 'competitive' | 'catching_up' | 'behind';
  competitorCount: number;
  highThreatCount: number;
}

interface User {
  email: string;
  name?: string;
}

interface DashboardStats {
  totalScans: number;
  competitorsTracked: number;
  avgPosition: string;
  highThreats: number;
}

export default function DashboardHome() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch reports and user data in parallel
        const [reportsRes, userRes] = await Promise.all([
          fetch('/api/radar/reports?limit=5'),
          fetch('/api/radar/auth/me')
        ]);

        if (!reportsRes.ok) {
          throw new Error('Failed to fetch reports');
        }

        const reportsData = await reportsRes.json();
        const reportsList = reportsData.reports || [];
        setReports(reportsList);

        // User endpoint might not be ready yet, handle gracefully
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        // Calculate stats from reports
        if (reportsList.length > 0) {
          const uniqueUrls = new Set(reportsList.map((r: Report) => r.url));
          const totalThreats = reportsList.reduce((sum: number, r: Report) => sum + r.highThreatCount, 0);

          // Calculate average position (numerical for sorting)
          const positionValues: Record<string, number> = {
            'leading': 4,
            'competitive': 3,
            'catching_up': 2,
            'behind': 1
          };
          const avgPositionValue = reportsList.reduce((sum: number, r: Report) =>
            sum + positionValues[r.competitivePosition], 0) / reportsList.length;

          let avgPositionText = 'Competitive';
          if (avgPositionValue >= 3.5) avgPositionText = 'Leading';
          else if (avgPositionValue >= 2.5) avgPositionText = 'Competitive';
          else if (avgPositionValue >= 1.5) avgPositionText = 'Catching Up';
          else avgPositionText = 'Behind';

          setStats({
            totalScans: reportsList.length,
            competitorsTracked: uniqueUrls.size,
            avgPosition: avgPositionText,
            highThreats: totalThreats
          });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  function getPositionBadgeClass(position: string) {
    switch (position) {
      case 'leading': return styles.badgeLeading;
      case 'competitive': return styles.badgeCompetitive;
      case 'catching_up': return styles.badgeCatching;
      case 'behind': return styles.badgeBehind;
      default: return styles.badgeCompetitive;
    }
  }

  function formatPosition(position: string) {
    switch (position) {
      case 'leading': return 'Leading';
      case 'competitive': return 'Competitive';
      case 'catching_up': return 'Catching Up';
      case 'behind': return 'Behind';
      default: return position;
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  if (loading) {
    return (
      <div className={styles.pageLoading}>
        <div className={styles.pageSpinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>⚠️</div>
        <h3 className={styles.emptyTitle}>Error Loading Dashboard</h3>
        <p className={styles.emptyDescription}>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.emptyBtn}>
          Try Again
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
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
            <span className={styles.statLabel}>Avg Position</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>High Threats</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardHome}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats?.totalScans || 0}</span>
          <span className={styles.statLabel}>Total Scans</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats?.competitorsTracked || 0}</span>
          <span className={styles.statLabel}>Competitors Tracked</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats?.avgPosition || '--'}</span>
          <span className={styles.statLabel}>Avg Position</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats?.highThreats || 0}</span>
          <span className={styles.statLabel}>High Threats</span>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className={styles.recentScansCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Recent Scans</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Competitor URL</th>
                <th>Position</th>
                <th>Threats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  onClick={() => router.push(`/radar/dashboard/reports/${report.id}`)}
                >
                  <td className={styles.dateCell}>{formatDate(report.createdAt)}</td>
                  <td className={styles.urlCell}>{report.url}</td>
                  <td>
                    <span className={`${styles.badge} ${getPositionBadgeClass(report.competitivePosition)}`}>
                      {formatPosition(report.competitivePosition)}
                    </span>
                  </td>
                  <td className={styles.threatCell}>
                    {report.highThreatCount > 0 ? (
                      <span className={styles.threatCount}>
                        {report.highThreatCount} high
                      </span>
                    ) : (
                      <span className={styles.threatNone}>None</span>
                    )}
                  </td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/radar/dashboard/reports/${report.id}`);
                      }}
                    >
                      View
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Card */}
      <div className={styles.ctaCard}>
        <div className={styles.ctaIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
        <div className={styles.ctaContent}>
          <h3 className={styles.ctaTitle}>Ready for Another Scan?</h3>
          <p className={styles.ctaDescription}>
            Analyze a new competitor or re-scan an existing one to track changes.
          </p>
        </div>
        <button
          onClick={() => router.push('/radar/dashboard/scan')}
          className={styles.ctaButton}
        >
          Run New Scan
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
