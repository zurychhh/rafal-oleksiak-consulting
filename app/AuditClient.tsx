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
            <span className="tag">Six categories, six different clocks</span>
            <div className="packs">
              <span className="pk p1"><b>30</b><i>Colostrum &middot; 60 kaps</i></span>
              <span className="pk p2"><b>76</b><i>Whey &middot; 2270 g</i></span>
              <span className="pk p3"><b>50</b><i>Krem &middot; 50 ml</i></span>
              <span className="pk p4"><b>45</b><i>Kapsu&#322;ki &middot; 60 szt</i></span>
              <span className="pk p5"><b>40</b><i>Karma &middot; 12 kg</i></span>
              <span className="pk pn"><b>&mdash;</b><i>&#346;wieca &middot; nie cykliczna</i></span>
            </div>
            <p className="note">Your subscription app ships all six on the same thirty days. The last one is
              not a consumable at all &mdash; and the tool says so instead of inventing a number.</p>
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
