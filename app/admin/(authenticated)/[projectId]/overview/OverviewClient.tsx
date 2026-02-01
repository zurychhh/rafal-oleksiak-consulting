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
  const avgSeoScore = posts.length > 0
    ? Math.round(posts.reduce((sum, p) => sum + (p.readability_score ?? 0), 0) / posts.length)
    : 0;

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
          <p className={styles.ovStatValue}>{scheduleStats.successful_posts}</p>
        </div>
        <div className={styles.ovStatCard}>
          <p className={styles.ovStatLabel}>Draft / Scheduled</p>
          <p className={styles.ovStatValue}>{draftPosts.length}</p>
        </div>
        <div className={styles.ovStatCard}>
          <p className={styles.ovStatLabel}>Avg. Readability</p>
          <p className={styles.ovStatValue}>{avgSeoScore || '—'}</p>
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
                        (scheduleStats.posts_last_7_days / Math.max(scheduleStats.posts_last_30_days, 1)) * 100,
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
                  <div className={styles.ovChartBarFill} style={{ height: '100%' }} />
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
                <span className={styles.ovChartBarValue}>{scheduleStats.total_posts_generated}</span>
              </div>
            </div>
            <p className={styles.ovChartCaption}>Posts Generated</p>
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
                <th>Status</th>
                <th>Words</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {posts.slice(0, 5).map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/${projectSlug}/posts/${post.id}`} className={styles.ovPostLink}>
                      {post.title || 'Untitled'}
                    </Link>
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
              ))}
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
