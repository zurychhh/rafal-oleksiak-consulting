// LAMA - Lead Acquisition Maturity Agent
// TypeScript type definitions for audit system

export interface AuditRequest {
  url: string;
  email: string;
  fullName?: string;
  company?: string;
  consent?: boolean;
  paid?: boolean;
  paymentId?: string;
}

export interface CategoryScore {
  category: 'Find' | 'Stay' | 'Understand' | 'Trust' | 'Engage' | 'Convert';
  score: number; // 0-100
  issues: Issue[];
  recommendations: string[];
}

export interface Issue {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  impact?: string; // Business impact explanation
}

export interface AuditResult {
  url: string;
  timestamp: string;
  overallScore: number; // 0-100
  categories: CategoryScore[];
  executionTime: number; // milliseconds
}

export interface VisibilityAnalysis {
  hasMetaTitle: boolean;
  metaTitleLength: number;
  hasMetaDescription: boolean;
  metaDescriptionLength: number;
  hasH1: boolean;
  h1Count: number;
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
  score: number;
  issues: Issue[];
}

export interface PerformanceAnalysis {
  mobileScore: number; // 0-100
  desktopScore: number; // 0-100
  largestContentfulPaint: number; // milliseconds
  cumulativeLayoutShift: number; // 0-1
  firstContentfulPaint: number; // milliseconds
  totalBlockingTime: number; // milliseconds
  speedIndex: number; // milliseconds
  score: number;
  issues: Issue[];
}

export interface HubSpotActivity {
  contactId: string;
  activityType: 'audit_sent' | 'audit_opened' | 'cta_clicked' | 'paid_audit_purchased';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentInfo {
  paid: boolean;
  paymentId?: string;
  amount?: number;
  currency?: string;
  purchaseDate?: string;
}

export interface EmailTemplateData {
  recipientName: string;
  websiteUrl: string;
  overallScore: number;
  categories: CategoryScore[];
  ctaLink: string;
  auditDate: string;
  paid?: boolean;
  paymentId?: string;
}
