# v74 — Authoring specification

Source of truth: claude.ai design project `1c71db27-fb65-4c02-8884-1b5693ecc331`,
files `Homepage v74 DOSAGE TRESC.dc.html` (1134 lines) and
`Tool v11 DOSAGE TRESC.dc.html` (480 lines), read 2026-10-07.

The canvas files are written in the design-canvas DSL: one `<x-dc>` markup tree with
`{{ … }}` interpolations, `<sc-if value="{{ flag }}">`, `<sc-for list="{{ list }}" as="x">`,
plus a `<script type="text/x-dc">` holding `class Component extends DCLogic` with
`renderVals()` returning every interpolated value. Re-authoring target is static HTML
plus imperative JS, so every `{{ … }}` below is given with the value it resolves to.

Two things that matter before you start, both verified by string search in the file:

1. **The COMPOSITION hover instrument is not wired up in v74.** `renderVals()` still
   computes `hover` state, a `ruler` (70 hover-dependent day ticks), a `directions`
   list, `dirTitle` and `panelText`, and each card object still carries `enter`/`leave`
   callbacks — but the markup contains no `onMouseEnter`/`onMouseLeave`, no
   `id="directions"` element, no `[data-rbar]` bars and no `{{ panelText }}`,
   `{{ dirTitle }}`, `{{ directions }}` or `{{ ruler }}` interpolation. Section 4a
   documents the mechanism the surviving code describes and marks exactly which parts
   exist only in the logic.
2. **`playInterval()` never runs.** It selects `[data-interval-span]` and
   `[data-interval-69]`, and `tick()` gates it on `[data-interval-axis]`; none of those
   three attributes appears in the markup. The 70-day axis in the ONE DATE panel is
   therefore static.

Font: Instrument Sans (Google Fonts, weights 400/500/600/700, `display=swap`),
fallback `system-ui, sans-serif`, with `-webkit-font-smoothing: antialiased`.

---

## 1. Section order, top to bottom

Breakpoint flags (computed in `tick()`, overridable by the `device` prop
`auto|desktop|phone`, default `auto`):

- `phone`  = media query `(max-width: 759px)` (fallback `innerWidth < 760`)
- `stacked` = `innerWidth < 1200`
- `narrow` = `innerWidth < 1024`
- `wide900` = `innerWidth > 900`
- `w768` = `innerWidth >= 768`

Document body is one root `<div>` with `padding-top: L.meterReserve` (always `0px`)
and `padding-bottom: rootPadB` — `0px` when the pinned finale renders, otherwise
`L.barSpace` (`104px` desktop, `0px` phone).

| # | Block | Where | Visibility |
|---|---|---|---|
| 1 | `<header>` — name lockup + 70-bar signature strip | flow | both |
| 2 | Dose meter — `position: fixed` | left rail `left:22px; top:50%` | **desktop only** (`meterOn = !phone && w768 !== false`); also needs `scrolled` (scrollY > 60) to be `display:flex` |
| 3 | `<main>` CSS grid, areas `head / form / recog / svc` | flow | both, different areas |
| 3a | grid-area `head`: eyebrow INDICATION, h1, source label, 45-vs-69 line, CTA link, lead paragraph, **phone enquiry form**, **phone fee tail** | | eyebrow desktop-only; form+tail phone-only |
| 3b | grid-area `form`: fee rail (`data-fee-band`) + **desktop enquiry form** | right column at >=1024px | desktop only (`midFormDisplay`) |
| 3c | grid-area `recog`: IF THIS IS YOUR STORE | full width | both |
| 3d | grid-area `svc`: COMPOSITION five cards, then the `#one-date` panel (axis, four channel rows, two closing paragraphs, "Count your own interval" link) | full width | both |
| 3e | `grid-column: 1 / -1`: PRIOR BATCHES, five client rows | inside `<main>`, last child | both |
| 4 | Second signature strip (70 bars) + `<footer>` | flow, outside `<main>` | both |
| 5 | **Pinned finale** `<section>`, `height: L.pinOuter` with a `position:sticky; top:0; height:100vh` child | flow | **desktop only** (`showPin = !phone && wide900`) |
| 6 | `<main>` holding the standalone closing enquiry panel | flow | **phone only** (`noPin = !showPin`) |
| 7 | Sticky bottom bar `[data-bar]`, `position: fixed; bottom: 0` | fixed | both, two variants: `barShort` desktop, `barFull` phone |

Grid areas:

- phone: `"head" "recog" "svc" "form"`, columns `minmax(0,1fr)`
- desktop `narrow` (<1024px): `"head" "form" "recog" "svc"`, columns `minmax(0,1fr)`
- desktop wide: `"head form" "recog recog" "svc svc"`, columns `minmax(0,1fr) minmax(300px,380px)`

**Where the document ends.** The last element in the tree is the fixed bottom bar
`<div data-bar>`, closed by `</x-dc></body></html>`. The last block that occupies
scroll height is block 5 on desktop (the pinned finale, which is the final 320vh of
the page and is immediately preceded by the footer) and block 6 on phone (the closing
enquiry panel inside the trailing `<main>`, followed by 0px of bar reserve because
`L.barSpace` is `0px` on phone — the phone bar is `barFull` and overlays).

---

## 2. Every piece of visible copy, verbatim, in order

Entities in the source are given here as the characters they render
(`&#322;` = ł, `&middot;` = ·, `&mdash;` = —, `&ndash;` = –, `&rsquo;` = ’).
Note the apostrophe discipline in the file: the h1 and the finale payoff use a
**straight** apostrophe in "don't"; every other possessive/contraction uses a curly ’.

### 2.1 Header

| Role | Copy |
|---|---|
| lockup (label, uppercase) | `Rafał Oleksiak · Consultant` |

Followed by a decorative 70-bar signature strip, `aria-hidden="true"`, no text.

### 2.2 Hero — grid-area `head`

| Role | Copy |
|---|---|
| eyebrow (desktop only) | `Indication` |
| headline (h1) | `You don't pay twice for the same customer.` |
| source label (eyebrow above a top rule) | `Source — a real supplement shop, anonymised` |
| lead statement (the 45-vs-69 sentence) | `The label says 45 days. The order data says 69.` |
| button-styled link, `href="/tool"` | `Check your own gap — free` |
| lead paragraph, first sentence (always) | `E-commerce for brands whose customers come back.` |
| lead paragraph, tail span (desktop only: `L.leadTail` is `inline` desktop, `none` phone) | ` I build the tools myself — calculators, counters, progress bars — the kind of thing that normally waits in an IT queue.` |

On phone the tail sentence is re-used as a standalone paragraph in the phone fee tail
(2.9), so the words appear exactly once at any viewport.

### 2.3 Enquiry form — identical copy in three places

Three live forms carry the same copy; only field `name`s and button padding differ.
See section 6 for the field inventory.

| Role | Copy |
|---|---|
| eyebrow | `Enquiry form` |
| label | `Your store URL` |
| placeholder | `yourstore.com` |
| label | `Your email` |
| placeholder | `you@yourstore.com` |
| consent 1 (required checkbox) | `I agree to be contacted about this enquiry` + ` (required)` in #6E6D68 |
| consent 2 (optional checkbox) | `Occasional email from me — notes on reorder timing, new tools I build, and what I learn working on FMCG stores. Unsubscribe in one click.` + ` (optional)` in #6E6D68 |
| body — the 24-hour promise | `I reply personally within 24 hours, with a first observation about ` + live echo span (default text `your store`) + ` — not a calendar link.` |
| button | `Send` |
| price line (`feeLead`) | `EUR 2,500 net per month.` |

The two consent spans are a single text node each; `(required)` / `(optional)` are
leading-space-separated child spans coloured `#6E6D68`.

### 2.4 Post-submit confirmation (hero and phone forms)

| Role | Copy |
|---|---|
| eyebrow | `Enquiry received` |
| label | `Your store URL` |
| value | the submitted host, echoed verbatim (`sentHost.*`) |
| body | `I reply personally within 24 hours, with a first observation about your store — not a calendar link.` |
| body | `Two clients at a time.` |

