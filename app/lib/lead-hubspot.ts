// app/lib/lead-hubspot.ts
//
// Ten sam kształt co istniejące app/lib/hubspot.ts — ta sama zmienna
// środowiskowa, ten sam typ zwracany, żeby nie wprowadzać drugiej konwencji.
//
// W HubSpocie trzeba raz założyć własne właściwości kontaktu wymienione
// w PROPERTIES poniżej. Bez nich API po cichu je zignoruje.

import type { Lead } from '@/app/api/lead/route';

export interface HubSpotResponse {
  success: boolean;
  contactId?: string;
  error?: string;
}

const API = 'https://api.hubapi.com/crm/v3/objects/contacts';

function propertiesFrom(lead: Lead) {
  return {
    email: lead.email,
    // Jedyne pole, które dzieli skrzynkę na „chcę plik" i „odezwij się".
    lead_intent: lead.intent === 'markup' ? 'wants mark-up' : 'sheet only',
    fmcg_category: lead.category,
    pack_days: String(lead.packDays),
    reorder_band: lead.reorderBand,
    knows_own_interval: lead.reorderKnown ? 'yes' : 'no',
    gap_days: String(lead.gapDays),
    leak_per_year_pln: String(lead.economics.perYear),
    steps_already_running: String(lead.steps.filter((s) => s.already).length),
    first_touch_source:
      lead.source?.utm_source ?? lead.source?.referrer ?? 'direct',
    first_touch_campaign: lead.source?.utm_campaign ?? '',
  };
}

export async function createLeadContact(lead: Lead): Promise<HubSpotResponse> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  if (!apiKey) {
    console.error('HubSpot API key not configured');
    return { success: false, error: 'HubSpot API key not configured' };
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  const properties = propertiesFrom(lead);

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers,
      body: JSON.stringify({ properties }),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, contactId: data.id };
    }

    // 409 = kontakt już istnieje. Aktualizujemy zamiast zgłaszać błąd,
    // bo powracający founder jest lepszym sygnałem niż nowy.
    if (res.status === 409) {
      const found = await fetch(`${API}/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                { propertyName: 'email', operator: 'EQ', value: lead.email },
              ],
            },
          ],
          limit: 1,
        }),
      }).then((r) => r.json());

      const id = found?.results?.[0]?.id;
      if (!id) return { success: false, error: 'contact exists but not found' };

      const patch = await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ properties }),
      });
      return patch.ok
        ? { success: true, contactId: id }
        : { success: false, error: `patch failed: ${patch.status}` };
    }

    return { success: false, error: `create failed: ${res.status}` };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'unknown' };
  }
}
