'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './trends.module.css';

interface TrendDataPoint {
  date: string;
  position: number; // 1-4: behind, catching_up, competitive, leading
  competitorCount: number;
  highThreatCount: number;
  criticalActionCount: number;
}

interface CompetitorFrequency {
  url: string;
  count: number;
  avgThreatLevel: 'high' | 'medium' | 'low';
}

interface ThreatDistribution {
  high: number;
  medium: number;
  low: number;
}

interface TrendsData {
  timeline: TrendDataPoint[];
  topCompetitors: CompetitorFrequency[];
  threatDistribution: ThreatDistribution;
}

export default function TrendsClient() {
  const router = useRouter();
  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrends() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/radar/trends');
        if (!res.ok) {
          throw new Error('Failed to fetch trends data');
        }

        const trendsData = await res.json();
        setData(trendsData);
      } catch (err) {
        console.error('Trends fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load trends data');
      } finally {
        setLoading(false);
      }
    }

    fetchTrends();
  }, []);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  function getPositionLabel(position: number) {
    switch (position) {
      case 4: return 'Leading';
      case 3: return 'Competitive';
      case 2: return 'Catching Up';
      case 1: return 'Behind';
      default: return 'Unknown';
    }
  }

  function getThreatBadgeClass(level: string) {
    switch (level) {
      case 'high': return styles.badgeThreatHigh;
      case 'medium': return styles.badgeThreatMedium;
      case 'low': return styles.badgeThreatLow;
      default: return styles.badgeThreatMedium;
    }
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
        <h3 className={styles.emptyTitle}>Error Loading Trends</h3>
        <p className={styles.emptyDescription}>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.emptyBtn}>
          Try Again
        </button>
      </div>
    );
  }

  if (!data || data.timeline.length < 2) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
          </svg>
        </div>
        <h3 className={styles.emptyTitle}>Not Enough Data Yet</h3>
        <p className={styles.emptyDescription}>
          Run at least 2 scans to see trends and track changes over time.
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

  // Calculate chart dimensions and scales
  const chartWidth = 800;
  const chartHeight = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Position chart calculations
  const positionPoints = data.timeline.map((point, index) => {
    const x = padding.left + (index / (data.timeline.length - 1)) * innerWidth;
    const y = padding.top + ((4 - point.position) / 3) * innerHeight;
    return { x, y, date: point.date, position: point.position };
  });

  const positionPath = positionPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const positionAreaPath = `${positionPath} L ${positionPoints[positionPoints.length - 1].x} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;

  // Metrics chart calculations
  const maxMetric = Math.max(
    ...data.timeline.map(d => Math.max(d.competitorCount, d.highThreatCount, d.criticalActionCount))
  );

  const metricsPoints = {
    competitors: data.timeline.map((point, index) => ({
      x: padding.left + (index / (data.timeline.length - 1)) * innerWidth,
      y: padding.top + ((maxMetric - point.competitorCount) / maxMetric) * innerHeight
    })),
    threats: data.timeline.map((point, index) => ({
      x: padding.left + (index / (data.timeline.length - 1)) * innerWidth,
      y: padding.top + ((maxMetric - point.highThreatCount) / maxMetric) * innerHeight
    })),
    actions: data.timeline.map((point, index) => ({
      x: padding.left + (index / (data.timeline.length - 1)) * innerWidth,
      y: padding.top + ((maxMetric - point.criticalActionCount) / maxMetric) * innerHeight
    }))
  };

  const createPath = (points: Array<{ x: number; y: number }>) =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Threat distribution percentages
  const totalThreats = data.threatDistribution.high + data.threatDistribution.medium + data.threatDistribution.low;
  const threatPercentages = {
    high: totalThreats > 0 ? (data.threatDistribution.high / totalThreats) * 100 : 0,
    medium: totalThreats > 0 ? (data.threatDistribution.medium / totalThreats) * 100 : 0,
    low: totalThreats > 0 ? (data.threatDistribution.low / totalThreats) * 100 : 0
  };

  return (
    <div className={styles.trendsPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Competitive Trends</h1>
        <p className={styles.pageDescription}>
          Track your competitive position and threat levels over time
        </p>
      </div>

      {/* Position Over Time Chart */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Position Over Time</h3>
        <p className={styles.chartSubtitle}>Your competitive standing relative to analyzed competitors</p>
        <div className={styles.chartContainer}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className={styles.chart}>
            <defs>
              <linearGradient id="positionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.3)" />
                <stop offset="100%" stopColor="rgba(239, 68, 68, 0.05)" />
              </linearGradient>
            </defs>

            {/* Y-axis labels */}
            <text x={padding.left - 10} y={padding.top} className={styles.axisLabel} textAnchor="end">Leading</text>
            <text x={padding.left - 10} y={padding.top + innerHeight / 3} className={styles.axisLabel} textAnchor="end">Competitive</text>
            <text x={padding.left - 10} y={padding.top + (2 * innerHeight) / 3} className={styles.axisLabel} textAnchor="end">Catching Up</text>
            <text x={padding.left - 10} y={chartHeight - padding.bottom} className={styles.axisLabel} textAnchor="end">Behind</text>

            {/* Grid lines */}
            <line x1={padding.left} y1={padding.top} x2={chartWidth - padding.right} y2={padding.top} className={styles.gridLine} />
            <line x1={padding.left} y1={padding.top + innerHeight / 3} x2={chartWidth - padding.right} y2={padding.top + innerHeight / 3} className={styles.gridLine} />
            <line x1={padding.left} y1={padding.top + (2 * innerHeight) / 3} x2={chartWidth - padding.right} y2={padding.top + (2 * innerHeight) / 3} className={styles.gridLine} />
            <line x1={padding.left} y1={chartHeight - padding.bottom} x2={chartWidth - padding.right} y2={chartHeight - padding.bottom} className={styles.gridLine} />

            {/* Area fill */}
            <path d={positionAreaPath} fill="url(#positionGradient)" />

            {/* Line */}
            <path d={positionPath} className={styles.positionLine} />

            {/* Data points */}
            {positionPoints.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={5}
                  className={styles.dataPoint}
                />
                <title>{formatDate(point.date)}: {getPositionLabel(point.position)}</title>
              </g>
            ))}

            {/* X-axis labels */}
            {positionPoints.map((point, index) => (
              <text
                key={index}
                x={point.x}
                y={chartHeight - padding.bottom + 20}
                className={styles.axisLabel}
                textAnchor="middle"
              >
                {formatDate(point.date)}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* Threat Distribution */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Threat Distribution</h3>
        <p className={styles.chartSubtitle}>Breakdown of competitive threats by severity level</p>
        <div className={styles.threatBar}>
          <div className={styles.threatSegmentHigh} style={{ width: `${threatPercentages.high}%` }}>
            {threatPercentages.high > 10 && <span>{data.threatDistribution.high}</span>}
          </div>
          <div className={styles.threatSegmentMedium} style={{ width: `${threatPercentages.medium}%` }}>
            {threatPercentages.medium > 10 && <span>{data.threatDistribution.medium}</span>}
          </div>
          <div className={styles.threatSegmentLow} style={{ width: `${threatPercentages.low}%` }}>
            {threatPercentages.low > 10 && <span>{data.threatDistribution.low}</span>}
          </div>
        </div>
        <div className={styles.threatLegend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDotHigh}></span>
            <span className={styles.legendLabel}>High ({data.threatDistribution.high})</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDotMedium}></span>
            <span className={styles.legendLabel}>Medium ({data.threatDistribution.medium})</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDotLow}></span>
            <span className={styles.legendLabel}>Low ({data.threatDistribution.low})</span>
          </div>
        </div>
      </div>

      {/* Top Competitors */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Top Competitors</h3>
        <p className={styles.chartSubtitle}>Most frequently scanned competitor URLs</p>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Competitor URL</th>
                <th>Scan Count</th>
                <th>Avg Threat Level</th>
              </tr>
            </thead>
            <tbody>
              {data.topCompetitors.map((competitor, index) => (
                <tr key={index}>
                  <td className={styles.urlCell}>{competitor.url}</td>
                  <td className={styles.countCell}>{competitor.count}</td>
                  <td>
                    <span className={`${styles.badge} ${getThreatBadgeClass(competitor.avgThreatLevel)}`}>
                      {competitor.avgThreatLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metrics Over Time */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Metrics Over Time</h3>
        <p className={styles.chartSubtitle}>Track key competitive intelligence metrics</p>
        <div className={styles.chartContainer}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className={styles.chart}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1={padding.left}
                y1={padding.top + (i * innerHeight) / 4}
                x2={chartWidth - padding.right}
                y2={padding.top + (i * innerHeight) / 4}
                className={styles.gridLine}
              />
            ))}

            {/* Lines */}
            <path d={createPath(metricsPoints.competitors)} className={styles.metricsLineCompetitors} />
            <path d={createPath(metricsPoints.threats)} className={styles.metricsLineThreats} />
            <path d={createPath(metricsPoints.actions)} className={styles.metricsLineActions} />

            {/* Data points */}
            {metricsPoints.competitors.map((point, index) => (
              <circle key={`c-${index}`} cx={point.x} cy={point.y} r={4} className={styles.dataPointCompetitors} />
            ))}
            {metricsPoints.threats.map((point, index) => (
              <circle key={`t-${index}`} cx={point.x} cy={point.y} r={4} className={styles.dataPointThreats} />
            ))}
            {metricsPoints.actions.map((point, index) => (
              <circle key={`a-${index}`} cx={point.x} cy={point.y} r={4} className={styles.dataPointActions} />
            ))}

            {/* X-axis labels */}
            {data.timeline.map((point, index) => (
              <text
                key={index}
                x={padding.left + (index / (data.timeline.length - 1)) * innerWidth}
                y={chartHeight - padding.bottom + 20}
                className={styles.axisLabel}
                textAnchor="middle"
              >
                {formatDate(point.date)}
              </text>
            ))}
          </svg>
        </div>
        <div className={styles.metricsLegend}>
          <div className={styles.legendItem}>
            <span className={styles.legendLineCompetitors}></span>
            <span className={styles.legendLabel}>Competitors</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendLineThreats}></span>
            <span className={styles.legendLabel}>High Threats</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendLineActions}></span>
            <span className={styles.legendLabel}>Critical Actions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