### 2.5 Fee rail (`feeRest`) — desktop right column, phone fee tail

| Role | Copy |
|---|---|
| body row 1 | `No setup fee. No minimum term.` |
| body row 2 | `Two clients at a time.` |
| body row 3 | `The first month is an as-is audit and the quick wins that come out of it.` |

### 2.6 IF THIS IS YOUR STORE — grid-area `recog`

| Role | Copy |
|---|---|
| eyebrow (left) | `If this is your store` |
| counter (right, `[data-recog-code]`) | `01–03` — rewritten at runtime to `01–01`, `01–02`, `01–03` |

Four statements, then a verdict. **The first statement has no veil and is always
visible**; only statements 2–4 carry `[data-recog-line]` and are revealed on scroll
(`armRecog` bails unless it finds exactly three).

| Role | Copy |
|---|---|
| body 1 (never hidden) | `You bought the same customer twice this quarter, and you only found out because you recognised the name.` |
| body 2 | `The campaign with the best reported return is the one bringing people who buy once and never come back.` |
| body 3 | `You know your category has a reorder date. Nobody in the business can say what it is, so the reminder goes out on the tool’s default day.` |
| body 4 | `The subscription converts and then cancels after the first delivery, and you cannot tell whether you sold loyalty or a discount.` |
| verdict (600 weight, larger) | `If two of these are yours, the problem is not your ad rates. It is that the second purchase is nobody’s job.` |

### 2.7 COMPOSITION — grid-area `svc`

| Role | Copy |
|---|---|
| eyebrow | `Composition — five parts, in order` |

Five cards, rendered left-to-right in a 5-column grid on desktop (single column when
`stacked`). Each card, in DOM order: dose bar + ml label, then number, title,
evidence paragraph, short line.

**Part 01** — ml label `100 ml`, number `01`
- title: `Paid that buys returning customers, not clicks`
- evidence: `The usual mistake is reporting return on ad spend against the first order, so the campaigns that bring people who never reorder look like the best ones and get more budget every month. Change the reporting window before you change the budget.`
- short: `Budget set around the customers who come back, not the first basket.`
- note (axis caption, logic only): `Days 46–69 — bid against a full cupboard`
- directions (logic only, three lines):
  1. `Campaign structure split by the role of the purchase, new customer versus returning.`
  2. `Audiences and exclusions built from CRM cycle data instead of platform lookalikes.`
  3. `The measurement window set to the category’s own cycle rather than a default seven or thirty days.`

**Part 02** — ml label `80 ml`, number `02`
- title: `More carts from the same traffic`
- evidence: `Most stores tune the product page and leave the pack size ambiguous. If a shopper cannot tell how long a pack lasts, they take the smallest one, and the smallest pack is the weakest possible start for a second order.`
- short: `The paths that decide whether a first pack becomes a habit.`
- note: `Days 1–2 — the visit that picks the pack size`
- directions:
  1. `Pack size and duration stated plainly on the product page so the shopper can see how long each variant lasts.`
  2. `A clean one-off versus subscription choice instead of a hidden toggle.`
  3. `Cart thresholds set against the real basket, and the second pack offered after purchase rather than discounted before it.`

**Part 03** — ml label `60 ml`, number `03`
- title: `The second purchase without paying for a click`
- evidence: `The second order is usually lost to timing, not to price. The flow fires on the template’s default day while the pack still has weeks left in it, and by the time it actually runs out the reminder is old mail.`
- short: `Owned channels take the next pack before the ad auction does.`
- note: `Days 40–48 — owned channels take the order`
- directions:
  1. `Winback and replenishment flows timed to each customer’s own cycle; lapsed segments separated from never-returned.`
  2. `Email, push and SMS split by what the moment deserves.`
  3. `Anyone already inside an owned-channel flow suppressed from paid so the same person is not bought twice.`

**Part 04** — ml label `40 ml`, number `04`
- title: `Subscription instead of a discount`
- evidence: `A subscription price that undercuts the one-off price teaches the whole base to subscribe and cancel after the first delivery. Keep the price and pay for loyalty with control instead — skip, postpone, change the pack — because what people cancel is the loss of control, not the cost.`
- short: `The return designed into the product rather than bought with a code.`
- note: `Days 45 and 69 — shipment set by consumption`
- directions:
  1. `Plans designed around pack size and real consumption; skip, postpone and change-size instead of a discount to stay.`
  2. `Loyalty earned by cadence rather than by spend.`
  3. `Save offers placed at the moment of the decision, not a month later.`

**Part 05** — ml label `20 ml`, number `05`
- title: `The day the pack runs out`
- evidence: `The interval on the label is a marketing number. The real one sits in the order history and runs longer, because people miss doses, travel and keep a spare. Build the calendar from each customer’s own gap between orders.`
- short: `One reorder date per customer, read from their own orders.`
- note: `Seven customers, seven different days`
- directions:
  1. `A model calculating the cycle per individual user from order history and pack size.`
  2. `A cohort fallback for customers who have bought only once.`
  3. `That date feeding both the CRM calendar and the paid exclusions, recalculated after every order.`

Default axis caption when nothing is hovered (`panelText`, logic only):
`45 on the label, 69 in the data`.

### 2.8 ONE DATE, FOUR CHANNELS — `#one-date`, inside grid-area `svc`

| Role | Copy |
|---|---|
| eyebrow (left) | `One date, four channels` |
| label (right) | `Dose ` + `dirDose` — at rest `Dose 100 ml` (= `(5 − selected) × 20 ml`) |

70-day axis labels (see section 5 for geometry):

| Role | Copy |
|---|---|
| caption, left edge | `1` |
| caption, day-45 tick, centred | `45 — label` |
| caption, right edge | `70` |
| caption, day-69 tick, right-aligned, colour #A25C11 | `69 — actual` |

Four channel rows, each: an uppercase label, a mini bar axis (`aria-hidden`), a sentence.

| Label | Sentence |
|---|---|
| `Paid` | `the exclusion window closes on day 69` |
| `CRM email` | `the reminder leaves on day 69` |
| `Subscription` | `the interval is set to 69 days` |
| `Product page` | `the pack offered is the one that lasts to day 69` |

Then, in order:

| Role | Copy |
|---|---|
| body, weight 600 | `They move together, not flow by flow.` |
| body | `The label date is not the reorder date.` |
| body | `Those two numbers are one shop’s. Paste your own order export and your own label, and the tool reads the same two numbers off your data.` |
| link, `href="/tool"`, colour #A25C11, underlined | `Count your own interval` |

### 2.9 Phone fee tail (phone only, end of grid-area `head`)

The three `feeRest` rows from 2.5, then:

| Role | Copy |
|---|---|
| lead paragraph | `I build the tools myself — calculators, counters, progress bars — the kind of thing that normally waits in an IT queue.` |

### 2.10 PRIOR BATCHES — full-width section, last child of `<main>`

| Role | Copy |
|---|---|
| eyebrow (left) | `Prior batches` |
| label (right) | `Record of work` |

Five rows. Desktop grid areas `"n l s"` (name, line, status); phone stacks `"n" "s" "l"`.

