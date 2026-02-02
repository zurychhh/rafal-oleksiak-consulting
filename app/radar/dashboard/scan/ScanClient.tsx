'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './scan.module.css';

interface UserProfile {
  yourUrl: string | null;
}

type ScanState = 'idle' | 'scanning' | 'error';

const SCAN_PROGRESS_STEPS = [
  'Scraping websites...',
  'Analyzing competitors...',
  'Generating insights...',
];

export default function ScanClient() {
  const router = useRouter();
  const [yourUrl, setYourUrl] = useState('');
  const [competitorUrls, setCompetitorUrls] = useState(['']);
  const [state, setState] = useState<ScanState>('idle');
  const [error, setError] = useState('');
  const [progressStep, setProgressStep] = useState(0);

  useEffect(() => {
    // Pre-fill user's URL from profile
    fetch('/api/radar/auth/me')
      .then((res) => res.json())
      .then((data: UserProfile) => {
        if (data.yourUrl) {
          setYourUrl(data.yourUrl);
        }
      })
      .catch(() => {
        // Silently fail if profile fetch fails
      });
  }, []);

  useEffect(() => {
    if (state === 'scanning') {
      const interval = setInterval(() => {
        setProgressStep((prev) => {
          if (prev < SCAN_PROGRESS_STEPS.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [state]);

  const addCompetitor = () => {
    if (competitorUrls.length < 5) {
      setCompetitorUrls([...competitorUrls, '']);
    }
  };

  const removeCompetitor = (index: number) => {
    setCompetitorUrls(competitorUrls.filter((_, i) => i !== index));
  };

  const updateCompetitor = (index: number, value: string) => {
    const updated = [...competitorUrls];
    updated[index] = value;
    setCompetitorUrls(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!yourUrl.trim()) {
      setError('Please enter your website URL');
      return;
    }

    const validCompetitors = competitorUrls.filter((url) => url.trim());
    if (validCompetitors.length === 0) {
      setError('Please add at least one competitor URL');
      return;
    }

    setState('scanning');
    setProgressStep(0);

    try {
      const response = await fetch('/api/radar/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yourUrl: yourUrl.trim(),
          competitorUrls: validCompetitors,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Scan failed');
      }

      const data = await response.json();
      router.push(`/radar/dashboard/reports/${data.reportId}`);
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Failed to complete scan');
    }
  };

  return (
    <div className={styles.scanPage}>
      <div className={styles.scanContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>New Competitive Scan</h1>
          <p className={styles.subtitle}>
            Analyze your website against competitors to uncover strategic insights
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <label className={styles.label} htmlFor="yourUrl">
              Your Website URL
            </label>
            <input
              id="yourUrl"
              type="text"
              value={yourUrl}
              onChange={(e) => setYourUrl(e.target.value)}
              placeholder="https://your-website.com"
              className={styles.input}
              disabled={state === 'scanning'}
            />
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <label className={styles.label}>Competitor URLs</label>
              <span className={styles.helperText}>
                Add 1-5 competitor websites
              </span>
            </div>

            <div className={styles.competitorList}>
              {competitorUrls.map((url, index) => (
                <div key={index} className={styles.competitorInput}>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => updateCompetitor(index, e.target.value)}
                    placeholder={`https://competitor${index + 1}.com`}
                    className={styles.input}
                    disabled={state === 'scanning'}
                  />
                  {competitorUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCompetitor(index)}
                      className={styles.removeBtn}
                      disabled={state === 'scanning'}
                      aria-label="Remove competitor"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {competitorUrls.length < 5 && (
              <button
                type="button"
                onClick={addCompetitor}
                className={styles.addBtn}
                disabled={state === 'scanning'}
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
                Add Competitor
              </button>
            )}
          </div>

          {error && (
            <div className={styles.errorBox}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {state === 'scanning' ? (
            <div className={styles.scanningState}>
              <div className={styles.spinner} />
              <div className={styles.scanningText}>
                {SCAN_PROGRESS_STEPS[progressStep]}
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${((progressStep + 1) / SCAN_PROGRESS_STEPS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <button type="submit" className={styles.submitBtn}>
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
              Start Scan
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
