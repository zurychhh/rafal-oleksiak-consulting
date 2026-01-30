import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Oleksiak Consulting',
  description: 'Privacy policy for oleksiakconsulting.com. GDPR-compliant data processing information.',
}

export default function PrivacyPolicy() {
  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 24px', color: '#ccc', background: '#1a1a2e', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '32px' }}>Privacy Policy</h1>

      <p style={{ marginBottom: '16px', lineHeight: 1.7 }}>
        <strong style={{ color: '#fff' }}>Last updated:</strong> January 2026
      </p>

      <h2 style={{ color: '#fff', fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>1. Data Controller</h2>
      <p style={{ lineHeight: 1.7 }}>
        Rafał Oleksiak, operating as Oleksiak Consulting<br />
        Email: <a href="mailto:rafal@oleksiakconsulting.com" style={{ color: '#9D4EDD' }}>rafal@oleksiakconsulting.com</a><br />
        Phone: <a href="tel:+48571903167" style={{ color: '#9D4EDD' }}>+48 571 903 167</a>
      </p>

      <h2 style={{ color: '#fff', fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>2. Data We Collect</h2>
      <p style={{ lineHeight: 1.7 }}>
        When you use our contact form or request a website audit, we collect: your name, email address, company website URL, and any additional information you provide. We also collect anonymized usage data through Google Analytics 4 (GA4).
      </p>

      <h2 style={{ color: '#fff', fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>3. How We Use Your Data</h2>
      <ul style={{ lineHeight: 1.7, paddingLeft: '20px' }}>
        <li>To respond to your inquiry and provide consulting services</li>
        <li>To generate your free website audit report (LAMA)</li>
        <li>To send marketing communications (only with your explicit consent)</li>
        <li>To improve our website and services through anonymized analytics</li>
      </ul>

      <h2 style={{ color: '#fff', fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>4. Legal Basis (GDPR)</h2>
      <p style={{ lineHeight: 1.7 }}>
        We process your data based on: (a) your explicit consent (Art. 6(1)(a) GDPR) for marketing communications;
        (b) legitimate interest (Art. 6(1)(f) GDPR) for responding to inquiries and improving our services;
        (c) contractual necessity (Art. 6(1)(b) GDPR) when providing consulting services.
      </p>

      <h2 style={{ color: '#fff', fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>5. Third-Party Services</h2>
      <ul style={{ lineHeight: 1.7, paddingLeft: '20px' }}>
        <li><strong style={{ color: '#fff' }}>Google Analytics 4</strong> — anonymized website usage analytics</li>
        <li><strong style={{ color: '#fff' }}>HubSpot</strong> — CRM and contact management</li>
        <li><strong style={{ color: '#fff' }}>Resend</strong> — email delivery</li>
        <li><strong style={{ color: '#fff' }}>Vercel</strong> — website hosting</li>
        <li><strong style={{ color: '#fff' }}>Stripe</strong> — payment processing (if applicable)</li>
      </ul>

      <h2 style={{ color: '#fff', fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>6. Cookies</h2>
      <p style={{ lineHeight: 1.7 }}>
        We use essential cookies for site functionality and analytics cookies (Google Analytics) to understand how visitors use our site.
        You can control cookie preferences through the consent banner shown on your first visit.
      </p>

      <h2 style={{ color: '#fff', fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>7. Your Rights</h2>
      <p style={{ lineHeight: 1.7 }}>
        Under GDPR, you have the right to: access your data, rectify inaccurate data, erase your data,
        restrict processing, data portability, object to processing, and withdraw consent at any time.
        Contact us at <a href="mailto:rafal@oleksiakconsulting.com" style={{ color: '#9D4EDD' }}>rafal@oleksiakconsulting.com</a> to exercise these rights.
      </p>

      <h2 style={{ color: '#fff', fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>8. Data Retention</h2>
      <p style={{ lineHeight: 1.7 }}>
        We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy,
        or as required by law. You may request deletion at any time.
      </p>

      <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <a href="/" style={{ color: '#9D4EDD', textDecoration: 'none' }}>&larr; Back to homepage</a>
      </div>
    </main>
  )
}
