'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { PostListResponse, AgentResponse } from '@/lib/blog/types';
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

export function PostsClient({
  initialPosts,
  agents,
  projectSlug,
  token,
}: {
  initialPosts: PostListResponse;
  agents: AgentResponse[];
  projectSlug: string;
  token: string;
}) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts.items);
  const [showCreate, setShowCreate] = useState(false);
  const [createMode, setCreateMode] = useState<'manual' | 'ai'>('manual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Manual create form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // AI create form
  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');

  // Topic suggestions
  const [suggestions, setSuggestions] = useState<{ topic: string; target_keyword: string; reasoning: string }[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const agentId = agents[0]?.id;

  async function refreshPosts() {
    try {
      const data = await apiFetch('/posts?page_size=50', token);
      setPosts(data.items);
    } catch { /* ignore */ }
  }

  async function handleCreateManual(e: React.FormEvent) {
    e.preventDefault();
    if (!agentId) return;
    setLoading(true);
    setError('');
    try {
      // Format first
      const formatted = await apiFetch('/posts/format', token, {
        method: 'POST',
        body: JSON.stringify({ title, content }),
      });

      await apiFetch('/posts', token, {
        method: 'POST',
        body: JSON.stringify({
          agent_id: agentId,
          title,
          content: formatted.formatted_content || content,
          status: 'published',
        }),
      });

      setTitle('');
      setContent('');
      setShowCreate(false);
      await refreshPosts();
    } catch {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAI(e: React.FormEvent) {
    e.preventDefault();
    if (!agentId) return;
    setLoading(true);
    setError('');
    try {
      await apiFetch('/posts/generate', token, {
        method: 'POST',
        body: JSON.stringify({
          agent_id: agentId,
          topic,
          target_keyword: keyword,
        }),
      });

      setTopic('');
      setKeyword('');
      setShowCreate(false);
      await refreshPosts();
    } catch {
      setError('AI generation failed. This can take 30-60s — try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSuggestTopics() {
    if (!agentId) return;
    setSuggestLoading(true);
    try {
      const data = await apiFetch('/topics/suggest', token, {
        method: 'POST',
        body: JSON.stringify({ agent_id: agentId, count: 5 }),
      });
      setSuggestions(data.suggestions || []);
    } catch {
      setError('Failed to get topic suggestions');
    } finally {
      setSuggestLoading(false);
    }
  }

  function selectSuggestion(s: { topic: string; target_keyword: string }) {
    setTopic(s.topic);
    setKeyword(s.target_keyword);
    setSuggestions([]);
  }

  async function handleToggleStatus(postId: string, currentStatus: string) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await apiFetch(`/posts/${postId}`, token, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      await refreshPosts();
    } catch { /* ignore */ }
  }

  async function handleDelete(postId: string) {
    if (!confirm('Delete this post?')) return;
    try {
      await apiFetch(`/posts/${postId}`, token, { method: 'DELETE' });
      await refreshPosts();
    } catch { /* ignore */ }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Posts</h1>
        <button className={styles.btnPrimary} onClick={() => setShowCreate(true)}>
          + New Post
        </button>
      </div>

      {error && <div className={styles.loginError}>{error}</div>}

      {/* Create Modal */}
      {showCreate && (
        <div className={styles.modalOverlay} onClick={() => !loading && setShowCreate(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>New Post</h2>

            <div className={styles.tabs}>
              <button
                className={createMode === 'manual' ? styles.tabActive : styles.tab}
                onClick={() => setCreateMode('manual')}
              >
                Manual
              </button>
              <button
                className={createMode === 'ai' ? styles.tabActive : styles.tab}
                onClick={() => setCreateMode('ai')}
              >
                AI Generate
              </button>
            </div>

            {createMode === 'manual' ? (
              <form onSubmit={handleCreateManual}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    className={styles.formInput}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Content (Markdown)</label>
                  <textarea
                    className={styles.formTextarea}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnSecondary} onClick={() => setShowCreate(false)} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnPrimary} disabled={loading}>
                    {loading ? 'Publishing...' : 'Publish'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateAI}>
                {/* Suggest Topics Button */}
                <div style={{ marginBottom: 16 }}>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={handleSuggestTopics}
                    disabled={suggestLoading || !agentId}
                  >
                    {suggestLoading ? 'Thinking...' : 'Suggest Topics with AI'}
                  </button>
                </div>

                {/* Topic Suggestions */}
                {suggestions.length > 0 && (
                  <div className={styles.suggestionsGrid}>
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        className={styles.suggestionChip}
                        onClick={() => selectSuggestion(s)}
                      >
                        <span className={styles.suggestionTopic}>{s.topic}</span>
                        <span className={styles.suggestionKeyword}>{s.target_keyword}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Topic</label>
                  <input
                    className={styles.formInput}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. How to improve ecommerce conversion rates"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>SEO Keyword</label>
                  <input
                    className={styles.formInput}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g. ecommerce conversion optimization"
                    required
                  />
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnSecondary} onClick={() => setShowCreate(false)} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnPrimary} disabled={loading}>
                    {loading ? (
                      <>
                        <span className={styles.spinner} /> Generating (30-60s)...
                      </>
                    ) : (
                      'Generate with AI'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Posts Table */}
      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>No posts yet</p>
          <p className={styles.emptyStateText}>Create your first post to get started.</p>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Words</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
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
                <td>{post.word_count}</td>
                <td>{formatDate(post.published_at || post.created_at)}</td>
                <td>
                  <div className={styles.btnGroup}>
                    <Link
                      href={`/admin/${projectSlug}/posts/${post.id}`}
                      className={`${styles.btnSecondary} ${styles.btnSmall}`}
                      style={{ textDecoration: 'none' }}
                    >
                      Edit
                    </Link>
                    <button
                      className={`${styles.btnSecondary} ${styles.btnSmall}`}
                      onClick={() => handleToggleStatus(post.id, post.status)}
                    >
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      className={`${styles.btnDanger} ${styles.btnSmall}`}
                      onClick={() => handleDelete(post.id)}
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
