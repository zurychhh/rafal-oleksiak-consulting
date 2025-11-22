// LAMA - HubSpot Integration
// Creates/updates contacts and logs audit activity to HubSpot timeline

import { createHubSpotContact } from '@/app/lib/hubspot';
import type { AuditResult } from './types';

export interface LAMAHubSpotContact {
  email: string;
  fullName: string;
  website: string;
  auditScore: number;
  auditTimestamp: string;
}

export interface LAMAHubSpotResponse {
  success: boolean;
  contactId?: string;
  activityLogged?: boolean;
  error?: string;
}

/**
 * Creates or updates HubSpot contact after LAMA audit
 * Also logs audit activity to contact's timeline
 */
export async function createOrUpdateLAMAContact(
  contactData: LAMAHubSpotContact,
  auditResult: AuditResult
): Promise<LAMAHubSpotResponse> {
  try {
    // 1. Create/Update contact using existing HubSpot integration
    const contactResult = await createHubSpotContact({
      email: contactData.email,
      fullName: contactData.fullName,
      website: contactData.website,
      challenge: `LAMA Audit requested (Score: ${contactData.auditScore}/100)`,
      marketingConsent: true, // Implied consent by requesting audit
    });

    if (!contactResult.success || !contactResult.contactId) {
      return {
        success: false,
        error: contactResult.error || 'Failed to create HubSpot contact',
      };
    }

    // 2. Log audit activity to timeline
    const activityLogged = await logAuditActivity(
      contactResult.contactId,
      auditResult
    );

    return {
      success: true,
      contactId: contactResult.contactId,
      activityLogged,
    };
  } catch (error) {
    console.error('LAMA HubSpot integration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Logs LAMA audit activity to HubSpot contact timeline
 */
async function logAuditActivity(
  contactId: string,
  auditResult: AuditResult
): Promise<boolean> {
  const apiKey = process.env.HUBSPOT_API_KEY;

  if (!apiKey) {
    console.error('HubSpot API key not configured');
    return false;
  }

  try {
    // Create a note on the contact timeline
    const noteBody = generateAuditNote(auditResult);

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/notes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          properties: {
            hs_timestamp: new Date(auditResult.timestamp).getTime().toString(),
            hs_note_body: noteBody,
            hubspot_owner_id: null, // Unassigned
          },
          associations: [
            {
              to: { id: contactId },
              types: [
                {
                  associationCategory: 'HUBSPOT_DEFINED',
                  associationTypeId: 202, // Note to Contact association
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Failed to log audit activity:', errorData);
      return false;
    }

    console.log(`Audit activity logged for contact ${contactId}`);
    return true;
  } catch (error) {
    console.error('Error logging audit activity:', error);
    return false;
  }
}

/**
 * Generates HTML note body for HubSpot timeline
 */
function generateAuditNote(auditResult: AuditResult): string {
  const { overallScore, categories, url, executionTime } = auditResult;

  let noteHtml = `
    <h3>🤖 LAMA Audit Sent</h3>
    <p><strong>Website:</strong> <a href="${url}" target="_blank">${url}</a></p>
    <p><strong>Overall Score:</strong> ${overallScore}/100</p>
    <p><strong>Execution Time:</strong> ${(executionTime / 1000).toFixed(1)}s</p>
    <br>
    <h4>Category Scores:</h4>
    <ul>
  `;

  categories.forEach((cat) => {
    const emoji = cat.score >= 80 ? '✅' : cat.score >= 60 ? '⚠️' : '❌';
    noteHtml += `<li>${emoji} <strong>${cat.category}:</strong> ${cat.score}/100</li>`;
  });

  noteHtml += `
    </ul>
    <br>
    <p><em>Automated audit report sent via LAMA system</em></p>
  `;

  return noteHtml;
}

/**
 * Logs when user clicks CTA in audit email
 */
export async function logAuditCTAClick(
  email: string,
  ctaType: 'book_consultation' | 'view_services'
): Promise<boolean> {
  const apiKey = process.env.HUBSPOT_API_KEY;

  if (!apiKey) {
    return false;
  }

  try {
    // Find contact by email
    const searchResponse = await fetch(
      'https://api.hubapi.com/crm/v3/objects/contacts/search',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'email',
                  operator: 'EQ',
                  value: email,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!searchResponse.ok) {
      return false;
    }

    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      return false;
    }

    const contactId = searchData.results[0].id;

    // Log note about CTA click
    const noteResponse = await fetch(
      'https://api.hubapi.com/crm/v3/objects/notes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          properties: {
            hs_timestamp: Date.now().toString(),
            hs_note_body: `<p>🎯 User clicked <strong>${ctaType === 'book_consultation' ? 'Book Consultation' : 'View Services'}</strong> CTA in LAMA audit email</p>`,
          },
          associations: [
            {
              to: { id: contactId },
              types: [
                {
                  associationCategory: 'HUBSPOT_DEFINED',
                  associationTypeId: 202,
                },
              ],
            },
          ],
        }),
      }
    );

    return noteResponse.ok;
  } catch (error) {
    console.error('Error logging CTA click:', error);
    return false;
  }
}
