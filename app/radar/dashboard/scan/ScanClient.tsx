'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './scan.module.css';

interface UserProfile {
  yourUrl: string | null;
}

type ScanState = 'idle' | 'scanning' | 'error';
type ValidationState = 'valid' | 'invalid' | 'warning' | 'empty';

interface ValidationResult {
  state: ValidationState;
  message?: string;
  suggestion?: string;
}

interface ErrorInfo {
  title: string;
  message: string;
  suggestion: string;
  failedUrl?: string;
}

const SCAN_PROGRESS_STEPS = [
  'Scraping websites...',
  'Analyzing competitors...',
  'Generating insights...',
];

// Parse error message and return user-friendly error info
function parseError(errorMessage: string): ErrorInfo {
  const lowerMsg = errorMessage.toLowerCase();

  // Extract status code if present
  const statusMatch = errorMessage.match(/:\s*(\d{3})$/);
  const statusCode = statusMatch ? statusMatch[1] : null;

  // Extract failed URL if present (format: "Failed to fetch https://example.com: 403")
  const urlMatch = errorMessage.match(/https?:\/\/[^\s:]+/);
  const failedUrl = urlMatch ? urlMatch[0] : undefined;

  // 403 Forbidden
  if (statusCode === '403' || lowerMsg.includes('403')) {
    return {
      title: 'Website Blocking Automated Scans',
      message: 'This website is blocking automated scanners. Large e-commerce sites like Allegro often implement strict anti-bot protection.',
      suggestion: 'Try analyzing a different competitor, or use a website without aggressive bot protection.',
      failedUrl,
    };
  }

  // 404 Not Found
  if (statusCode === '404' || lowerMsg.includes('404')) {
    return {
      title: 'Website Not Found',
      message: 'We could not find a website at this URL. The page may have been moved or deleted.',
      suggestion: 'Please check the URL and make sure it\'s correct. Try accessing it in your browser first.',
      failedUrl,
    };
  }

  // Timeout
  if (lowerMsg.includes('timeout') || lowerMsg.includes('timed out')) {
    return {
      title: 'Connection Timeout',
      message: 'The website took too long to respond. It might be experiencing technical issues or heavy traffic.',
      suggestion: 'Wait a few minutes and try again. If the problem persists, try a different competitor.',
      failedUrl,
    };
  }

  // Network/Connection errors
  if (lowerMsg.includes('network') || lowerMsg.includes('connection') || lowerMsg.includes('econnrefused')) {
    return {
      title: 'Connection Failed',
      message: 'We could not establish a connection to the website. This could be a network issue or the site might be down.',
      suggestion: 'Check your internet connection and verify the website is accessible in your browser.',
      failedUrl,
    };
  }

  // Failed to scrape your website
  if (lowerMsg.includes('failed to scrape your website')) {
    return {
      title: 'Could Not Analyze Your Website',
      message: 'We encountered an issue while analyzing your website. This could be due to access restrictions or technical problems.',
      suggestion: 'Make sure your website is publicly accessible and not blocking automated tools.',
      failedUrl,
    };
  }

  // Failed to scrape any competitor
  if (lowerMsg.includes('failed to scrape any competitor')) {
    return {
      title: 'No Competitors Could Be Analyzed',
      message: 'We were unable to analyze any of the competitor websites you provided. They may all be blocking automated access.',
      suggestion: 'Try different competitors that are more accessible, or ensure the URLs are correct.',
      failedUrl,
    };
  }

  // Generic fallback
  return {
    title: 'Analysis Failed',
    message: 'Something went wrong while analyzing the websites.',
    suggestion: 'Please try again in a moment. If the problem continues, contact support for assistance.',
    failedUrl,
  };
}

const validateUrl = (url: string): ValidationResult => {
  // Empty state
  if (!url.trim()) {
    return { state: 'empty' };
  }

  // Check for protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return {
      state: 'invalid',
      message: 'URL must start with https:// or http://',
      suggestion: `https://${url}`,
    };
  }

  // Validate URL format
  try {
    const urlObj = new URL(url);

    // Check for localhost
    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      return {
        state: 'warning',
        message: "Warning: localhost URLs won't work in production",
      };
    }

    // Check for IP address
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(urlObj.hostname)) {
      return {
        state: 'warning',
        message: 'Warning: Consider using the domain name instead',
      };
    }

    // Check for very short domains (potential typos)
    const domainParts = urlObj.hostname.split('.');
    if (domainParts.length < 2 || domainParts.some(part => part.length < 2)) {
      return {
        state: 'warning',
        message: 'Warning: This looks like an unusual domain name',
      };
    }

    return { state: 'valid' };
  } catch {
    return {
      state: 'invalid',
      message: 'Please enter a valid website URL',
    };
  }
};

