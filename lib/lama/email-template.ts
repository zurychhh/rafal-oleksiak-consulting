// LAMA - Email Template Generator (B2B Email Best Practices Compliant)
// Table-based layout, inline CSS, CAN-SPAM/GDPR compliant
// Following EMAIL_BEST_PRACTICES.md standards

import type { AuditResult, CategoryScore, Issue } from './types';

export interface EmailData {
  recipientName: string;
  auditResult: AuditResult;
  ctaLink: string;
}

export function generateAuditEmail(data: EmailData): string {
  const { recipientName, auditResult, ctaLink } = data;
  const { overallScore, categories, url, timestamp, executionTime } = auditResult;

  const scoreColor = getScoreColor(overallScore);
  const scoreLabel = getScoreLabel(overallScore);
  const criticalIssues = getCriticalIssues(categories);

  // Preheader text (first 90 characters appear in email preview)
  const preheaderText = `Overall Score: ${overallScore}/100 | ${criticalIssues.length} critical ${criticalIssues.length === 1 ? 'issue' : 'issues'} found | Quick wins identified`;

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Your Website Audit Results - ${overallScore}/100</title>
    <!--[if mso]>
    <style type="text/css">
        table {border-collapse: collapse;}
    </style>
    <![endif]-->
    <style type="text/css">
        /* Mobile-only media queries (Gmail supports this) */
        @media only screen and (max-width: 600px) {
            .mobile-padding { padding: 20px !important; }
            .mobile-font-large { font-size: 32px !important; }
            .mobile-font-medium { font-size: 18px !important; }
            .mobile-font-small { font-size: 14px !important; }
            .mobile-hide { display: none !important; }
            .mobile-full-width { width: 100% !important; }
        }
        /* Prevent blue links in iOS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Poppins', 'DM Sans', Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">

    <!-- Preheader Text (hidden, appears in email preview) -->
    <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #f5f5f5;">
        ${preheaderText}
    </div>

    <!-- 100% background wrapper -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 40px 20px;">

                <!-- Main email container (600px max-width) -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

                    <!-- Header with Logo -->
                    <tr>
                        <td style="background-color: #1A1A2E; padding: 24px 32px;" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td>
                                        <span style="font-family: 'Poppins', Arial, sans-serif; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.01em; text-transform: uppercase; line-height: 1;">
                                            OLEKSIAK CONSULT
                                        </span>
                                    </td>
                                    <td style="padding-left: 14px;">
                                        <!-- Decorative dots -->
                                        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(90deg, #7B2CBF 0%, #0066FF 100%); margin-right: 8px;"></span>
                                        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(90deg, #7B2CBF 0%, #0066FF 100%); margin-right: 8px;"></span>
                                        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(90deg, #7B2CBF 0%, #0066FF 100%);"></span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="background-color: #1A1A2E; padding: 32px;" class="mobile-padding">

                            <!-- Main Heading -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <h1 style="font-family: 'Poppins', Arial, sans-serif; font-size: 28px; font-weight: 700; margin: 0 0 24px 0; color: #ffffff; line-height: 1.3;">
                                            Your Website Audit Results
                                        </h1>
                                    </td>
                                </tr>
                            </table>

                            <!-- Greeting -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding-bottom: 16px;">
                                        <p style="margin: 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.85);">
                                            Hi ${recipientName},
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 16px;">
                                        <p style="margin: 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.85);">
                                            I've analyzed <strong style="color: #ffffff;">${url}</strong> and found critical insights that could transform your revenue from owned channels.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style="margin: 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 14px; color: rgba(255, 255, 255, 0.6);">
                                            ⚡ Analysis completed in ${(executionTime / 1000).toFixed(1)} seconds
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Overall Score Card -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, rgba(248, 249, 250, 0.05) 0%, rgba(233, 236, 239, 0.05) 100%); border-radius: 12px; padding: 32px; border-left: 6px solid ${scoreColor};">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td align="center">
                                                    <p style="margin: 0 0 12px 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 14px; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; letter-spacing: 1px;">
                                                        Overall Score
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <p style="margin: 0; font-family: 'Poppins', Arial, sans-serif; font-size: 56px; font-weight: 700; color: ${scoreColor}; line-height: 1;">
                                                        ${overallScore}<span style="font-size: 28px; color: rgba(255, 255, 255, 0.4);">/100</span>
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <p style="margin: 12px 0 0 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; color: rgba(255, 255, 255, 0.6); font-weight: 600;">
                                                        ${scoreLabel}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Category Breakdown Section -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px;">
                                <tr>
                                    <td>
                                        <h2 style="font-family: 'Poppins', Arial, sans-serif; font-size: 22px; font-weight: 700; margin: 0 0 20px 0; color: #ffffff;">
                                            Category Breakdown
                                        </h2>
                                    </td>
                                </tr>
                            </table>

                            <!-- Category Items -->
                            ${categories.map((cat) => generateCategoryHTML(cat)).join('')}

                            <!-- Critical Issues or Success Message -->
                            ${criticalIssues.length > 0 ? `
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
                                <tr>
                                    <td style="background-color: rgba(255, 193, 7, 0.1); border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px;">
                                        <h3 style="font-family: 'Poppins', Arial, sans-serif; font-size: 18px; font-weight: 700; color: #ffc107; margin: 0 0 12px 0;">
                                            ⚠️ Critical Issues Found
                                        </h3>
                                        <p style="margin: 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.85);">
                                            ${generateCriticalIssuesSummary(criticalIssues)}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            ` : `
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
                                <tr>
                                    <td style="background-color: rgba(123, 44, 191, 0.1); border: 1px solid rgba(123, 44, 191, 0.3); border-radius: 12px; padding: 24px;">
                                        <p style="margin: 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; color: #10B981;">
                                            ✅ No critical issues found! Your website is in good shape.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            `}

                            <!-- Business Impact -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
                                <tr>
                                    <td style="background-color: rgba(123, 44, 191, 0.1); border: 1px solid rgba(123, 44, 191, 0.3); border-radius: 12px; padding: 24px;">
                                        <h3 style="font-family: 'Poppins', Arial, sans-serif; font-size: 18px; font-weight: 700; margin: 0 0 12px 0; color: rgba(255, 255, 255, 0.9);">
                                            💡 Estimated Business Impact
                                        </h3>
                                        <p style="margin: 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.85);">
                                            ${generateBusinessImpact(overallScore)}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Section -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px;">
                                <tr>
                                    <td align="center">
                                        <p style="font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; font-weight: 600; color: rgba(255, 255, 255, 0.9); margin: 0 0 20px 0;">
                                            Want to fix these issues and double your revenue?
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <!-- Bulletproof Button -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="border-radius: 12px; background: linear-gradient(135deg, #7B2CBF 0%, #6A25AB 100%);">
                                                    <a href="${ctaLink}" target="_blank" style="display: inline-block; padding: 18px 48px; font-family: 'Poppins', Arial, sans-serif; font-size: 18px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px;">
                                                        Book Free Consultation →
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <p style="margin: 12px 0 0 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 14px; color: rgba(255, 255, 255, 0.6);">
                                            No commitment required • 30-minute strategy call
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Social Proof -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
                                <tr>
                                    <td style="background-color: rgba(0, 102, 255, 0.05); border: 1px solid rgba(0, 102, 255, 0.2); border-radius: 12px; padding: 24px;" align="center">
                                        <p style="font-family: 'DM Sans', Arial, sans-serif; font-style: italic; font-size: 16px; color: rgba(255, 255, 255, 0.85); margin: 0 0 16px 0; line-height: 1.6;">
                                            "Rafał doubled our marketing automation revenue in 6 months"
                                        </p>
                                        <p style="margin: 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 13px; color: rgba(255, 255, 255, 0.5);">
                                            — Previous clients: Allegro, Accenture, Booksy, mBank
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px; background-color: #1A1A2E; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 16px 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; color: rgba(255, 255, 255, 0.85);">
                                            Best regards,
                                        </p>
                                        <p style="margin: 0; font-family: 'Poppins', Arial, sans-serif; font-weight: 700; font-size: 18px; color: #ffffff;">
                                            Rafał Oleksiak
                                        </p>
                                        <p style="margin: 4px 0 16px 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 14px; color: rgba(255, 255, 255, 0.6);">
                                            CRM & Marketing Automation Consultant
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 8px 0;">
                                            <a href="mailto:contact@oleksiakconsulting.com" style="font-family: 'DM Sans', Arial, sans-serif; font-size: 14px; color: #9D4EDD; text-decoration: none;">
                                                contact@oleksiakconsulting.com
                                            </a>
                                        </p>
                                        <p style="margin: 0;">
                                            <a href="https://www.linkedin.com/in/rafal-oleksiak" target="_blank" style="font-family: 'DM Sans', Arial, sans-serif; font-size: 14px; color: #9D4EDD; text-decoration: none;">
                                                LinkedIn Profile →
                                            </a>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                                        <p style="margin: 8px 0 0 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.4); line-height: 1.6;">
                                            Audit generated on ${new Date(timestamp).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- CAN-SPAM/GDPR Compliance Footer -->
                    <tr>
                        <td style="padding: 20px 30px; background-color: #f5f5f5; border-top: 1px solid #e0e0e0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0 0 8px 0; font-family: Arial, sans-serif; font-size: 12px; color: #666; line-height: 1.6;">
                                            <strong>Rafał Oleksiak Consulting</strong><br>
                                            ul. Prosta 51, 00-838 Warszawa, Poland<br>
                                            NIP: 1132855368
                                        </p>
                                        <p style="margin: 0 0 8px 0; font-family: Arial, sans-serif; font-size: 12px; color: #666;">
                                            <a href="https://oleksiakconsulting.com/privacy" style="color: #7B2CBF; text-decoration: underline;">Privacy Policy</a> |
                                            <a href="mailto:contact@oleksiakconsulting.com?subject=Unsubscribe" style="color: #7B2CBF; text-decoration: underline;">Unsubscribe</a>
                                        </p>
                                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 11px; color: #999;">
                                            You received this email because you requested a free website audit at oleksiakconsulting.com
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
                <!-- End main email container -->

            </td>
        </tr>
    </table>
    <!-- End 100% background wrapper -->

</body>
</html>
  `.trim();
}

function generateCategoryHTML(category: CategoryScore): string {
  const { category: name, score, issues, recommendations } = category;
  const scoreColor = getScoreColor(score);
  const progressWidth = `${score}%`;
  const gradient = getScoreGradient(score);
  const categoryMeta = getCategoryMeta(name);

  return `
    <!-- Category: ${name} -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
        <tr>
            <td>
                <!-- Category Header -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 8px;">
                    <tr>
                        <td>
                            <span style="font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; font-weight: 600; color: rgba(255, 255, 255, 0.9);">
                                ${categoryMeta.emoji} ${categoryMeta.title}
                            </span>
                            <br>
                            <span style="font-family: 'DM Sans', Arial, sans-serif; font-size: 13px; color: rgba(255, 255, 255, 0.6); font-style: italic;">
                                ${categoryMeta.question}
                            </span>
                        </td>
                        <td align="right" valign="top">
                            <span style="font-family: 'Poppins', Arial, sans-serif; font-size: 16px; font-weight: 700; color: ${scoreColor};">
                                ${score}/100
                            </span>
                        </td>
                    </tr>
                </table>

                <!-- Progress Bar -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 12px;">
                    <tr>
                        <td style="background-color: rgba(233, 236, 239, 0.1); border-radius: 20px; height: 12px; padding: 0;">
                            <div style="background: ${gradient}; width: ${progressWidth}; height: 12px; border-radius: 20px;"></div>
                        </td>
                    </tr>
                </table>

                <!-- Issues (top 2) -->
                ${issues.slice(0, 2).map((issue) => `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 8px 0;">
                    <tr>
                        <td style="border-left: 3px solid ${getSeverityColor(issue.severity)}; padding-left: 15px;">
                            <p style="margin: 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 14px; color: rgba(255, 255, 255, 0.75);">
                                ${getSeverityIcon(issue.severity)} ${issue.title}
                            </p>
                        </td>
                    </tr>
                </table>
                `).join('')}

                <!-- Recommendation (Quick Win) -->
                ${recommendations.length > 0 ? `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 12px;">
                    <tr>
                        <td style="background-color: rgba(0, 102, 255, 0.08); border-radius: 8px; padding: 12px 16px;">
                            <p style="margin: 0; font-family: 'DM Sans', Arial, sans-serif; font-size: 13px; color: #00BFFF;">
                                💡 <strong>Quick Win:</strong> ${recommendations[0]}
                            </p>
                        </td>
                    </tr>
                </table>
                ` : ''}
            </td>
        </tr>
    </table>
  `;
}

function getCriticalIssues(categories: CategoryScore[]): Issue[] {
  return categories.flatMap(c =>
    c.issues.filter(i => i.severity === 'critical')
  );
}

function generateCriticalIssuesSummary(issues: Issue[]): string {
  if (issues.length === 0) return '';

  const summaries = issues.slice(0, 3).map(issue => issue.title);
  return `Found ${issues.length} critical ${issues.length === 1 ? 'issue' : 'issues'}: ${summaries.join(', ')}.`;
}

function generateBusinessImpact(overallScore: number): string {
  if (overallScore >= 80) {
    return "You're ahead of 70% of competitors. Small optimizations could push you to the top 10%.";
  }

  if (overallScore >= 60) {
    return "You're losing an estimated 20-30% of potential conversions due to fixable issues. Quick improvements could add €10-50k annual revenue.";
  }

  if (overallScore >= 40) {
    return "Critical issues are costing you 40-50% of potential leads. Fixing these could double your inbound conversions within 3 months.";
  }

  return "Your website is significantly underperforming. You're likely losing 60%+ of potential customers. Urgent action needed to stop revenue leakage.";
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981'; // Green
  if (score >= 60) return '#FFC107'; // Yellow
  if (score >= 40) return '#FF9800'; // Orange
  return '#DC2626'; // Red
}

function getScoreGradient(score: number): string {
  if (score >= 80) return 'linear-gradient(90deg, #10B981 0%, #34D399 100%)';
  if (score >= 60) return 'linear-gradient(90deg, #FFC107 0%, #FFD54F 100%)';
  if (score >= 40) return 'linear-gradient(90deg, #FF9800 0%, #FFB74D 100%)';
  return 'linear-gradient(90deg, #DC2626 0%, #EF4444 100%)';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good - Room for improvement';
  if (score >= 40) return 'Needs attention';
  return 'Critical issues found';
}

function getSeverityColor(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical': return '#DC2626';
    case 'warning': return '#FFC107';
    case 'info': return '#00BFFF';
  }
}

function getSeverityIcon(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical': return '🚨';
    case 'warning': return '⚠️';
    case 'info': return 'ℹ️';
  }
}

function getCategoryMeta(category: 'Find' | 'Stay' | 'Understand' | 'Trust' | 'Engage' | 'Convert'): { emoji: string; title: string; question: string } {
  switch (category) {
    case 'Find':
      return {
        emoji: '🔍',
        title: 'Find',
        question: 'Will people find my website?'
      };
    case 'Stay':
      return {
        emoji: '⚡',
        title: 'Stay',
        question: 'Will people stay on my website?'
      };
    case 'Understand':
      return {
        emoji: '💡',
        title: 'Understand',
        question: 'Will people understand what I offer?'
      };
    case 'Trust':
      return {
        emoji: '🛡️',
        title: 'Trust',
        question: 'Will people trust my business?'
      };
    case 'Convert':
      return {
        emoji: '🎯',
        title: 'Convert',
        question: 'Will people convert into customers?'
      };
    case 'Engage':
      return {
        emoji: '🤝',
        title: 'Engage',
        question: 'How mature is my CRM & marketing automation?'
      };
  }
}
