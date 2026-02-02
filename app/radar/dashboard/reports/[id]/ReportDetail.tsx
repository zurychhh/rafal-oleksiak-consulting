'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { RadarReport } from '@/lib/radar/types';
import styles from './report-detail.module.css';

interface ReportDetailProps {
  reportId: string;
}

type LoadingState = 'loading' | 'idle' | 'error' | 'not-found';

const POSITION_CONFIG = {
  leading: { label: 'Leading', color: '#4ade80' },
  competitive: { label: 'Competitive', color: '#60a5fa' },
  catching_up: { label: 'Catching Up', color: '#fbbf24' },
  behind: { label: 'Behind', color: '#f87171' },
};

const THREAT_CONFIG = {
  high: { label: 'High', color: '#f87171' },
  medium: { label: 'Medium', color: '#fbbf24' },
  low: { label: 'Low', color: '#4ade80' },
};

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: '#f87171' },
  high: { label: 'High', color: '#fb923c' },
  medium: { label: 'Medium', color: '#fbbf24' },
  low: { label: 'Low', color: '#4ade80' },
};

export default function ReportDetail({ reportId }: ReportDetailProps) {
  const router = useRouter();
  const [state, setState] = useState<LoadingState>('loading');
  const [report, setReport] = useState<RadarReport | null>(null);
  const [expandedCompetitor, setExpandedCompetitor] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    setState('loading');
    try {
      const response = await fetch(`/api/radar/reports/${reportId}`);

      if (response.status === 404) {
        setState('not-found');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load report');
      }

      const data: RadarReport = await response.json();
      setReport(data);
      setState('idle');
    } catch (err) {
      setState('error');
      console.error('Failed to load report:', err);
    }
  };

  const handleRunAgain = () => {
    router.push('/radar/dashboard/scan');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (ms: number) => {
    const seconds = Math.round(ms / 1000);
    return `${seconds}s`;
  };

  const toggleCompetitor = (url: string) => {
    setExpandedCompetitor(expandedCompetitor === url ? null : url);
  };

  if (state === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading report...</p>
      </div>
    );
  }

  if (state === 'not-found') {
    return (
      <div className={styles.errorContainer}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2>Report Not Found</h2>
        <p>The report you're looking for doesn't exist or has been deleted.</p>
        <button onClick={() => router.push('/radar/dashboard/reports')} className={styles.backBtn}>
          Back to Reports
        </button>
      </div>
    );
  }

  if (state === 'error' || !report) {
    return (
      <div className={styles.errorContainer}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2>Failed to Load Report</h2>
        <p>An error occurred while loading the report. Please try again.</p>
        <button onClick={loadReport} className={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  const highThreatCount = report.competitors.filter((c) => c.aiInsights.threatLevel === 'high').length;
  const criticalActions = report.strategicInsights.actionItems.filter((a) => a.priority === 'critical').length;

  return (
    <div className={styles.reportPage}>
      {/* Header */}
      <div className={styles.reportHeader}>
        <div>
          <h1 className={styles.reportTitle}>{report.yourUrl}</h1>
          <p className={styles.reportMeta}>
            Analyzed on {formatDate(report.analyzedAt)} • Execution time: {formatTime(report.executionTime)}
          </p>
        </div>
        <button onClick={handleRunAgain} className={styles.runAgainBtn}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Run Again
        </button>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            <span
              className={styles.positionBadge}
              style={{
                background: `${POSITION_CONFIG[report.strategicInsights.overallCompetitivePosition].color}20`,
                color: POSITION_CONFIG[report.strategicInsights.overallCompetitivePosition].color,
              }}
            >
              {POSITION_CONFIG[report.strategicInsights.overallCompetitivePosition].label}
            </span>
          </div>
          <div className={styles.statLabel}>Your Position</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{report.competitors.length}</div>
          <div className={styles.statLabel}>Competitors Analyzed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{highThreatCount}</div>
          <div className={styles.statLabel}>High Threats</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{criticalActions}</div>
          <div className={styles.statLabel}>Critical Actions</div>
        </div>
      </div>

      {/* Strategic Assessment */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Strategic Assessment</h2>
        <div className={styles.assessmentContent}>
          <span
            className={styles.assessmentBadge}
            style={{
              background: `${POSITION_CONFIG[report.strategicInsights.overallCompetitivePosition].color}20`,
              color: POSITION_CONFIG[report.strategicInsights.overallCompetitivePosition].color,
            }}
          >
            {POSITION_CONFIG[report.strategicInsights.overallCompetitivePosition].label}
          </span>
          <p className={styles.assessmentText}>{report.strategicInsights.positionReason}</p>
        </div>
      </div>

      {/* Advantages vs Vulnerabilities */}
      <div className={styles.twoColumn}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your Advantages</h2>
          <ul className={styles.list}>
            {report.strategicInsights.yourAdvantages.map((advantage, idx) => (
              <li key={idx} className={styles.listItem}>
                <svg
                  className={styles.iconGreen}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your Vulnerabilities</h2>
          <ul className={styles.list}>
            {report.strategicInsights.yourVulnerabilities.map((vulnerability, idx) => (
              <li key={idx} className={styles.listItem}>
                <svg
                  className={styles.iconRed}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                <span>{vulnerability}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market Gaps */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Market Gaps & Opportunities</h2>
        <ul className={styles.list}>
          {report.strategicInsights.marketGaps.map((gap, idx) => (
            <li key={idx} className={styles.listItem}>
              <svg
                className={styles.iconYellow}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span>{gap}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Competitors */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Competitor Analysis</h2>
        <div className={styles.competitorList}>
          {report.competitors.map((competitor) => (
            <div key={competitor.url} className={styles.competitorCard}>
              <div
                className={styles.competitorHeader}
                onClick={() => toggleCompetitor(competitor.url)}
              >
                <div className={styles.competitorInfo}>
                  <h3 className={styles.competitorUrl}>{competitor.url}</h3>
                  <span
                    className={styles.threatBadge}
                    style={{
                      background: `${THREAT_CONFIG[competitor.aiInsights.threatLevel].color}20`,
                      color: THREAT_CONFIG[competitor.aiInsights.threatLevel].color,
                    }}
                  >
                    {THREAT_CONFIG[competitor.aiInsights.threatLevel].label} Threat
                  </span>
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`${styles.expandIcon} ${expandedCompetitor === competitor.url ? styles.expandIconOpen : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              <p className={styles.positioning}>{competitor.aiInsights.positioning}</p>

              {expandedCompetitor === competitor.url && (
                <div className={styles.competitorDetails}>
                  <div className={styles.detailSection}>
                    <h4 className={styles.detailTitle}>Strengths</h4>
                    <ul className={styles.detailList}>
                      {competitor.aiInsights.strengths.map((strength, idx) => (
                        <li key={idx} className={styles.detailItem}>
                          <svg
                            className={styles.iconGreen}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.detailSection}>
                    <h4 className={styles.detailTitle}>Weaknesses</h4>
                    <ul className={styles.detailList}>
                      {competitor.aiInsights.weaknesses.map((weakness, idx) => (
                        <li key={idx} className={styles.detailItem}>
                          <svg
                            className={styles.iconRed}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.detailSection}>
                    <h4 className={styles.detailTitle}>Unique Angles</h4>
                    <ul className={styles.detailList}>
                      {competitor.aiInsights.uniqueAngles.map((angle, idx) => (
                        <li key={idx} className={styles.detailItem}>
                          <svg
                            className={styles.iconBlue}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.25M15.54 15.54l4.24 4.25M1 12h6M17 12h6M4.22 19.78l4.24-4.25M15.54 8.46l4.24-4.25" />
                          </svg>
                          {angle}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Recommended Actions</h2>
        <div className={styles.actionList}>
          {report.strategicInsights.actionItems
            .sort((a, b) => {
              const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((action, idx) => (
              <div key={idx} className={styles.actionItem}>
                <div className={styles.actionHeader}>
                  <span
                    className={styles.priorityBadge}
                    style={{
                      background: `${PRIORITY_CONFIG[action.priority].color}20`,
                      color: PRIORITY_CONFIG[action.priority].color,
                    }}
                  >
                    {PRIORITY_CONFIG[action.priority].label}
                  </span>
                  <h3 className={styles.actionTitle}>{action.title}</h3>
                </div>
                <p className={styles.actionDescription}>{action.description}</p>
                <div className={styles.actionImpact}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  <span>Impact: {action.estimatedImpact}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className={styles.footerCta}>
        <button onClick={handleRunAgain} className={styles.footerBtn}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Run Another Scan
        </button>
      </div>
    </div>
  );
}
