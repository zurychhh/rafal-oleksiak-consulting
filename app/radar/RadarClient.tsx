'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './radar.module.css';
import type { RadarReport } from '@/lib/radar/types';

function threatColor(level: string): string {
  if (level === 'high') return '#f87171';
  if (level === 'medium') return '#fbbf24';
  return '#4ade80';
}

function priorityColor(priority: string): string {
  if (priority === 'critical') return '#f87171';
  if (priority === 'high') return '#fb923c';
  if (priority === 'medium') return '#fbbf24';
  return '#4ade80';
}

function positionColor(position: string): string {
  if (position === 'leading') return '#4ade80';
  if (position === 'competitive') return '#60a5fa';
  if (position === 'catching_up') return '#fbbf24';
  return '#f87171';
}

export function RadarClient() {
  const [yourUrl, setYourUrl] = useState('');
  const [competitors, setCompetitors] = useState(['', '', '']);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<RadarReport | null>(null);
  const [phase, setPhase] = useState('');

  function addCompetitor() {
    if (competitors.length < 5) {
      setCompetitors([...competitors, '']);
    }
  }

  function removeCompetitor(index: number) {
    if (competitors.length > 1) {
      setCompetitors(competitors.filter((_, i) => i !== index));
    }
  }

  function updateCompetitor(index: number, value: string) {
    const updated = [...competitors];
    updated[index] = value;
    setCompetitors(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setReport(null);
    setLoading(true);

    const validCompetitors = competitors.filter(c => c.trim().length > 0);
    if (validCompetitors.length === 0) {
      setError('Add at least one competitor URL');
      setLoading(false);
      return;
    }

    const phases = [
      'Scanning your website...',
      'Scraping competitor sites...',
      'Running AI competitive analysis...',
      'Generating strategic insights...',
      'Preparing your report...',
    ];

    let phaseIndex = 0;
    setPhase(phases[0]);
    const phaseInterval = setInterval(() => {
      phaseIndex = Math.min(phaseIndex + 1, phases.length - 1);
      setPhase(phases[phaseIndex]);
    }, 8000);

    try {
      const response = await fetch('/api/radar/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yourUrl,
          competitorUrls: validCompetitors,
          email,
          fullName: fullName || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      clearInterval(phaseInterval);
      setLoading(false);
      setPhase('');
    }
  }

  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>
          Oleksiak Consulting
        </Link>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/blog" className={styles.navLink}>Blog</Link>
          <a
            href="https://calendly.com/rafaloleksiakconsulting/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navCta}
          >
            Book Call
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.heroGlow} />
        <span className={styles.badge}>AI-POWERED INTELLIGENCE</span>
        <h1 className={styles.heroTitle}>
          Know Your Competitors<br />
          <span className={styles.gradient}>Before They Know You.</span>
        </h1>
        <p className={styles.heroSub}>
          Enter your website and up to 5 competitors. AI scrapes, analyzes, and delivers
          strategic intelligence — strengths, weaknesses, threats, and action items — straight
          to your inbox.
        </p>
      </header>

      {/* Form */}
      {!report && (
        <section className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Your Website</label>
              <input
                type="text"
                className={styles.input}
                value={yourUrl}
                onChange={e => setYourUrl(e.target.value)}
                placeholder="e.g. mystore.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Competitors ({competitors.length}/5)
              </label>
              {competitors.map((c, i) => (
                <div key={i} className={styles.competitorRow}>
                  <input
                    type="text"
                    className={styles.input}
                    value={c}
                    onChange={e => updateCompetitor(i, e.target.value)}
                    placeholder={`competitor${i + 1}.com`}
                  />
                  {competitors.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeCompetitor(i)}
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
              {competitors.length < 5 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={addCompetitor}
                >
                  + Add Competitor
                </button>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email (for report)</label>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Name (optional)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  {phase}
                </>
              ) : (
                'Run RADAR Analysis'
              )}
            </button>

            <p className={styles.note}>
              Free analysis. Results + full report sent to your email.
              Takes 30-60 seconds.
            </p>
          </form>
        </section>
      )}

      {/* Results */}
      {report && (
        <section className={styles.results}>
          {/* Summary Bar */}
          <div className={styles.summaryBar}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{report.competitors.length}</span>
              <span className={styles.statLabel}>Competitors</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue} style={{ color: threatColor('high') }}>
                {report.competitors.filter(c => c.aiInsights.threatLevel === 'high').length}
              </span>
              <span className={styles.statLabel}>High Threats</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue} style={{ color: priorityColor('critical') }}>
                {report.strategicInsights.actionItems.filter(a => a.priority === 'critical').length}
              </span>
              <span className={styles.statLabel}>Critical Actions</span>
            </div>
            <div className={styles.stat}>
              <span
                className={styles.statValue}
                style={{ color: positionColor(report.strategicInsights.overallCompetitivePosition), fontSize: '18px', textTransform: 'capitalize' }}
              >
                {report.strategicInsights.overallCompetitivePosition.replace('_', ' ')}
              </span>
              <span className={styles.statLabel}>Your Position</span>
            </div>
          </div>

          {/* Strategic Assessment */}
          <div className={styles.strategicBox}>
            <span className={styles.sectionBadge}>Strategic Assessment</span>
            <p className={styles.strategicText}>
              {report.strategicInsights.positionReason}
            </p>
          </div>

          {/* Competitor Cards */}
          <h2 className={styles.sectionTitle}>Competitor Analysis</h2>
          {report.competitors.map((c, i) => {
            let hostname: string;
            try {
              hostname = new URL(c.url).hostname;
            } catch {
              hostname = c.url;
            }
            return (
              <div
                key={i}
                className={styles.competitorCard}
                style={{ borderLeftColor: threatColor(c.aiInsights.threatLevel) }}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{hostname}</h3>
                  <span
                    className={styles.threatBadge}
                    style={{ color: threatColor(c.aiInsights.threatLevel), borderColor: threatColor(c.aiInsights.threatLevel) }}
                  >
                    {c.aiInsights.threatLevel} threat
                  </span>
                </div>
                <p className={styles.positioning}>{c.aiInsights.positioning}</p>
                <p className={styles.threatReason}>{c.aiInsights.threatReason}</p>
                <div className={styles.cardColumns}>
                  <div>
                    <h4 className={styles.columnTitle} style={{ color: '#4ade80' }}>Their Strengths</h4>
                    {c.aiInsights.strengths.map((s, j) => (
                      <p key={j} className={styles.columnItem} style={{ borderLeftColor: 'rgba(74,222,128,0.4)' }}>{s}</p>
                    ))}
                  </div>
                  <div>
                    <h4 className={styles.columnTitle} style={{ color: '#f87171' }}>Their Weaknesses</h4>
                    {c.aiInsights.weaknesses.map((w, j) => (
                      <p key={j} className={styles.columnItem} style={{ borderLeftColor: 'rgba(248,113,113,0.4)' }}>{w}</p>
                    ))}
                  </div>
                </div>
                {c.aiInsights.uniqueAngles.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <h4 className={styles.columnTitle} style={{ color: '#818cf8' }}>Unique Angles</h4>
                    {c.aiInsights.uniqueAngles.map((a, j) => (
                      <p key={j} className={styles.columnItem} style={{ borderLeftColor: 'rgba(129,140,248,0.4)' }}>{a}</p>
                    ))}
                  </div>
                )}

                {/* Snapshot data */}
                <div className={styles.snapshotGrid}>
                  <span className={styles.snapshotItem}>
                    {c.snapshot.hasBlog ? 'Has Blog' : 'No Blog'}
                  </span>
                  <span className={styles.snapshotItem}>
                    {c.snapshot.hasPricing ? 'Has Pricing' : 'No Pricing'}
                  </span>
                  <span className={styles.snapshotItem}>
                    {c.snapshot.hasSocialProof ? 'Social Proof' : 'No Social Proof'}
                  </span>
                  <span className={styles.snapshotItem}>
                    {c.snapshot.contentLength} words
                  </span>
                  {c.snapshot.techStack.length > 0 && (
                    <span className={styles.snapshotItem}>
                      {c.snapshot.techStack.slice(0, 3).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Advantages & Vulnerabilities */}
          <div className={styles.avGrid}>
            <div className={styles.advantagesBox}>
              <h3 className={styles.avTitle} style={{ color: '#4ade80' }}>Your Advantages</h3>
              {report.strategicInsights.yourAdvantages.map((a, i) => (
                <p key={i} className={styles.avItem} style={{ borderLeftColor: 'rgba(74,222,128,0.4)' }}>{a}</p>
              ))}
            </div>
            <div className={styles.vulnerabilitiesBox}>
              <h3 className={styles.avTitle} style={{ color: '#f87171' }}>Your Vulnerabilities</h3>
              {report.strategicInsights.yourVulnerabilities.map((v, i) => (
                <p key={i} className={styles.avItem} style={{ borderLeftColor: 'rgba(248,113,113,0.4)' }}>{v}</p>
              ))}
            </div>
          </div>

          {/* Market Gaps */}
          {report.strategicInsights.marketGaps.length > 0 && (
            <div className={styles.marketGapsBox}>
              <h3 className={styles.avTitle} style={{ color: '#fbbf24' }}>Market Gaps to Exploit</h3>
              {report.strategicInsights.marketGaps.map((g, i) => (
                <p key={i} className={styles.gapItem}>{g}</p>
              ))}
            </div>
          )}

          {/* Action Items */}
          <h2 className={styles.sectionTitle}>Recommended Actions</h2>
          {report.strategicInsights.actionItems.map((item, i) => (
            <div key={i} className={styles.actionCard}>
              <span
                className={styles.priorityBadge}
                style={{ color: priorityColor(item.priority), background: `${priorityColor(item.priority)}15` }}
              >
                {item.priority}
              </span>
              <h4 className={styles.actionTitle}>{item.title}</h4>
              <p className={styles.actionDesc}>{item.description}</p>
              <p className={styles.actionImpact}>Expected impact: {item.estimatedImpact}</p>
            </div>
          ))}

          {/* CTA */}
          <div className={styles.ctaBox}>
            <h3 className={styles.ctaTitle}>Want to turn these insights into action?</h3>
            <p className={styles.ctaSub}>
              Book a free 30-min strategy call to discuss your competitive positioning.
            </p>
            <a
              href="https://calendly.com/rafaloleksiakconsulting/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
            >
              Book Free Strategy Call
            </a>
          </div>

          {/* Run Again */}
          <button
            className={styles.resetBtn}
            onClick={() => { setReport(null); setError(''); }}
          >
            Run Another Analysis
          </button>

          <p className={styles.footer}>
            Analysis completed in {(report.executionTime / 1000).toFixed(1)}s |
            Full report sent to your email
          </p>
        </section>
      )}
    </div>
  );
}
