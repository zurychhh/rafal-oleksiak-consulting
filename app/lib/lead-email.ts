// app/lib/lead-email.ts
//
// Dwa maile. Pierwszy idzie do odwiedzajacego i jest potwierdzeniem, nie
// dostawa: strona nie obiecuje juz arkusza, bo kalkulator, ktory go liczyl,
// zostal wyciety, a pomiar robi teraz narzedzie pod /tool. Zamiast arkusza
// mail prosi o jedna rzecz, ktorej naprawde potrzeba do rozmowy — eksport
// zamowien. Drugi jest dla Rafala i ma dac decyzje w pare sekund.

import type { Lead, ConsentRecord } from '@/app/api/lead/route'
import { analysisOf, ownerTag, WORDING, type Analysis } from '@/app/lib/lead-analysis'

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

/** Odbiorca maila do odwiedzajacego — od niego zalezy stopka. */
export interface Recipient {
  email: string
  marketing: boolean
}

const stopUrl = (email: string) =>
  `https://oleksiakconsulting.com/stop?email=${encodeURIComponent(email)}`

/* Stopka mowi prawde o tym, na co ktos sie zgodzil. "No list, no sequence"
   tylko dla osob BEZ zgody marketingowej — kto ja zaznaczyl, zapisal sie na
   okazjonalne maile i stopka nie moze temu przeczyc. Link wypisu otwiera /stop
   z wpisanym adresem; wypis to jeden przycisk (nie GET — skanery linkow). */
const FOOT = {
  marketing:
    'You signed up for occasional emails from me — notes on reorder timing, new tools I build, ' +
    'and what I learn working on FMCG stores.',
  marketingStop: "the page opens with your address filled in; one button and you're off the list.",
  reply:
    'You are getting this because you wrote to me on oleksiakconsulting.com. I keep your address to ' +
    'reply — no list, no sequence, no third party.',
  replyStop: 'and I never write again.',
}

function footerHtml(r: Recipient | null): string {
  if (!r) return ''
  const a = (t: string) => `<a href="${esc(stopUrl(r.email))}" style="color:#83879A;">${t}</a>`
  const body = r.marketing
    ? `${esc(FOOT.marketing)} ${a('Unsubscribe')} &mdash; ${esc(FOOT.marketingStop)}`
    : `${esc(FOOT.reply)} ${a('Tell me to stop')} ${esc(FOOT.replyStop)}`
  return `<p style="max-width:600px;margin:16px auto 0;font-size:11px;line-height:1.7;color:#83879A;
  text-align:left;">${body}</p>`
}

function footerText(r: Recipient): string {
  return r.marketing
    ? `${FOOT.marketing}\nUnsubscribe: ${stopUrl(r.email)} — ${FOOT.marketingStop}`
    : `${FOOT.reply}\nTell me to stop ${FOOT.replyStop} ${stopUrl(r.email)}`
}

const SHELL = (inner: string, r: Recipient | null) => `<!doctype html>
<html><body style="margin:0;background:#F4F4F1;padding:28px 16px;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
  color:#171A24;line-height:1.6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0"
  style="max-width:600px;background:#FFFFFF;border:1px solid #E3E1DB;">
<tr><td style="padding:32px 32px 36px;">${inner}</td></tr>
</table>
${footerHtml(r)}
</td></tr></table>
</body></html>`

const H = (t: string) =>
  `<h1 style="margin:0 0 14px;font-size:21px;line-height:1.25;font-weight:700;">${t}</h1>`
const P = (t: string) =>
  `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;">${t}</p>`

/** Potwierdzenie dla odwiedzajacego. Krotkie, z jedna prosba.
    Tresc nie jest personalizowana; od odbiorcy zalezy tylko stopka. */
const CONFIRM = {
  head: 'Got it — I reply by hand.',
  paras: [
    'I read every message myself, so there is no sequence behind this one. You will hear ' +
      'back from me, usually the same day.',
    'If you want that reply to be worth reading, send me an order export: date, customer, ' +
      'product title, quantity, price. A CSV straight out of Shopify, WooCommerce or ' +
      'BaseLinker is fine — no cleaning up.',
  ],
  tool:
    'From that I can see the real gap between the day a pack runs out and the day your ' +
    'customer comes back. You can see the same thing yourself first, in your browser, ' +
    'without sending me anything:',
}

