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
      <div className="wrap">

        <div className="top">
          <span className="mark">Oleksiak Consulting</span>
          <span className="tag">FMCG &middot; end to end &middot; Warszawa</span>
        </div>

        <div className="hero">
          <div className="hcell">
            <h1 className="hook">Every pack runs out on a different day. <em>Everything you run fires on the same one.</em></h1>
            <p className="sub">One market &mdash; FMCG and anything bought again. Inside it the whole funnel:
              paid, search including AI answers, the storefront, CRM, subscription, loyalty.</p>
            <a className="door" href="/tool"><b>Run it on your own export</b><i>&rarr;</i></a>
          </div>

          <div className="shelf">
            <span className="tag">The second number</span>
            <div className="second">
              <div className="q">
                <label className="qlab" htmlFor="n1">How many days does one of your packs last?</label>
                <div className="qrow">
                  <input className="nin" id="n1" type="text" inputMode="numeric" autoComplete="off" maxLength={3} aria-describedby="note1" />
                  <span className="unit">days</span>
                </div>
                <p className="qnote" id="note1">off the label</p>
              </div>

              <div className="q q2" id="q2">
                <label className="qlab" id="lab2" htmlFor="n2">How many days until the same customer comes back
                  for it?</label>
                <div className="qrow">
                  <input className="nin" id="n2" type="text" inputMode="numeric" autoComplete="off" maxLength={3} aria-describedby="note2" />
                  <button className="dunno" id="dunno" type="button">I don&rsquo;t know</button>
                </div>
                <p className="qnote" id="note2"></p>
              </div>

              <p className="qend" id="qend"><a href="/tool">It is in your order export &rarr;</a></p>
            </div>
          </div>
        </div>

        <div className="band">
          <div className="bars">
            <span className="tag">Colostrum 300 g &middot; 1&#8201;240 orders</span>
            <div className="rows">
              <div className="brow">
                <span className="tag">Label</span>
                <span className="track"><i className="f50"></i></span>
                <span className="d">50 d</span>
              </div>
              <div className="brow">
                <span className="tag">Return</span>
                <span className="track"><i className="f78"></i></span>
                <span className="d on">78 d</span>
              </div>
            </div>
          </div>
          <p className="claim">Twenty-eight days when your ads, your page and your list are all
            <em>talking to a full cupboard</em>.</p>
        </div>

        <div className="record">
          <div className="rec"><b>Allegro</b><span>FMCG and recurring team, five data scientists,
            next-pack prediction. CRM 0.5% &rarr; 12% of revenue.</span></div>
          <div className="rec"><b>mBank &middot; mOkazje</b><span>Retention built on consumables &mdash;
            coffee, detergents, lenses.</span></div>
          <div className="rec now"><b>Genactiv</b><span>Colostrum, category leader. Ad budgets pooled into
            one ROAS, storefront, search, lifecycle. Current.</span></div>
          <div className="rec"><b>Booksy</b><span>The same arithmetic where the pack is an
            appointment.</span></div>
        </div>

        <div className="terms">
          <div className="tcell">
            <h2>One piece of work, priced before it starts.</h2>
            <p className="dl">Week 3, on your desk:</p>
            <ul className="dlist">
              <li>one table, per SKU: the day the label implies against the day buyers actually come
                back</li>
              <li>the ten widest gaps, ranked by how far they miss</li>
              <li>a corrected send-and-spend calendar: dates, not principles</li>
            </ul>
            <p className="dnote">If the gaps turn out to be small, you hear that in week one.</p>
            <p className="tp">Two to three weeks, fixed fee <b>8&ndash;12k z&#322; net</b>, agreed up front.
              No retainer, no paid discovery. One more brand this quarter.</p>
          </div>
          <div className="write">
            <span className="tag">Write to me</span>
            <form id="form" noValidate>
              <p className="err" id="err"></p>
              <div className="fbox">
                <input id="mail" type="email" inputMode="email" autoComplete="email" spellCheck="false" autoCapitalize="off" placeholder="you@yourbrand.pl" />
                <button type="submit">Send</button>
              </div>
              <input id="msg" className="msg" type="text" maxLength={140} autoComplete="off" placeholder="What do you sell? (optional)" />
              <p className="fine">One reply, by hand. No list, no sequence.</p>
            </form>
            <div className="sent" id="sent">
              <h4>Sent</h4>
              <p id="rcpt"></p>
            </div>
          </div>
        </div>

      </div>
{/* >>> KONIEC BLOKU ZE ZRODLA <<< */}
    </>
  );
}
