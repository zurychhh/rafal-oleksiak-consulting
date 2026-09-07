// app/api/stop/route.ts
//
// Wypis. Stopka każdego maila obiecuje „one line at the bottom of the mail
// stops it for good", więc to musi realnie zapisać żądanie, a nie tylko
// pokazać potwierdzenie.
//
// Trwałym rejestrem jest skrzynka właściciela: po wycięciu radaru nie ma już
// bazy, a lista adresatów i tak jest prowadzona ręcznie. Mail do właściciela
// jest więc zapisem, a nie powiadomieniem — dlatego jego niepowodzenie
// przerywa żądanie i odwiedzający dostaje błąd zamiast fałszywego „gotowe".
// Oznaczenie w HubSpocie jest dodatkiem i nie może o niczym decydować.

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const StopSchema = z.object({
  email: z.string().email().max(254),
});

export async function POST(request: NextRequest) {
  // Ten sam test co w /api/lead: liczony z żądania, więc działa tak samo
  // na produkcji, na preview i na localhoście.
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 });
  }

  const parsed = StopSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid' }, { status: 422 });
  }
  const { email } = parsed.data;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('[stop] RESEND_API_KEY missing');
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }
  const resend = new Resend(key);

  const { error } = await resend.emails.send({
    from: `Rafał Oleksiak <${process.env.FROM_EMAIL}>`,
    to: [process.env.TO_EMAIL!],
    replyTo: email,
    subject: `[STOP] ${email}`,
    // Adres jest wstawiany do tekstu, nie do HTML-a, i przeszedł już walidację
    // zoda — żaden znak spoza adresu email się tu nie dostanie.
    text:
      `${email} prosi o wypis.\n\n`
      + 'Usuń ten adres ze wszystkiego, co trzymasz, i nie pisz do niego więcej.\n'
      + 'Zgłoszone przez formularz na /stop.\n',
  });

  if (error) {
    console.error('[stop] resend error', error);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