| Name | Status | Line |
|---|---|---|
| `Allegro` | `Closed` (#6E6D68) | `Worked with a data science team on predicting a customer’s next purchase.` |
| `Accenture` | `Closed` (#6E6D68) | `Lifecycle marketing for cosmetics and drugstore brands: the same repeat-purchase problem at retail scale.` |
| `mBank` | `Closed` (#6E6D68) | `Built a retention programme around consumables: coffee, detergents, lenses.` |
| `Booksy` | `Closed` (#6E6D68) | `The same recurring problem on the service side, where the cycle is an appointment rather than a pack.` |
| `GenActiv` | `In production` (#14161A) | `Current client. Colostrum, Shopify: strategy and build.` |

### 2.11 Dose meter (fixed left rail, desktop only)

| Role | Copy |
|---|---|
| label, repeated on each of 5 marks | `100 ml` (empty string on phone, where the meter does not render) |
| readout (uppercase) | `(5 − spent) × 100` + ` ml left` — i.e. `500 ml left` … `0 ml left` |

### 2.12 Pinned finale (desktop only)

| Role | Copy |
|---|---|
| eyebrow (left) | `One brand, one mark per customer` |
| label (right) | `Batch record` |
| caption, left field, weight 600, ink | `Bought again, and paid for again` |
| caption, right field, #6E6D68 | `Came back on their own day` |
| payoff headline | `You don't pay twice for the same customer.` |
| body, weight 600 | `Rafał Oleksiak` |
| body small, #6E6D68 | `rafal@oleksiakconsulting.com` |
| eyebrow | `Rafał Oleksiak wrote:` |
| body, weight 600 | `Your pack runs out today.` |
| small, #6E6D68, tabular nums | the timestamp, `HH:MM` from `toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})` |
| small, #6E6D68 | `A demonstration — sent with one dose left, not after the pack ran dry.` |
| placeholder + aria-label | `Your store URL` |
| placeholder + aria-label | `Your email` |
| button | `Send` |
| consent 1 | `I agree to be contacted about this enquiry` + ` (required)` |
| consent 2 | `Occasional email from me — notes on reorder timing, new tools I build, and what I learn working on FMCG stores. Unsubscribe in one click.` + ` (optional)` |
| label, uppercase, ink | `One more dose — nothing dispensed` |
| post-submit body | `Got it — ` + host + `. I’ll write to you from rafal@oleksiakconsulting.com within 24 hours.` |

### 2.13 Phone closing enquiry panel (`noPin`, phone only)

| Role | Copy |
|---|---|
| eyebrow (`closeEyebrow`) | `Enquiry form`, replaced by `Enquiry received` after submit |
| body row 1 | `No setup fee.` |
| body row 2 | `No minimum term.` |
| body row 3 | `Two clients at a time.` |

Then the standard form (2.3) with `Send`, `EUR 2,500 net per month.`, and the 24-hour
promise; post-submit shows the `Your store URL` label, the host, the 24-hour sentence
and `Two clients at a time.` (2.4 without the eyebrow, which lives on the panel).

### 2.14 Sticky bottom bar

Desktop (`barShort`):

| Role | Copy |
|---|---|
| body small, max 44ch | `Reply in 24 hours, with a first observation about ` + echo span (`your store`) + `.` |
| placeholder + aria-label | `Your store URL` |
| button | `Send` |

Phone (`barFull`, a collapsible form):

| Role | Copy |
|---|---|
| label | `Your store URL` |
| placeholder | `yourstore.com` |
| button | `Send` |
| label (revealed row) | `Your email` |
| placeholder | `you@yourstore.com` |
| consent 1 | `I agree to be contacted about this enquiry` + ` (required)` |
| consent 2 | `Occasional email from me — notes on reorder timing, new tools I build, and what I learn working on FMCG stores. Unsubscribe in one click.` + ` (optional)` |
| body 12px | `Reply in 24 hours, with a first observation about ` + echo span (`your store`) + `.` |

Post-submit (both variants):
`Got it — ` + host + `. I’ll write to you from rafal@oleksiakconsulting.com within 24 hours, with a first observation about your store.`

### 2.15 Footer

| Role | Copy |
|---|---|
| label, uppercase | `Rafał Oleksiak · Warsaw` |
| legal / LOT line, monospace stack, weight 400, letter-spacing .18em, #6E6D68 | `LOT 45/69 · REV 2026-09 · WARSAW` |
| link, `mailto:`, inherits colour, no underline | `rafal@oleksiakconsulting.com` |
| link, LinkedIn profile, #6E6D68 | `Rafał Oleksiak on LinkedIn` |

LinkedIn href: `https://www.linkedin.com/in/rafa%C5%82-oleksiak-3b322981/`.
A 70-bar signature strip sits immediately above the footer, `aria-hidden="true"`.

---

## 3. Design tokens

### 3.1 Colour literals and their roles

Only ten colours appear in the file. There are no CSS custom properties; every value
is written inline. Promote these to `:root` tokens when re-authoring.

| Literal | Role |
|---|---|
| `#F7F5F0` | page and `body` background; also the fill of every reveal veil (recog, batches, dose meniscus backdrop) so a veil reads as "unprinted paper" |
| `#14161A` | ink: all primary text, every 1px rule and border, `h1`, submit-button background, `accent-color` on checkboxes, focus outline, day-45 axis tick, signature day-45 bar |
| `#FFFFFF` | submit-button label only |
| `#3A3C40` | submit-button hover background (`style-hover`); also the `sub` colour of the active COMPOSITION card (its number and short line) |
| `#6E6D68` | mid grey: eyebrow/label secondary text, `(required)`/`(optional)` suffixes, footer, inactive card label + number + short line, `Closed` statuses, axis captions |
| `#C9C7C0` | hairline: unmarked day ticks, channel-row top rules, channel mini-axis track, inactive card left rule |
| `#DCDAD2` | row divider inside the fee rail and between PRIOR BATCHES rows (`border-top`) |
| `#EDEAE1` | background of the active COMPOSITION card |
| `#C97B1F` | amber: the day-69 tick, the day-69 vertical marker on the axis and on every channel mini-axis, the marked ticks of the hover ruler |
| `#A25C11` | deep amber, text only: the `69 — actual` caption and the `Count your own interval` link |
| `#9B9A95` | `input::placeholder` |

### 3.2 Type scale

Everything is set in Instrument Sans. Weights used: 400 (LOT line only), 600, 700.

**Fixed across breakpoints**

| Use | Size / tracking |
|---|---|
| eyebrow | 12px / 700 / `letter-spacing: .22em` / uppercase |
| field label, status, readout, axis caption | 12px / 600–700 / `.18em` / uppercase |
| ml label on the dose bar | 12px / 700 / `.16em` / uppercase |
| channel label, meter mark label, ruler numerals | 12px / 600–700 / `.14em` / uppercase (ruler numerals `font-variant-numeric: tabular-nums`) |
| COMPOSITION `short` line | 12.5px / 400 / line-height 1.5 |
| button label | `L.body` / 600 / `.06em` / uppercase |
| LOT line | 12px / 400 / `.18em` / `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |

**Responsive (`L` tokens)**

| Token | Phone | Desktop |
|---|---|---|
| `h1` | `clamp(33px,10vw,40px)` | `clamp(40px,7vw,72px)` when narrow, else `clamp(44px,5.2vw,78px)` |
| `gap45` (the 45-vs-69 line) | `24px` | `30px` when narrow, else `clamp(28px,2.4vw,34px)` |
| `lead` | `16px` | `20px` |
| `lead2` (unused) | `16px` | `18px` |
| `recog` | `16px` | `18px` |
| `recogClose` (verdict) | `18px` | `21px` |
| `svc` (card title) | `16px` | `17px` |
| `evidMain` (card evidence) | `14.5px` | `15px` |
| `evid` (unused) | `12.5px` | `13px` |
| `body` | `14px` | `15px` |
| `field` (inputs) | `16px` | `15px` |
| `small` | `12px` | `13px` |
| `fee` (fee rail rows) | `12px` | `13px` |
| `feeLead` (price line) | `18px` | `28px` |
| `proofSize` (batch name) | `17px` | `21px` |
| `capSize` (finale captions) | `13px` | `15px` |
| `payoff` (finale headline) | `clamp(24px,6.8vw,30px)` | `clamp(34px,3.8vw,58px)` |

Line heights in use: `h1` .94 (letter-spacing −.035em); `gap45` 1.15 (−.015em);
`lead` 1.35; `recog` 1.6; `recogClose` 1.4 (−.01em); card title 1.2 (−.015em);
card evidence 1.45; body paragraphs 1.45–1.55; finale captions 1.4;
finale payoff 1.02 (−.03em); `feeLead` 1.15.
Measure caps: `h1` 17ch, `gap45` 24ch, `lead` 46ch, recog block `L.recogMeasure`
(100% phone / 62ch desktop), body paragraphs 62ch, batch line `minmax(0,62ch)`,
finale payoff 24ch. `text-wrap: balance` on `h1`, `gap45`, verdict and payoff;
`text-wrap: pretty` on evidence, recog lines, batch lines and channel sentences.

### 3.3 Spacing, layout and grid tokens

| Token | Phone | Desktop |
|---|---|---|
| `hpad` (header padding) | `14px 18px` | narrow `14px 40px`, wide `18px 112px 18px 176px` |
| `mpad` (main padding) | `20px 18px 30px` | narrow `28px 40px 40px`, wide `34px 112px 44px 176px` |
| `mpadL` / `mpadR` (footer + trailing main) | `18px` / `18px` | narrow `40px` / `40px`, wide `176px` / `112px` |
| `mpadX` (unused) | `18px` | narrow `40px`, wide `176px` |
| `areas` | `"head" "recog" "svc" "form"` | narrow `"head" "form" "recog" "svc"`, wide `"head form" "recog recog" "svc svc"` |
| `gridCols` | `minmax(0,1fr)` | narrow `minmax(0,1fr)`, wide `minmax(0,1fr) minmax(300px,380px)` |
| `colGap` | `18px` | `clamp(28px,3.4vw,56px)` |
| `rowGap` | `30px` | `48px` |
| `headGap` | `10px` | `20px` |
| `leadPad` (above source label rule) | `10px` | `16px` |
| `svcHead` (section header gap) | `14px` | `18px` |
| `svcCols` | `minmax(0,1fr)` | `repeat(5,minmax(0,1fr))`, collapsing to `minmax(0,1fr)` when `stacked` (<1200px) |
| `itemPad` (card) | `12px 0 14px 0` | `14px 16px 18px`, `14px 0 18px` when `stacked` |
| `itemGap` | `9px` | `12px` |
| `segW` / `segH` (dose bar) | `58px` / `9px` | `68px` / `10px` |
| `markW` / `markH` (meter mark) | `11px` / `11px` | `13px` / `13px` |
| `formGap` / `heroGap` / `formPad` | `12px` / `6px` / `12px` | `15px` / `15px` / `20px` |
| `fee` rail: `feePad`, `feeHeadGap`, `feeRailGap`, `feeLift` | `0`, `2px`, `0px`, `0px` | `7px 0 8px`, `10px`, `22px`, `0px` |
| `recogGap` / `recogCloseMargin` | `15px` / `7px 0 0` | `18px` / `10px 0 0` |
| `panelGap` / `panelPad` | `12px` / `16px` | `14px` / `20px` |
| `rulerH` / `tickGap` | `34px` / `2px` | `48px` / `3px` |
| `chanCols` / `chanColGap` / `chanSpacer` | `minmax(0,1fr)` / `0px` / `none` | `176px minmax(0,1fr)` / `24px` / `block` |
| `tailPad` (PRIOR BATCHES top padding) | `4px` | `20px` |
| `batchCols` | `minmax(0,1fr)` | `minmax(120px,168px) minmax(0,62ch) minmax(max-content,1fr)` |
| `batchAreas` / `batchStatusAlign` / `batchGap` / `batchPad` | `"n" "s" "l"` / `start` / `0px` / `4px 0 6px` | `"n l s"` / `end` / `clamp(24px,3vw,48px)` / `14px 0 16px` |
| `meterPos` | `left:0;right:0;top:0` | `left:22px;top:50%;transform:translateY(-50%)` |
| `meterDir` / `meterAlign` / `meterJustify` / `meterGap` / `meterPad` / `meterBorder` | `row` / `center` / `space-between` / `8px` / `8px 18px` / `1px solid #14161A` | `column` / `flex-start` / `center` / `20px` / `0` / `0` |
| `meterReserve` | `0px` | `0px` |
| `barSpace` (root bottom padding when no pinned finale) | `0px` | `104px` |
| `barPad` / `barDir` / `barAlign` / `barGap` / `barFormW` | `9px 18px` / `column` / `stretch` / `0px` / `100%` | `12px 112px` / `row` / `flex-end` / `32px` / `420px` |
| `closeW` / `closePad` / `closeGap` / `closeFeePad` | `100%` / `12px 14px` / `8px` / `3px 0 4px` | `560px` / `20px` / `15px` / `7px 0 8px` |
| `pinOuter` | `(pinScroll ?? 320)vh` | same |
| `pinPad` | `clamp(16px,3vh,24px) 18px` | narrow `clamp(24px,5vh,56px) 40px`, wide `clamp(24px,5vh,56px) 112px clamp(24px,5vh,56px) 176px` |
| `frameGap` | `clamp(14px,3vh,22px)` | `clamp(18px,3.6vh,36px)` |
| `fieldDir` / `halfGap` | `column` / `clamp(12px,2.4vh,20px)` | `row` / `clamp(24px,3.4vw,64px)` |
| `fieldCols` | `repeat(6,minmax(0,1fr))` | `repeat(10,minmax(0,1fr))` |
| `rowGap2` / `colGap2` / `markGap` | `clamp(5px,1.1vh,9px)` / `6px` / `2px` | `clamp(7px,1.7vh,14px)` / `8px` / `3px` |
| `dotS` / `costS` | `6px` / `4px` | `7px` / `5px` |
| `capGap` / `capH` | `10px` / `18px` | `20px` / `22px` |
| `divW` / `divH` (finale divider) | `100%` / `1px` | `1px` / `76%` |
| `payoffH` | `76px` | `128px` |
| `msgDir` / `msgGap` / `msgPad` / `msgIdW` / `msgIdAlign` | `column` / `14px` / `14px` / `100%` / `center` | `row` / `40px` / `18px` / `240px` / `flex-start` |
| `msgInnerGap` / `msgFieldGap` / `msgFieldDir` / `msgFieldAlign` / `msgBtnW` | `12px` / `12px` / `column` / `stretch` / `100%` | `14px` / `14px` / `row` / `flex-end` / `auto` |
| `msgMetaDir` / `msgMetaAlign` / `chromeH` | `column` / `flex-start` / `58px` | `row` / `center` / `24px` |
| `dir` (footer direction) | `column` | `row` |
| `leadTail` | `none` | `inline` |

Grid/column counts at a glance: main grid is 1 column on phone and when
`narrow` (<1024px), 2 columns (`1fr` + `300–380px`) above that; COMPOSITION is
1 column up to 1200px and 5 columns above; the finale mark field is 6 columns
with 30 cells on phone and 10 columns with 60 cells on desktop; the channel block
is 1 column on phone and `176px + 1fr` on desktop.

**Tokens defined but never interpolated** (safe to drop when re-authoring):
`mpadX`, `lead2`, `evid`, `photo`, `msgPhoto`, `instGap`, `twoCols`, `proofCols`,
`proofGap`, `dirGap`, `dirPad`, `dirH`, `dirCols`, `dirColGap`, `panelTextH`,
and the value `closeMinH`. Phone values for the `meter*` tokens are also dead,
because the meter never renders on phone.

---

## 4. The three mechanisms

### 4a. The COMPOSITION hover instrument

**State of play in v74: the handlers are not attached.** The logic below is fully
present in `renderVals()` and `componentDidUpdate()`, but the markup never binds it.
Re-implement it from this description; do not expect to find it working in the canvas.

What exists and is rendered:

- `this.state.hover` — `null` or `0…4`. Never changes in v74.
- `sel = hover ?? 0` and `shown = hover ?? 0`.
- Each of the five card objects carries `enter: () => setState({hover: i})` and
  `leave: () => { if (hover === i) setState({hover: null}) }`. **Nothing calls them** —
  there is no `onMouseEnter`/`onMouseLeave`/`onFocus` attribute on `[data-card]`.
- The per-card visual state **is** driven by `sel`, so it renders:
  | Property | Active card (`sel === i`) | Inactive |
  |---|---|---|
  | `background-color` | `#EDEAE1` | `transparent` |
  | `border-top` (2px) | `#14161A` | `transparent` |
  | `border-left` (1px) + the absolute `[data-div]` hairline | `#14161A` | `#C9C7C0`, and `transparent` for card 01 (no left rule on the first card, ever) |
  | ml label colour | `#14161A` | `#6E6D68` |
  | number + short line colour | `#3A3C40` | `#6E6D68` |
- **Rest state consequence:** because `hover` is always `null`, `sel` is always `0`,
  so **card 01 renders permanently in the active treatment** and the other four are
  permanently inactive. If you re-wire hover, the rest state must be card 01 active.
- The dose bar: `L.segW × L.segH` box, 1px ink border, `overflow:hidden`, holding five
  `[data-seg]` flex children. Segment `j` is ink when `j < 5 − i`, otherwise
  transparent; each segment gets a 1px left tick in ink except the first (transparent).
  So card 01 shows 5/5 filled, card 05 shows 1/5 — matching the ml labels
  100/80/60/40/20 and `fillPct` 100%/80%/60%/40%/20%.

What is computed but has no DOM to drive (re-create these elements):

- `directions` — the three lines of the hovered part (section 2.7), to be rendered in
  an element with `id="directions"`.
- `dirTitle` — `part 01` … `part 05` for the hovered part.
- `panelText` — the hovered part's `note`, defaulting to `45 on the label, 69 in the data`.
- `ruler` — 70 objects, one per day, recomputed for the hovered part:
  `marked = D[sel].mark(day)`; `h = marked ? '100%' : (day % 5 === 0 ? '58%' : '34%')`;
  `bg = marked ? '#C97B1F' : (day <= 45 ? '#6E6D68' : '#C9C7C0')`. Intended for bars
  carrying `data-rbar="1"`.
  The five `mark(day)` predicates: 01 `day >= 46 && day <= 69`; 02 `day <= 2`;
  03 `day >= 40 && day <= 48`; 04 `day === 45 || day === 69`;
  05 `[8,19,27,38,44,55,66].includes(day)`.

The transition on selection change (`componentDidUpdate`, keyed on `state.hover`,
comparing against `this._lastSel`; the very first update only records the baseline):

- Bails out entirely if `prefers-reduced-motion`, `navigator.webdriver`, or
  `Element.prototype.animate` is missing.
- Cancels any previous animations and the two guard timers.
- `#directions`: `opacity 0.25 → 1`, **160ms**, `ease-out`, `fill: 'none'`.
- Each `[data-rbar="1"]` bar, indexed `k`: keyframes
  `scaleY(0.34)` held until `offset = (k*6)/(220 + k*6)`, then to `scaleY(1)`;
  duration `220 + k*6` ms, `linear`, `fill: 'none'`. That is a left-to-right ripple
  across 70 bars, 6ms of stagger per bar, so the last bar runs 634ms.
- Guards: at **160ms**, if `anims[0].currentTime` is null or `< 40`, cancel everything
  (the document timeline is not advancing); and a hard stop cancel at **600ms**.

**One-shot dose-bar drain (`observeDose` → `playFill`), which does work.**

- Gated off when `prefers-reduced-motion`, no `IntersectionObserver`, or no
  `Element.prototype.animate`.
- `IntersectionObserver` on the card row (`rowRef`) at `threshold: 0.3`, disconnected
  on first intersection, then `playFill(row)`.
- Per card `i`: `ml = (5 − i) * 20`, `dur = ml * 10` ms — so 1000 / 800 / 600 / 400 / 200ms.
- Start state: `[data-fillveil]` (a `#F7F5F0` overlay whose width is the card's
  `fillPct`, `transform-origin: right center`) set to `opacity 1, scaleX(1)`;
  the ml label set to `opacity 0`.
- Cards fire in sequence with 80ms between the *starts*: card `i` begins at the
  running offset, which advances by `dur + 80`.
- Each card: veil animates `scaleX(1) → scaleX(0)` over `dur`, `linear`,
  `fill:'none'`, then is pinned to `opacity:0; transform:none`.
  A 1px ink `[data-meniscus]` line animates `translateX(0) → translateX(width − 1)px`
  over the same `dur` (only when the veil's measured width > 1px), then hides.
  The ml label fades in `opacity 0 → 1` over **120ms**, `linear`, starting at `dur`.
- A final `clearAll` at `total + 800ms` forces every veil/meniscus hidden and clears
  inline label opacity. Every timer is collected in `this.doseTimers` and cleared on unmount.

### 4b. The pinned finale

Desktop only (`showPin = !phone && wide900`). Structure:

```
<section ref=pinRef style="height: L.pinOuter; position: relative; border-top: 1px solid #14161A">
  <div style="position: sticky; top: 0; height: 100vh; max-height: 100vh;
              display: flex; flex-direction: column; gap: L.frameGap;
              padding: L.pinPad; overflow: hidden">
    header row (eyebrow + Batch record)
    flex:1 centred body — left mark field | divider | right mark field, then the payoff
    footer row (pinFormRef) — identity | message chrome + form
```

**Scroll → progress.** In `tick()` (an interval at 100ms plus passive `scroll` and
`resize` listeners):

```
r    = pinRef.getBoundingClientRect()
span = Math.max(1, r.height - vh)          // vh = documentElement.clientHeight || innerHeight
pp   = clamp(0, 1, -r.top / span)
step = Math.round(pp * 40)                 // state.step, 0…40 — the only state written
```

So progress is quantised to 41 steps over `(pinScroll − 100)` vh of scrolling.
`pinScroll` is an author prop: range 200–480, step 20, unit vh, default **320**.

In `renderVals()`: `p = reduced ? 1 : step / 40`, and
`seg(a, b) = clamp(0, 1, (p − a) / (b − a))`. Four easing windows:

| Window | Range of `p` | Drives |
|---|---|---|
| `pA` | 0.00 → 0.20 | per-cell opacity of both mark fields |
| `pB` | 0.18 → 0.52 | the base number of cost bars per cell (both fields) |
| `pC` | 0.48 → 0.74 | extra cost bars on the left field, removal of bars on the right field, and the divider |
| `pD` | 0.72 → 0.90 | the payoff headline's opacity, and the message/dry thresholds |

A fifth window, `seg(0.54, 0.80)`, drives the two caption opacities.
With `prefers-reduced-motion`, `p` is forced to 1 — the finale renders fully resolved,
no scroll scrubbing.

**The mark field.** `fcount` cells (60 desktop / 30 phone), laid out in
`L.fieldCols` columns. Per cell `i`: `j = ((i * 37) % 11) / 11` — a fixed
pseudo-random phase in eleven steps, so cells resolve in a scattered order, not left to right.

```
o     = (0.25 + 0.75 * clamp(0,1, pA*1.7 - j*0.6)).toFixed(2)      // cell opacity
base  = clamp(0,1, pB*1.3 - j*0.3) * 3
extra = pC * (2 + (j > 0.62 ? 1 : 0))
nL    = clamp(0, 6, Math.round(base + extra))                       // left: bars grow
nR    = Math.max(0, Math.round(base * (1 - pC)))                    // right: bars drain away
```

Each cell renders a `L.dotS` square with a 1px ink border (the customer), followed by
six bars of height `L.costS`; bar `k` is `#14161A` at width `L.costS` when `k <= n`,
otherwise `transparent` at width `0px`. Left field = cost accumulating
(`Bought again, and paid for again`); right field = cost going to nothing
(`Came back on their own day`).

**What appears at which point.**

| Progress | What happens |
|---|---|
| `p = 0` | both fields at 0.25 opacity, no cost bars, divider at `scale(0.05)` and `opacity 0.12`, captions at `opacity 0.06`, payoff at `opacity 0`, message chrome and dry line both `opacity 0` |
| `pA` 0 → 1 (`p` 0–0.20) | cells fade up to full opacity, scattered by `j` |
| `pB` 0 → 1 (`p` 0.18–0.52) | cost bars grow on **both** fields, up to 3 per cell |
| `pC` 0 → 1 (`p` 0.48–0.74) | left field gains 2–3 more bars per cell while the right field drains to zero; the divider scales from 0.05 to 1 (`scaleY` desktop, `scaleX` phone) and its opacity goes 0.12 → 1 |
| `seg(0.54,0.80)` | both captions fade 0.06 → 1 |
| `pD` 0 → 1 (`p` 0.72–0.90) | the payoff headline fades in; its `opacity` is `pD.toFixed(2)` — a direct scrub, not a transition |
| `pD >= 0.6` | `fired` → the message chrome (`Rafał Oleksiak wrote:` / `Your pack runs out today.` / timestamp / the demonstration caption) switches to `opacity 1`, and the timestamp is minted once and cached on `this.pinStamp` |
| `pD >= 1` | `dried` → the `One more dose — nothing dispensed` label switches to `opacity 1` |

`fired` and `dried` have a second path through the dose meter: `fired` is also true when
`state.maxSpent >= 4`, `dried` when `maxSpent >= 5`; and before the clock is confirmed
live (`live === false`) both are forced true so a non-animating browser shows everything.
Reserved heights prevent reflow while these fade: `L.payoffH` (128/76px),
`L.chromeH` (24/58px), `min-height: 17px` on the dry label, `L.capH` on captions.

**How it ends the document.** The section is the last thing in the flow on desktop:
footer, then this section's `(pinScroll)vh`. Its sticky child unpins when
`-r.top / span` reaches 1, i.e. with exactly `100vh` of the section left — the final
viewport of the document is the fully-resolved finale, held still, and then the page
bottom arrives. Because the finale is present, `rootPadB` is `0px` (no bar reserve),
and the bottom bar is suppressed while the finale is on screen: `tick()` computes
`inFinal = pinRef.top < vh` and `state.bar = heroForm.bottom < 0 && !(closeForm in view)
&& !inFinal`.

### 4c. The dose meter

A `position: fixed` rail of five marks plus a readout. Not a progress bar of the page —
a measure of how much of one 500 ml dose is left before the closing form.

- Renders only when `meterOn = !phone && state.w768 !== false` (`w768` is
  `innerWidth >= 768`, or forced by the `device` prop). `display` is `flex` only once
  `state.scrolled` (scrollY > 60); `aria-hidden` flips `"true" → "false"` with it.
- Desktop placement: `left: 22px; top: 50%; transform: translateY(-50%)`, column,
  `gap: 20px`, no border, no padding, `z-index: 25`, background `#F7F5F0`.
- Each mark: a `13×13px` box, 1px ink border, `background-color` ink while unspent and
  `transparent` once spent, with the label `100 ml` beside it. Mark `i` is spent when
  `i < state.spent`.
- Readout: `(5 − spent) * 100` + ` ml left`, uppercase 12px #6E6D68, `white-space: nowrap`.

**How it depletes** (`tick()`), where `el = pinRef.current || pinFormRef.current ||
closeFormRef.current` — the finale on desktop, the closing form on phone:

```
maxScroll = max(1, documentElement.scrollHeight - vh)
formAt    = el.getBoundingClientRect().top + window.scrollY - vh * 0.5
end       = max(1, min(maxScroll, formAt))
q         = window.scrollY / end
spent     = q >= 1 ? 5 : clamp(0, 4, Math.floor(q * 5))
```

So the scale runs from the top of the document to the point where the closing form
reaches the vertical middle of the viewport. **Where it stops:** `spent` is clamped at
**4** (one mark, 100 ml, still unspent) for the whole journey; the fifth mark is only
spent when `q >= 1`, i.e. when the reader actually arrives at the closing form. The
meter cannot read `0 ml left` before the form is reached.

A second counter, `state.maxSpent`, is the ratchet that gates the finale copy:

- Until the reader has interacted at all (`this.armed` is set by the first
  `wheel`, `touchmove`, `keydown` or `pointerdown`), `maxSpent` simply tracks `spent`.
- Once armed, `maxSpent` only advances when `spent === maxSpent + 1` — one step at a
  time, no skipping — and it drops back whenever `spent < maxSpent && spent < 4`.
- The first time `spent` reaches 4 while armed, `state.stamp` is minted
  (`toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})`); it is cleared again
  if the reader scrolls back below 4.
- `state.live` is set on the first tick after `componentDidMount`'s
  `setTimeout(…, 0)` sets `this.timersWork`; that first transition resets
  `spent`, `maxSpent` and `stamp` to zero/empty and returns early.

### 4d. The other scroll behaviours in the file (needed for parity)

**IF THIS IS YOUR STORE reveal** (`observeRecog` → `armRecog`). Skipped under
`prefers-reduced-motion`, without `IntersectionObserver`, or without
`Element.prototype.animate`. Requires exactly three `[data-recog-line]` elements and
one `[data-recog-verdict]`. Line = `innerHeight * 0.82`; only elements whose `top >=`
that line are animated, the rest count as already landed. Hidden state: the
`[data-recog-veil]` child at `opacity 1` plus `transform: translateY(8px)` on the
element. Observer `rootMargin: '0px 0px -18% 0px'`, `threshold: 0`, disconnected on
first intersection; then each pending line reveals at `i * 180ms`, and the verdict at
`(pending − 1) * 180 + 420 + 400` ms. Reveal = veil `opacity 1 → 0` and element
`translateY(8px) → translateY(0)`, both **420ms** `cubic-bezier(.2,.7,.2,1)`,
`fill: 'none'`, with a 700ms safety timeout that force-settles. After each line lands,
`[data-recog-code]` is rewritten to `'01–' + String(clamp(1,3,n)).padStart(2,'0')`.

**PRIOR BATCHES reveal** (`observeBatches` → `armBatches`). Requires exactly five
`[data-batch]` rows; scroll-driven rather than IO-driven. Hide when the first row's
`top < vh * 1.25`: every `[data-batch-veil]` to `opacity 1` and `[data-batch-rule]` to
`scaleX(0)`. Play when `top < vh * 0.82`. Row `i` starts at `i * 510ms`: the 1px
`#DCDAD2` rule animates `scaleX(0) → scaleX(1)` over **420ms** `linear`
(`transform-origin: left center`, settled at 660ms), and the name and status veils fade
over **180ms**; the line's veil fades over **200ms** starting at `+420ms`. A
`setTimeout(force, 3400)` reveals everything unconditionally if the sequence never runs.
The scroll listener removes itself once played.

**Fee rail rule** (`observeFeeRule`). Only if the rule starts below
`innerHeight * 0.9`. `IntersectionObserver` with `rootMargin: '0px 0px -10% 0px'`,
`threshold: 0`, disconnect on first intersection; the 1px ink `[data-fee-rule]`
animates `scaleX(0) → scaleX(1)` over **320ms** `linear`, `fill: 'none'`.

**Live URL echo** (`bindEcho` / `paintEcho`). One delegated `input` listener on
`document`. Fires only for `INPUT[inputmode="url"]`; the owning form is identified by
`closest()` in this order: `#enquiry-phone` → `phone`, `#enquiry-2` → `close`,
`#enquiry` → `hero`, `[data-bar]` → `bar`. Debounce **250ms**. The value is reduced to
a host by stripping a leading scheme (`/^[a-z][a-z0-9+.-]*:\/\//i`) and `www.`, then
cutting at the first `/`, `?` or `#`. Valid only if `/[^.]\.[^.]/` matches; hosts over
28 characters are truncated to 27 plus an ellipsis; invalid or empty falls back to the
literal `your store`. Every `[data-echo="<key>"]` in that group gets the text, plus
`font-weight: 600` when valid (cleared when not), and a **160ms**
`cubic-bezier(.2,.7,.2,1)` animation from `{opacity:0, top:2px}` to `{opacity:1, top:0}`.
The echo spans are `position: relative; display: inline-block;
max-width: min(100%, 13em)` (6.5em in the desktop bar), with
`overflow:hidden; text-overflow:ellipsis; white-space:nowrap; vertical-align:bottom`.

**Motion-capability probe.** `clockLive()` starts a 600ms no-op `opacity 1 → 1`
animation on `document.body` and checks `currentTime !== null`, cancelling it
immediately; every reveal is gated behind it so a frozen timeline never leaves content
veiled. Separately, `componentDidMount` samples `document.timeline.currentTime` and
again 300ms later, setting `state.motionOK` only if it advanced by more than 150ms;
`motionOK` is the only thing that enables the bottom bar's CSS `transition`
(`opacity 220ms cubic-bezier(.2,.7,.2,1), transform 220ms cubic-bezier(.2,.7,.2,1)`,
otherwise `none`).

**Bottom bar collapse (phone).** If motion is allowed, a `setTimeout(…, 250)` sets
`state.barCollapsed`, which makes `barRows` `0fr`; focusing the bar form
(`onFocus` → `openBar`) sets `state.barOpen` and `barRows` becomes `1fr`. The
transition is on the wrapper: `grid-template-rows 220ms cubic-bezier(.2,.7,.2,1)`,
with the revealed block `min-height: 0; overflow: hidden`. `barMinH` is pinned to the
bar's measured `offsetHeight` after submit so the bar does not jump.

**Dead animation.** `playInterval()` would animate `[data-interval-span]`
(`scaleX(0) → scaleX(1)`, **700ms**, `cubic-bezier(.2,.7,.2,1)`) and every
`[data-interval-69]` (opacity held at 0 until `offset 0.85`, then to 1, 700ms,
`linear`), guarded at 160ms and hard-stopped at 1200ms, and `tick()` would trigger it
when `[data-interval-axis]` crosses `innerHeight * 0.7`. **None of those three
attributes exists in the markup**, so this never runs. If you want the axis to draw
itself in, you must add the attributes: `data-interval-axis` on the ruler wrapper,
`data-interval-span` on a growing track, `data-interval-69` on the amber marker and
its caption.

---

## 5. The 70-day axis — geometry

One axis shape is used four times: the ONE DATE ruler, the caption row under it, the
mini-axis in each of the four channel rows, and the two decorative signature strips.

**The tick grid.** 70 sibling spans in a flex row, each `flex: 1; min-width: 0`,
separated by `gap: L.tickGap` (**3px** desktop, **2px** phone), container
`align-items: flex-end`, `height: L.rulerH` (**48px** desktop, **34px** phone).
Day `d` is index `k = d − 1`. One tick is therefore
`w = (100% − 69 × gap) / 70` wide, and the centre of tick `k` is

```
centre(k) = k × (w + gap) + w / 2
          = (100% − 69 × gap) × (2k + 1) / 140  +  k × gap
```

which is exactly the `calc()` written in the file. The two literals that appear:

| Day | k | `calc()` as written |
|---|---|---|
| 45 | 44 | `calc((100% - 69 * {tickGap}) * 89 / 140 + 44 * {tickGap})` |
| 69 | 68 | `calc((100% - 69 * {tickGap}) * 137 / 140 + 68 * {tickGap})` |

**Tick heights and colours (`oneRuler`, the rendered axis).**

| Day | Height | Colour |
|---|---|---|
| 45 (`k === 44`) | `100%` | `#14161A` — ink |
| 69 (`k === 68`) | `100%` | `#C97B1F` — amber |
| all others | `40%` | `#C9C7C0` — hairline |

**The amber marker.** `position: absolute; left: centre(68); top: 0; bottom: -4px;
width: 1px; margin-left: -0.5px; background: #C97B1F`, `aria-hidden="true"` — it
spans the full ruler height and overhangs 4px below it, so it reads as a cut line
rather than a bar.

**The caption row.** `position: relative; height: 30px`, 12px / 600 / `.14em` /
`#6E6D68` / `tabular-nums` / `nowrap`.

| Caption | Placement |
|---|---|
| `1` | `left: 0; top: 0` |
| `45 — label` | `left: centre(44); top: 0; transform: translateX(-50%)` |
| `70` | `right: 0; top: 0` |
| `69 — actual` | `left: centre(68); top: 15px; transform: translateX(-100%)`, colour `#A25C11` |

The two amber captions sit on a second baseline 15px lower and are right-aligned to
the marker, so `69 — actual` never collides with `70` or with `45 — label`.

**Channel mini-axis** (one per channel row, `aria-hidden="true"`,
`position: relative; height: 10px`), three absolutely positioned pieces:

1. the full track — `left: 0; right: 0; top: 4px; height: 1px; background: #C9C7C0`
2. the elapsed block — `left: 0; width: centre(68); top: 2px; height: 5px; background: #C9C7C0`
3. the cut — `left: centre(68); top: -2px; bottom: -2px; width: 1px;
   margin-left: -0.5px; background: #C97B1F`

Each channel row is a grid of `L.chanCols` (`176px minmax(0,1fr)` desktop,
single column phone) with `border-top: 1px solid #C9C7C0; padding-top: 10px`.
On desktop the ruler itself is preceded by an empty `aria-hidden` spacer
(`display: L.chanSpacer`, `block` desktop / `none` phone) so the ruler aligns with the
channel sentences rather than with the channel labels.

**Signature strips** (`sig`, in the header and above the footer): 70 spans,
`width: 1px`, `gap: 1px`, container `height: 10px`, `align-items: flex-end`, and the
same mapping as `oneRuler` — day 45 full-height ink, day 69 full-height amber,
everything else 40% hairline. Both strips are `aria-hidden="true"`.

**What is amber and what is ink.** Ink marks the claimed number (day 45, the label);
amber marks the measured number (day 69) and every element that points at it — the
vertical cut on the ruler, the cut on all four channel rows, and the `69 — actual`
caption in the darker `#A25C11` for text contrast. Everything else on the axis is the
`#C9C7C0` hairline. The only place that departs from this is the unrendered hover
ruler, which additionally paints days 1–45 in `#6E6D68` and days 46–70 in `#C9C7C0`
so the label window reads darker, and lifts every *marked* day to `100%` / `#C97B1F`
with a `58%` height on each fifth day as a decade gauge.

---

## 6. Forms

**Four form instances, all sharing one submit handler factory.** At any given
viewport, three of them are mounted (desktop: hero, finale, bar; phone: phone-hero,
closing panel, bar). The field-name suffix is how they are told apart.

| Key | `id` | Where it sits | Rendered when |
|---|---|---|---|
| `phone` | `enquiry-phone` | inside grid-area `head`, directly after the lead paragraph | `phone` |
| `hero` | `enquiry` | grid-area `form`, below the fee rail | `!phone` |
| `close` | `enquiry-2` | **desktop:** inside the pinned finale's footer row; **phone:** inside the trailing closing panel | always, one of the two |
| `bar` | (none) | inside the fixed `[data-bar]` | always, `barShort` desktop / `barFull` phone |

Field order and names:

| Key | Fields, in DOM order |
|---|---|
| `phone` | `url0` (text, `inputmode="url"`), `email0` (email), `consent0` (checkbox, required), `marketing0` (checkbox), 24-hour paragraph, submit, price line |
| `hero` | `url`, `email`, `consent`, `marketing`, 24-hour paragraph, submit, price line |
| `close` desktop (finale) | row of `url3` + `email3` + submit side by side, then a meta row with `consent3`, `marketing3` and the dry label |
| `close` phone (panel) | `url3`, `email3`, `consent3`, `marketing3`, submit, price line, 24-hour paragraph |
| `bar` desktop (`barShort`) | the 24-hour sentence, then `url2` + submit only — **no email, no consent** |
| `bar` phone (`barFull`) | `url2` + submit always visible; `email2`, `consent2`, `marketing2` and the 24-hour line inside the collapsible row |

Input attributes, consistent everywhere: URL fields are
`type="text" inputmode="url" autocapitalize="none" spellcheck="false" required`;
email fields are `type="email" required`. Styling is `background: none; border: 0;
border-bottom: 1px solid #14161A; padding: 7px 0` (`5px 0` in the phone bar),
`font-size: L.field`, `min-height: 44px`, `box-sizing: border-box`,
`border-radius: 0` in the bar. Checkboxes are `20 × 20px`,
`accent-color: #14161A`, `flex: none`, inside a `min-height: 44px` label.
Submit buttons: `background: #14161A; color: #FFFFFF; border: 0;
font-family: inherit; font-size: L.body; font-weight: 600; letter-spacing: .06em;
text-transform: uppercase; min-height: 44px`, hover `#3A3C40` via the DSL's
`style-hover` attribute. Padding varies: `12px 16px` (phone hero, phone panel),
`11px 16px` (desktop hero), `9px 20px` (finale, desktop bar), `9px 18px` (phone bar).
Where the field has no visible label — the finale and the bar — the input carries
`aria-label` matching its placeholder.

**Submit behaviour.** One factory builds all four handlers:

```
submit[k] = (e) => {
  e.preventDefault();                             // nothing is posted anywhere
  const f   = e.currentTarget;
  const raw = (f.querySelector('input[inputmode="url"]')?.value || '').trim();
  if (k === 'bar') setState({ barH: f.closest('[data-bar]').offsetHeight });
  const host = raw.replace(/^[a-z][a-z0-9+.-]*:\/\//i,'')
                  .replace(/^www\./i,'')
                  .split(/[\/?#]/)[0] || raw;
  const h = Math.round(f.getBoundingClientRect().height);
  setState(st => ({
    sent:   { ...st.sent,   [k]: host },
    closeH: k === 'close' ? h : st.closeH,
    sentHt: { ...st.sentHt, [k]: h }
  }));
}
```

There is no network call and no validation beyond the browser's own `required`.
The measured height is written back as `min-height` on the confirmation block
(`sentH[k]`), so the swap from form to confirmation does not shift the page.
`sent[k]` / `unsent[k]` drive the `sc-if` pair; `sentHost[k]` is the echoed host,
defaulting to an empty string.

**Post-submit confirmation copy** — verbatim in section 2.4 (hero and phone),
2.12 (finale) and 2.14 (bar). In short: hero/phone/panel swap to an
`Enquiry received` block showing `Your store URL`, the host on a 1px ink underline
(`overflow-wrap: anywhere`), the 24-hour sentence with `your store` in place of the
echo, and `Two clients at a time.`; the finale and the bar collapse to a single
`Got it — <host>. I’ll write to you from rafal@oleksiakconsulting.com within
24 hours…` line. On the phone closing panel the eyebrow itself changes from
`Enquiry form` to `Enquiry received` (`closeEyebrow`).

---

## 7. Accessibility and motion rules actually present

- **Focus.** One global rule:
  `input:focus-visible, button:focus-visible, [role="group"]:focus-visible
  { outline: 1px solid #14161A; outline-offset: 2px }`. No focus styling on links
  beyond the UA default. There is no visible focus treatment on the COMPOSITION cards,
  because they are not interactive in v74 — if you add hover selection, add
  keyboard focus with it.
- **Minimum target size.** `min-height: 44px` is applied to every input, every
  checkbox label, every submit button, the hero CTA link, the
  `Count your own interval` link and both footer links. Checkboxes are 20×20px inside
  those 44px labels.
- **ARIA.** `aria-hidden="true"` on both signature strips, every channel mini-axis,
  the amber ruler marker, the reveal veils, the recog veils, the batch rules and
  veils, the dose veil and meniscus, and the desktop channel spacer.
  `aria-hidden` is bound to state in two places: the dose meter
  (`aria-hidden="{{ meterHidden }}"`, `"true"` until `scrolled`) and the bottom bar
  (`aria-hidden="{{ barHidden }}"`, `"true"` whenever the bar is off-screen, paired
  with `pointer-events: none`). `aria-label` on the four unlabelled inputs
  (`url3`, `email3` in the finale; `url2` in both bar variants).
- **Reduced motion.** `this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches`,
  read once on mount, and it short-circuits: `observeFeeRule`, `observeBatches`,
  `observeRecog`, `observeDose`, the selection transition in `componentDidUpdate`,
  the echo's fade, the bar's collapse timer, and `playInterval` (re-checked live in
  `tick()` via a fresh `matchMedia` call). In the finale, `p` is forced to `1`, so
  the whole sequence renders resolved instead of scrubbing. The bar's CSS
  `transition` is `none` unless `state.motionOK` proved the document timeline
  advances.
- **Capability gating.** Every animated reveal additionally checks
  `'IntersectionObserver' in window` and
  `typeof Element.prototype.animate === 'function'`, and runs `clockLive()` to
  confirm `currentTime` is not null. Each reveal has a settle timeout
  (recog 700ms, batches 3400ms force-show, dose `total + 800ms`) so nothing can be
  left permanently veiled. Each `observe*` call in `componentDidMount` is wrapped in
  its own `try/catch` that logs `'<name> skipped:'` and continues.
- **Teardown.** `componentWillUnmount` clears the 100ms interval, both scroll
  listeners, the resize listener, the four arming listeners, the delegated `input`
  listener, all three IntersectionObservers, and every timer array
  (`recogTimers`, `batchTimers`, `doseTimers`, `echoTimers`, `selGuard`/`selStop`,
  `intervalGuard`/`intervalStop`).
- **`will-change`.** `[data-seg], [data-settle], [data-div] { will-change: auto }` —
  explicitly declining to hint the compositor.
- Links: 1px underline, `text-underline-offset: 3px`, thickening to 2px on hover;
  `text-underline-offset: 4px` on `Count your own interval`. The hero CTA and the
  `mailto:` footer link opt out of underline.

---

## 8. Tool v11 — the form block only

From `Tool v11 DOSAGE TRESC.dc.html`. The block sits at the end of the page, inside a
panel bordered `1px solid #14161A`, `max-width: L.closeW`, `padding: L.closePad`.
Above the form, the panel carries the eyebrow `Enquiry form` over a 1px ink bottom
rule, then three rows each separated by `border-top: 1px solid #DCDAD2`:
`No setup fee.` / `No minimum term.` / `Two clients at a time.`
The form itself is `<form id="enquiry-2" onSubmit="{{ onSend }}">`, and `onSend` is
`(e) => e.preventDefault()` — Tool v11 has **no** post-submit state at all.

All copy verbatim, in DOM order:

| Role | Copy |
|---|---|
| heading (eyebrow, 12px / 700 / `.22em` / uppercase) | `Send me this analysis` |
| lead sentence under it (`L.body`, line-height 1.45, max-width 62ch) | `I’ll email you the numbers above — the label day, the real interval and the gap for each product family — so you can forward them to whoever owns the calendar.` |
| label | `Your store URL` |
| placeholder | `yourstore.com` |
| label | `Your email` |
| placeholder | `you@yourstore.com` |
| consent 1 (`consent3`, required checkbox) | `I agree to be contacted about this enquiry` + ` (required)` in #6E6D68 |
| consent 2 (`marketing3`, optional checkbox) | `Occasional email from me — notes on reorder timing, new tools I build, and what I learn working on FMCG stores. Unsubscribe in one click.` + ` (optional)` in #6E6D68 |
| button | `Send me the analysis` |
| price line (`L.feeLead`, weight 600) | `EUR 2,500 net per month.` |
| closing body (`L.small`) | `I reply personally within 24 hours, with a first observation about your store — not a calendar link.` |

Note two differences from the homepage: the button reads **`Send me the analysis`**,
not `Send`; and the 24-hour sentence is static — it has no live `[data-echo]` span,
so `your store` is literal text here.

**The sentence under the drop zone.** The drop zone is a `<label for="orderFile">`
with `Drop your order export` / `CSV or XLSX`, followed by a `Choose a file` button.
Two paragraphs follow it, in this order:

| Role | Copy |
|---|---|
| body small, #6E6D68 | `Shopify — Orders, Export, CSV. WooCommerce — Analytics, Orders, Download. Anywhere else: any file with a date, a product title and a quantity.` |
| body small, #14161A — the privacy sentence | `The file is read in your browser. Customers are replaced by anonymous numbers before anything is used — names, emails, addresses and phone numbers never leave your computer.` |

The word "privacy" does not appear anywhere in the file; the second paragraph above is
the privacy statement, and it is the one set in ink rather than grey so it reads as a
commitment rather than a help note.

The surrounding section is `<section id="your-data">` with the eyebrow
`Now on your own data` and the lead
`Everything above is the example shop. Drop your own order export and the gaps are
measured on your orders instead.`

---

*End of specification.*
