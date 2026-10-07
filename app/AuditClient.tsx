'use client';

import { useEffect, useRef } from 'react';
import bootAudit from './audit-runtime';

/**
 * THE AUDIT — strona główna.
 *
 * Znaczniki i skrypt pochodzą z design/production/index.html i są przenoszone
 * przez `npm run ship`. Region między znacznikami poniżej jest GENEROWANY —
 * ręczna zmiana zniknie przy następnym przeniesieniu. Cała logika siedzi
 * w ./audit-runtime.js, dosłownie taka, jak została przetestowana wizualnie.
 *
 * Arkusz: app/audit.css (reguły) + app/globals.css (zmienne :root).
 */
export default function AuditClient() {
  const booted = useRef(false);

  useEffect(() => {
    // reactStrictMode odpala efekty dwukrotnie w dev, a bootstrap dokłada dzieci
    // do #cats i wiesza listener na formularzu. Bez tej blokady w dev widać
    // czternaście kafli kategorii zamiast siedmiu — i bramka to widzi.
    if (booted.current) return;
    booted.current = true;

    bootAudit();

    // Klasy siedzą na <body>, więc przy zejściu ze strony trzeba je zdjąć —
    // inaczej blog odziedziczy `display:none` ze stanu `done`.
    return () => {
      document.body.classList.remove('done', 'shown');
    };
  }, []);

  return (
    <>
      {/* >>> ZE ZRODLA — GENEROWANE, NIE EDYTUJ RECZNIE <<< */}
      <header className="top">
        <p className="label">Rafa&#322; Oleksiak &middot; Consultant</p>
        <span className="sig" aria-hidden="true" data-sig></span>
      </header>

      <div className="meter" data-meter aria-hidden="true">
        <span className="m"><span className="mk"></span><span className="ml">100 ml</span></span>
        <span className="m"><span className="mk"></span><span className="ml">100 ml</span></span>
        <span className="m"><span className="mk"></span><span className="ml">100 ml</span></span>
        <span className="m"><span className="mk"></span><span className="ml">100 ml</span></span>
        <span className="m"><span className="mk"></span><span className="ml">100 ml</span></span>
        <span className="readout" data-readout>500 ml left</span>
      </div>

      <main className="grid">

        <div className="a-head">
          <p className="eyebrow desk-only">Indication</p>
          <h1>You don't pay twice for the same customer.</h1>
          <div className="src">
            <p className="label">Source &mdash; a real supplement shop, anonymised</p>
          </div>
          <p className="gap45">The label says 45 days. The order data says 69.</p>
          <a className="cta" href="/tool">Check your own gap &mdash; free</a>
          <p className="leadp">E-commerce for brands whose customers come back.<span className="tail"> I build the tools myself &mdash; calculators, counters, progress bars &mdash; the kind of thing that normally waits in an IT queue.</span></p>

          <form className="form phone-only" id="enquiry-phone" data-form="phone" noValidate>
            <div className="live">
              <div className="rule"><p className="eyebrow">Enquiry form</p></div>
              <div className="fld">
                <label className="label" htmlFor="url0">Your store URL</label>
                <input id="url0" name="url0" type="text" inputMode="url" autoCapitalize="none" spellCheck="false" placeholder="yourstore.com" required />
              </div>
              <div className="fld">
                <label className="label" htmlFor="email0">Your email</label>
                <input id="email0" name="email0" type="email" placeholder="you@yourstore.com" required />
              </div>
              <label className="cons"><input id="consent0" name="consent0" type="checkbox" required /><span>I agree to be contacted about this enquiry<span className="opt"> (required)</span></span></label>
              <label className="cons"><input id="marketing0" name="marketing0" type="checkbox" /><span>Occasional email from me &mdash; notes on reorder timing, new tools I build, and what I learn working on FMCG stores. Unsubscribe in one click.<span className="opt"> (optional)</span></span></label>
              <p className="promise">I reply personally within 24 hours, with a first observation about <span data-echo>your store</span> &mdash; not a calendar link.</p>
              <button className="send" type="submit">Send</button>
              <p className="feelead">EUR 2,500 net per month.</p>
            </div>
            <div className="sent">
              <div className="rule"><p className="eyebrow">Enquiry received</p></div>
              <p className="label">Your store URL</p>
              <p className="host" data-host></p>
              <p className="promise">I reply personally within 24 hours, with a first observation about your store &mdash; not a calendar link.</p>
              <p className="promise">Two clients at a time.</p>
            </div>
          </form>

          <div className="phone-only fee">
            <p className="feerow">No setup fee. No minimum term.</p>
            <p className="feerow">Two clients at a time.</p>
            <p className="feerow">The first month is an as-is audit and the quick wins that come out of it.</p>
            <p className="leadp">I build the tools myself &mdash; calculators, counters, progress bars &mdash; the kind of thing that normally waits in an IT queue.</p>
          </div>
        </div>

        <div className="a-form desk-only">
          <div className="fee" data-fee-band>
            <p className="feelead">EUR 2,500 net per month.</p>
            <p className="feerow">No setup fee. No minimum term.</p>
            <p className="feerow">Two clients at a time.</p>
            <p className="feerow">The first month is an as-is audit and the quick wins that come out of it.</p>
          </div>
          <form className="form" id="enquiry" data-form="hero" noValidate>
            <div className="live">
              <div className="rule"><p className="eyebrow">Enquiry form</p></div>
              <div className="fld">
                <label className="label" htmlFor="url">Your store URL</label>
                <input id="url" name="url" type="text" inputMode="url" autoCapitalize="none" spellCheck="false" placeholder="yourstore.com" required />
              </div>
              <div className="fld">
                <label className="label" htmlFor="email">Your email</label>
                <input id="email" name="email" type="email" placeholder="you@yourstore.com" required />
              </div>
              <label className="cons"><input id="consent" name="consent" type="checkbox" required /><span>I agree to be contacted about this enquiry<span className="opt"> (required)</span></span></label>
              <label className="cons"><input id="marketing" name="marketing" type="checkbox" /><span>Occasional email from me &mdash; notes on reorder timing, new tools I build, and what I learn working on FMCG stores. Unsubscribe in one click.<span className="opt"> (optional)</span></span></label>
              <p className="promise">I reply personally within 24 hours, with a first observation about <span data-echo>your store</span> &mdash; not a calendar link.</p>
              <button className="send" type="submit">Send</button>
            </div>
            <div className="sent">
              <div className="rule"><p className="eyebrow">Enquiry received</p></div>
              <p className="label">Your store URL</p>
              <p className="host" data-host></p>
              <p className="promise">I reply personally within 24 hours, with a first observation about your store &mdash; not a calendar link.</p>
              <p className="promise">Two clients at a time.</p>
            </div>
          </form>
        </div>

        <section className="a-recog recog">
          <div className="rule">
            <p className="eyebrow">If this is your store</p>
            <p className="label" data-recog-code>01&ndash;03</p>
          </div>
          <div className="lines">
            <p>You bought the same customer twice this quarter, and you only found out because you recognised the name.</p>
            <p data-reveal><span className="veil" aria-hidden="true"></span>The campaign with the best reported return is the one bringing people who buy once and never come back.</p>
            <p data-reveal><span className="veil" aria-hidden="true"></span>You know your category has a reorder date. Nobody in the business can say what it is, so the reminder goes out on the tool&rsquo;s default day.</p>
            <p data-reveal><span className="veil" aria-hidden="true"></span>The subscription converts and then cancels after the first delivery, and you cannot tell whether you sold loyalty or a discount.</p>
            <p className="verdict" data-reveal><span className="veil" aria-hidden="true"></span>If two of these are yours, the problem is not your ad rates. It is that the second purchase is nobody&rsquo;s job.</p>
          </div>
        </section>

        <section className="a-svc svc">
          <div className="rule">
            <p className="eyebrow">Composition &mdash; five parts, in order</p>
            <p className="label">Hover a part &middot; 01&ndash;05</p>
          </div>

          <div className="cards" role="tablist" aria-label="Composition">
            <button className="card" type="button" role="tab" data-part="0" aria-selected="true" aria-controls="directions">
              <span className="dose"><span className="gauge" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span className="mll">100 ml</span></span>
              <span className="num">01</span>
              <span className="title">Paid that buys returning customers, not clicks</span>
              <span className="ev">The usual mistake is reporting return on ad spend against the first order, so the campaigns that bring people who never reorder look like the best ones and get more budget every month. Change the reporting window before you change the budget.</span>
              <span className="short">Budget set around the customers who come back, not the first basket.</span>
            </button>
            <button className="card" type="button" role="tab" data-part="1" aria-selected="false" aria-controls="directions">
              <span className="dose"><span className="gauge" aria-hidden="true"><i></i><i></i><i></i><i></i><i className="off"></i></span><span className="mll">80 ml</span></span>
              <span className="num">02</span>
              <span className="title">More carts from the same traffic</span>
              <span className="ev">Most stores tune the product page and leave the pack size ambiguous. If a shopper cannot tell how long a pack lasts, they take the smallest one, and the smallest pack is the weakest possible start for a second order.</span>
              <span className="short">The paths that decide whether a first pack becomes a habit.</span>
            </button>
            <button className="card" type="button" role="tab" data-part="2" aria-selected="false" aria-controls="directions">
              <span className="dose"><span className="gauge" aria-hidden="true"><i></i><i></i><i></i><i className="off"></i><i className="off"></i></span><span className="mll">60 ml</span></span>
              <span className="num">03</span>
              <span className="title">The second purchase without paying for a click</span>
              <span className="ev">The second order is usually lost to timing, not to price. The flow fires on the template&rsquo;s default day while the pack still has weeks left in it, and by the time it actually runs out the reminder is old mail.</span>
              <span className="short">Owned channels take the next pack before the ad auction does.</span>
            </button>
            <button className="card" type="button" role="tab" data-part="3" aria-selected="false" aria-controls="directions">
              <span className="dose"><span className="gauge" aria-hidden="true"><i></i><i></i><i className="off"></i><i className="off"></i><i className="off"></i></span><span className="mll">40 ml</span></span>
              <span className="num">04</span>
              <span className="title">Subscription instead of a discount</span>
              <span className="ev">A subscription price that undercuts the one-off price teaches the whole base to subscribe and cancel after the first delivery. Keep the price and pay for loyalty with control instead &mdash; skip, postpone, change the pack &mdash; because what people cancel is the loss of control, not the cost.</span>
              <span className="short">The return designed into the product rather than bought with a code.</span>
            </button>
            <button className="card" type="button" role="tab" data-part="4" aria-selected="false" aria-controls="directions">
              <span className="dose"><span className="gauge" aria-hidden="true"><i></i><i className="off"></i><i className="off"></i><i className="off"></i><i className="off"></i></span><span className="mll">20 ml</span></span>
              <span className="num">05</span>
              <span className="title">The day the pack runs out</span>
              <span className="ev">The interval on the label is a marketing number. The real one sits in the order history and runs longer, because people miss doses, travel and keep a spare. Build the calendar from each customer&rsquo;s own gap between orders.</span>
              <span className="short">One reorder date per customer, read from their own orders.</span>
            </button>
          </div>

          <div className="panel" id="directions" role="tabpanel" aria-live="polite">
            <div className="rule">
              <p className="eyebrow">Directions for use &mdash; <span data-dir-title>part 01</span></p>
              <p className="label">Dose <span data-dir-dose>100 ml</span></p>
            </div>
            <div className="axis" data-axis>
              <div className="ticks" data-ticks></div>
              <span className="cut" aria-hidden="true"></span>
            </div>
            <div className="caps">
              <span className="c1">1</span>
              <span className="c45">45 &mdash; label</span>
              <span className="c70">70</span>
              <span className="c69">69 &mdash; actual</span>
            </div>
            <p className="label" data-panel-text>45 on the label, 69 in the data</p>
            <div data-directions></div>
          </div>

          <div className="panel">
            <div className="rule">
              <p className="eyebrow">One date, four channels</p>
            </div>
            <div className="chan"><p className="cl">Paid</p><div><div className="mini" aria-hidden="true"><span className="track"></span><span className="past"></span><span className="cut"></span></div><p className="cs">the exclusion window closes on day 69</p></div></div>
            <div className="chan"><p className="cl">CRM email</p><div><div className="mini" aria-hidden="true"><span className="track"></span><span className="past"></span><span className="cut"></span></div><p className="cs">the reminder leaves on day 69</p></div></div>
            <div className="chan"><p className="cl">Subscription</p><div><div className="mini" aria-hidden="true"><span className="track"></span><span className="past"></span><span className="cut"></span></div><p className="cs">the interval is set to 69 days</p></div></div>
            <div className="chan"><p className="cl">Product page</p><div><div className="mini" aria-hidden="true"><span className="track"></span><span className="past"></span><span className="cut"></span></div><p className="cs">the pack offered is the one that lasts to day 69</p></div></div>
            <p className="body" style={{ fontWeight: '600' }}>They move together, not flow by flow.</p>
            <p className="body">The label date is not the reorder date.</p>
            <p className="body">Those two numbers are one shop&rsquo;s. Paste your own order export and your own label, and the tool reads the same two numbers off your data.</p>
            <a className="toollink" href="/tool">Count your own interval</a>
          </div>
        </section>

        <section className="batches">
          <div className="rule">
            <p className="eyebrow">Prior batches</p>
            <p className="label">Record of work</p>
          </div>
          <div className="batch"><p className="n">Allegro</p><p className="l">Worked with a data science team on predicting a customer&rsquo;s next purchase.</p><p className="s">Closed</p></div>
          <div className="batch"><p className="n">Accenture</p><p className="l">Lifecycle marketing for cosmetics and drugstore brands: the same repeat-purchase problem at retail scale.</p><p className="s">Closed</p></div>
          <div className="batch"><p className="n">mBank</p><p className="l">Built a retention programme around consumables: coffee, detergents, lenses.</p><p className="s">Closed</p></div>
          <div className="batch"><p className="n">Booksy</p><p className="l">The same recurring problem on the service side, where the cycle is an appointment rather than a pack.</p><p className="s">Closed</p></div>
          <div className="batch"><p className="n">GenActiv</p><p className="l">Current client. Colostrum, Shopify: strategy and build.</p><p className="s live">In production</p></div>
        </section>

      </main>

      <div className="footwrap">
        <span className="sig" aria-hidden="true" data-sig></span>
        <footer>
          <p className="label">Rafa&#322; Oleksiak &middot; Warsaw</p>
          <p className="lot">LOT 45/69 &middot; REV 2026-10 &middot; WARSAW</p>
          <p><a href="mailto:rafal@oleksiakconsulting.com">rafal@oleksiakconsulting.com</a></p>
          <p><a className="li" href="https://www.linkedin.com/in/rafa%C5%82-oleksiak-3b322981/">Rafa&#322; Oleksiak on LinkedIn</a></p>
        </footer>
      </div>

      <section className="finale" data-finale>
        <div className="frame">
          <div className="rule">
            <p className="eyebrow">One brand, one mark per customer</p>
            <p className="label">Batch record</p>
          </div>
          <div className="mid">
            <div className="fields">
              <div className="half">
                <div className="marks" data-marks="left" aria-hidden="true"></div>
                <p className="cap l">Bought again, and paid for again</p>
              </div>
              <span className="div" aria-hidden="true" data-div></span>
              <div className="half">
                <div className="marks" data-marks="right" aria-hidden="true"></div>
                <p className="cap r">Came back on their own day</p>
              </div>
            </div>
            <p className="payoff" data-payoff>You don't pay twice for the same customer.</p>
          </div>
          <div className="msg">
            <div className="who">
              <b>Rafa&#322; Oleksiak</b>
              <span>rafal@oleksiakconsulting.com</span>
            </div>
            <div className="body">
              <div className="chrome" data-chrome>
                <span className="k">Rafa&#322; Oleksiak wrote:</span>
                <span className="s">Your pack runs out today.</span>
                <span className="t" data-stamp></span>
                <span className="d">A demonstration &mdash; sent with one dose left, not after the pack ran dry.</span>
              </div>
              <form id="enquiry-2" data-form="close" noValidate>
                <div className="live">
                  <div className="row">
                    <input id="url3" name="url3" type="text" inputMode="url" autoCapitalize="none" spellCheck="false" placeholder="Your store URL" aria-label="Your store URL" required />
                    <input id="email3" name="email3" type="email" placeholder="Your email" aria-label="Your email" required />
                    <button className="send" type="submit">Send</button>
                  </div>
                  <div className="meta">
                    <label className="cons"><input id="consent3" name="consent3" type="checkbox" required /><span>I agree to be contacted about this enquiry<span className="opt"> (required)</span></span></label>
                    <label className="cons"><input id="marketing3" name="marketing3" type="checkbox" /><span>Occasional email from me &mdash; notes on reorder timing, new tools I build, and what I learn working on FMCG stores. Unsubscribe in one click.<span className="opt"> (optional)</span></span></label>
                    <span className="dry" data-dry>One more dose &mdash; nothing dispensed</span>
                  </div>
                </div>
                <div className="sent">
                  <p className="promise">Got it &mdash; <span data-host></span>. I&rsquo;ll write to you from rafal@oleksiakconsulting.com within 24 hours.</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="closewrap">
        <form className="closepanel form" id="enquiry-3" data-form="closephone" noValidate>
          <div className="live">
            <div className="rule"><p className="eyebrow">Enquiry form</p></div>
            <p className="feerow">No setup fee.</p>
            <p className="feerow">No minimum term.</p>
            <p className="feerow">Two clients at a time.</p>
            <div className="fld">
              <label className="label" htmlFor="url4">Your store URL</label>
              <input id="url4" name="url4" type="text" inputMode="url" autoCapitalize="none" spellCheck="false" placeholder="yourstore.com" required />
            </div>
            <div className="fld">
              <label className="label" htmlFor="email4">Your email</label>
              <input id="email4" name="email4" type="email" placeholder="you@yourstore.com" required />
            </div>
            <label className="cons"><input id="consent4" name="consent4" type="checkbox" required /><span>I agree to be contacted about this enquiry<span className="opt"> (required)</span></span></label>
            <label className="cons"><input id="marketing4" name="marketing4" type="checkbox" /><span>Occasional email from me &mdash; notes on reorder timing, new tools I build, and what I learn working on FMCG stores. Unsubscribe in one click.<span className="opt"> (optional)</span></span></label>
            <button className="send" type="submit">Send</button>
            <p className="feelead">EUR 2,500 net per month.</p>
            <p className="promise">I reply personally within 24 hours, with a first observation about <span data-echo>your store</span> &mdash; not a calendar link.</p>
          </div>
          <div className="sent">
            <div className="rule"><p className="eyebrow">Enquiry received</p></div>
            <p className="label">Your store URL</p>
            <p className="host" data-host></p>
            <p className="promise">I reply personally within 24 hours, with a first observation about your store &mdash; not a calendar link.</p>
            <p className="promise">Two clients at a time.</p>
          </div>
        </form>
      </div>

      <div className="bar" data-bar>
        <p className="note">Reply in 24 hours, with a first observation about <span data-echo>your store</span>.</p>
        <form data-form="bar" noValidate>
          <div className="live">
            <input id="url2" name="url2" type="text" inputMode="url" autoCapitalize="none" spellCheck="false" placeholder="Your store URL" aria-label="Your store URL" required />
            <div className="more">
              <input id="email2" name="email2" type="email" placeholder="Your email" aria-label="Your email" required />
              <label className="cons"><input id="consent2" name="consent2" type="checkbox" required /><span>I agree to be contacted about this enquiry<span className="opt"> (required)</span></span></label>
              <label className="cons"><input id="marketing2" name="marketing2" type="checkbox" /><span>Occasional email from me &mdash; notes on reorder timing, new tools I build, and what I learn working on FMCG stores. Unsubscribe in one click.<span className="opt"> (optional)</span></span></label>
            </div>
            <button className="send" type="submit">Send</button>
          </div>
          <div className="sent">
            <p className="note">Got it &mdash; <span data-host></span>. I&rsquo;ll write to you from rafal@oleksiakconsulting.com within 24 hours, with a first observation about your store.</p>
          </div>
        </form>
      </div>
{/* >>> KONIEC BLOKU ZE ZRODLA <<< */}
    </>
  );
}
