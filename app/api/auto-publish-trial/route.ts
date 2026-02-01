import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, email, website, cms, message } = body;

    if (!email || !company) {
      return NextResponse.json(
        { error: 'Company name and email are required' },
        { status: 400 },
      );
    }

    // Notify Rafal about new trial request
    const { error: notifyError } = await resend.emails.send({
      from: `Oleksiak Consulting <${process.env.FROM_EMAIL}>`,
      to: [process.env.TO_EMAIL!],
      subject: `New Auto-Publish Trial Request — ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7B2CBF;">New Auto-Publish Trial Request</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Website:</strong> ${website ? `<a href="${website}" target="_blank">${website}</a>` : 'Not provided'}</p>
            <p><strong>CMS Platform:</strong> ${cms || 'Not specified'}</p>
            ${message ? `<p><strong>Message:</strong></p><p style="background: white; padding: 15px; border-left: 4px solid #7B2CBF;">${message}</p>` : ''}
          </div>
          <p style="color: #666; font-size: 12px;">
            Action: Create tenant + agent + user on Railway backend, then send login credentials.
          </p>
        </div>
      `,
    });

    if (notifyError) {
      console.error('Resend notify error:', notifyError);
      return NextResponse.json(
        { error: 'Failed to process request' },
        { status: 500 },
      );
    }

    // Send confirmation to the client
    await resend.emails.send({
      from: `Oleksiak Consulting <${process.env.FROM_EMAIL}>`,
      to: [email],
      subject: 'Your Auto-Publish Trial Request — Oleksiak Consulting',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #7B2CBF 0%, #0066FF 100%); padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Auto-Publish</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Your free trial request has been received.</p>
          </div>
          <div style="background: #f9f9f9; padding: 32px; border-radius: 0 0 12px 12px;">
            <p>Hi <strong>${company}</strong> team,</p>
            <p>Thank you for your interest in Auto-Publish — our AI-powered SEO content engine for ecommerce brands.</p>
            <p>Here's what happens next:</p>
            <ol style="line-height: 1.8;">
              <li><strong>Account setup</strong> — We'll configure your AI agent with your brand's expertise and tone within 24 hours.</li>
              <li><strong>Login credentials</strong> — You'll receive an email with your dashboard access.</li>
              <li><strong>First post</strong> — Your AI agent will generate the first SEO-optimized article for your review.</li>
            </ol>
            <p>If you'd like to discuss your content strategy first, <a href="https://calendly.com/rafaloleksiakconsulting/30min" style="color: #7B2CBF;">book a quick call</a>.</p>
            <p style="margin-top: 24px;">Best,<br/><strong>Rafal Oleksiak</strong><br/>Oleksiak Consulting</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Trial request submitted successfully',
    });
  } catch (error) {
    console.error('Auto-publish trial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