export function confirmEmail(r: Recipient) {
  return SHELL(
    H(esc(CONFIRM.head)) +
      CONFIRM.paras.map((t) => P(esc(t))).join('') +
      P(
        esc(CONFIRM.tool) + ' ' +
          '<a href="https://oleksiakconsulting.com/tool" style="color:#C2410C;">' +
          'oleksiakconsulting.com/tool</a>.',
      ) +
      P('— Rafał'),
    r,
  )
}

export function confirmText(r: Recipient) {
  return [
    CONFIRM.head, '',
    ...CONFIRM.paras.flatMap((t) => [t, '']),
    `${CONFIRM.tool} https://oleksiakconsulting.com/tool`, '',
    '— Rafał', '', '--',
    footerText(r),
  ].join('\n')
}

/* ── Wynik z /tool ──────────────────────────────────────────────────────────
   Mail, ktory "SEND ME THE ANALYSIS" obiecuje. Wszystkie liczby pochodza
   z przegladarki odwiedzajacego i przeszly przez zoda jako liczby calkowite,
   wiec trafiaja tu bez escape'owania tekstu — ale i tak przez String(). */

/** Wiersze tabeli wyniku: [etykieta, wartosc]. Wspolne dla HTML i plain text. */
function analysisRows(a: Analysis, now: Date): [string, string][] {
  const rows: [string, string][] = [['Analysis run', now.toISOString().slice(0, 10)]]
  if (a.labelDay != null) rows.push(['Day on the label', `day ${a.labelDay}`])
  if (a.verdict === 'confident') {
    rows.push(['Median gap between orders', `${a.interval} days`])
    if (a.gap != null) rows.push(['Difference', WORDING.gap(a.gap)])
  } else if (a.low != null && a.high != null) {
    rows.push(['Gap between orders', `day ${a.low} to day ${a.high} (middle half)`])
  }
  if (a.sampleN != null) rows.push(['Customers with 2+ orders', String(a.sampleN)])
  if (a.windowDays != null) rows.push(['Data window', `${a.windowDays} days`])
  return rows
}

/** Akapity pod naglowkiem — te same zdania co na ekranie (WORDING). */
function analysisLines(a: Analysis): { head: string; lines: string[] } {
  const lines: string[] = []
  let head: string
  if (a.verdict === 'confident') {
    head = a.labelDay != null
      ? `The label says ${a.labelDay}. Your data says ${a.interval}.`
      : `Your customers reorder after ${a.interval} days.`
    if (a.gap != null) {
      lines.push(`Your customers reorder ${WORDING.gap(a.gap)} — that is the window every reminder, ` +
        'exclusion and subscription interval should be timed to.')
    }
  } else if (a.verdict === 'small') {
    head = 'Too few repeat customers for one number yet.'
    lines.push(WORDING.small(a.sampleN ?? 0))
    lines.push(a.low != null && a.high != null ? WORDING.range(a.low, a.high) : WORDING.noRange)
  } else if (a.verdict === 'bimodal') {
    head = 'Two different return rhythms.'
    lines.push(WORDING.bimodal(a.sampleN))
    if (a.low != null && a.high != null) lines.push(WORDING.range(a.low, a.high))
  } else {
    head = a.labelDay != null ? `The label says ${a.labelDay}.` : 'Your result.'
    lines.push(WORDING.partial)
  }
  if (a.shortWindow && a.windowDays != null) lines.push(WORDING.shortWindow(a.windowDays))
  lines.push(WORDING.source)
  return { head, lines }
}

