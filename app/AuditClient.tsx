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
          <span className="brand">Oleksiak Consulting</span>
          <div className="clients">
            <span className="cl"><b>Allegro</b><i>CRM 0.5% &rarr; 12% of revenue</i></span>
            <span className="cl"><b>mBank mOkazje</b><i>Retention on consumables</i></span>
            <span className="cl"><b>Genactiv</b><i>Colostrum, category leader</i></span>
            <span className="cl"><b>Booksy</b><i>The pack is an appointment</i></span>
          </div>
          <span className="clm">Allegro &middot; mBank mOkazje &middot; Genactiv &middot; Booksy</span>
        </div>

        <div className="say">
          <h1 className="claim">Your second order, on time.</h1>
          <p className="lead">I find the day each pack really runs out, then move ads, emails and
            subscriptions onto it.</p>
        </div>

        <div className="band">
          <div className="grid" id="grid"><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c1"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c2"></i><i className="c3"></i></div>
          <div className="legend">
            <span>45 days the label sells for</span>
            <span className="amb" id="leg">24 days of ads to a full cupboard</span>
            <span className="soft">Day 69: the reorder lands</span>
          </div>
          <p className="origin">Real orders: an anonymous supplements store, 1,197 first-to-second gaps,
            4.8 years. Your numbers differ &mdash; that is what the calculator is for.</p>
        </div>

        <div className="exit">
          <a className="go" href="/tool" aria-label="Calculate your reorder day">
            <span className="gotxt">Calculate your reorder day</span>
            <span className="goarr" aria-hidden="true">&rarr;</span>
          </a>
          <form id="form" noValidate>
            <p className="err" id="err"></p>
            <div className="fbox">
              <input id="mail" type="email" inputMode="email" autoComplete="email" spellCheck="false" autoCapitalize="off" aria-label="Your email" placeholder="Leave your email" />
              <button type="submit">Send</button>
            </div>
            <span className="fine">One reply, written by me. No sequence, no call.</span>
          </form>
          <div className="sent" id="sent"><b>Sent</b><span id="rcpt"></span></div>
        </div>

        <p className="ai">AI reads your pack labels and catalogue, works out days of supply per SKU, and
          compares it with your real gap between orders.</p>

        <div className="svcs" id="svcs">
          <div className="svc">
            <span className="hair"></span>
            <span className="dots"><i></i><i></i><i></i><i></i><i></i></span>
            <span className="sname">Loyalty programmes for FMCG</span>
            <span className="sdesc">built on what people actually finish and rebuy, not on points.</span>
          </div>
          <div className="svc">
            <span className="hair"></span>
            <span className="dots"><i></i><i></i><i></i><i></i><i></i></span>
            <span className="sname">Replenishment cycles, calculated with AI</span>
            <span className="sdesc">our tool reads your pack labels and works out days of supply per SKU.</span>
          </div>
          <div className="svc">
            <span className="hair"></span>
            <span className="dots"><i></i><i></i><i></i><i></i><i></i></span>
            <span className="sname">Shorter time between orders</span>
            <span className="sdesc">the same customers, one more order a year. That is LTV.</span>
          </div>
          <div className="svc">
            <span className="hair"></span>
            <span className="dots"><i></i><i></i><i></i><i></i><i></i></span>
            <span className="sname">Subscription models that fit the pack</span>
            <span className="sdesc">intervals set by the pack, not by a number someone typed once.</span>
          </div>
        </div>

      </div>
{/* >>> KONIEC BLOKU ZE ZRODLA <<< */}
    </>
  );
}
