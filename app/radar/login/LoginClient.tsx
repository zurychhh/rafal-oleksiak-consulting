'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './login.module.css';

type LoginState = 'idle' | 'sending' | 'sent' | 'error';

const ERROR_MESSAGES: Record<string, string> = {
  missing_token: 'Login link is missing. Please request a new one.',
  invalid_or_expired: 'This login link has expired. Please request a new one.',
  verification_failed: 'Verification failed. Please try again.',
};

export default function LoginClient() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<LoginState>('idle');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam && ERROR_MESSAGES[errorParam]) {
      setError(ERROR_MESSAGES[errorParam]);
      setState('error');
    }
  }, [searchParams]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'sending' || cooldown > 0) return;

    setState('sending');
    setError('');

    try {
      const res = await fetch('/api/radar/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send login link');
      }

      setState('sent');
      setCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  };

  const handleResend = () => {
    setState('idle');
    setError('');
  };

  return (
    <div className={styles.loginPage}>
      {/* Floating gradient shapes */}
      <div className={styles.floatingShape1} />
      <div className={styles.floatingShape2} />

      <div className={styles.loginContainer}>
        {/* RADAR Branding */}
        <div className={styles.branding}>
          <span className={styles.radarBadge}>RADAR</span>
          <p className={styles.brandingSub}>Competitive Intelligence</p>
        </div>

        {/* Login Card */}
        <div className={styles.loginCard}>
          {state === 'sent' ? (
            <div className={styles.sentState}>
              <div className={styles.sentIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 6L2 7" />
                </svg>
              </div>
              <h2 className={styles.sentTitle}>Check your email</h2>
              <p className={styles.sentDescription}>
                We sent a sign-in link to <strong>{email}</strong>. Click the link in the email to access your dashboard.
              </p>
              <p className={styles.sentHint}>
                The link expires in 15 minutes.
              </p>
              <button
                onClick={handleResend}
                disabled={cooldown > 0}
                className={styles.resendBtn}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Send another link'}
              </button>
            </div>
          ) : (
            <>
              <h1 className={styles.loginTitle}>Sign in to your dashboard</h1>
              <p className={styles.loginSubtitle}>
                Enter your email and we&apos;ll send you a magic link to sign in.
              </p>

              {error && (
                <div className={styles.errorBox}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.loginForm}>
                <label className={styles.inputLabel} htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={styles.emailInput}
                  required
                  autoFocus
                  disabled={state === 'sending'}
                />
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={state === 'sending' || !email}
                >
                  {state === 'sending' ? (
                    <span className={styles.loadingText}>
                      <span className={styles.spinner} />
                      Sending...
                    </span>
                  ) : (
                    'Send magic link'
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Back to RADAR link */}
        <a href="/radar" className={styles.backLink}>
          &larr; Back to RADAR
        </a>
      </div>
    </div>
  );
}
