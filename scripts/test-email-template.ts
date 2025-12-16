// Test script for LAMA email template
// Run: npx tsx scripts/test-email-template.ts

import { generateAuditEmail } from '../lib/lama/email-template';
import type { AuditResult } from '../lib/lama/types';
import * as fs from 'fs';
import * as path from 'path';

// Mock audit data
const mockAuditResult: AuditResult = {
  url: 'https://example.com',
  timestamp: new Date().toISOString(),
  overallScore: 62,
  categories: [
    {
      category: 'Find',
      score: 75,
      issues: [
        { title: 'Meta title too short (32 characters)', severity: 'warning', description: '' },
        { title: 'Missing H1 tag on homepage', severity: 'critical', description: '' },
      ],
      recommendations: ['Optimize title length to 50-60 characters for best search display'],
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
      score: 25, // Lowest - will be marked as Priority Fix
      issues: [
        { title: 'No email capture form', severity: 'critical', description: '' },
        { title: 'No CRM integration detected', severity: 'critical', description: '' },
        { title: 'No marketing automation', severity: 'warning', description: '' },
      ],
      recommendations: ['Implement basic email capture with lead magnet'],
    },
  ],
};

// Generate email HTML
const emailHtml = generateAuditEmail({
  recipientName: 'Test User',
  auditResult: mockAuditResult,
  ctaLink: 'https://calendly.com/oleksiak-consulting/30min',
});

// Save to file
const outputPath = path.join(process.cwd(), 'test-email-output.html');
fs.writeFileSync(outputPath, emailHtml);

console.log(`\n✅ Email HTML generated successfully!`);
console.log(`📄 Output file: ${outputPath}`);
console.log(`\n🔍 To test:`);
console.log(`   1. Open in browser: open ${outputPath}`);
console.log(`   2. Use Chrome DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)`);
console.log(`   3. Select iPhone SE (375px) or iPhone 12 Pro (390px)`);
console.log(`\n📱 Mobile viewports to test: 320px, 375px, 414px`);
