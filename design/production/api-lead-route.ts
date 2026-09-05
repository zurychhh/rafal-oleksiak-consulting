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
import { sheetEmail, ownerEmail } from '@/app/lib/sheet-email';

const resend = new Resend(process.env.RESEND_API_KEY);

const StepSchema = z.object({
  rank: z.number().int().min(1).max(50),
  step: z.string().max(160),
  when: z.string().max(40),
  channel: z.string().max(40),
  moves: z.string().max(40),
  already: z.boolean(),
});

const LeadSchema = z.object({
  email: z.string().email().max(254),
  intent: z.enum(['sheet', 'markup']),
  // trafia do nagłówka Subject, więc żadnych znaków końca linii
  category: z.string().max(80).regex(/^[^\r\n]*$/),
  packDays: z.number().int().min(3).max(400),
  reorderBand: z.string().max(20),
  // czy odwiedzający zna swój realny interwał, czy zostawił pole puste
  reorderKnown: z.boolean(),
  gapDays: z.number().int().min(-400).max(400),
  economics: z.object({
    orders: z.number().min(1).max(9_999_999),
    recovered: z.number().min(0).max(9_999_999),
    perMonth: z.number().min(0).max(999_999_999),
    perYear: z.number().min(0).max(999_999_999),
  }),
  steps: z.array(StepSchema).max(50),
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
const MAX_PER_WINDOW = 5;

function seenRecently(ip: string) {
  const now = Date.now();
  const seen = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  seen.push(now);
  HITS.set(ip, seen);
  if (HITS.size > 5000) HITS.clear();
  return seen.length > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  // Egzekwowalne bez wspólnego stanu, w przeciwieństwie do mapy powyżej.
  const origin = request.headers.get('origin');
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oleksiakconsulting.com';
  if (origin && origin !== site) {
    return NextResponse.json({ error: 'bad_origin' }, { status: 403 });
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

  const from = `Rafał Oleksiak <${process.env.FROM_EMAIL}>`;

  // 1 · To, o co poprosili. Jeśli to padnie, request pada — odwiedzający
  //     dostaje na stronie adres i wie, że ma napisać wprost.
  const { error } = await resend.emails.send({
    from,
    to: [lead.email],
    replyTo: process.env.TO_EMAIL,
    subject:
      lead.intent === 'markup'
        ? `Twój sheet: ${lead.category.toLowerCase()} — czytam go dziś`
        : `Twój sheet: ${lead.category.toLowerCase()}`,
    html: sheetEmail(lead),
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
        (lead.intent === 'markup' ? '[MARK-UP] ' : '[sheet] ') +
        `${lead.email} · ${lead.category} · ${lead.economics.perYear.toLocaleString('pl-PL')} zł/rok`,
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