export default function ScanClient() {
  const router = useRouter();
  const [yourUrl, setYourUrl] = useState('');
  const [competitorUrls, setCompetitorUrls] = useState(['']);
  const [state, setState] = useState<ScanState>('idle');
  const [error, setError] = useState('');
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const [yourUrlValidation, setYourUrlValidation] = useState<ValidationResult>({ state: 'empty' });
  const [competitorValidations, setCompetitorValidations] = useState<ValidationResult[]>([{ state: 'empty' }]);

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
      setCompetitorValidations([...competitorValidations, { state: 'empty' }]);
    }
  };

  const removeCompetitor = (index: number) => {
    setCompetitorUrls(competitorUrls.filter((_, i) => i !== index));
    setCompetitorValidations(competitorValidations.filter((_, i) => i !== index));
  };

  const updateCompetitor = (index: number, value: string) => {
    const updated = [...competitorUrls];
    updated[index] = value;
    setCompetitorUrls(updated);

    const updatedValidations = [...competitorValidations];
    updatedValidations[index] = validateUrl(value);
    setCompetitorValidations(updatedValidations);
  };

  const handleYourUrlChange = (value: string) => {
    setYourUrl(value);
    setYourUrlValidation(validateUrl(value));
  };

  const applyUrlSuggestion = (value: string, isYourUrl: boolean, competitorIndex?: number) => {
    if (isYourUrl) {
      handleYourUrlChange(value);
    } else if (competitorIndex !== undefined) {
      updateCompetitor(competitorIndex, value);
    }
  };

  const handleRetry = () => {
    setState('idle');
    setError('');
    setErrorInfo(null);
  };

  const isFormValid = () => {
    // Check if yourUrl is valid
    if (yourUrlValidation.state === 'invalid' || yourUrlValidation.state === 'empty') {
      return false;
    }

    // Check if at least one competitor URL is valid
    const validCompetitors = competitorValidations.filter(
      (v, i) => competitorUrls[i].trim() && (v.state === 'valid' || v.state === 'warning')
    );

    if (validCompetitors.length === 0) {
      return false;
    }

    // Check if any competitor URL is invalid (not empty, but invalid)
    const hasInvalidCompetitor = competitorValidations.some(
      (v, i) => competitorUrls[i].trim() && v.state === 'invalid'
    );

    return !hasInvalidCompetitor;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorInfo(null);

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
      const rawError = err instanceof Error ? err.message : 'Failed to complete scan';
      setError(rawError);
      setErrorInfo(parseError(rawError));
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
            <div className={styles.inputWrapper}>
              <input
                id="yourUrl"
                type="text"
                value={yourUrl}
                onChange={(e) => handleYourUrlChange(e.target.value)}
                placeholder="https://your-website.com"
                className={`${styles.input} ${
                  yourUrlValidation.state === 'valid' ? styles.inputValid :
                  yourUrlValidation.state === 'invalid' ? styles.inputInvalid :
                  yourUrlValidation.state === 'warning' ? styles.inputWarning : ''
                }`}
                disabled={state === 'scanning'}
              />
              {yourUrlValidation.state === 'valid' && (
                <span className={styles.validationIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
              )}
              {yourUrlValidation.state === 'invalid' && (
                <span className={styles.validationIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              )}
            </div>
            {yourUrlValidation.message && (
              <div className={`${styles.validationMessage} ${
                yourUrlValidation.state === 'invalid' ? styles.validationError :
                yourUrlValidation.state === 'warning' ? styles.validationWarning : ''
              }`}>
                {yourUrlValidation.message}
                {yourUrlValidation.suggestion && (
                  <button
                    type="button"
                    className={styles.suggestionBtn}
                    onClick={() => applyUrlSuggestion(yourUrlValidation.suggestion!, true)}
                  >
                    Use {yourUrlValidation.suggestion}
                  </button>
                )}
              </div>
            )}
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
                <div key={index} className={styles.competitorInputGroup}>
                  <div className={styles.competitorInput}>
                    <div className={styles.inputWrapper}>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => updateCompetitor(index, e.target.value)}
                        placeholder={`https://competitor${index + 1}.com`}
                        className={`${styles.input} ${
                          competitorValidations[index]?.state === 'valid' ? styles.inputValid :
                          competitorValidations[index]?.state === 'invalid' ? styles.inputInvalid :
                          competitorValidations[index]?.state === 'warning' ? styles.inputWarning : ''
                        }`}
                        disabled={state === 'scanning'}
                      />
                      {competitorValidations[index]?.state === 'valid' && (
                        <span className={styles.validationIcon}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                      )}
                      {competitorValidations[index]?.state === 'invalid' && (
                        <span className={styles.validationIcon}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </span>
                      )}
                    </div>
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
                  {competitorValidations[index]?.message && (
                    <div className={`${styles.validationMessage} ${
                      competitorValidations[index]?.state === 'invalid' ? styles.validationError :
                      competitorValidations[index]?.state === 'warning' ? styles.validationWarning : ''
                    }`}>
                      {competitorValidations[index].message}
                      {competitorValidations[index].suggestion && (
                        <button
                          type="button"
                          className={styles.suggestionBtn}
                          onClick={() => applyUrlSuggestion(competitorValidations[index].suggestion!, false, index)}
                        >
                          Use {competitorValidations[index].suggestion}
                        </button>
                      )}
                    </div>
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

          {/* Simple validation error (not scan error) */}
          {error && !errorInfo && (
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

          {/* Enhanced error UI for scan failures */}
          {errorInfo && state === 'error' && (
            <div className={styles.errorCard}>
              <div className={styles.errorCardHeader}>
                <div className={styles.errorIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div className={styles.errorContent}>
                  <h3 className={styles.errorTitle}>{errorInfo.title}</h3>
                  <p className={styles.errorMessage}>{errorInfo.message}</p>
                  {errorInfo.failedUrl && (
                    <div className={styles.errorUrl}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <span>{errorInfo.failedUrl}</span>
                    </div>
                  )}
                  <p className={styles.errorSuggestion}>{errorInfo.suggestion}</p>
                </div>
              </div>
              <div className={styles.errorActions}>
                <button
                  type="button"
                  onClick={handleRetry}
                  className={styles.retryBtn}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                  </svg>
                  Try Again
                </button>
                <a
                  href="mailto:rafal@oleksiakconsulting.com?subject=RADAR Scan Issue"
                  className={styles.helpLink}
                >
                  Need Help?
                </a>
              </div>
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
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!isFormValid() || state === 'error'}
            >
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
