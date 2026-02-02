export function generateMagicLinkEmail(verifyUrl: string, recipientEmail: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to RADAR</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0D0D14; font-family: 'DM Sans', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0D0D14;">
    <tr><td align="center" style="padding: 60px 20px;">
      <table width="480" cellpadding="0" cellspacing="0" style="max-width: 480px;">

        <!-- Logo -->
        <tr><td style="text-align: center; padding: 0 0 32px 0;">
          <p style="font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #EF4444; margin: 0 0 8px 0;">
            RADAR COMPETITIVE INTELLIGENCE
          </p>
        </td></tr>

        <!-- Card -->
        <tr><td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
            <tr><td style="padding: 40px 36px; text-align: center;">
              <h1 style="font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 700; color: #ffffff; margin: 0 0 12px 0; line-height: 1.3;">
                Sign in to your dashboard
              </h1>
              <p style="font-family: 'DM Sans', sans-serif; font-size: 15px; color: rgba(255,255,255,0.6); margin: 0 0 32px 0; line-height: 1.5;">
                Click the button below to sign in to RADAR. This link expires in 15 minutes.
              </p>

              <!-- CTA Button -->
              <a href="${verifyUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #EF4444 0%, #F97316 100%); color: #ffffff; font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px; letter-spacing: 0.5px; box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);">
                SIGN IN TO RADAR
              </a>

              <p style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.35); margin: 24px 0 0 0; line-height: 1.5;">
                If you didn't request this email, you can safely ignore it.
              </p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="text-align: center; padding: 24px 0 0 0;">
          <p style="font-family: 'DM Sans', sans-serif; font-size: 12px; color: rgba(255,255,255,0.2); margin: 0;">
            RADAR by Oleksiak Consulting
          </p>
          <p style="font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.15); margin: 6px 0 0 0;">
            Sent to ${recipientEmail}
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
