// app/lib/lead-email.ts
//
// Dwa maile. Pierwszy idzie do odwiedzajacego i jest potwierdzeniem, nie
// dostawa: strona nie obiecuje juz arkusza, bo kalkulator, ktory go liczyl,
// zostal wyciety, a pomiar robi teraz narzedzie pod /tool. Zamiast arkusza
// mail prosi o jedna rzecz, ktorej naprawde potrzeba do rozmowy — eksport
// zamowien. Drugi jest dla Rafala i ma dac decyzje w pare sekund.

import type { Lead } from '@/app/api/lead/route'

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

const SHELL = (inner: string) => `<!doctype html>
<html><body style="margin:0;background:#F4F4F1;padding:28px 16px;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
  color:#171A24;line-height:1.6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0"
  style="max-width:600px;background:#FFFFFF;border:1px solid #E3E1DB;">
<tr><td style="padding:32px 32px 36px;">${inner}</td></tr>
</table>
<p style="max-width:600px;margin:16px auto 0;font-size:11px;line-height:1.7;color:#83879A;
  text-align:left;">
You are getting this because you wrote to me on oleksiakconsulting.com. I keep your address to
reply — no list, no sequence, no third party.
<a href="https://oleksiakconsulting.com/stop" style="color:#83879A;">Tell me to stop</a> and I never
write again.
</p>
</td></tr></table>
</body></html>`

const H = (t: string) =>
  `<h1 style="margin:0 0 14px;font-size:21px;line-height:1.25;font-weight:700;">${t}</h1>`
const P = (t: string) =>
  `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;">${t}</p>`

/** Potwierdzenie dla odwiedzajacego. Krotkie, z jedna prosba.
    Nie bierze leada: nie personalizujemy tresci, a adres i tak jest w polu To. */
export function confirmEmail() {
  return SHELL(
    H('Got it — I reply by hand.') +
      P(
        'I read every message myself, so there is no sequence behind this one. You will hear ' +
          'back from me, usually the same day.',
      ) +
      P(
        'If you want that reply to be worth reading, send me an order export: date, customer, ' +
          'product title, quantity, price. A CSV straight out of Shopify, WooCommerce or ' +
          'BaseLinker is fine — no cleaning up.',
      ) +
      P(
        'From that I can see the real gap between the day a pack runs out and the day your ' +
          'customer comes back. You can see the same thing yourself first, in your browser, ' +
          'without sending me anything: ' +
          '<a href="https://oleksiakconsulting.com/tool" style="color:#C2410C;">' +
          'oleksiakconsulting.com/tool</a>.',
      ) +
      P('— Rafał'),
  )
}

/** Powiadomienie dla wlasciciela. Ma wystarczyc do decyzji, czy odpisac. */
export function ownerEmail(lead: Lead) {
  const src = lead.source ?? {}
  const rows = Object.keys(src)
    .sort()
    .map(
      (k) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#83879A;white-space:nowrap;">${esc(k)}</td>` +
        `<td style="padding:4px 0;">${esc(src[k]!)}</td></tr>`,
    )
    .join('')

  return SHELL(
    H(esc(lead.email)) +
      (lead.message
        ? `<p style="margin:0 0 16px;padding:12px 14px;background:#F4F4F1;border-left:3px solid #C2410C;
             font-size:15px;line-height:1.6;">${esc(lead.message)}</p>`
        : P('<span style="color:#83879A;">No message — address only.</span>')) +
      (rows
        ? `<table role="presentation" cellpadding="0" cellspacing="0"
             style="font-size:13px;line-height:1.6;margin-top:4px;">${rows}</table>`
        : P('<span style="color:#83879A;">No campaign or referrer recorded.</span>')),
  )
}
