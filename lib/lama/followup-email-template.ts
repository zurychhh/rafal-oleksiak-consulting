// LAMA Follow-up Email Template
// Sent 3 days after audit if no action taken (no call scheduled, no full report purchased)
// Premium dark-theme design matching original LAMA audit email

export interface FollowupEmailData {
  recipientEmail: string;
  recipientName?: string;
  score: number;
  quickWinsCount: number;
  quickWinTitle: string;
  quickWinDescription: string;
  totalRecommendations: number;
  calendlyLink: string;
  reportPurchaseLink: string;
  unsubscribeLink: string;
}

export function generateFollowupEmail(data: FollowupEmailData): string {
  const {
    recipientName,
    score,
    quickWinsCount,
    quickWinTitle,
    quickWinDescription,
    totalRecommendations,
    calendlyLink,
    reportPurchaseLink,
    unsubscribeLink,
  } = data;

  const greeting = recipientName ? `Hi ${recipientName},` : 'Hi,';

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <meta name="x-apple-disable-message-reformatting">
    <title>Have You Tackled Those Issues Yet?</title>
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
            .mobile-stack { display: block !important; width: 100% !important; padding-bottom: 16px !important; }
            .mobile-center { text-align: center !important; }
            .mobile-card { height: auto !important; min-height: 0 !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0D0D14; font-family: Arial, Helvetica, sans-serif;">

    <!-- Preheader (hidden) -->
    <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #0D0D14;">
        Checking in: any progress on those website issues? Here's how to move faster.
    </div>

    <!-- Email Wrapper -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0D0D14;">
        <tr>
            <td align="center" style="padding: 40px 20px;">

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

                    <!-- HERO SECTION -->
                    <tr>
                        <td align="center" style="padding: 48px 32px; background: linear-gradient(135deg, #1E1B4B 0%, #0D0D14 50%, #0C1222 100%);" class="mobile-padding">
                            <h1 style="font-family: Arial, Helvetica, sans-serif; font-size: 32px; font-weight: 700; color: #F9FAFB; margin: 0 0 16px 0; line-height: 1.2;">
                                Have You Tackled Those Issues Yet?
                            </h1>
                            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; color: #9CA3AF; margin: 0; line-height: 1.6; max-width: 480px;">
                                I sent you a detailed website audit. I'm curious — did anything change?
                            </p>
                        </td>
                    </tr>

                    <!-- SCORE REMINDER CARD -->
                    <tr>
                        <td style="padding: 32px;" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #16161F; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <!-- Score Circle - matching original LAMA email style -->
                                                <td width="140" valign="middle" style="padding-right: 24px;" class="mobile-stack mobile-center">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                                        <tr>
                                                            <td align="center" valign="middle" width="120" height="120" style="width: 120px; height: 120px; background: linear-gradient(135deg, #7B2CBF 0%, #5B3CC4 100%); border-radius: 50%; -webkit-border-radius: 50%; -moz-border-radius: 50%;">
                                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                                    <tr>
                                                                        <td align="center" style="padding: 0;">
                                                                            <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 42px; font-weight: 700; color: #FFFFFF; line-height: 1;">${score}</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center" style="padding: 2px 0 0 0;">
                                                                            <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.85);">/ 100</p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <!-- Score Text -->
                                                <td valign="middle" class="mobile-stack mobile-center">
                                                    <p style="margin: 0 0 8px 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 600; color: #F9FAFB; line-height: 1.4;">
                                                        Your score was <span style="font-family: 'Courier New', monospace; color: #A78BFA;">${score}/100</span>
                                                    </p>
                                                    <p style="margin: 0 0 12px 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #9CA3AF; line-height: 1.6;">
                                                        That's <span style="color: #06B6D4; font-weight: 600;">${quickWinsCount} quick wins</span> waiting to be fixed.
                                                    </p>
                                                    <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #6B7280; line-height: 1.5;">
                                                        Most businesses at this level lose 20-30% of potential conversions.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- TWO WAYS SECTION -->
                    <tr>
                        <td style="padding: 0 32px 32px 32px;" class="mobile-padding">
                            <h2 style="margin: 0 0 24px 0; font-family: Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 700; color: #F9FAFB; text-align: center;">
                                Two Ways I Can Help
                            </h2>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <!-- Card 1: Let's Talk Strategy -->
                                    <td width="48%" valign="top" class="mobile-stack">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #16161F; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; height: 300px;" class="mobile-card">
                                            <tr>
                                                <td style="padding: 24px;" valign="top">
                                                    <p style="margin: 0 0 16px 0; font-size: 32px; line-height: 1;">📅</p>
                                                    <h3 style="margin: 0 0 12px 0; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 700; color: #F9FAFB;">
                                                        Let's Talk Strategy
                                                    </h3>
                                                    <p style="margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #9CA3AF; line-height: 1.6;">
                                                        30 minutes. Walk through your audit together. I'll show you what to prioritize first.
                                                    </p>
                                                    <p style="margin: 0 0 20px 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #6B7280; line-height: 1.5;">
                                                        No pitch. No obligation.
                                                    </p>
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="background: linear-gradient(135deg, #7B2CBF 0%, #5B3CC4 100%); border-radius: 10px;">
                                                                <a href="${calendlyLink}" style="display: inline-block; padding: 14px 32px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 700; color: #FFFFFF; text-decoration: none;">
                                                                    Book a Call →
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td width="4%"></td>
                                    <!-- Card 2: Get the Complete Playbook -->
                                    <td width="48%" valign="top" class="mobile-stack">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #16161F; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; height: 300px; position: relative;" class="mobile-card">
                                            <tr>
                                                <td style="padding: 24px;" valign="top">
                                                    <!-- Badge -->
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="position: absolute; top: 16px; right: 16px;">
                                                        <tr>
                                                            <td style="background-color: rgba(139, 92, 246, 0.15); padding: 4px 8px; border-radius: 4px;">
                                                                <span style="font-family: Arial, sans-serif; font-size: 10px; font-weight: 700; color: #A78BFA; letter-spacing: 0.5px;">100+ PAGES</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <p style="margin: 0 0 16px 0; font-size: 32px; line-height: 1;">📄</p>
                                                    <h3 style="margin: 0 0 12px 0; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 700; color: #F9FAFB;">
                                                        Get the Complete Playbook
                                                    </h3>
                                                    <p style="margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #9CA3AF; line-height: 1.6;">
                                                        Ready-to-implement solutions. Code snippets. Vendor comparisons. Action plan to reach 90/100.
                                                    </p>
                                                    <p style="margin: 0 0 20px 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #6B7280; line-height: 1.5;">
                                                        Everything you need to fix it yourself.
                                                    </p>
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="border: 2px solid #8B5CF6; border-radius: 10px;">
                                                                <a href="${reportPurchaseLink}" style="display: inline-block; padding: 12px 28px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 700; color: #8B5CF6; text-decoration: none;">
                                                                    View Full Report →
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- QUICK WIN TEASER -->
                    <tr>
                        <td style="padding: 0 32px 32px 32px;" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #16161F; border: 2px solid rgba(6, 182, 212, 0.2); border-radius: 12px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <p style="margin: 0 0 12px 0; font-size: 28px; line-height: 1;">💡</p>
                                        <h3 style="margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 700; color: #F9FAFB;">
                                            Here's one thing you can fix today
                                        </h3>
                                        <p style="margin: 0 0 8px 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 600; color: #06B6D4;">
                                            ${quickWinTitle}
                                        </p>
                                        <p style="margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #9CA3AF; line-height: 1.6;">
                                            ${quickWinDescription}
                                        </p>
                                        <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #6B7280;">
                                            The full report has <span style="color: #A78BFA; font-weight: 600;">${totalRecommendations} more</span> like this.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- REPLY NUDGE -->
                    <tr>
                        <td style="padding: 0 32px 48px 32px; text-align: center;" class="mobile-padding">
                            <p style="margin: 0 0 8px 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #9CA3AF; line-height: 1.6;">
                                Questions? Just hit reply. I read every email.
                            </p>
                            <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #6B7280;">
                                — Rafal
                            </p>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="padding: 32px; border-top: 1px solid rgba(255, 255, 255, 0.05);" class="mobile-padding">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center; padding-bottom: 16px;">
                                        <p style="margin: 0 0 4px 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; color: #9CA3AF;">
                                            Rafal Oleksiak
                                        </p>
                                        <p style="margin: 0 0 12px 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #6B7280;">
                                            CRM & Marketing Automation
                                        </p>
                                        <p style="margin: 0 0 8px 0;">
                                            <a href="mailto:rafal@oleksiakconsulting.com" style="font-family: Arial, Helvetica, sans-serif; color: #8B5CF6; text-decoration: none; font-size: 13px;">
                                                rafal@oleksiakconsulting.com
                                            </a>
                                        </p>
                                        <p style="margin: 0 0 16px 0;">
                                            <a href="https://www.linkedin.com/in/rafal-oleksiak" style="font-family: Arial, Helvetica, sans-serif; color: #8B5CF6; text-decoration: none; font-size: 13px;">
                                                LinkedIn
                                            </a>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; padding-bottom: 16px;">
                                        <p style="margin: 0 0 8px 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #4B5563;">
                                            Trusted by teams at Allegro, Accenture, Booksy
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                                        <p style="margin: 0 0 8px 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #4B5563;">
                                            © 2025 Oleksiak Consult. All rights reserved.
                                        </p>
                                        <p style="margin: 0;">
                                            <a href="${unsubscribeLink}" style="font-family: Arial, Helvetica, sans-serif; color: #6B7280; text-decoration: underline; font-size: 11px;">
                                                Unsubscribe
                                            </a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>`;
}
