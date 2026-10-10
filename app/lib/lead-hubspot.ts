// app/lib/lead-hubspot.ts
//
// Ten sam kształt co istniejące app/lib/hubspot.ts — ta sama zmienna
// środowiskowa, ten sam typ zwracany, żeby nie wprowadzać drugiej konwencji.
//
// W HubSpocie trzeba raz założyć własne właściwości kontaktu, które wysyła
// propertiesFrom() poniżej — robi to `node scripts/hubspot-setup.mjs --apply`.
// Uwaga: nieistniejąca właściwość NIE jest ignorowana. HubSpot odrzuca wtedy
// CAŁY zapis kontaktu (400, PROPERTY_DOESNT_EXIST), więc nowe pole najpierw
// zakłada się w portalu, a dopiero potem wdraża kod, który je wysyła.

import type { Lead, ConsentRecord } from '@/app/api/lead/route';

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
function propertiesFrom(lead: Lead, consent: ConsentRecord): Record<string, string> {
  const p: Record<string, string> = {
    email: lead.email,
    first_touch_source: lead.source?.utm_source ?? lead.source?.referrer ?? 'direct',
  };
  const campaign = lead.source?.utm_campaign;
  if (campaign) p.first_touch_campaign = campaign;

  const store = lead.storeUrl ?? lead.message;
  if (store) p.store_url = store;
  if (lead.form) p.lead_form = lead.form;

  /* Zgody sa jedynym wyjatkiem od reguly "nie wysylamy pustych wlasciwosci".
     Tam regula chroni przed skasowaniem tego, co juz wiemy; tutaj dziala
     odwrotnie: "false" to nie brak danych, tylko odnotowany brak zgody, i to
     jest dokladnie ta informacja, ktorej potrzebujemy, zeby kogos NIE wrzucic
     na liste marketingowa. Zapisujemy wiec zawsze, takze gdy jest falszem. */
  /* Wynik z /tool — tylko gdy zgloszenie go niesie (regula "nie wysylamy
     pustych"). Wlasciwosci zalozone 11.10.2026 przez hubspot-setup.mjs;
     nowa nazwa tutaj BEZ wpisu tam = 400 i caly kontakt przepada. */
  if (lead.interval != null) p.reorder_interval_days = String(lead.interval);
  if (lead.labelDay != null) p.label_day = String(lead.labelDay);
  if (lead.sampleN != null) p.sample_n = String(lead.sampleN);
  if (lead.windowDays != null) p.data_window_days = String(lead.windowDays);

  p.consent_contact = consent.contact ? 'true' : 'false';
  p.consent_marketing = consent.marketing ? 'true' : 'false';
  p.consent_at = consent.at;
  if (consent.text) p.consent_text = consent.text;
  if (consent.ip && consent.ip !== 'unknown') p.consent_ip = consent.ip;
  return p;
}

/* Sam kod statusu nie mowi, ktore pole HubSpot odrzucil, a ten tekst trafia
   do maila wlasciciela. Bierzemy `message` z odpowiedzi, przyciete. */
async function reason(res: Response): Promise<string> {
  try {
    const j = await res.json();
    return String(j?.message ?? '').slice(0, 300);
  } catch {
    return '';
  }
}

export async function createLeadContact(
  lead: Lead,
  consent: ConsentRecord,
): Promise<HubSpotResponse> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  if (!apiKey) {
    console.error('HubSpot API key not configured');
    return { success: false, error: 'HubSpot API key not configured' };
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  const properties = propertiesFrom(lead, consent);

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
        : { success: false, error: `patch failed: ${patch.status} ${await reason(patch)}` };
    }

    return { success: false, error: `create failed: ${res.status} ${await reason(res)}` };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'unknown' };
  }
}
