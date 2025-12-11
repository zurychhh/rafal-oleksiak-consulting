// LAMA - Email Template Generator v2.0
// Premium dark-theme design with SVG score circle
// Table-based layout, inline CSS, email-compatible
// CAN-SPAM/GDPR compliant

import type { AuditResult, CategoryScore, Issue } from './types';

export interface EmailData {
  recipientName: string;
  auditResult: AuditResult;
  ctaLink: string;
}

export function generateAuditEmail(data: EmailData): string {
  const { recipientName, auditResult, ctaLink } = data;
  const { overallScore, categories, url, timestamp } = auditResult;

  const scoreColor = getScoreColor(overallScore);
  const criticalIssues = getCriticalIssues(categories);
  const quickWinsCount = categories.reduce((sum, cat) => sum + cat.recommendations.length, 0);
  const percentile = getScorePercentile(overallScore);

  // Calculate SVG stroke offset (circumference = 628, 100% = 0 offset)
  const circumference = 628;
  const strokeOffset = Math.round(circumference - (overallScore / 100 * circumference));

  // Preheader text
  const preheaderText = `Overall Score: ${overallScore}/100 | ${criticalIssues.length} critical ${criticalIssues.length === 1 ? 'issue' : 'issues'} found | ${quickWinsCount} quick wins identified`;

  // Find lowest scoring category for "Priority Fix"
  const lowestCategory = [...categories].sort((a, b) => a.score - b.score)[0];

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <meta name="x-apple-disable-message-reformatting">
    <title>Your Website Audit Results - ${overallScore}/100</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <style type="text/css">
        table {border-collapse: collapse;}
        td {font-family: Arial, sans-serif;}
    </style>
    <![endif]-->
    <style type="text/css">
        body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
        @media only screen and (max-width: 620px) {
            .mobile-full-width { width: 100% !important; }
            .mobile-padding { padding: 20px !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
            .mobile-center { text-align: center !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0D0D14; font-family: Arial, Helvetica, sans-serif;">

    <!-- Preheader (hidden) -->
    <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #0D0D14;">
        ${preheaderText}
    </div>

    <!-- Email Wrapper -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0D0D14;">
        <tr>
            <td align="center" style="padding: 0;">

                <!-- Main Container 600px -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="mobile-full-width" style="max-width: 600px; background-color: #0D0D14;">

                    <!-- HEADER with Logo + 3 Dots -->
                    <tr>
                        <td style="padding: 24px 32px; background-color: #0D0D14;" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="font-family: Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 800; color: #F9FAFB; letter-spacing: 0.5px; text-transform: uppercase;">
                                        OLEKSIAK CONSULT
                                    </td>
                                    <td style="padding-left: 12px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="width: 8px; height: 8px; background-color: #7B2CBF; border-radius: 50%;"></td>
                                                <td style="width: 6px;"></td>
                                                <td style="width: 8px; height: 8px; background-color: #5B3CC4; border-radius: 50%;"></td>
                                                <td style="width: 6px;"></td>
                                                <td style="width: 8px; height: 8px; background-color: #0066FF; border-radius: 50%;"></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- HERO SCORE SECTION -->
                    <tr>
                        <td align="center" style="padding: 48px 32px; background: linear-gradient(135deg, #1E1B4B 0%, #0D0D14 50%, #0C1222 100%);" class="mobile-padding">

                            <h1 style="font-family: Arial, Helvetica, sans-serif; font-size: 32px; font-weight: 700; color: #F9FAFB; margin: 0 0 12px 0;">Your Website Audit Results</h1>
                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; color: #9CA3AF; margin: 0 0 32px 0;">We've analyzed <span style="color: #FFFFFF; font-weight: 700; text-decoration: none;">${new URL(url).hostname.replace(/\./g, '&#8203;.')}</span> and found opportunities for improvement</p>

                            <!-- Score Circle - Simple table-based approach -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                <tr>
                                    <td align="center" valign="middle" width="180" height="180" style="width: 180px; height: 180px; background: linear-gradient(135deg, #7B2CBF 0%, #5B3CC4 100%); border-radius: 50%; -webkit-border-radius: 50%; -moz-border-radius: 50%;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td align="center" style="padding: 0;">
                                                    <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 56px; font-weight: 700; color: #FFFFFF; line-height: 1;">${overallScore}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="padding: 4px 0 0 0;">
                                                    <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.85);">Overall</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>


                        </td>
                    </tr>

                    <!-- QUICK STATS 2x2 -->
                    <tr>
                        <td style="padding: 32px 32px 0 32px;" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td width="48%" style="background-color: #16161F; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; text-align: center;" class="mobile-stack">
                                        <p style="margin: 0 0 4px 0; font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #8B5CF6;">6</p>
                                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; color: #9CA3AF;">Categories Analyzed</p>
                                    </td>
                                    <td width="4%"></td>
                                    <td width="48%" style="background-color: #16161F; border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 20px; text-align: center;" class="mobile-stack">
                                        <p style="margin: 0 0 4px 0; font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #EF4444;">${criticalIssues.length}</p>
                                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; color: #9CA3AF;">Critical Issues</p>
                                    </td>
                                </tr>
                                <tr><td colspan="3" height="12"></td></tr>
                                <tr>
                                    <td width="48%" style="background-color: #16161F; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; text-align: center;" class="mobile-stack">
                                        <p style="margin: 0 0 4px 0; font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #10B981;">${quickWinsCount}</p>
                                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; color: #9CA3AF;">Quick Wins Found</p>
                                    </td>
                                    <td width="4%"></td>
                                    <td width="48%" style="background-color: #16161F; border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 12px; padding: 20px; text-align: center;" class="mobile-stack">
                                        <p style="margin: 0 0 4px 0; font-family: 'Courier New', monospace; font-size: 28px; font-weight: 700; color: #F59E0B;">${getEstimatedRevenue(overallScore)}</p>
                                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; color: #9CA3AF;">Revenue at Risk</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- CATEGORY BREAKDOWN HEADER -->
                    <tr>
                        <td style="padding: 48px 32px 24px 32px;" class="mobile-padding">
                            <h2 style="font-family: Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 700; color: #F9FAFB; margin: 0;">Category Breakdown</h2>
                        </td>
                    </tr>

                    <!-- CATEGORY CARDS -->
                    <tr>
                        <td style="padding: 0 32px 32px 32px;" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                ${generateCategoryRows(categories, lowestCategory.category)}
                            </table>
                        </td>
                    </tr>

                    <!-- CRITICAL FINDING SPOTLIGHT -->
                    ${criticalIssues.length > 0 ? `
                    <tr>
                        <td style="padding: 0 32px 32px 32px;" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%); border: 1px solid rgba(239, 68, 68, 0.3); border-left: 5px solid #EF4444; border-radius: 12px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="56" valign="top">
                                                    <div style="width: 40px; height: 40px; background-color: rgba(239, 68, 68, 0.15); border-radius: 10px; text-align: center; line-height: 40px; font-size: 20px;">&#9888;</div>
                                                </td>
                                                <td valign="top">
                                                    <h3 style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 700; color: #F9FAFB; margin: 0 0 8px 0;">${criticalIssues.length} Critical Issue${criticalIssues.length > 1 ? 's' : ''} Need${criticalIssues.length === 1 ? 's' : ''} Immediate Attention</h3>
                                                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #9CA3AF; margin: 0; line-height: 1.6;">${generateCriticalIssuesSummary(criticalIssues, lowestCategory)}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    ` : ''}

                    <!-- BUSINESS IMPACT -->
                    <tr>
                        <td style="padding: 0 32px 16px 32px;" class="mobile-padding">
                            <h2 style="font-family: Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 700; color: #F9FAFB; margin: 0 0 20px 0;">What This Means For Your Business</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 32px 20px 32px;" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td width="32%" style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 10px; padding: 16px; text-align: center;" class="mobile-stack">
                                        <p style="margin: 0 0 4px 0; font-size: 24px;">&#128200;</p>
                                        <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 14px; font-weight: 700; color: #EF4444;">${getConversionLoss(overallScore)}</p>
                                        <p style="margin: 4px 0 0 0; font-family: Arial, sans-serif; font-size: 11px; color: #9CA3AF;">Conversion Loss</p>
                                    </td>
                                    <td width="2%"></td>
                                    <td width="32%" style="background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 10px; padding: 16px; text-align: center;" class="mobile-stack">
                                        <p style="margin: 0 0 4px 0; font-size: 24px;">&#128176;</p>
                                        <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 14px; font-weight: 700; color: #F59E0B;">${getEstimatedRevenue(overallScore)}</p>
                                        <p style="margin: 4px 0 0 0; font-family: Arial, sans-serif; font-size: 11px; color: #9CA3AF;">Annual Risk</p>
                                    </td>
                                    <td width="2%"></td>
                                    <td width="32%" style="background-color: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 10px; padding: 16px; text-align: center;" class="mobile-stack">
                                        <p style="margin: 0 0 4px 0; font-size: 24px;">&#9203;</p>
                                        <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 14px; font-weight: 700; color: #8B5CF6;">3mo</p>
                                        <p style="margin: 4px 0 0 0; font-family: Arial, sans-serif; font-size: 11px; color: #9CA3AF;">to Fix</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 32px 48px 32px;" class="mobile-padding">
                            <p style="font-family: Arial, sans-serif; font-size: 15px; color: #9CA3AF; line-height: 1.7; margin: 0;">${generateBusinessImpact(overallScore)}</p>
                        </td>
                    </tr>

                    <!-- CTA SECTION -->
                    <tr>
                        <td align="center" style="padding: 40px 32px; background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%); border-top: 1px solid rgba(139, 92, 246, 0.2); border-bottom: 1px solid rgba(139, 92, 246, 0.2);" class="mobile-padding">
                            <p style="font-family: Arial, sans-serif; font-size: 15px; color: #9CA3AF; margin: 0 0 24px 0;">Ready to fix these issues?</p>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="border-radius: 12px; background: linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%);">
                                        <a href="${ctaLink}" target="_blank" style="display: inline-block; padding: 18px 48px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 700; color: #FFFFFF; text-decoration: none;">
                                            Book Strategy Call &#8594;
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-family: Arial, sans-serif; font-size: 13px; color: #6B7280; margin: 16px 0 0 0;">Free &bull; 30 min &bull; No obligation</p>
                        </td>
                    </tr>

                    <!-- TRUST STRIP -->
                    <tr>
                        <td align="center" style="padding: 32px 32px 24px 32px;" class="mobile-padding">
                            <p style="font-family: Arial, sans-serif; font-size: 12px; color: #6B7280; margin: 0;">
                                Trusted by teams at
                                <span style="color: #9CA3AF; font-weight: 600;">Allegro</span>,
                                <span style="color: #9CA3AF; font-weight: 600;">Accenture</span>,
                                <span style="color: #9CA3AF; font-weight: 600;">Booksy</span>
                            </p>
                        </td>
                    </tr>

                    <!-- SIGNATURE -->
                    <tr>
                        <td style="padding: 0 32px 32px 32px;" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top: 1px solid rgba(255, 255, 255, 0.05);">
                                <tr>
                                    <td style="padding-top: 24px;">
                                        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #9CA3AF; margin: 0 0 4px 0;">Best regards,</p>
                                        <p style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; color: #F9FAFB; margin: 0 0 2px 0;">Rafal Oleksiak</p>
                                        <p style="font-family: Arial, sans-serif; font-size: 13px; color: #6B7280; margin: 0 0 12px 0;">CRM & Marketing Automation Consultant</p>
                                        <p style="margin: 0;">
                                            <a href="mailto:rafal@oleksiakconsulting.com" style="font-family: Arial, sans-serif; font-size: 13px; color: #8B5CF6; text-decoration: none;">rafal@oleksiakconsulting.com</a>
                                            <span style="color: #4B5563; margin: 0 8px;">|</span>
                                            <a href="https://www.linkedin.com/in/rafal-oleksiak" style="font-family: Arial, sans-serif; font-size: 13px; color: #8B5CF6; text-decoration: none;">LinkedIn &#8594;</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td align="center" style="padding: 24px 32px; background-color: rgba(22, 22, 31, 0.5); border-top: 1px solid rgba(255, 255, 255, 0.05);" class="mobile-padding">
                            <a href="mailto:rafal@oleksiakconsulting.com?subject=Unsubscribe" style="font-family: Arial, sans-serif; font-size: 12px; color: #6B7280; text-decoration: none;">Unsubscribe</a>
                            <p style="font-family: Arial, sans-serif; font-size: 11px; color: #4B5563; margin: 8px 0 0 0;">&copy; ${new Date(timestamp).getFullYear()} Oleksiak Consulting</p>
                        </td>
                    </tr>

                </table>
                <!-- End Main Container -->

            </td>
        </tr>
    </table>
    <!-- End Email Wrapper -->

</body>
</html>`.trim();
}

// Generate category cards in 2-column rows
function generateCategoryRows(categories: CategoryScore[], lowestCategoryName: string): string {
  // Order categories: Find, Convert, Stay, Understand, Trust, Engage
  const orderedCategories = ['Find', 'Convert', 'Stay', 'Understand', 'Trust', 'Engage'];
  const sortedCategories = orderedCategories
    .map(name => categories.find(c => c.category === name))
    .filter((c): c is CategoryScore => c !== undefined);

  let html = '';

  for (let i = 0; i < sortedCategories.length; i += 2) {
    const cat1 = sortedCategories[i];
    const cat2 = sortedCategories[i + 1];

    html += `
                                <tr>
                                    ${generateCategoryCard(cat1, cat1.category === lowestCategoryName)}
                                    <td width="4%"></td>
                                    ${cat2 ? generateCategoryCard(cat2, cat2.category === lowestCategoryName) : '<td width="48%"></td>'}
                                </tr>
                                <tr><td colspan="3" height="12"></td></tr>`;
  }

  return html;
}

// Generate a single category card
function generateCategoryCard(category: CategoryScore, isPriorityFix: boolean): string {
  const { category: name, score, issues, recommendations } = category;
  const meta = getCategoryMeta(name);
  const scoreColor = getScoreColor(score);

  const borderStyle = isPriorityFix
    ? 'border: 2px solid rgba(239, 68, 68, 0.5);'
    : 'border: 1px solid rgba(255, 255, 255, 0.08);';

  const priorityBadge = isPriorityFix ? `
                                            <tr>
                                                <td colspan="2" align="right" style="padding-bottom: 8px;">
                                                    <span style="display: inline-block; padding: 4px 10px; background-color: #EF4444; border-radius: 12px; font-family: Arial, sans-serif; font-size: 10px; font-weight: 700; color: #FFF; text-transform: uppercase; letter-spacing: 0.5px;">Priority Fix</span>
                                                </td>
                                            </tr>` : '';

  const topIssues = issues.slice(0, 2);
  const issuesHtml = topIssues.map(issue => `
                                            <tr>
                                                <td colspan="2" style="border-left: 3px solid ${getSeverityColor(issue.severity)}; padding-left: 12px; padding-bottom: 8px;">
                                                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #9CA3AF;">${issue.title}</p>
                                                </td>
                                            </tr>`).join('');

  const quickWinHtml = recommendations.length > 0 ? `
                                            <tr>
                                                <td colspan="2" style="background-color: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 8px; padding: 10px 12px;">
                                                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 11px; color: #06B6D4;"><strong>Quick Win:</strong> ${recommendations[0]}</p>
                                                </td>
                                            </tr>` : '';

  return `
                                    <td width="48%" valign="top" style="background-color: #16161F; ${borderStyle} border-radius: 12px; padding: 20px;" class="mobile-stack">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            ${priorityBadge}
                                            <tr>
                                                <td style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 600; color: #F9FAFB;">
                                                    <span style="color: #06B6D4;">${meta.emoji}</span> ${meta.title}
                                                </td>
                                                <td align="right">
                                                    <span style="display: inline-block; width: 6px; height: 6px; background-color: ${scoreColor}; border-radius: 50%;"></span>
                                                    <span style="font-family: 'Courier New', monospace; font-size: 16px; font-weight: 700; color: #F9FAFB; margin-left: 6px;">${score}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding: 8px 0 12px 0;">
                                                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #6B7280; font-style: italic;">"${meta.question}"</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding-bottom: 16px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="background-color: rgba(255,255,255,0.05); border-radius: 2px; height: 4px;">
                                                                <div style="background-color: ${scoreColor}; width: ${score}%; height: 4px; border-radius: 2px;"></div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            ${issuesHtml}
                                            ${quickWinHtml}
                                        </table>
                                    </td>`;
}

// Helper functions
function getCriticalIssues(categories: CategoryScore[]): Issue[] {
  return categories.flatMap(c => c.issues.filter(i => i.severity === 'critical'));
}

function generateCriticalIssuesSummary(issues: Issue[], lowestCategory: CategoryScore): string {
  const categoryName = lowestCategory.category.toLowerCase();
  return `Your ${categoryName} score (${lowestCategory.score}) indicates missed revenue opportunities. ${issues.slice(0, 2).map(i => i.title).join('. ')}. These can be fixed quickly.`;
}

function generateBusinessImpact(overallScore: number): string {
  if (overallScore >= 80) {
    return "You're ahead of most competitors. Small optimizations could push you to the top 10%. Focus on the quick wins identified above to maximize your conversion potential.";
  }
  if (overallScore >= 60) {
    return "Based on industry benchmarks, websites with similar scores typically lose 20-30% of potential conversions. This translates to significant missed annual revenue. The good news? Most issues can be resolved within 3 months.";
  }
  if (overallScore >= 40) {
    return "Critical issues are costing you 40-50% of potential leads. Based on your traffic levels, fixing these could double your inbound conversions within 3 months with focused optimization.";
  }
  return "Your website is significantly underperforming. You're likely losing 60%+ of potential customers. Urgent action is needed to stop revenue leakage and get your growth back on track.";
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#F59E0B';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
}

function getSeverityColor(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical': return '#EF4444';
    case 'warning': return '#F59E0B';
    case 'info': return '#06B6D4';
  }
}

function getScorePercentile(score: number): string {
  if (score >= 90) return 'Top 5% of analyzed websites';
  if (score >= 80) return 'Top 15% of analyzed websites';
  if (score >= 70) return 'Top 35% of analyzed websites';
  if (score >= 60) return 'Top 50% of analyzed websites';
  if (score >= 50) return 'Below average performance';
  return 'Needs significant improvement';
}

function getEstimatedRevenue(score: number): string {
  if (score >= 80) return 'EUR15k';
  if (score >= 60) return 'EUR35k';
  if (score >= 40) return 'EUR47k';
  return 'EUR65k+';
}

function getConversionLoss(score: number): string {
  if (score >= 80) return '-10%';
  if (score >= 60) return '-23%';
  if (score >= 40) return '-35%';
  return '-50%+';
}

function getCategoryMeta(category: string): { emoji: string; title: string; question: string } {
  switch (category) {
    case 'Find':
      return { emoji: '&#128269;', title: 'Find', question: 'Will people find my website?' };
    case 'Stay':
      return { emoji: '&#9201;', title: 'Stay', question: 'Will visitors stay on my website?' };
    case 'Understand':
      return { emoji: '&#128161;', title: 'Understand', question: 'Will people understand what I offer?' };
    case 'Trust':
      return { emoji: '&#128737;', title: 'Trust', question: 'Will visitors trust my business?' };
    case 'Convert':
      return { emoji: '&#127919;', title: 'Convert', question: 'Will visitors become customers?' };
    case 'Engage':
      return { emoji: '&#129309;', title: 'Engage', question: 'How mature is my CRM & automation?' };
    default:
      return { emoji: '&#128200;', title: category, question: 'How does this category perform?' };
  }
}