/** Mail z wynikiem dla odwiedzajacego — HTML. */
export function analysisEmail(a: Analysis, r: Recipient, now = new Date()) {
  const { head, lines } = analysisLines(a)
  const table =
    `<table role="presentation" cellpadding="0" cellspacing="0" width="100%"
       style="font-size:14px;line-height:1.5;margin:4px 0 18px;border-top:1px solid #14161A;">` +
    analysisRows(a, now)
      .map(([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #DCDAD2;color:#6E6D68;` +
        `white-space:nowrap;vertical-align:top;">${esc(k)}</td>` +
        `<td style="padding:8px 0;border-bottom:1px solid #DCDAD2;font-weight:600;">${esc(v)}</td></tr>`)
      .join('') +
    `</table>`
  return SHELL(
    H(esc(head)) +
      table +
      lines.map((l) => P(esc(l))).join('') +
      P('If you want me to look at what this means for your store, reply to this email — ' +
        'I read every message myself.') +
      P('— Rafał'),
    r,
  )
}

/** Ten sam mail jako plain text — dla klientow bez HTML i dla filtrow spamu. */
export function analysisText(a: Analysis, r: Recipient, now = new Date()) {
  const { head, lines } = analysisLines(a)
  const rows = analysisRows(a, now)
  const w = Math.max(...rows.map(([k]) => k.length))
  return [
    head,
    '',
    ...rows.map(([k, v]) => `${k.padEnd(w)}  ${v}`),
    '',
    ...lines.flatMap((l) => [l, '']),
    'If you want me to look at what this means for your store, reply to this email — I read every message myself.',
    '',
    '— Rafał',
    '',
    '--',
    footerText(r),
  ].join('\n')
}

/** Powiadomienie dla wlasciciela. Ma wystarczyc do decyzji, czy odpisac. */
export function ownerEmail(lead: Lead, consent?: ConsentRecord, crmError?: string | null) {
  const src = lead.source ?? {}
  const store = lead.storeUrl ?? lead.message ?? ''
  const rows = Object.keys(src)
    .sort()
    .map(
      (k) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#83879A;white-space:nowrap;">${esc(k)}</td>` +
        `<td style="padding:4px 0;">${esc(src[k]!)}</td></tr>`,
    )
    .join('')

  /* Pasek zgod stoi wysoko i jest jednoznaczny, bo od niego zalezy, co wolno
     zrobic z tym adresem. Zielone/czerwone, nie "brak danych": jesli pole nie
     przyszlo, to znaczy, ze zgody nie odnotowano, i tak to jest napisane. */
  const flag = (ok: boolean, yes: string, no: string) =>
    `<span style="display:inline-block;padding:2px 8px;margin:0 8px 6px 0;font-size:12px;
       font-weight:600;border:1px solid ${ok ? '#1F7A4D' : '#B23B2E'};
       color:${ok ? '#1F7A4D' : '#B23B2E'};">${ok ? yes : no}</span>`

  const consentBlock = consent
    ? `<p style="margin:0 0 16px;">` +
      flag(consent.contact, 'Contact consent', 'NO contact consent') +
      flag(consent.marketing, 'Marketing consent', 'No marketing consent') +
      `<br><span style="font-size:12px;color:#83879A;">${esc(consent.at)} &middot; ` +
      `${esc(consent.ip)} &middot; form: ${esc(consent.form)}</span>` +
      (consent.text
        ? `<br><span style="font-size:12px;color:#83879A;">&ldquo;${esc(consent.text)}&rdquo;</span>`
        : '') +
      `</p>`
    : ''

  /* Jedyny kanal, ktory Rafal naprawde czyta. Jesli kontakt nie zapisal sie
     w CRM, ma to wiedziec z tego maila, a nie z logow Vercela. */
  const crmBlock = crmError
    ? `<p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#B23B2E;">` +
      `CRM write failed: ${esc(crmError)}</p>`
    : ''

  /* Wynik z /tool na samej gorze — z czym przychodzi lead, zanim otworzysz CRM.
     Ta sama metka co w temacie, te same zastrzezenia co u odwiedzajacego. */
  const a = analysisOf(lead)
  const analysisBlock = a
    ? `<p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.14em;
         text-transform:uppercase;color:#6E6D68;">From /tool &middot; ${esc(a.verdict)}</p>` +
      `<p style="margin:0 0 16px;padding:10px 14px;border:1px solid #14161A;font-size:15px;
         font-weight:600;line-height:1.5;">${esc(ownerTag(a))}</p>`
    : ''

  return SHELL(
    H(esc(lead.email)) +
      crmBlock +
      analysisBlock +
      consentBlock +
      (store
        ? `<p style="margin:0 0 16px;padding:12px 14px;background:#F4F4F1;border-left:3px solid #C2410C;
             font-size:15px;line-height:1.6;">${esc(store)}</p>`
        : P('<span style="color:#83879A;">No store URL — address only.</span>')) +
      (rows
        ? `<table role="presentation" cellpadding="0" cellspacing="0"
             style="font-size:13px;line-height:1.6;margin-top:4px;">${rows}</table>`
        : P('<span style="color:#83879A;">No campaign or referrer recorded.</span>')),
    null, // mail do wlasciciela — bez stopki dla odbiorcy
  )
}
