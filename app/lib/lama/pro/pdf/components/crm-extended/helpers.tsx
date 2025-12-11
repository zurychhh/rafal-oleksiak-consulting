import { components } from '../../shared-styles';
/**
 * Helper components for CRM Extended Section
 * Reusable building blocks to avoid code duplication
 */

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../../font-constants';
import { crmStyles as styles, COLORS } from './styles';
import type { CalculationStep, EmailTemplate, AutomationStep, Metric } from './types';

// Page Header Component
export const PageHeader: React.FC<{
  categoryName: string;
  score?: number;
  benchmark?: number;
  title: string;
  subtitle: string;
  pageNumber: string;
}> = ({ categoryName, score, benchmark, title, subtitle, pageNumber }) => (
  <View style={styles.pageHeader}>
    <View style={styles.categoryBadge}>
      <Text style={styles.categoryName}>{categoryName}</Text>
      {score !== undefined && benchmark !== undefined && (
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>
            {score}/{benchmark}
          </Text>
        </View>
      )}
    </View>
    <Text style={styles.pageTitle}>{title}</Text>
    <Text style={styles.pageSubtitle}>{subtitle}</Text>
    <Text style={styles.pageNumber}>Strona {pageNumber}</Text>
  </View>
);

// Page Footer Component
export const PageFooter: React.FC<{ pageNum: string }> = ({ pageNum }) => (
  <View style={styles.pageFooter}>
    <Text style={styles.footerText}>LAMA PRO V6 - CRM Core Audit</Text>
    <Text style={styles.footerText}>CRM Page {pageNum} of 18</Text>
  </View>
);

// Section Title Component
export const SectionTitle: React.FC<{ emoji?: string; title: string }> = ({ emoji, title }) => (
  <Text style={styles.sectionTitle}>
    {emoji && `${emoji} `}{title}
  </Text>
);

// Calculation Box Component
export const CalculationBox: React.FC<{
  steps: CalculationStep[];
  source?: string;
  note?: string;
}> = ({ steps, source, note }) => (
  <View style={styles.calculationBox}>
    {steps.map((step, idx) => (
      <Text key={idx} style={styles.calcStep}>
        <Text style={styles.calcValue}>{step.step}. </Text>
        {step.description}
        {step.value && <Text style={styles.calcValue}> → {step.value}</Text>}
      </Text>
    ))}
    {source && (
      <Text style={styles.calcSource}>
        <Text style={styles.boldText}>Source: </Text>
        {source}
      </Text>
    )}
    {note && (
      <Text style={[styles.calcSource, { marginTop: 4, paddingTop: 0, borderTopWidth: 0 }]}>
        <Text style={styles.boldText}>Uwaga: </Text>
        {note}
      </Text>
    )}
  </View>
);

// Bullet List Component
export const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <View style={styles.bulletList}>
    {items.map((item, idx) => (
      <View key={idx} style={styles.bulletItem}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
);

// Numbered List Component
export const NumberedList: React.FC<{ items: string[] }> = ({ items }) => (
  <View style={styles.bulletList}>
    {items.map((item, idx) => (
      <View key={idx} style={styles.numberedItem}>
        <Text style={styles.numberedNumber}>{idx + 1}.</Text>
        <Text style={styles.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
);

// ROI Badge Component
export const ROIBadge: React.FC<{ roi: string }> = ({ roi }) => (
  <Text style={styles.roiBadge}>ROI: {roi}</Text>
);

// Priority Badge Component
export const PriorityBadge: React.FC<{ priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' }> = ({
  priority,
}) => {
  const badgeStyle = [
    styles.priorityBadge,
    priority === 'CRITICAL' && styles.criticalBadge,
    priority === 'HIGH' && styles.highBadge,
    priority === 'MEDIUM' && styles.mediumBadge,
    priority === 'LOW' && styles.lowBadge,
  ];

  return <Text style={badgeStyle}>{priority}</Text>;
};

// Email Template Component
export const EmailTemplateCard: React.FC<{ email: EmailTemplate; showCTA?: boolean }> = ({
  email,
  showCTA = false,
}) => (
  <View style={styles.emailTemplate}>
    <Text style={styles.emailDay}>Day {email.day}</Text>
    <Text style={styles.emailSubject}>{email.subject}</Text>
    {email.preview && <Text style={styles.emailPreview}>"{email.preview}"</Text>}
    <Text style={styles.emailGoal}>Goal: {email.goal}</Text>
    {showCTA && email.cta && (
      <Text style={[styles.emailGoal, { marginTop: 2 }]}>CTA: {email.cta}</Text>
    )}
  </View>
);

// Automation Workflow Component
export const AutomationWorkflow: React.FC<{ steps: AutomationStep[]; showTools?: boolean }> = ({
  steps,
  showTools = false,
}) => (
  <View>
    {steps.map((step, idx) => (
      <View key={idx} style={styles.workflowStep}>
        <Text style={styles.workflowNumber}>{step.stepNumber}.</Text>
        <View style={styles.flex1}>
          <Text style={styles.workflowText}>
            {step.description}
            {step.conditional && ` (${step.conditional})`}
          </Text>
          {step.timing && <Text style={styles.workflowTiming}>Timing: {step.timing}</Text>}
          {showTools && step.tool && (
            <Text style={[styles.workflowTiming, { fontStyle: 'normal', color: COLORS.electricBlue }]}>
              Tool: {step.tool}
            </Text>
          )}
        </View>
      </View>
    ))}
  </View>
);

// Metric Row Component
export const MetricRow: React.FC<{ metric: Metric }> = ({ metric }) => (
  <View style={styles.metricRow}>
    <Text style={styles.metricLabel}>{metric.metric}</Text>
    <View style={[styles.row, { gap: 8 }]}>
      <Text style={styles.metricValue}>Current: {metric.current}</Text>
      <Text style={styles.metricTarget}>Target: {metric.target}</Text>
    </View>
  </View>
);

// Code Block Component
export const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <View style={styles.codeBlock}>
    <Text style={components.codeBlockText}>{code}</Text>
  </View>
);

// Problem Box Component
export const ProblemBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.problemBox}>{children}</View>
);

// Solution Box Component
export const SolutionBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.solutionBox}>{children}</View>
);

// Info Box Component
export const InfoBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.infoBox}>{children}</View>
);

// Warning Box Component
export const WarningBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.warningBox}>{children}</View>
);

// Divider Component
export const Divider: React.FC<{ thick?: boolean }> = ({ thick = false }) => (
  <View style={thick ? styles.thickDivider : styles.divider} />
);

// Body Text Component with formatting
export const BodyText: React.FC<{
  children: React.ReactNode;
  small?: boolean;
  style?: any;
}> = ({ children, small = false, style }) => (
  <Text style={[small ? styles.bodyTextSmall : styles.bodyText, style]}>{children}</Text>
);

// Bold Inline Text
export const Bold: React.FC<{ children: string }> = ({ children }) => (
  <Text style={styles.boldText}>{children}</Text>
);

// Highlight Inline Text
export const Highlight: React.FC<{ children: string }> = ({ children }) => (
  <Text style={styles.highlightText}>{children}</Text>
);

// Success Inline Text
export const Success: React.FC<{ children: string }> = ({ children }) => (
  <Text style={styles.successText}>{children}</Text>
);

// Error Inline Text
export const ErrorText: React.FC<{ children: string }> = ({ children }) => (
  <Text style={styles.errorText}>{children}</Text>
);

// Warning Inline Text
export const WarningText: React.FC<{ children: string }> = ({ children }) => (
  <Text style={styles.warningText}>{children}</Text>
);
