'use client';

import { useState } from 'react';
import Link from 'next/link';
import type {
  PostResponse,
  AgentResponse,
  ScheduleResponse,
  ScheduleStats,
  TenantResponse,
  TenantUsageResponse,
} from '@/lib/blog/types';
import styles from '../../../admin.module.css';

const API_URL = process.env.NEXT_PUBLIC_BLOG_API_URL;

/** Compute a composite SEO score (0-100) for a single post */
function computeSeoScore(post: PostResponse): number {
  let score = 0;
  let maxScore = 0;

  // 1. Word count (25 pts) — 1500+ words = full marks
  maxScore += 25;
  const wc = post.word_count ?? 0;
  if (wc >= 1500) score += 25;
  else if (wc >= 1000) score += 20;
  else if (wc >= 600) score += 12;
  else if (wc >= 300) score += 6;

  // 2. Meta title (15 pts) — present + 30-60 chars optimal
  maxScore += 15;
  const mt = post.meta_title ?? '';
  if (mt.length > 0) {
    score += 7;
    if (mt.length >= 30 && mt.length <= 65) score += 8;
    else if (mt.length >= 20 && mt.length <= 80) score += 4;
  }

  // 3. Meta description (15 pts) — present + 120-160 chars optimal
  maxScore += 15;
  const md = post.meta_description ?? '';
  if (md.length > 0) {
    score += 7;
    if (md.length >= 120 && md.length <= 165) score += 8;
    else if (md.length >= 80 && md.length <= 200) score += 4;
  }

  // 4. Keywords targeted (15 pts) — 2-5 keywords is optimal
  maxScore += 15;
  const kwCount = (post.keywords ?? []).length;
  if (kwCount >= 2 && kwCount <= 5) score += 15;
  else if (kwCount === 1) score += 8;
  else if (kwCount > 5) score += 10;

  // 5. Keyword density (15 pts) — primary keyword 0.5-2.5% is optimal
  maxScore += 15;
  const density = post.keyword_density;
  if (density && typeof density === 'object') {
    const values = Object.values(density);
    if (values.length > 0) {
      const primaryDensity = Math.max(...values);
      if (primaryDensity >= 0.5 && primaryDensity <= 2.5) score += 15;
      else if (primaryDensity > 0 && primaryDensity < 0.5) score += 8;
      else if (primaryDensity > 2.5 && primaryDensity <= 4) score += 8;
      else if (primaryDensity > 0) score += 4;
    }
  }

  // 6. Readability (15 pts) — readability_score closer to 60 is best (Flesch)
  maxScore += 15;
  const rs = post.readability_score ?? 0;
  if (rs >= 40 && rs <= 80) score += 15;
  else if (rs >= 20 && rs < 40) score += 10;
  else if (rs > 80) score += 10;
  else if (rs > 0) score += 5;

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

function seoScoreColor(score: number): string {
  if (score >= 75) return '#4ade80';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

function seoScoreLabel(score: number): string {
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Work';
}

interface OverviewProps {
  posts: PostResponse[];
  agents: AgentResponse[];
  schedules: ScheduleResponse[];
  scheduleStats: ScheduleStats;
  tenant: TenantResponse;
  usage: TenantUsageResponse | null;
  projectSlug: string;
  token: string;
}

export function OverviewClient({
  posts,
  agents,
  schedules,
  scheduleStats,
  tenant,
  usage,
  projectSlug,
  token,
}: OverviewProps) {
  const [generating, setGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState('');

  const publishedPosts = posts.filter((p) => p.status === 'published');
  const draftPosts = posts.filter((p) => p.status === 'draft' || p.status === 'scheduled');

  // Compute per-post SEO scores
  const postSeoScores = posts.map((p) => computeSeoScore(p));
  const avgSeoScore = posts.length > 0
    ? Math.round(postSeoScores.reduce((a, b) => a + b, 0) / postSeoScores.length)
    : 0;
  const totalWords = posts.reduce((sum, p) => sum + (p.word_count ?? 0), 0);

  const activeSchedule = schedules.find((s) => s.is_active);

  async function handleGenerateNow() {
    if (!agents[0] || generating) return;
    setGenerating(true);
    setGenMessage('');
    try {
      const res = await fetch(`${API_URL}/posts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agent_id: agents[0].id,
          topic: '',
          target_keyword: '',
        }),
      });
      if (!res.ok) throw new Error('Generation failed');
      setGenMessage('Post generated successfully! Check your posts.');
    } catch {
      setGenMessage('Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  function formatRelative(dateStr: string | null) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)}d ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Overview</h1>
        <div className={styles.btnGroup}>
          <button
            className={styles.btnPrimary}
            onClick={handleGenerateNow}
            disabled={generating || agents.length === 0}
          >
            {generating ? 'Generating...' : 'Generate Post Now'}
          </button>
        </div>
      </div>

      {genMessage && (
        <div className={genMessage.includes('success') ? styles.ovSuccessMsg : styles.ovErrorMsg}>
          {genMessage}
        </div>
      )}

      {/* Stat Cards */}
      <div className={styles.ovStatGrid}>
        <div className={styles.ovStatCard}>
          <p className={styles.ovStatLabel}>Posts Published</p>
          <p className={styles.ovStatValue}>{publishedPosts.length}</p>
        </div>
        <div className={styles.ovStatCard}>
          <p className={styles.ovStatLabel}>Draft / Scheduled</p>
          <p className={styles.ovStatValue}>{draftPosts.length}</p>
        </div>
        <div className={styles.ovStatCard}>
          <p className={styles.ovStatLabel}>Avg. SEO Score</p>
          <p className={styles.ovStatValue} style={{ color: posts.length > 0 ? seoScoreColor(avgSeoScore) : undefined }}>
            {posts.length > 0 ? `${avgSeoScore}/100` : '—'}
          </p>
        </div>
        <div className={styles.ovStatCard}>
          <p className={styles.ovStatLabel}>Next Publish</p>
          <p className={styles.ovStatValue}>{formatRelative(activeSchedule?.next_run_at ?? null)}</p>
        </div>
      </div>

      {/* Usage Bar */}
      {usage && (
        <div className={styles.ovUsageSection}>
          <h3 className={styles.ovSectionTitle}>Usage</h3>
          <div className={styles.ovUsageGrid}>
            <div className={styles.ovUsageItem}>
              <div className={styles.ovUsageHeader}>
                <span>Posts</span>
                <span>{usage.posts_used} / {usage.posts_limit}</span>
              </div>
              <div className={styles.ovProgressBar}>
                <div
                  className={styles.ovProgressFill}
                  style={{ width: `${Math.min(usage.posts_percentage, 100)}%` }}
                />
              </div>
            </div>
            <div className={styles.ovUsageItem}>
              <div className={styles.ovUsageHeader}>
                <span>Tokens</span>
                <span>{usage.tokens_used.toLocaleString()} / {usage.tokens_limit.toLocaleString()}</span>
              </div>
              <div className={styles.ovProgressBar}>
                <div
                  className={styles.ovProgressFill}
                  style={{ width: `${Math.min(usage.tokens_percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Activity */}
      <div className={styles.ovChartsSection}>
        <h3 className={styles.ovSectionTitle}>Content Activity</h3>
        <div className={styles.ovChartsGrid}>
          {/* Posts last 7 / 30 days bar */}
          <div className={styles.ovChartCard}>
            <div className={styles.ovChartBars}>
              <div className={styles.ovChartBarGroup}>
                <div className={styles.ovChartBarTrack}>
                  <div
                    className={styles.ovChartBarFill}
                    style={{
                      height: `${Math.min(
                        (scheduleStats.posts_last_7_days / Math.max(posts.length, 1)) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
                <span className={styles.ovChartBarLabel}>7d</span>
                <span className={styles.ovChartBarValue}>{scheduleStats.posts_last_7_days}</span>
              </div>
              <div className={styles.ovChartBarGroup}>
                <div className={styles.ovChartBarTrack}>
                  <div
                    className={styles.ovChartBarFill}
                    style={{
                      height: `${Math.min(
                        (scheduleStats.posts_last_30_days / Math.max(posts.length, 1)) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
                <span className={styles.ovChartBarLabel}>30d</span>
                <span className={styles.ovChartBarValue}>{scheduleStats.posts_last_30_days}</span>
              </div>
              <div className={styles.ovChartBarGroup}>
                <div className={styles.ovChartBarTrack}>
                  <div
                    className={`${styles.ovChartBarFill} ${styles.ovChartBarTotal}`}
                    style={{ height: '100%' }}
                  />
                </div>
                <span className={styles.ovChartBarLabel}>All</span>
                <span className={styles.ovChartBarValue}>{posts.length}</span>
              </div>
            </div>
            <p className={styles.ovChartCaption}>Total Posts</p>
          </div>

          {/* Overall SEO Score Circle */}
          <div className={styles.ovChartCard}>
            <svg viewBox="0 0 100 100" className={styles.ovCircleChart}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="#3a3d50" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={seoScoreColor(avgSeoScore)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(avgSeoScore / 100) * 264} 264`}
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="46" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="700">
                {posts.length > 0 ? avgSeoScore : '—'}
              </text>
              <text x="50" y="62" textAnchor="middle" fill="#8b8fa3" fontSize="9">
                SEO Score
              </text>
            </svg>
          </div>

          {/* Success Rate Circle */}
          <div className={styles.ovChartCard}>
            <svg viewBox="0 0 100 100" className={styles.ovCircleChart}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="#3a3d50" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#ovGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(scheduleStats.success_rate / 100) * 264} 264`}
                transform="rotate(-90 50 50)"
              />
              <defs>
                <linearGradient id="ovGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7B2CBF" />
                  <stop offset="100%" stopColor="#0066FF" />
                </linearGradient>
              </defs>
              <text x="50" y="46" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="700">
                {Math.round(scheduleStats.success_rate)}%
              </text>
              <text x="50" y="62" textAnchor="middle" fill="#8b8fa3" fontSize="9">
                Success Rate
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* SEO Impact Estimation */}
      {publishedPosts.length > 0 && (() => {
        const uniqueKeywords = [...new Set(publishedPosts.flatMap((p) => p.keywords))];
        // Backlinko B2B Content Marketing Report: avg B2B blog post ranks for 29 keywords
        const estRankableKeywords = uniqueKeywords.length + Math.round(publishedPosts.length * 29);
        // Backlinko: median B2B blog post = 49 organic visits/month (after 3-12 months maturity)
        // Top 10% = ~2,001/month. We use conservative: median 49, optimistic top-quartile ~200
        // Weighted by SEO score: score/100 acts as quality multiplier
        const medianPerPost = 49;
        const topQuartilePerPost = 200;
        const qualityMultiplier = avgSeoScore / 100;
        const estTrafficLow = Math.round(publishedPosts.length * medianPerPost * qualityMultiplier);
        const estTrafficHigh = Math.round(publishedPosts.length * topQuartilePerPost * qualityMultiplier);
        // Content velocity from schedule
        const velocityPerMonth = activeSchedule
          ? activeSchedule.interval === 'daily' ? 30 : activeSchedule.interval === 'every_3_days' ? 10 : activeSchedule.interval === 'weekly' ? 4 : 2
          : 0;

        return (
          <div className={styles.ovSeoImpactSection}>
            <h3 className={styles.ovSectionTitle}>SEO Impact Estimation</h3>
            <div className={styles.ovSeoImpactGrid}>
              <div className={styles.ovSeoImpactCard}>
                <p className={styles.ovSeoImpactLabel}>Total Indexed Content</p>
                <p className={styles.ovSeoImpactValue}>{totalWords.toLocaleString()} words</p>
                <p className={styles.ovSeoImpactMeta}>{publishedPosts.length} published articles &middot; avg {publishedPosts.length > 0 ? Math.round(totalWords / publishedPosts.length).toLocaleString() : 0} words/post</p>
              </div>
              <div className={styles.ovSeoImpactCard}>
                <p className={styles.ovSeoImpactLabel}>Est. Rankable Keywords</p>
                <p className={styles.ovSeoImpactValue}>
                  ~{estRankableKeywords.toLocaleString()}
                </p>
                <p className={styles.ovSeoImpactMeta}>{uniqueKeywords.length} targeted + ~{publishedPosts.length * 29} variations (avg post ranks for 29 keywords &mdash; Backlinko)</p>
              </div>
              <div className={styles.ovSeoImpactCard}>
                <p className={styles.ovSeoImpactLabel}>Est. Monthly Organic Potential</p>
                <p className={styles.ovSeoImpactValue}>
                  {estTrafficLow.toLocaleString()} &ndash; {estTrafficHigh.toLocaleString()}
                </p>
                <p className={styles.ovSeoImpactMeta}>visits/mo after 3-12 months maturity ({publishedPosts.length} posts &times; 49-200 visits &times; {avgSeoScore}% quality)</p>
              </div>
              <div className={styles.ovSeoImpactCard}>
                <p className={styles.ovSeoImpactLabel}>Content Velocity</p>
                <p className={styles.ovSeoImpactValue}>
                  {velocityPerMonth}
                </p>
                <p className={styles.ovSeoImpactMeta}>posts/month projected &middot; 9+ posts/mo = +35.8% YoY traffic (StrataBeat)</p>
              </div>
            </div>
            <p className={styles.ovSeoImpactNote}>
              Formulas: Traffic per post uses Backlinko B2B Content Report median (49 visits/mo) and top-quartile (200 visits/mo), weighted by SEO score. Keyword estimate uses avg 29 rankable keywords per post (Backlinko). New content typically takes 3-12 months to reach full organic potential (Ahrefs: only 5.7% of pages reach top 10 within 1 year). 96.55% of all pages get zero Google traffic (Ahrefs) &mdash; well-optimized content with proper keyword targeting significantly outperforms the median.
            </p>
          </div>
        );
      })()}

      {/* Schedule Status */}
      {schedules.length > 0 && (
        <div className={styles.ovScheduleSection}>
          <h3 className={styles.ovSectionTitle}>Schedule</h3>
          <div className={styles.ovScheduleCards}>
            {schedules.map((sch) => (
              <div key={sch.id} className={styles.ovScheduleCard}>
                <div className={styles.ovScheduleRow}>
                  <span className={sch.is_active ? styles.ovDotActive : styles.ovDotInactive} />
                  <span className={styles.ovScheduleName}>{sch.interval_display}</span>
                  <span className={styles.ovScheduleMeta}>
                    {sch.is_active ? 'Active' : 'Paused'} &middot; {sch.total_posts_generated} posts generated
                  </span>
                </div>
                {sch.is_active && sch.next_run_at && (
                  <p className={styles.ovScheduleNext}>
                    Next: {formatRelative(sch.next_run_at)} at {sch.publish_hour}:00 {sch.timezone}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts */}
      <div className={styles.ovRecentSection}>
        <div className={styles.ovRecentHeader}>
          <h3 className={styles.ovSectionTitle}>Recent Posts</h3>
          <Link href={`/admin/${projectSlug}/posts`} className={styles.ovViewAll}>
            View All Posts
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateTitle}>No posts yet</p>
            <p className={styles.emptyStateText}>Generate your first post to get started.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>SEO Score</th>
                <th>Status</th>
                <th>Words</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {posts.slice(0, 5).map((post) => {
                const score = computeSeoScore(post);
                return (
                  <tr key={post.id}>
                    <td>
                      <Link href={`/admin/${projectSlug}/posts/${post.id}`} className={styles.ovPostLink}>
                        {post.title || 'Untitled'}
                      </Link>
                    </td>
                    <td>
                      <span className={styles.ovSeoScoreBadge} style={{ color: seoScoreColor(score), borderColor: seoScoreColor(score) }}>
                        {score}
                      </span>
                    </td>
                    <td>
                      <span
                        className={
                          post.status === 'published'
                            ? styles.statusPublished
                            : post.status === 'scheduled'
                              ? styles.statusScheduled
                              : styles.statusDraft
                        }
                      >
                        {post.status}
                      </span>
                    </td>
                    <td>{post.word_count.toLocaleString()}</td>
                    <td>{formatDate(post.published_at || post.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.ovQuickActions}>
        <Link href={`/admin/${projectSlug}/posts`} className={styles.btnSecondary}>
          View All Posts
        </Link>
        <Link href={`/admin/${projectSlug}/schedules`} className={styles.btnSecondary}>
          Manage Schedules
        </Link>
      </div>
    </>
  );
}
