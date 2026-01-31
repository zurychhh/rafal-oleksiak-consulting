'use client';

import { useState } from 'react';
import type { ScheduleListResponse, AgentResponse } from '@/lib/blog/types';
import styles from '../../../admin.module.css';

const API_URL = process.env.NEXT_PUBLIC_BLOG_API_URL;

async function apiFetch(path: string, token: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

const INTERVALS = [
  { value: 'daily', label: 'Daily' },
  { value: 'every_3_days', label: 'Every 3 days' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
];

const POST_LENGTHS = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
  { value: 'very_long', label: 'Very long' },
];

export function SchedulesClient({
  initialSchedules,
  agents,
  projectSlug,
  token,
}: {
  initialSchedules: ScheduleListResponse;
  agents: AgentResponse[];
  projectSlug: string;
  token: string;
}) {
  const [schedules, setSchedules] = useState(initialSchedules.items);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Create form
  const [interval, setInterval] = useState('weekly');
  const [publishHour, setPublishHour] = useState(10);
  const [postLength, setPostLength] = useState('long');
  const [autoPublish, setAutoPublish] = useState(true);
  const [keywords, setKeywords] = useState('');

  const agentId = agents[0]?.id;

  async function refreshSchedules() {
    try {
      const data = await apiFetch('/schedules', token);
      setSchedules(data.items);
    } catch { /* ignore */ }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!agentId) return;
    setLoading(true);
    setError('');
    try {
      await apiFetch('/schedules', token, {
        method: 'POST',
        body: JSON.stringify({
          agent_id: agentId,
          interval,
          publish_hour: publishHour,
          timezone: 'Europe/Warsaw',
          auto_publish: autoPublish,
          target_keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
          post_length: postLength,
          is_active: true,
        }),
      });
      setShowCreate(false);
      await refreshSchedules();
    } catch {
      setError('Failed to create schedule');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(scheduleId: string) {
    try {
      await apiFetch(`/schedules/${scheduleId}/toggle`, token, { method: 'POST' });
      await refreshSchedules();
    } catch { /* ignore */ }
  }

  async function handleRun(scheduleId: string) {
    setRunningId(scheduleId);
    try {
      await apiFetch(`/schedules/${scheduleId}/run`, token, { method: 'POST' });
      // Poll for completion — stop after 60s or 3 min timeout
      let attempts = 0;
      let stopped = false;

      function poll() {
        if (stopped) return;
        attempts++;
        refreshSchedules();
        if (attempts >= 30) {
          stopped = true;
          setRunningId(null);
          return;
        }
        setTimeout(poll, 2000);
      }

      setTimeout(poll, 2000);

      // Hard timeout at 3 min
      setTimeout(() => {
        stopped = true;
        setRunningId(null);
      }, 180000);
    } catch {
      setRunningId(null);
    }
  }

  async function handleDelete(scheduleId: string) {
    if (!confirm('Delete this schedule?')) return;
    try {
      await apiFetch(`/schedules/${scheduleId}`, token, { method: 'DELETE' });
      await refreshSchedules();
    } catch { /* ignore */ }
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Schedules</h1>
        <button className={styles.btnPrimary} onClick={() => setShowCreate(true)}>
          + New Schedule
        </button>
      </div>

      {error && <div className={styles.loginError}>{error}</div>}

      {/* Create Modal */}
      {showCreate && (
        <div className={styles.modalOverlay} onClick={() => !loading && setShowCreate(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>New Schedule</h2>
            <form onSubmit={handleCreate}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Interval</label>
                <select className={styles.formSelect} value={interval} onChange={(e) => setInterval(e.target.value)}>
                  {INTERVALS.map((i) => (
                    <option key={i.value} value={i.value}>{i.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Publish Hour (UTC)</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={publishHour}
                  onChange={(e) => setPublishHour(Number(e.target.value))}
                  min={0}
                  max={23}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Post Length</label>
                <select className={styles.formSelect} value={postLength} onChange={(e) => setPostLength(e.target.value)}>
                  {POST_LENGTHS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target Keywords (comma separated)</label>
                <input
                  className={styles.formInput}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. ecommerce, CRM, conversion"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <input
                    type="checkbox"
                    checked={autoPublish}
                    onChange={(e) => setAutoPublish(e.target.checked)}
                    style={{ marginRight: 8 }}
                  />
                  Auto-publish (otherwise save as draft)
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowCreate(false)} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedules Table */}
      {schedules.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>No schedules yet</p>
          <p className={styles.emptyStateText}>Create a schedule to automate blog posting.</p>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Interval</th>
              <th>Hour</th>
              <th>Length</th>
              <th>Active</th>
              <th>Generated</th>
              <th>Next Run</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.id}>
                <td>{s.interval_display}</td>
                <td>{s.publish_hour}:00 UTC</td>
                <td>{s.post_length}</td>
                <td>
                  <button
                    className={s.is_active ? styles.toggleActive : styles.toggle}
                    onClick={() => handleToggle(s.id)}
                    title={s.is_active ? 'Active — click to pause' : 'Paused — click to activate'}
                  />
                </td>
                <td>
                  {s.successful_posts}/{s.total_posts_generated}
                  {s.failed_posts > 0 && (
                    <span style={{ color: '#f87171', marginLeft: 4 }}>
                      ({s.failed_posts} failed)
                    </span>
                  )}
                </td>
                <td>
                  {s.next_run_at
                    ? new Date(s.next_run_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'}
                </td>
                <td>
                  <div className={styles.btnGroup}>
                    <button
                      className={`${styles.btnPrimary} ${styles.btnSmall}`}
                      onClick={() => handleRun(s.id)}
                      disabled={runningId === s.id}
                    >
                      {runningId === s.id ? (
                        <><span className={styles.spinner} /> Running...</>
                      ) : (
                        'Run now'
                      )}
                    </button>
                    <button
                      className={`${styles.btnDanger} ${styles.btnSmall}`}
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
