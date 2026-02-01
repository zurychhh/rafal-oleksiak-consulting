// RADAR - Email Report Template
// Generates HTML email with competitive intelligence results

import type { RadarReport, CompetitorAnalysis, ActionItem } from './types';

function threatColor(level: string): string {
  if (level === 'high') return '#f87171';
  if (level === 'medium') return '#fbbf24';
  return '#4ade80';
}

function priorityColor(priority: string): string {
  if (priority === 'critical') return '#f87171';
  if (priority === 'high') return '#fb923c';
  if (priority === 'medium') return '#fbbf24';
  return '#4ade80';
}

function positionColor(position: string): string {
  if (position === 'leading') return '#4ade80';
  if (position === 'competitive') return '#60a5fa';
  if (position === 'catching_up') return '#fbbf24';
  return '#f87171';
}

function competitorCard(c: CompetitorAnalysis): string {
  const hostname = new URL(c.url).hostname;
  return `
    <tr><td style="padding: 0 0 16px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; border-left: 4px solid ${threatColor(c.aiInsights.threatLevel)};">
        <tr><td style="padding: 20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 700; color: #ffffff;">
                ${hostname}
              </td>
              <td align="right">
                <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: ${threatColor(c.aiInsights.threatLevel)}; border: 1px solid ${threatColor(c.aiInsights.threatLevel)};">
                  ${c.aiInsights.threatLevel} threat
                </span>
              </td>
            </tr>
          </table>
          <p style="font-family: 'DM Sans', sans-serif; font-size: 14px; color: rgba(255,255,255,0.7); margin: 8px 0 0 0; line-height: 1.5;">
            ${c.aiInsights.positioning}
          </p>
          <p style="font-family: 'DM Sans', sans-serif; font-size: 12px; color: rgba(255,255,255,0.5); margin: 4px 0 12px 0;">
            ${c.aiInsights.threatReason}
          </p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" valign="top" style="padding-right: 12px;">
                <p style="font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; color: #4ade80; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 6px 0;">Their Strengths</p>
                ${c.aiInsights.strengths.map(s => `<p style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.8); margin: 0 0 4px 0; padding-left: 12px; border-left: 2px solid rgba(74,222,128,0.3);">${s}</p>`).join('')}
              </td>
              <td width="50%" valign="top" style="padding-left: 12px;">
                <p style="font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; color: #f87171; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 6px 0;">Their Weaknesses</p>
                ${c.aiInsights.weaknesses.map(w => `<p style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.8); margin: 0 0 4px 0; padding-left: 12px; border-left: 2px solid rgba(248,113,113,0.3);">${w}</p>`).join('')}
              </td>
            </tr>
          </table>
          ${c.aiInsights.uniqueAngles.length > 0 ? `
            <p style="font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px; margin: 12px 0 6px 0;">Unique Angles</p>
            ${c.aiInsights.uniqueAngles.map(a => `<p style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.8); margin: 0 0 4px 0; padding-left: 12px; border-left: 2px solid rgba(129,140,248,0.3);">${a}</p>`).join('')}
          ` : ''}
        </td></tr>
      </table>
    </td></tr>`;
}

function actionItemRow(item: ActionItem): string {
  return `
    <tr><td style="padding: 0 0 12px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;">
        <tr><td style="padding: 16px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: ${priorityColor(item.priority)}20; color: ${priorityColor(item.priority)};">
                  ${item.priority}
                </span>
              </td>
            </tr>
            <tr>
              <td style="font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; color: #ffffff; padding-top: 8px;">
                ${item.title}
              </td>
            </tr>
            <tr>
              <td style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.7); padding-top: 4px; line-height: 1.5;">
                ${item.description}
              </td>
            </tr>
            <tr>
              <td style="font-family: 'DM Sans', sans-serif; font-size: 12px; color: #60a5fa; padding-top: 6px;">
                Expected impact: ${item.estimatedImpact}
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>`;
}

