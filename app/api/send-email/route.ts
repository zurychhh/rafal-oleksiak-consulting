import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createHubSpotContact } from '@/app/lib/hubspot';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formType, ...formData } = body;

    let subject = '';
    let htmlContent = '';

    if (formType === 'consultation') {
      subject = 'New Consultation Request - oleksiakconsulting.com';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7B2CBF;">New Consultation Request</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Full Name:</strong> ${formData.fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
            <p><strong>Website:</strong> <a href="${formData.website}" target="_blank">${formData.website}</a></p>
            <p><strong>Challenge:</strong></p>
            <p style="background: white; padding: 15px; border-left: 4px solid #7B2CBF;">${formData.challenge}</p>
            <p><strong>Marketing Consent:</strong> ${formData.consent ? 'Yes' : 'No'}</p>
          </div>
          <p style="color: #666; font-size: 12px;">Sent from oleksiakconsulting.com</p>
        </div>
      `;
    } else if (formType === 'proposal') {
      subject = 'New Custom Proposal Request - oleksiakconsulting.com';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7B2CBF;">New Custom Proposal Request</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
            <p><strong>Website:</strong> <a href="${formData.website}" target="_blank">${formData.website}</a></p>
            <p><strong>Business Needs:</strong></p>
            <p style="background: white; padding: 15px; border-left: 4px solid #7B2CBF;">${formData.needs}</p>
            <p><strong>Marketing Consent:</strong> ${formData.marketing ? 'Yes' : 'No'}</p>
          </div>
          <p style="color: #666; font-size: 12px;">Sent from oleksiakconsulting.com</p>
        </div>
      `;
    }

    const { data, error } = await resend.emails.send({
      from: `Rafał Oleksiak <${process.env.FROM_EMAIL}>`,
      to: [process.env.TO_EMAIL!],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    // HubSpot CRM Integration (always create contact with consent flag)
    const marketingConsent = formType === 'consultation'
      ? formData.consent
      : formData.marketing;

    try {
      const hubspotResult = await createHubSpotContact({
        email: formData.email,
        fullName: formType === 'consultation' ? formData.fullName : '',
        website: formData.website,
        challenge: formType === 'consultation' ? formData.challenge : formData.needs,
        marketingConsent: marketingConsent
      });

      if (hubspotResult.success) {
        console.log(
          `HubSpot contact created: ${hubspotResult.contactId} (marketing consent: ${marketingConsent})`
        );
      } else {
        // Log error but don't fail the request
        console.error('HubSpot contact creation failed:', hubspotResult.error);
      }
    } catch (hubspotError) {
      // Log error but don't fail the request
      console.error('HubSpot integration error:', hubspotError);
    }

    // LAMA Audit Integration (if requested)
    if (formType === 'consultation' && formData.auditRequested) {
      console.log(`[LAMA] Audit requested for ${formData.email} - ${formData.website}`);

      // Trigger audit asynchronously (don't block response)
      fetch(`${request.nextUrl.origin}/api/lama/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formData.website,
          email: formData.email,
          fullName: formData.fullName,
        }),
      })
        .then(async (auditResponse) => {
          if (auditResponse.ok) {
            const auditData = await auditResponse.json();
            console.log(
              `[LAMA] Audit completed successfully (Score: ${auditData.auditResult?.overallScore}/100)`
            );
          } else {
            const auditError = await auditResponse.json().catch(() => null);
            console.error('[LAMA] Audit failed:', auditError);
          }
        })
        .catch((auditError) => {
          console.error('[LAMA] Audit request failed:', auditError);
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      id: data?.id
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
