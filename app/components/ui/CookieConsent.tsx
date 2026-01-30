'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Delay showing banner to not block initial paint
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      data-cookie-consent="banner"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(20, 20, 30, 0.97)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(123, 44, 191, 0.3)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      <p style={{ color: '#ccc', fontSize: '14px', margin: 0, maxWidth: '600px' }}>
        This site uses cookies and Google Analytics to improve your experience.
        By continuing, you consent to our use of cookies.
        See our <a href="/privacy" style={{ color: '#9D4EDD', textDecoration: 'underline' }}>Privacy Policy</a>.
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={accept}
          style={{
            background: 'linear-gradient(135deg, #7B2CBF, #0066FF)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 20px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Accept
        </button>
        <button
          onClick={decline}
          style={{
            background: 'transparent',
            color: '#999',
            border: '1px solid #444',
            borderRadius: '6px',
            padding: '8px 20px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
      </div>
    </div>
  )
}