export function generateRadarEmail(report: RadarReport, recipientName: string): string {
  const { strategicInsights, competitors } = report;
  const yourHostname = new URL(report.yourUrl).hostname;
  const highThreats = competitors.filter(c => c.aiInsights.threatLevel === 'high').length;
  const criticalActions = strategicInsights.actionItems.filter(a => a.priority === 'critical').length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RADAR Competitive Intelligence Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0D0D14; font-family: 'DM Sans', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0D0D14;">
    <tr><td align="center" style="padding: 40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">

        <!-- Header -->
        <tr><td style="text-align: center; padding: 0 0 32px 0;">
          <p style="font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #818cf8; margin: 0 0 8px 0;">
            RADAR COMPETITIVE INTELLIGENCE
          </p>
          <h1 style="font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 900; color: #ffffff; margin: 0 0 8px 0; line-height: 1.2;">
            Your Competitor Report
          </h1>
          <p style="font-family: 'DM Sans', sans-serif; font-size: 15px; color: rgba(255,255,255,0.6); margin: 0;">
            ${competitors.length} competitor${competitors.length !== 1 ? 's' : ''} analyzed for ${yourHostname}
          </p>
        </td></tr>

        <!-- Quick Stats -->
        <tr><td style="padding: 0 0 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">
            <tr>
              <td width="25%" style="text-align: center; padding: 20px 8px;">
                <p style="font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 900; color: #ffffff; margin: 0;">${competitors.length}</p>
                <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.5); margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">Competitors</p>
              </td>
              <td width="25%" style="text-align: center; padding: 20px 8px;">
                <p style="font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 900; color: ${highThreats > 0 ? '#f87171' : '#4ade80'}; margin: 0;">${highThreats}</p>
                <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.5); margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">High Threats</p>
              </td>
              <td width="25%" style="text-align: center; padding: 20px 8px;">
                <p style="font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 900; color: ${criticalActions > 0 ? '#fb923c' : '#4ade80'}; margin: 0;">${criticalActions}</p>
                <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.5); margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">Critical Actions</p>
              </td>
              <td width="25%" style="text-align: center; padding: 20px 8px;">
                <p style="font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 900; color: ${positionColor(strategicInsights.overallCompetitivePosition)}; margin: 0; font-size: 16px; text-transform: capitalize;">${strategicInsights.overallCompetitivePosition.replace('_', ' ')}</p>
                <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.5); margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">Your Position</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Strategic Position -->
        <tr><td style="padding: 0 0 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(129,140,248,0.1), rgba(96,165,250,0.1)); border: 1px solid rgba(129,140,248,0.2); border-radius: 12px;">
            <tr><td style="padding: 24px;">
              <p style="font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #818cf8; margin: 0 0 8px 0;">Strategic Assessment</p>
              <p style="font-family: 'DM Sans', sans-serif; font-size: 15px; color: rgba(255,255,255,0.85); line-height: 1.6; margin: 0;">
                ${strategicInsights.positionReason}
              </p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Competitor Cards -->
        <tr><td style="padding: 0 0 8px 0;">
          <h2 style="font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 16px 0;">
            Competitor Analysis
          </h2>
        </td></tr>
        ${competitors.map(c => competitorCard(c)).join('')}

        <!-- Your Advantages & Vulnerabilities -->
        <tr><td style="padding: 16px 0 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" valign="top" style="padding-right: 8px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(74,222,128,0.05); border: 1px solid rgba(74,222,128,0.15); border-radius: 12px;">
                  <tr><td style="padding: 20px;">
                    <p style="font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700; color: #4ade80; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">Your Advantages</p>
                    ${strategicInsights.yourAdvantages.map(a => `<p style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.8); margin: 0 0 8px 0; padding-left: 12px; border-left: 2px solid rgba(74,222,128,0.4);">${a}</p>`).join('')}
                  </td></tr>
                </table>
              </td>
              <td width="50%" valign="top" style="padding-left: 8px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(248,113,113,0.05); border: 1px solid rgba(248,113,113,0.15); border-radius: 12px;">
                  <tr><td style="padding: 20px;">
                    <p style="font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700; color: #f87171; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">Vulnerabilities</p>
                    ${strategicInsights.yourVulnerabilities.map(v => `<p style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.8); margin: 0 0 8px 0; padding-left: 12px; border-left: 2px solid rgba(248,113,113,0.4);">${v}</p>`).join('')}
                  </td></tr>
                </table>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Market Gaps -->
        ${strategicInsights.marketGaps.length > 0 ? `
        <tr><td style="padding: 0 0 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(251,191,36,0.05); border: 1px solid rgba(251,191,36,0.15); border-radius: 12px;">
            <tr><td style="padding: 20px 24px;">
              <p style="font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">Market Gaps to Exploit</p>
              ${strategicInsights.marketGaps.map(g => `<p style="font-family: 'DM Sans', sans-serif; font-size: 14px; color: rgba(255,255,255,0.85); margin: 0 0 8px 0; line-height: 1.5;">&bull; ${g}</p>`).join('')}
            </td></tr>
          </table>
        </td></tr>
        ` : ''}

        <!-- Action Items -->
        <tr><td style="padding: 0 0 8px 0;">
          <h2 style="font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 16px 0;">
            Recommended Actions
          </h2>
        </td></tr>
        ${strategicInsights.actionItems.map(item => actionItemRow(item)).join('')}

        <!-- CTA -->
        <tr><td style="padding: 24px 0 32px 0; text-align: center;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(129,140,248,0.15), rgba(96,165,250,0.15)); border: 1px solid rgba(129,140,248,0.3); border-radius: 12px;">
            <tr><td style="padding: 32px; text-align: center;">
              <p style="font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">
                Want to turn these insights into action?
              </p>
              <p style="font-family: 'DM Sans', sans-serif; font-size: 14px; color: rgba(255,255,255,0.6); margin: 0 0 20px 0;">
                Book a free 30-min strategy call to discuss your competitive positioning.
              </p>
              <a href="https://calendly.com/rafaloleksiakconsulting/30min" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #818cf8, #60a5fa); color: #ffffff; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 8px; letter-spacing: 0.5px;">
                BOOK FREE STRATEGY CALL
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="text-align: center; padding: 20px 0 0 0; border-top: 1px solid rgba(255,255,255,0.06);">
          <p style="font-family: 'DM Sans', sans-serif; font-size: 12px; color: rgba(255,255,255,0.3); margin: 0;">
            RADAR by Oleksiak Consulting | AI-Powered Competitive Intelligence
          </p>
          <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.2); margin: 8px 0 0 0;">
            Analysis completed in ${(report.executionTime / 1000).toFixed(1)}s | ${new Date(report.analyzedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
