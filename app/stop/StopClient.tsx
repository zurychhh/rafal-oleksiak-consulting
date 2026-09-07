'use client';

import { useState } from 'react';

export default function StopClient() {
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      setErr(v.indexOf('@') < 0
        ? 'Missing the @ — try name@company.com.'
        : 'Missing the domain — try name@company.com.');
      return;
    }
    setErr('');
    setSending(true);
    try {
      const r = await fetch('/api/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: v }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setDone(true);
    } catch {
      // Ten sam wzorzec co na stronie głównej: odwiedzający zrobił swoje,
      // więc nigdy nie zostawiamy go z niczym — dostaje adres wprost.
      setErr('That did not go through. Write to hello@oleksiakconsulting.com and I will remove you by hand.');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <form className="stopform" onSubmit={submit} noValidate>
        <div className="stopbox">
          <input
            id="stopmail"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            autoCapitalize="off"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErr(''); }}
            aria-label="Your email address"
          />
          <button type="submit" disabled={sending}>{sending ? 'Removing' : 'Remove me'}</button>
        </div>
        <p className={'stoperr' + (err ? ' on' : '')} role="alert">{err}</p>
      </form>

      <div className={'stopdone' + (done ? ' on' : '')}>
        <h2>Done · you are off the list</h2>
        <p>Nothing further is coming. If anything ever does arrive, it is a mistake — reply to it
          and I will fix it the same day.</p>
      </div>
    </>
  );
}
