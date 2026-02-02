'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './reports.module.css';

interface ReportSummary {
  id: string;
  yourUrl: string;
  overallPosition: 'leading' | 'competitive' | 'catching_up' | 'behind';
  competitorCount: number;
  highThreatCount: number;
  criticalActionCount: number;
  executionTime: number;
  createdAt: string;
}

interface ReportsResponse {
  reports: ReportSummary[];
  total: number;
  page: number;
  limit: number;
}

type LoadingState = 'loading' | 'idle' | 'error';

const POSITION_CONFIG = {
  leading: { label: 'Leading', color: '#4ade80' },
  competitive: { label: 'Competitive', color: '#60a5fa' },
  catching_up: { label: 'Catching Up', color: '#fbbf24' },
  behind: { label: 'Behind', color: '#f87171' },
};

export default function ReportsClient() {
  const router = useRouter();
  const [state, setState] = useState<LoadingState>('loading');
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    loadReports();
  }, [page]);

  const loadReports = async () => {
    setState('loading');
    try {
      const response = await fetch(`/api/radar/reports?page=${page}&limit=${limit}`);

      if (!response.ok) {
        throw new Error('Failed to load reports');
      }

      const data: ReportsResponse = await response.json();
      setReports(data.reports);
      setTotal(data.total);
      setState('idle');
    } catch (err) {
      setState('error');
      console.error('Failed to load reports:', err);
    }
  };

  const handleRowClick = (reportId: string) => {
    router.push(`/radar/dashboard/reports/${reportId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (ms: number) => {
    const seconds = Math.round(ms / 1000);
    return `${seconds}s`;
  };

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  if (state === 'loading') {
    return (
      <div className={styles.reportsPage}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className={styles.reportsPage}>
        <div className={styles.errorState}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2>Failed to load reports</h2>
          <button onClick={loadReports} className={styles.retryBtn}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className={styles.reportsPage}>
        <div className={styles.emptyState}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <h2 className={styles.emptyTitle}>No reports yet</h2>
          <p className={styles.emptyDescription}>
            Run your first competitive scan to get strategic insights
          </p>
          <button
            onClick={() => router.push('/radar/dashboard/scan')}
            className={styles.emptyBtn}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            Start Your First Scan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.reportsPage}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Scan Reports</h1>
          <p className={styles.subtitle}>
            View and analyze your competitive intelligence reports
          </p>
        </div>
        <button
          onClick={() => router.push('/radar/dashboard/scan')}
          className={styles.newScanBtn}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Scan
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Your URL</th>
              <th>Competitors</th>
              <th>Position</th>
              <th>Threats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                onClick={() => handleRowClick(report.id)}
                className={styles.tableRow}
              >
                <td className={styles.dateCell}>
                  {formatDate(report.createdAt)}
                  <span className={styles.timeCell}>
                    {formatTime(report.executionTime)}
                  </span>
                </td>
                <td className={styles.urlCell}>{report.yourUrl}</td>
                <td className={styles.countCell}>{report.competitorCount}</td>
                <td>
                  <span
                    className={styles.positionBadge}
                    style={{
                      background: `${POSITION_CONFIG[report.overallPosition].color}20`,
                      color: POSITION_CONFIG[report.overallPosition].color,
                    }}
                  >
                    {POSITION_CONFIG[report.overallPosition].label}
                  </span>
                </td>
                <td>
                  {report.highThreatCount > 0 ? (
                    <span className={styles.threatBadge}>
                      {report.highThreatCount}
                    </span>
                  ) : (
                    <span className={styles.noThreats}>None</span>
                  )}
                </td>
                <td>
                  {report.criticalActionCount > 0 ? (
                    <span className={styles.actionBadge}>
                      {report.criticalActionCount}
                    </span>
                  ) : (
                    <span className={styles.noActions}>0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={!hasPrevPage}
            className={styles.paginationBtn}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!hasNextPage}
            className={styles.paginationBtn}
          >
            Next
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
