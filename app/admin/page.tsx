'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('Invalid email or password');
        return;
      }

      router.push('/admin/dashboard');
    } catch {
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h1 className={styles.loginTitle}>Admin Panel</h1>
        <p className={styles.loginSubtitle}>Sign in to manage your blogs</p>

        {error && <div className={styles.loginError}>{error}</div>}

        <label className={styles.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
            autoFocus
          />
        </label>

        <label className={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </label>

        <button type="submit" className={styles.loginButton} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
