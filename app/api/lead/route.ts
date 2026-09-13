// app/api/lead/route.ts
//
// Dopasowane do tego, co już jest w projekcie:
//   – Resend jest skonfigurowany, używa FROM_EMAIL / TO_EMAIL
//   – HubSpot chodzi przez HUBSPOT_API_KEY i helper w app/lib/
//   – wzorzec „wyślij, potem zaloguj do CRM" jest już w app/api/lama/audit/route.ts
//
// Nowe względem istniejących endpointów: walidacja zodem i rate limit,
// których żaden obecny route nie ma.
//
// Wymaga: npm i zod

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { createLeadContact } from '@/app/lib/lead-hubspot';
import { confirmEmail, ownerEmail } from '@/app/lib/lead-email';

// Klient Resend powstaje dopiero w POST, po walidacji. W zakresie modułu
// `new Resend(undefined)` rzuca przy ładowaniu trasy i cała obsługa kodów
// statusu poniżej nigdy się nie wykonuje — brak konfiguracji wygląda wtedy
// jak awaria 500 z HTML-em, także dla żądań, które powinny dostać 403 lub 422.

// Kontrakt poszedl za strona. Kalkulator zostal wyciety, wiec kategoria,
// dlugosc opakowania, dzien odkupu, cztery liczby i lista osiemnastu krokow
// nie maja skad pochodzic — i nie sa juz przyjmowane. Zostaje adres, jedna
// opcjonalna linia od odwiedzajacego i to, skad przyszedl.
const LeadSchema = z.object({
  email: z.string().email().max(254),
  // Trafia do naglowka Subject, wiec zadnych znakow konca linii.
  message: z.string().max(140).regex(/^[^\r\n]*$/).optional(),
  source: z.record(z.string(), z.string().max(300)).optional(),
});

export type Lead = z.infer<typeof LeadSchema>;

// To NIE jest rate limiting. Na Vercelu każde wywołanie może trafić w inną
// instancję, a zimny start czyści mapę — więc to działa wyłącznie jako
// wygaszacz podwójnych kliknięć w obrębie jednej ciepłej instancji.
// Prawdziwy limit wymaga wspólnego magazynu (Vercel KV / Upstash).
// Realną barierą jest sprawdzenie originu niżej.
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = Number(process.env.LEAD_MAX_PER_HOUR ?? 5);

// Poza produkcją limiter jest wyłączony. Bramka wizualna puszcza dziewięć
// viewportów z jednego adresu: przy aktywnym limicie pięć pierwszych kończyło
// w jednym stanie, a cztery ostatnie na 429, czyli w innym. Wtedy jeden PASS
// opisuje dwie różne rzeczy i przestaje cokolwiek znaczyć.
const LIMITER_ACTIVE = process.env.NODE_ENV === 'production';

// Znacznik czasu dopisujemy WYŁĄCZNIE dla żądania, które zostało przepuszczone.
// Wcześniej szedł przed sprawdzeniem progu, więc odbite żądanie też przesuwało
// koniec okna — ponawianie odsuwało odblokowanie zamiast je przybliżać i nadawca
// w pętli nie przechodził nigdy. Próg jest ten sam: MAX_PER_WINDOW żądań
// przechodzi, następne dostaje 429.
function seenRecently(ip: string) {
  if (!LIMITER_ACTIVE) return false;
  const now = Date.now();
  const seen = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (seen.length >= MAX_PER_WINDOW) {
    // Zapisujemy przefiltrowaną tablicę, żeby stare znaczniki wypadały z mapy
    // także wtedy, gdy adres dostaje same odmowy.
    HITS.set(ip, seen);
    return true;
  }
  seen.push(now);
  HITS.set(ip, seen);
  if (HITS.size > 5000) HITS.clear();
  return false;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  // Egzekwowalne bez wspólnego stanu, w przeciwieństwie do mapy powyżej.
  // Liczone z samego żądania, a nie ze stałej w env: dzięki temu działa tak
  // samo na produkcji, na deployu preview i na localhoście, i nie ma czego
  // rozjechać z rzeczywistością. NEXT_PUBLIC_SITE_URL zostaje jako furtka
  // dla domeny kanonicznej, gdyby host był za proxy.
  const origin = request.headers.get('origin');
  if (origin) {
    const host = request.headers.get('host');
    let ok = false;
    try {
      const o = new URL(origin);
      ok = o.host === host
        || (!!process.env.NEXT_PUBLIC_SITE_URL
            && o.host === new URL(process.env.NEXT_PUBLIC_SITE_URL).host);
    } catch { ok = false; }
    if (!ok) return NextResponse.json({ error: 'bad_origin' }, { status: 403 });
  }

  if (seenRecently(ip)) {
    return NextResponse.json({ error: 'too_fast' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid' }, { status: 422 });
  }
  const lead = parsed.data;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('[lead] RESEND_API_KEY missing');
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }
  const resend = new Resend(key);

  const from = `Rafał Oleksiak <${process.env.FROM_EMAIL}>`;

  // 1 · Potwierdzenie dla odwiedzajacego. Jesli to padnie, request pada —
  //     odwiedzajacy dostaje na stronie adres i wie, ze ma napisac wprost.
  const { error } = await resend.emails.send({
    from,
    to: [lead.email],
    replyTo: process.env.TO_EMAIL,
    subject: 'Got it — I reply by hand',
    html: confirmEmail(),
  });

  if (error) {
    console.error('[lead] resend error', error);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }

  // 2 · Wszystko dalej to księgowość i nigdy nie może zablokować dostawy.
  try {
    await resend.emails.send({
      from,
      to: [process.env.TO_EMAIL!],
      subject:
        '[lead] ' + lead.email + (lead.message ? ` · ${lead.message.slice(0, 60)}` : ''),
      html: ownerEmail(lead),
    });
  } catch (e) {
    console.error('[lead] owner notification failed', e);
  }

  try {
    const hs = await createLeadContact(lead);
    if (!hs.success) console.error('[lead] hubspot failed', hs.error);
  } catch (e) {
    console.error('[lead] hubspot threw', e);
  }

  return NextResponse.json({ ok: true });
}
