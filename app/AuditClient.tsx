'use client';

import { useEffect, useRef } from 'react';
// Uzywane przez generowany region: wlasciwosci niestandardowe (--d) nie
// mieszcza sie w CSSProperties bez rzutowania.
import type { CSSProperties } from 'react';
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
      <div className="s1">
        <div className="head"><span className="wm">Oleksiak Consult</span><span className="lab">FMCG ecommerce &middot; end to end</span></div>
        <h1 className="hook">Every pack runs out on a different day. <em>Everything you run fires on the same one.</em></h1>
        <p className="sub">One market: FMCG and anything bought again &mdash; supplements and colostrum, food, cosmetics, household chemicals, pet food, lenses. Inside it I run the whole funnel: paid, search and AI answers, storefront, CRM, subscription, loyalty.</p>

        <a className="toolcta" href="/tool"><b>Open the pack-duration tool <i>&rarr;</i></b>
          <span>Days of supply off the label, against the gap between orders in your own export. Runs in your browser.</span></a>

        <div className="card1">
          <div className="lab">Fifteen years of this</div>
          <ul>
            <li><b>Allegro</b>FMCG and recurring team, next-pack prediction.</li>
            <li><b>mBank / mOkazje</b>Consumables retention.</li>
            <li><b>Genactiv</b>Colostrum, category leader. Current.</li>
            <li><b>Booksy</b>Same arithmetic, pack as appointment.</li>
          </ul>
          <p className="fee">Fixed fee agreed up front &mdash; usually 8&ndash;12k z&#322; net for two to three weeks. No retainer.</p>
        </div>

        <p className="bridge">Below, one piece of that work running live.</p>
        <div className="step1">
          <div className="lab">01 &nbsp;What runs out in your range</div>
          <div className="cats" id="cats"></div>
          <p className="dq"><b>Not here:</b> fashion, electronics, furniture, one-off gifts. If the thing you sell
            does not empty, nothing on this page applies to you — every step below is timed off a pack
            running out, and yours never does.</p>
        </div>
        <div className="step1">
          <div className="lab">02 &nbsp;Days one pack lasts before the next order</div>
          <div className="row2">
            <div className="daybox"><input id="days" type="number" min="3" max="400" inputMode="numeric" defaultValue="30" /><span>days</span></div>
            <button className="go" id="go" type="button">Run the audit</button>
          </div>
        </div>
      </div>

      <div className="s2">
        <div className="bar"><div className="barin"><span className="wm">Oleksiak Consult</span>
          <button id="crumb" type="button"></button></div></div>
        <div className="shell">
          <div className="main">
            <div className="finding fade" style={{ '--d': '0ms' } as CSSProperties}>
              <div className="lab">Finding</div>
              <p className="leakline" id="leakline"></p>
            </div>

            <div className="fade" style={{ '--d': '80ms' } as CSSProperties}>
              <div className="calc">
                <div className="crow"><label htmlFor="ord">Orders a month<em>your number</em></label>
                  <span className="cval"><input className="n" id="ord" type="number" min="1" max="9999999" inputMode="numeric" defaultValue="800" /></span></div>
                <div className="crow"><label htmlFor="reorder">Days between first and second order<em>read it from your orders — leave blank if you do not know</em></label>
                  <span className="cval"><input className="n" id="reorder" type="number" min="3" max="800" inputMode="numeric" placeholder="?" /></span></div>
                <div className="crow"><label htmlFor="loss">Share who never buy a second pack<em>your estimate — nothing here is mine</em></label>
                  <span className="cval"><input className="n" id="loss" type="number" min="1" max="90" inputMode="numeric" defaultValue="30" />%</span></div>
                <div className="crow"><label htmlFor="win">Share of those a timed sequence wins back<em>your estimate — nothing here is mine</em></label>
                  <span className="cval"><input className="n" id="win" type="number" min="1" max="80" inputMode="numeric" defaultValue="20" />%</span></div>
                <div className="crow"><label htmlFor="aov">Average order<em>your number</em></label>
                  <span className="cval"><input className="n" id="aov" type="number" min="1" max="99999" inputMode="numeric" defaultValue="140" /> z&#322;</span></div>
                <div className="crow out"><span id="calcsum"></span><span className="cval" id="permo"></span></div>
              </div>
              <p className="peryear" id="peryear"></p>
              <p className="priceline" id="priceline"></p>
              <p className="gapline" id="gapline"></p>
            </div>

            <div className="fade" style={{ '--d': '160ms' } as CSSProperties}>
              <div className="shead">
                <div className="lab">The eighteen, in the order I would build them</div>
                <span className="lab">Tap a step to read why</span>
              </div>
              <ol className="steps" id="steps"></ol>
              <button className="copylink" id="copy" type="button">or copy the sheet to the clipboard instead</button>
            </div>

            <p className="foot">Not one number about your shop is invented. The four inputs above are yours;
              the percentages beside each step are ranges from work described on the right, not measurements
              of your shop. If you leave the reorder box blank, the page says so instead of guessing for you.
              The one figure here that is mine is the fee, and it is labelled as mine.</p>
          </div>

          <div className="rail">
            <div className="card fade" style={{ '--d': '120ms' } as CSSProperties}>
              <div className="lab">Fifteen years pricing the day the pack runs out</div>
              <div className="rtb">
        <h3>Rafał Oleksiak. Fifteen years of FMCG ecommerce — traffic, storefront, and what happens after the first pack.</h3>
        <ul><li><b>Paid</b><span>Audiences built on the consumption clock, not the last visit.</span></li><li><b>Search &amp; AI answers</b><span>Consumable queries are duration questions. Own those.</span></li><li><b>Storefront</b><span>Shopify, WooCommerce or bespoke. Pack size, duration on the product page, subscribe-and-save on the real interval.</span></li><li><b>Owned &amp; loyalty</b><span>Each kept cycle is worth more than the last. Timed to the pack, not the calendar.</span></li></ul>
        <ul><li><b>Allegro</b><span>FMCG and recurring team, five data scientists, next-pack prediction. CRM 0.5% to 12% of revenue.</span></li><li><b>mBank / mOkazje</b><span>Consumables retention.</span></li><li><b>Genactiv</b><span>Colostrum, category leader. Ad budgets pooled into one ROAS, storefront, search, lifecycle. Current.</span></li><li><b>Booksy</b><span>Same arithmetic, pack as appointment.</span></li></ul>
        <p className="rtbnote" style={{ fontSize: '13px', fontWeight: '400', color: 'var(--dim)' }}>How it works: you get the sheet. If you asked for it, I reply once with what I would change. If that is useful we scope one piece of work at a fixed fee agreed up front — usually 8&ndash;12k z&#322; net for two to three weeks. No retainer, no discovery phase you pay for.</p>
      </div>
            </div>
            <div className="card fade" style={{ '--d': '200ms' } as CSSProperties}>
              <div className="cov" id="cov"></div>
              <div className="covbar" id="covbar"><i></i></div>
              <p className="covnote" id="covnote"></p>
            </div>
            <div className="card fade" style={{ '--d': '260ms' } as CSSProperties}>
              <p className="askline" id="askline"></p>
              <form id="form" noValidate>
                <p className="err" id="err"></p>
                <div className="fbox">
                  <input id="mail" type="email" inputMode="email" autoComplete="email" spellCheck="false" autoCapitalize="off" placeholder="name@company.com" />
                  <button type="submit">Send the sheet</button>
                </div>
                <div className="choice">
                  <label><input type="radio" name="intent" value="sheet" defaultChecked />
                    <span>Just send me the sheet.</span></label>
                  <label><input type="radio" name="intent" value="markup" />
                    <span><b>Send it, and write back with what you would change.</b>
                      I am considering bringing someone in.</span></label>
                </div>
                <p className="promise">I keep the address to send this sheet, and to reply if you asked me to.
                  No list, no sequence, no third party. One line at the bottom of the mail stops it for good.</p>
              </form>
              <div className="sent" id="sent" style={{ marginTop: '16px' }}>
                <h4>Sent &middot; now I go and look</h4>
                <p id="rcpt"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
{/* >>> KONIEC BLOKU ZE ZRODLA <<< */}
    </>
  );
}
