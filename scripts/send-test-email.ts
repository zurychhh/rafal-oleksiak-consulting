// Send test email via Resend
// Run: npx tsx scripts/send-test-email.ts your@email.com

import { Resend } from 'resend';
import { generateAuditEmail } from '../lib/lama/email-template';
import type { AuditResult } from '../lib/lama/types';

const resend = new Resend(process.env.RESEND_API_KEY);

const testEmail = process.argv[2];

if (!testEmail) {
  console.error('❌ Usage: npx tsx scripts/send-test-email.ts your@email.com');
  process.exit(1);
}

if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY not set. Run: export RESEND_API_KEY=re_xxx');
  process.exit(1);
}

// Mock audit data
const mockAuditResult: AuditResult = {
  url: 'https://example.com',
  timestamp: new Date().toISOString(),
  overallScore: 62,
  executionTime: 5000,
  categories: [
    {
      category: 'Find',
      score: 75,
      issues: [
        { title: 'Meta title too short (32 characters)', severity: 'warning', description: '' },
        { title: 'Missing H1 tag on homepage', severity: 'critical', description: '' },
      ],
      recommendations: ['Optimize title length to 50-60 characters'],
    },
    {
      category: 'Convert',
      score: 68,
      issues: [
        { title: 'No clear CTA above the fold', severity: 'warning', description: '' },
        { title: 'Contact form has 8+ fields', severity: 'warning', description: '' },
      ],
      recommendations: ['Add a prominent CTA button in the hero section'],
    },
    {
      category: 'Stay',
      score: 55,
      issues: [
        { title: 'Page load time > 4 seconds', severity: 'critical', description: '' },
        { title: 'No mobile optimization detected', severity: 'critical', description: '' },
      ],
      recommendations: ['Compress images and enable lazy loading'],
    },
    {
      category: 'Understand',
      score: 70,
      issues: [
        { title: 'Value proposition unclear', severity: 'warning', description: '' },
      ],
      recommendations: ['Add a clear headline explaining your unique value'],
    },
    {
      category: 'Trust',
      score: 80,
      issues: [
        { title: 'No testimonials visible', severity: 'info', description: '' },
      ],
      recommendations: ['Add 2-3 customer testimonials with photos'],
    },
    {
      category: 'Engage',
      score: 25,
      issues: [
        { title: 'No email capture form', severity: 'critical', description: '' },
        { title: 'No CRM integration detected', severity: 'critical', description: '' },
        { title: 'No marketing automation', severity: 'warning', description: '' },
      ],
      recommendations: ['Implement basic email capture with lead magnet'],
    },
  ],
};

async function sendTestEmail() {
  console.log(`\n📧 Sending test email to: ${testEmail}`);

  const emailHtml = generateAuditEmail({
    recipientName: 'Test User',
    auditResult: mockAuditResult,
    ctaLink: 'https://calendly.com/oleksiak-consulting/30min',
  });

  try {
    const { data, error } = await resend.emails.send({
      from: 'LAMA Audit <audit@oleksiakconsulting.com>',
      to: testEmail,
      subject: `[TEST] Website Audit Results - Score: ${mockAuditResult.overallScore}/100`,
      html: emailHtml,
    });

    if (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    }

    console.log('✅ Email sent successfully!');
    console.log(`📬 Email ID: ${data?.id}`);
    console.log(`\n📱 Check your inbox on mobile to test the layout!`);
  } catch (err) {
    console.error('❌ Failed to send:', err);
    process.exit(1);
  }
}

sendTestEmail();
