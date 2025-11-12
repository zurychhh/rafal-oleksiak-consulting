/**
 * HubSpot CRM Integration
 *
 * Creates contacts in HubSpot CRM when users submit the consultation form
 * with marketing consent.
 */

export interface HubSpotContactData {
  email: string;
  fullName: string;
  website: string;
  challenge: string;
  marketingConsent: boolean;
}

export interface HubSpotResponse {
  success: boolean;
  contactId?: string;
  error?: string;
}

/**
 * Creates a contact in HubSpot CRM
 *
 * @param contactData - Contact information from the form
 * @returns Promise with success status and contact ID or error
 */
export async function createHubSpotContact(
  contactData: HubSpotContactData
): Promise<HubSpotResponse> {
  const apiKey = process.env.HUBSPOT_API_KEY;

  if (!apiKey) {
    console.error('HubSpot API key not configured');
    return {
      success: false,
      error: 'HubSpot API key not configured'
    };
  }

  // Split full name into first and last name
  const nameParts = contactData.fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        properties: {
          email: contactData.email,
          firstname: firstName,
          lastname: lastName,
          website: contactData.website,
          message: contactData.challenge,
          // Custom property for lead source
          hs_lead_status: 'NEW',
          // Marketing consent
          hs_marketable_status: contactData.marketingConsent ? 'true' : 'false',
          // Additional tracking
          lifecyclestage: 'lead',
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      // Check if contact already exists (409 conflict)
      if (response.status === 409) {
        console.log('Contact already exists in HubSpot, updating instead');
        // Try to update existing contact
        return await updateHubSpotContact(contactData);
      }

      console.error('HubSpot API error:', errorData);
      return {
        success: false,
        error: errorData?.message || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();

    return {
      success: true,
      contactId: data.id
    };

  } catch (error) {
    console.error('HubSpot network error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Updates an existing contact in HubSpot CRM
 *
 * @param contactData - Contact information from the form
 * @returns Promise with success status
 */
async function updateHubSpotContact(
  contactData: HubSpotContactData
): Promise<HubSpotResponse> {
  const apiKey = process.env.HUBSPOT_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'HubSpot API key not configured'
    };
  }

  const nameParts = contactData.fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  try {
    // First, find the contact by email
    const searchResponse = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          filterGroups: [{
            filters: [{
              propertyName: 'email',
              operator: 'EQ',
              value: contactData.email
            }]
          }]
        })
      }
    );

    if (!searchResponse.ok) {
      return {
        success: false,
        error: 'Failed to find existing contact'
      };
    }

    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      return {
        success: false,
        error: 'Contact not found'
      };
    }

    const contactId = searchData.results[0].id;

    // Update the contact
    const updateResponse = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          properties: {
            firstname: firstName,
            lastname: lastName,
            website: contactData.website,
            message: contactData.challenge,
            hs_marketable_status: contactData.marketingConsent ? 'true' : 'false',
          }
        })
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => null);
      return {
        success: false,
        error: errorData?.message || 'Failed to update contact'
      };
    }

    return {
      success: true,
      contactId: contactId
    };

  } catch (error) {
    console.error('HubSpot update error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
