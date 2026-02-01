'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PostResponse } from '@/lib/blog/types';
import styles from '../../../../admin.module.css';

const API_URL = process.env.NEXT_PUBLIC_BLOG_API_URL;

interface EditorProps {
  post: PostResponse;
  projectSlug: string;
  token: string;
}

export function PostEditorClient({ post, projectSlug, token }: EditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [metaTitle, setMetaTitle] = useState(post.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(post.meta_description || '');
  const [keywords, setKeywords] = useState<string[]>(post.keywords || []);
  const [keywordInput, setKeywordInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function apiFetch(path: string, options?: RequestInit) {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`API ${res.status}: ${body}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await apiFetch(`/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          content,
          meta_title: metaTitle || undefined,
          meta_description: metaDescription || undefined,
          keywords,
        }),
      });
      setMessage('Saved successfully');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    setError('');
    setMessage('');
    try {
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      await apiFetch(`/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      setMessage(newStatus === 'published' ? 'Published!' : 'Moved to draft');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await apiFetch(`/posts/${post.id}`, { method: 'DELETE' });
      router.push(`/admin/${projectSlug}/posts`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
      setDeleting(false);
    }
  }

  function addKeyword() {
    const kw = keywordInput.trim().toLowerCase();
    if (kw && !keywords.includes(kw)) {
      setKeywords([...keywords, kw]);
    }
    setKeywordInput('');
  }

  function removeKeyword(kw: string) {
    setKeywords(keywords.filter((k) => k !== kw));
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Edit Post</h1>
        <div className={styles.btnGroup}>
          <button
            className={styles.btnSecondary}
            onClick={() => router.push(`/admin/${projectSlug}/posts`)}
          >
            Back to Posts
          </button>
          <button
            className={styles.btnPrimary}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {message && <div className={styles.ovSuccessMsg}>{message}</div>}
      {error && <div className={styles.ovErrorMsg}>{error}</div>}

      <div className={styles.editorLayout}>
        {/* Main editor area */}
        <div className={styles.editorMain}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Title</label>
            <input
              className={styles.formInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Content (Markdown)
              <span className={styles.editorMeta}>{wordCount.toLocaleString()} words</span>
            </label>
            <textarea
              className={styles.editorTextarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content in markdown..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.editorSidebar}>
          {/* Status */}
          <div className={styles.editorSidebarCard}>
            <h3 className={styles.editorSidebarTitle}>Status</h3>
            <div className={styles.editorStatusRow}>
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
            </div>
            <div className={styles.btnGroup} style={{ marginTop: 12 }}>
              <button
                className={post.status === 'published' ? styles.btnSecondary : styles.btnPrimary}
                onClick={handlePublish}
                disabled={publishing}
              >
                {publishing
                  ? '...'
                  : post.status === 'published'
                    ? 'Unpublish'
                    : 'Publish'}
              </button>
              <button
                className={`${styles.btnDanger} ${styles.btnSmall}`}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? '...' : 'Delete'}
              </button>
            </div>
          </div>

          {/* SEO */}
          <div className={styles.editorSidebarCard}>
            <h3 className={styles.editorSidebarTitle}>SEO</h3>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Meta Title
                <span className={styles.editorMeta}>{metaTitle.length}/70</span>
              </label>
              <input
                className={styles.formInput}
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                maxLength={70}
                placeholder="SEO title..."
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Meta Description
                <span className={styles.editorMeta}>{metaDescription.length}/160</span>
              </label>
              <textarea
                className={styles.formTextarea}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                maxLength={160}
                placeholder="SEO description..."
                style={{ minHeight: 80 }}
              />
            </div>
          </div>

          {/* Keywords */}
          <div className={styles.editorSidebarCard}>
            <h3 className={styles.editorSidebarTitle}>Keywords</h3>
            <div className={styles.editorKeywords}>
              {keywords.map((kw) => (
                <span key={kw} className={styles.editorKeyword}>
                  {kw}
                  <button
                    className={styles.editorKeywordRemove}
                    onClick={() => removeKeyword(kw)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
            <div className={styles.editorKeywordInput}>
              <input
                className={styles.formInput}
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
                placeholder="Add keyword..."
              />
              <button className={styles.btnSecondary} onClick={addKeyword}>
                Add
              </button>
            </div>
          </div>

          {/* Info */}
          <div className={styles.editorSidebarCard}>
            <h3 className={styles.editorSidebarTitle}>Info</h3>
            <p className={styles.editorInfoRow}>
              <span>Words:</span> <span>{wordCount.toLocaleString()}</span>
            </p>
            {post.readability_score != null && (
              <p className={styles.editorInfoRow}>
                <span>Readability:</span> <span>{post.readability_score}</span>
              </p>
            )}
            {post.keyword_density != null && typeof post.keyword_density === 'object' && Object.keys(post.keyword_density).length > 0 && (
              <div>
                <p className={styles.editorInfoRow} style={{ marginBottom: 4 }}>
                  <span>Keyword Density:</span>
                </p>
                {Object.entries(post.keyword_density).map(([kw, density]) => (
                  <p key={kw} className={styles.editorInfoRow} style={{ paddingLeft: 8, fontSize: '0.85em' }}>
                    <span>{kw}:</span> <span>{(density * 100).toFixed(1)}%</span>
                  </p>
                ))}
              </div>
            )}
            {post.tokens_used > 0 && (
              <p className={styles.editorInfoRow}>
                <span>Tokens Used:</span> <span>{post.tokens_used.toLocaleString()}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
