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

/* Po wycieciu kalkulatora osiem z jedenastu wlasciwosci nie ma juz skad
   pochodzic: fmcg_category, pack_days, reorder_band, knows_own_interval,
   gap_days, leak_per_year_pln, steps_already_running i lead_intent zniknely
   razem z polami, ktore je karmily.

   NIE wysylamy ich pustych. Puste pole w CRM nie jest "brakiem danych" —
   jest twierdzeniem, ze zmierzylismy i wyszlo zero, a przy nadpisaniu
   istniejacego kontaktu skasowaloby to, co wiemy z wczesniejszej rozmowy.
   Wlasciwosci zostaja w portalu; po prostu przestajemy je zapisywac.

   first_touch_campaign tez tylko wtedy, gdy jest: wczesniej szlo tu '' przy
   kazdym wejsciu bez kampanii i kasowalo atrybucje z pierwszej wizyty. */
function propertiesFrom(lead: Lead): Record<string, string> {
  const p: Record<string, string> = {
    email: lead.email,
    first_touch_source: lead.source?.utm_source ?? lead.source?.referrer ?? 'direct',
  };
  const campaign = lead.source?.utm_campaign;
  if (campaign) p.first_touch_campaign = campaign;
  return p;
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
