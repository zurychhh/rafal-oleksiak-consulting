// app/lib/sheet-email.ts
//
// Two emails. The first is the thing the visitor asked for and has to be
// worth opening on its own. The second is for Rafał and exists so he can
// decide in five seconds whether to reply.

import type { Lead } from '@/app/api/lead/route'

const zl = (n: number) => n.toLocaleString('pl-PL') + ' zł'
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
You are getting this because you asked for it on oleksiakconsulting.com. I keep your address to
send this sheet and to reply if you asked me to — no list, no sequence, no third party.
<a href="https://oleksiakconsulting.com/stop" style="color:#83879A;">Tell me to stop</a> and I never
write again.
</p>
</td></tr></table>
</body></html>`

export function sheetEmail(lead: Lead) {
  const rows = lead.steps
    .map(
      (s: Lead['steps'][number]) => `<tr>
      <td style="padding:9px 10px 9px 0;border-bottom:1px solid #EDEBE5;font-size:13px;
        color:#83879A;width:26px;vertical-align:top;">${s.rank}</td>
      <td style="padding:9px 10px 9px 0;border-bottom:1px solid #EDEBE5;font-size:14px;
        vertical-align:top;${s.already ? 'color:#9A9DAA;text-decoration:line-through;' : ''}">
        <b style="font-weight:600;">${esc(s.step)}</b><br>
        <span style="font-size:12px;color:#6A6E80;">${esc(s.when)} · ${esc(s.channel)} · ${esc(s.moves)}</span>
      </td>
      <td style="padding:9px 0;border-bottom:1px solid #EDEBE5;font-size:12px;color:#6A6E80;
        text-align:right;vertical-align:top;white-space:nowrap;">
        ${s.already ? 'already running' : ''}</td>
    </tr>`,
    )
    .join('')

  const gapLine = !lead.reorderKnown
    ? `A pack lasts ${lead.packDays} days. You did not fill in the day your buyers actually come
       back — most brands cannot. That missing number is the finding: every step below is timed
       against a cycle nobody in your shop has measured yet.`
    : lead.gapDays > 0
      ? `A pack lasts ${lead.packDays} days and your buyers come back on day
         ${esc(lead.reorderBand)} — <b>${lead.gapDays} days</b> with nothing in the cupboard.`
      : lead.gapDays < 0
        ? `A pack lasts ${lead.packDays} days and your buyers reorder on day
           ${esc(lead.reorderBand)}, before it runs out. That is a standing-order problem, not a
           reminder problem.`
        : `Your pack cycle and your reorder cycle land on the same day. Timing is not the problem —
           reach is.`

  const closing =
    lead.intent === 'markup'
      ? `<p style="margin:22px 0 0;font-size:15px;">You asked me to mark this up. I am reading it
         today and you will have my notes before this time tomorrow: the order I would build it in,
         the two steps I would cut, and what I would need from your order data to replace the
         assumptions below with your real interval.</p>
         <p style="margin:14px 0 0;font-size:14px;color:#6A6E80;">If any of it turns out to be worth
         doing together, it is one piece of work at a fixed fee agreed up front — usually
         <b style="color:#171A24;">8&ndash;12k z&#322; net</b> for two to three weeks. No retainer,
         and no discovery phase you pay for before anything moves.</p>`
      : `<p style="margin:22px 0 0;font-size:15px;">That is the whole sheet — no follow-up sequence
         is coming. If you want me to mark up your version, just reply to this email and I will.</p>
         <p style="margin:14px 0 0;font-size:14px;color:#6A6E80;">And if you would rather I built one
         of these than described it: one piece of work, fixed fee agreed up front, usually
         <b style="color:#171A24;">8&ndash;12k z&#322; net</b>.</p>`

  return SHELL(`
    <p style="margin:0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#83879A;">
      Oleksiak Consulting</p>
    <h1 style="margin:14px 0 0;font-size:23px;line-height:1.25;font-weight:700;">
      ${esc(lead.category)} · ${lead.packDays}-day pack</h1>

    <p style="margin:18px 0 0;font-size:15px;">${gapLine}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="margin-top:22px;border-top:2px solid #171A24;">
      <tr><td style="padding:12px 0 4px;font-size:13px;color:#6A6E80;">
        ${lead.economics.orders.toLocaleString('pl-PL')} orders a month, of which about
        <b style="color:#171A24;">${lead.economics.recovered.toLocaleString('pl-PL')}</b> are winnable back
      </td></tr>
      <tr><td style="padding:0 0 14px;border-bottom:2px solid #171A24;">
        <span style="font-size:26px;font-weight:700;color:#C2410C;">${zl(lead.economics.perMonth)}</span>
        <span style="font-size:13px;color:#6A6E80;"> a month · ${zl(lead.economics.perYear)} a year</span>
      </td></tr>
    </table>
    <p style="margin:10px 0 0;font-size:12px;color:#6A6E80;">
      Those four factors were yours to set on the page. The arithmetic is just multiplication —
      change any of them and the number changes with them.</p>

    <p style="margin:30px 0 10px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;
      color:#83879A;">The eighteen, in the order I would build them</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="border-top:1px solid #171A24;">${rows}</table>

    ${closing}

    <p style="margin:26px 0 0;padding-top:18px;border-top:1px solid #E3E1DB;font-size:12px;
      line-height:1.7;color:#6A6E80;">
      <b style="color:#171A24;">About the numbers.</b> Everything in the sum above is yours — I put
      no figure of my own into it. The percentages beside each step are ranges from the work below,
      not measurements of your shop. Fifteen years of FMCG ecommerce — traffic, storefront and
      lifecycle: Allegro (the FMCG and recurring team, next-pack prediction per user),
      mBank/mOkazje (coffee, detergents, contact lenses), Genactiv (colostrum sachets, category
      leader), and Booksy where the pack is an appointment.</p>
  `)
}

export function ownerEmail(lead: Lead) {
  const marked = lead.steps.filter((s) => s.already)
  const src = lead.source ?? {}
  return SHELL(`
    <p style="margin:0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;
      color:${lead.intent === 'markup' ? '#C2410C' : '#83879A'};">
      ${lead.intent === 'markup' ? 'Wants a mark-up — reply within 24h' : 'Sheet only'}</p>
    <h1 style="margin:12px 0 0;font-size:20px;font-weight:700;">${esc(lead.email)}</h1>
    <p style="margin:8px 0 0;font-size:14px;color:#6A6E80;">
      ${esc(lead.category)} · ${lead.packDays}-day pack ·
      ${lead.reorderKnown ? `reorder day ${esc(lead.reorderBand)} · gap ${lead.gapDays} dni` : 'nie zna swojego interwału'}<br>
      ${lead.economics.orders.toLocaleString('pl-PL')} orders/mo →
      <b style="color:#171A24;">${zl(lead.economics.perYear)}/yr</b> on their own inputs</p>

    <p style="margin:20px 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;
      color:#83879A;">Says they already run ${marked.length} of ${lead.steps.length}</p>
    <p style="margin:0;font-size:14px;">${
      marked.length ? marked.map((s) => esc(s.step)).join(' · ') : '<i style="color:#6A6E80;">nothing marked</i>'
    }</p>

    <p style="margin:20px 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;
      color:#83879A;">Where they came from</p>
    <p style="margin:0;font-size:13px;color:#6A6E80;">
      ${Object.entries(src).map(([k, v]) => `${esc(k)}: ${esc(String(v))}`).join('<br>') || 'no source data'}</p>
  `)
}
