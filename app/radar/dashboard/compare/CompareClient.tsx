'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './compare.module.css';

interface ReportListItem {
  id: string;
  createdAt: string;
  url: string;
  competitivePosition: 'leading' | 'competitive' | 'catching_up' | 'behind';
}

interface Competitor {
  url: string;
  threatLevel: 'high' | 'medium' | 'low';
}

interface StrategicInsights {
  advantages: string[];
  vulnerabilities: string[];
}

interface ActionItem {
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface ReportDetail {
  id: string;
  createdAt: string;
  url: string;
  competitivePosition: 'leading' | 'competitive' | 'catching_up' | 'behind';
  competitorCount: number;
  highThreatCount: number;
  competitors: Competitor[];
  strategicInsights: StrategicInsights;
  actionItems: ActionItem[];
}

type ChangeDirection = 'improved' | 'declined' | 'same';

export default function CompareClient() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [reportA, setReportA] = useState<ReportDetail | null>(null);
  const [reportB, setReportB] = useState<ReportDetail | null>(null);
  const [selectedA, setSelectedA] = useState<string>('');
  const [selectedB, setSelectedB] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/radar/reports?limit=50');
        if (!res.ok) {
          throw new Error('Failed to fetch reports');
        }

        const data = await res.json();
        setReports(data.reports || []);
      } catch (err) {
        console.error('Reports fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  async function handleCompare() {
    if (!selectedA || !selectedB) return;

    try {
      setComparing(true);
      setError(null);

      const [resA, resB] = await Promise.all([
        fetch(`/api/radar/reports/${selectedA}`),
        fetch(`/api/radar/reports/${selectedB}`)
      ]);

      if (!resA.ok || !resB.ok) {
        throw new Error('Failed to fetch report details');
      }

      const [dataA, dataB] = await Promise.all([
        resA.json(),
        resB.json()
      ]);

      setReportA(dataA);
      setReportB(dataB);
    } catch (err) {
      console.error('Compare error:', err);
      setError(err instanceof Error ? err.message : 'Failed to compare reports');
    } finally {
      setComparing(false);
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

  function getPositionValue(position: string): number {
    switch (position) {
      case 'leading': return 4;
      case 'competitive': return 3;
      case 'catching_up': return 2;
      case 'behind': return 1;
      default: return 0;
    }
  }

  function getPositionLabel(position: string): string {
    switch (position) {
      case 'leading': return 'Leading';
      case 'competitive': return 'Competitive';
      case 'catching_up': return 'Catching Up';
      case 'behind': return 'Behind';
      default: return position;
    }
  }

  function comparePosition(): { direction: ChangeDirection; change: number } {
    if (!reportA || !reportB) return { direction: 'same', change: 0 };
    const valueA = getPositionValue(reportA.competitivePosition);
    const valueB = getPositionValue(reportB.competitivePosition);
    const change = valueB - valueA;

    if (change > 0) return { direction: 'improved', change };
    if (change < 0) return { direction: 'declined', change: Math.abs(change) };
    return { direction: 'same', change: 0 };
  }

  function compareMetric(valueA: number, valueB: number): ChangeDirection {
    if (valueB > valueA) return 'improved';
    if (valueB < valueA) return 'declined';
    return 'same';
  }

  function getChangeIcon(direction: ChangeDirection) {
    if (direction === 'improved') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      );
    }
    if (direction === 'declined') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      );
    }
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
      </svg>
    );
  }

  function getChangeClass(direction: ChangeDirection) {
    switch (direction) {
      case 'improved': return styles.changeImproved;
      case 'declined': return styles.changeDeclined;
      case 'same': return styles.changeSame;
    }
  }

  if (loading) {
    return (
      <div className={styles.pageLoading}>
        <div className={styles.pageSpinner}></div>
      </div>
    );
  }

  if (error && reports.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>⚠️</div>
        <h3 className={styles.emptyTitle}>Error Loading Reports</h3>
        <p className={styles.emptyDescription}>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.emptyBtn}>
          Try Again
        </button>
      </div>
    );
  }

  if (reports.length < 2) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </div>
        <h3 className={styles.emptyTitle}>Not Enough Data</h3>
        <p className={styles.emptyDescription}>
          Run at least 2 scans to use the comparison tool.
        </p>
        <button onClick={() => router.push('/radar/dashboard/scan')} className={styles.emptyBtn}>
          Run Another Scan
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  const positionChange = reportA && reportB ? comparePosition() : null;

  return (
    <div className={styles.comparePage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Compare Reports</h1>
        <p className={styles.pageDescription}>
          Compare two competitive intelligence reports side-by-side
        </p>
      </div>

      {/* Selectors */}
      <div className={styles.selectorCard}>
        <div className={styles.selectorGroup}>
          <label className={styles.selectorLabel}>Report A (Earlier)</label>
          <select
            value={selectedA}
            onChange={(e) => setSelectedA(e.target.value)}
            className={styles.selector}
          >
            <option value="">Select a report...</option>
            {reports.map((report) => (
              <option key={report.id} value={report.id}>
                {formatDate(report.createdAt)} - {report.url}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.selectorDivider}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        <div className={styles.selectorGroup}>
          <label className={styles.selectorLabel}>Report B (Later)</label>
          <select
            value={selectedB}
            onChange={(e) => setSelectedB(e.target.value)}
            className={styles.selector}
          >
            <option value="">Select a report...</option>
            {reports.map((report) => (
              <option key={report.id} value={report.id}>
                {formatDate(report.createdAt)} - {report.url}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCompare}
          disabled={!selectedA || !selectedB || comparing}
          className={styles.compareBtn}
        >
          {comparing ? 'Comparing...' : 'Compare'}
        </button>
      </div>

      {/* Comparison Results */}
      {reportA && reportB && (
        <div className={styles.comparisonResults}>
          {/* Position Comparison */}
          <div className={styles.comparisonCard}>
            <h3 className={styles.comparisonTitle}>Competitive Position</h3>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonCol}>
                <span className={styles.comparisonLabel}>Report A</span>
                <span className={styles.comparisonValue}>{getPositionLabel(reportA.competitivePosition)}</span>
              </div>
              {positionChange && (
                <div className={`${styles.comparisonChange} ${getChangeClass(positionChange.direction)}`}>
                  {getChangeIcon(positionChange.direction)}
                  {positionChange.direction !== 'same' && (
                    <span>{positionChange.change} level{positionChange.change > 1 ? 's' : ''}</span>
                  )}
                </div>
              )}
              <div className={styles.comparisonCol}>
                <span className={styles.comparisonLabel}>Report B</span>
                <span className={styles.comparisonValue}>{getPositionLabel(reportB.competitivePosition)}</span>
              </div>
            </div>
          </div>

          {/* Competitor Count */}
          <div className={styles.comparisonCard}>
            <h3 className={styles.comparisonTitle}>Competitor Count</h3>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonCol}>
                <span className={styles.comparisonLabel}>Report A</span>
                <span className={styles.comparisonValue}>{reportA.competitorCount}</span>
              </div>
              <div className={`${styles.comparisonChange} ${getChangeClass(compareMetric(reportA.competitorCount, reportB.competitorCount))}`}>
                {getChangeIcon(compareMetric(reportA.competitorCount, reportB.competitorCount))}
                <span>{Math.abs(reportB.competitorCount - reportA.competitorCount)}</span>
              </div>
              <div className={styles.comparisonCol}>
                <span className={styles.comparisonLabel}>Report B</span>
                <span className={styles.comparisonValue}>{reportB.competitorCount}</span>
              </div>
            </div>
          </div>

          {/* High Threat Count */}
          <div className={styles.comparisonCard}>
            <h3 className={styles.comparisonTitle}>High Threats</h3>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonCol}>
                <span className={styles.comparisonLabel}>Report A</span>
                <span className={styles.comparisonValue}>{reportA.highThreatCount}</span>
              </div>
              <div className={`${styles.comparisonChange} ${getChangeClass(
                compareMetric(reportB.highThreatCount, reportA.highThreatCount) // Reversed: fewer threats is better
              )}`}>
                {getChangeIcon(compareMetric(reportB.highThreatCount, reportA.highThreatCount))}
                <span>{Math.abs(reportB.highThreatCount - reportA.highThreatCount)}</span>
              </div>
              <div className={styles.comparisonCol}>
                <span className={styles.comparisonLabel}>Report B</span>
                <span className={styles.comparisonValue}>{reportB.highThreatCount}</span>
              </div>
            </div>
          </div>

          {/* Strategic Insights Diff */}
          <div className={styles.comparisonCard}>
            <h3 className={styles.comparisonTitle}>Strategic Insights Changes</h3>
            <div className={styles.insightsDiff}>
              <div className={styles.insightsSection}>
                <h4 className={styles.insightsSectionTitle}>
                  <span className={styles.insightsIconGained}>+</span>
                  Advantages Gained
                </h4>
                {reportB.strategicInsights.advantages
                  .filter(adv => !reportA.strategicInsights.advantages.includes(adv))
                  .map((adv, index) => (
                    <div key={index} className={styles.insightItem}>
                      <span className={styles.insightBullet}>•</span>
                      {adv}
                    </div>
                  ))}
                {reportB.strategicInsights.advantages.filter(adv => !reportA.strategicInsights.advantages.includes(adv)).length === 0 && (
                  <p className={styles.insightEmpty}>No new advantages</p>
                )}
              </div>

              <div className={styles.insightsSection}>
                <h4 className={styles.insightsSectionTitle}>
                  <span className={styles.insightsIconLost}>−</span>
                  Advantages Lost
                </h4>
                {reportA.strategicInsights.advantages
                  .filter(adv => !reportB.strategicInsights.advantages.includes(adv))
                  .map((adv, index) => (
                    <div key={index} className={styles.insightItem}>
                      <span className={styles.insightBullet}>•</span>
                      {adv}
                    </div>
                  ))}
                {reportA.strategicInsights.advantages.filter(adv => !reportB.strategicInsights.advantages.includes(adv)).length === 0 && (
                  <p className={styles.insightEmpty}>No lost advantages</p>
                )}
              </div>

              <div className={styles.insightsSection}>
                <h4 className={styles.insightsSectionTitle}>
                  <span className={styles.insightsIconGained}>+</span>
                  New Vulnerabilities
                </h4>
                {reportB.strategicInsights.vulnerabilities
                  .filter(vuln => !reportA.strategicInsights.vulnerabilities.includes(vuln))
                  .map((vuln, index) => (
                    <div key={index} className={styles.insightItem}>
                      <span className={styles.insightBullet}>•</span>
                      {vuln}
                    </div>
                  ))}
                {reportB.strategicInsights.vulnerabilities.filter(vuln => !reportA.strategicInsights.vulnerabilities.includes(vuln)).length === 0 && (
                  <p className={styles.insightEmpty}>No new vulnerabilities</p>
                )}
              </div>

              <div className={styles.insightsSection}>
                <h4 className={styles.insightsSectionTitle}>
                  <span className={styles.insightsIconResolved}>✓</span>
                  Resolved Vulnerabilities
                </h4>
                {reportA.strategicInsights.vulnerabilities
                  .filter(vuln => !reportB.strategicInsights.vulnerabilities.includes(vuln))
                  .map((vuln, index) => (
                    <div key={index} className={styles.insightItem}>
                      <span className={styles.insightBullet}>•</span>
                      {vuln}
                    </div>
                  ))}
                {reportA.strategicInsights.vulnerabilities.filter(vuln => !reportB.strategicInsights.vulnerabilities.includes(vuln)).length === 0 && (
                  <p className={styles.insightEmpty}>No resolved vulnerabilities</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Items Comparison */}
          <div className={styles.comparisonCard}>
            <h3 className={styles.comparisonTitle}>Action Items</h3>
            <div className={styles.actionsSideBySide}>
              <div className={styles.actionsColumn}>
                <h4 className={styles.actionsColumnTitle}>Report A ({reportA.actionItems.length})</h4>
                <div className={styles.actionsList}>
                  {reportA.actionItems.slice(0, 5).map((action, index) => (
                    <div key={index} className={styles.actionItem}>
                      <span className={`${styles.actionPriority} ${styles[`priority${action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}`]}`}>
                        {action.priority}
                      </span>
                      <span className={styles.actionTitle}>{action.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.actionsColumn}>
                <h4 className={styles.actionsColumnTitle}>Report B ({reportB.actionItems.length})</h4>
                <div className={styles.actionsList}>
                  {reportB.actionItems.slice(0, 5).map((action, index) => (
                    <div key={index} className={styles.actionItem}>
                      <span className={`${styles.actionPriority} ${styles[`priority${action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}`]}`}>
                        {action.priority}
                      </span>
                      <span className={styles.actionTitle}>{action.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State when no comparison */}
      {!reportA && !reportB && !comparing && selectedA === '' && selectedB === '' && (
        <div className={styles.emptyComparison}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <p className={styles.emptyComparisonText}>Select two reports above to compare</p>
        </div>
      )}
    </div>
  );
}
