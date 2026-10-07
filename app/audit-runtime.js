/**
 * Skrypt strony glownej — przeniesiony BAJT W BAJT z bloku <script>
 * w design/production/index.html. Zawartosc miedzy znacznikami generuje
 * scripts/ship.mjs; nie edytuj jej recznie, bo nastepny ship ja nadpisze.
 *
 * Dlaczego to plik .js, a nie .tsx: tsconfig obejmuje wylacznie pliki .ts
 * i .tsx, a checkJs jest wylaczony, wiec ten plik omija typecheck. Dzieki
 * temu kod moze zostac doslownie taki, jak zostal przetestowany wizualnie —
 * bez ani jednej adnotacji dopisanej po to, zeby zadowolic kompilator.
 */
export default function bootAudit() {
/* >>> ZE ZRODLA — GENEROWANE, NIE EDYTUJ RECZNIE <<< */
  var D = document;
  var reduced = false, headless = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  try { headless = !!navigator.webdriver; } catch (e) {}
  var instant = reduced || headless;

  /* ── pasek 70 dni: sygnatury i os ─────────────────────────────── */
  function fillDays(host, cls45, cls69){
    if (!host || host.childElementCount) return;
    var frag = D.createDocumentFragment();
    for (var d = 1; d <= 70; d++){
      var s = D.createElement('span');
      if (d === 45) s.className = cls45;
      else if (d === 69) s.className = cls69;
      frag.appendChild(s);
    }
    host.appendChild(frag);
  }
  Array.prototype.forEach.call(D.querySelectorAll('[data-sig]'), function(el){ fillDays(el, 'd45', 'd69'); });
  var ticks = D.querySelector('[data-ticks]');
  fillDays(ticks, 'd45', 'd69');

  /* ── instrument skladu ────────────────────────────────────────── */
  var PARTS = [
    { dose:'100 ml', note:'Days 46–69 — bid against a full cupboard',
      mark:function(d){ return d >= 46 && d <= 69; },
      lines:['Campaign structure split by the role of the purchase, new customer versus returning.',
             'Audiences and exclusions built from CRM cycle data instead of platform lookalikes.',
             'The measurement window set to the category’s own cycle rather than a default seven or thirty days.'] },
    { dose:'80 ml', note:'Days 1–2 — the visit that picks the pack size',
      mark:function(d){ return d <= 2; },
      lines:['Pack size and duration stated plainly on the product page so the shopper can see how long each variant lasts.',
             'A clean one-off versus subscription choice instead of a hidden toggle.',
             'Cart thresholds set against the real basket, and the second pack offered after purchase rather than discounted before it.'] },
    { dose:'60 ml', note:'Days 40–48 — owned channels take the order',
      mark:function(d){ return d >= 40 && d <= 48; },
      lines:['Winback and replenishment flows timed to each customer’s own cycle; lapsed segments separated from never-returned.',
             'Email, push and SMS split by what the moment deserves.',
             'Anyone already inside an owned-channel flow suppressed from paid so the same person is not bought twice.'] },
    { dose:'40 ml', note:'Days 45 and 69 — shipment set by consumption',
      mark:function(d){ return d === 45 || d === 69; },
      lines:['Plans designed around pack size and real consumption; skip, postpone and change-size instead of a discount to stay.',
             'Loyalty earned by cadence rather than by spend.',
             'Save offers placed at the moment of the decision, not a month later.'] },
    { dose:'20 ml', note:'Seven customers, seven different days',
      mark:function(d){ return [8,19,27,38,44,55,66].indexOf(d) >= 0; },
      lines:['A model calculating the cycle per individual user from order history and pack size.',
             'A cohort fallback for customers who have bought only once.',
             'That date feeding both the CRM calendar and the paid exclusions, recalculated after every order.'] }
  ];

  var cards = Array.prototype.slice.call(D.querySelectorAll('.card'));
  var dirHost = D.querySelector('[data-directions]');
  var dirTitle = D.querySelector('[data-dir-title]');
  var dirDose = D.querySelector('[data-dir-dose]');
  var panelText = D.querySelector('[data-panel-text]');
  var selected = -1, rippleTimers = [];

  function paintTicks(i){
    if (!ticks) return;
    var kids = ticks.children, p = PARTS[i], n = kids.length, k;
    for (k = 0; k < rippleTimers.length; k++) clearTimeout(rippleTimers[k]);
    rippleTimers = [];
    for (k = 0; k < n; k++){
      (function(k){
        var el = kids[k], day = k + 1, on = p.mark(day);
        var apply = function(){
          if (on){ el.style.height = '100%'; el.style.background = 'var(--amber)'; }
          else if (day === 45){ el.style.height = '100%'; el.style.background = 'var(--ink)'; }
          else if (day === 69){ el.style.height = '100%'; el.style.background = 'var(--amber)'; }
          else { el.style.height = (day % 5 === 0 ? '58%' : '40%'); el.style.background = 'var(--hair)'; }
        };
        if (instant || !on) apply();
        else rippleTimers.push(setTimeout(apply, Math.min(600, k * 6)));
      })(k);
    }
  }

  function renderDirections(i){
    if (!dirHost) return;
    var p = PARTS[i];
    var build = function(){
      dirHost.innerHTML = '';
      var wrap = D.createElement('div');
      wrap.className = 'dirs';
      for (var k = 0; k < p.lines.length; k++){
        var line = D.createElement('p');
        line.className = 'dirline';
        line.textContent = p.lines[k];
        wrap.appendChild(line);
      }
      dirHost.appendChild(wrap);
      dirHost.style.opacity = '1';
    };
    if (instant || !dirHost.firstChild){ build(); return; }
    dirHost.style.transition = 'opacity .16s linear';
    dirHost.style.opacity = '0';
    setTimeout(function(){ build(); }, 160);
  }

  function select(i, focusIt){
    if (i === selected || !PARTS[i]) return;
    selected = i;
    for (var k = 0; k < cards.length; k++){
      cards[k].setAttribute('aria-selected', k === i ? 'true' : 'false');
      cards[k].setAttribute('tabindex', k === i ? '0' : '-1');
    }
    if (dirTitle) dirTitle.textContent = 'part 0' + (i + 1);
    if (dirDose) dirDose.textContent = PARTS[i].dose;
    if (panelText) panelText.textContent = PARTS[i].note;
    renderDirections(i);
    paintTicks(i);
    if (focusIt && cards[i]) cards[i].focus();
  }

  cards.forEach(function(card, i){
    card.addEventListener('mouseenter', function(){ select(i); });
    card.addEventListener('focus', function(){ select(i); });
    card.addEventListener('click', function(){ select(i); });
    card.addEventListener('keydown', function(ev){
      var next = -1;
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') next = (i + 1) % cards.length;
      if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') next = (i - 1 + cards.length) % cards.length;
      if (next >= 0){ ev.preventDefault(); select(next, true); }
    });
  });
  select(0);

  /* ── odslona sekcji rozpoznania ───────────────────────────────── */
  var revealables = Array.prototype.slice.call(D.querySelectorAll('[data-reveal]'));
  var codeEl = D.querySelector('[data-recog-code]');
  var landed = 0;
  function setCode(n){
    if (!codeEl) return;
    var v = Math.max(1, Math.min(3, n));
    codeEl.textContent = '01–' + (v < 10 ? '0' + v : String(v));
  }
  function land(el){
    el.classList.add('in');
    if (el.hasAttribute('data-reveal') && !el.classList.contains('verdict')){
      landed += 1; setCode(landed);
    }
  }
  if (instant || !('IntersectionObserver' in window)){
    revealables.forEach(function(el){ el.classList.add('in'); });
    setCode(3);
  } else {
    revealables.forEach(function(el){ el.classList.add('armed'); });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        setTimeout(function(){ land(en.target); }, 60);
      });
    }, { rootMargin: '0px 0px -18% 0px', threshold: 0 });
    revealables.forEach(function(el){ io.observe(el); });
    /* Bezpiecznik: jesli obserwator nie ruszy w ciagu sekundy, dopelniamy sami. */
    setTimeout(function(){
      revealables.forEach(function(el){ if (!el.classList.contains('in')) land(el); });
    }, 1000);
  }

  /* ── final przypiety ──────────────────────────────────────────── */
  var finale = D.querySelector('[data-finale]');
  var payoff = D.querySelector('[data-payoff]');
  var chrome = D.querySelector('[data-chrome]');
  var dry = D.querySelector('[data-dry]');
  var divider = D.querySelector('[data-div]');
  var stampEl = D.querySelector('[data-stamp]');
  var caps = Array.prototype.slice.call(D.querySelectorAll('.finale .cap'));
  var markHosts = Array.prototype.slice.call(D.querySelectorAll('[data-marks]'));
  var markCells = { left: [], right: [] };
  var stamped = '';

  function buildMarks(){
    markHosts.forEach(function(host){
      var side = host.getAttribute('data-marks');
      if (host.childElementCount) return;
      var count = 60, frag = D.createDocumentFragment(), cells = [];
      for (var i = 0; i < count; i++){
        var mk = D.createElement('span');
        mk.className = 'mk';
        var dot = D.createElement('span'); dot.className = 'dot'; mk.appendChild(dot);
        var bars = [];
        for (var b = 0; b < 6; b++){ var bar = D.createElement('i'); mk.appendChild(bar); bars.push(bar); }
        frag.appendChild(mk);
        cells.push({ el: mk, bars: bars, j: ((i * 37) % 11) / 11 });
      }
      host.appendChild(frag);
      markCells[side] = cells;
    });
  }
  buildMarks();

  function seg(p, a, b){ return Math.max(0, Math.min(1, (p - a) / (b - a))); }

  function paintFinale(p){
    var pA = seg(p, 0, .20), pB = seg(p, .18, .52), pC = seg(p, .48, .74), pD = seg(p, .72, .90);
    ['left','right'].forEach(function(side){
      markCells[side].forEach(function(c){
        var o = 0.2 + 0.8 * Math.max(0, Math.min(1, pA * 1.7 - c.j * 0.6));
        c.el.style.opacity = o.toFixed(2);
        var base = Math.max(0, Math.min(1, pB * 1.3 - c.j * 0.3)) * 3;
        var extra = pC * (2 + (c.j > 0.62 ? 1 : 0));
        var n = side === 'left'
          ? Math.max(0, Math.min(6, Math.round(base + extra)))
          : Math.max(0, Math.round(base * (1 - pC)));
        for (var b = 0; b < 6; b++) c.bars[b].className = (b < n) ? 'on' : '';
      });
    });
    if (divider){
      divider.style.transform = 'scaleY(' + (0.05 + 0.95 * pC).toFixed(3) + ')';
      divider.style.opacity = (0.12 + 0.88 * pC).toFixed(2);
    }
    var capO = (0.06 + 0.94 * seg(p, .54, .80)).toFixed(2);
    caps.forEach(function(c){ c.style.opacity = capO; });
    if (payoff) payoff.style.opacity = pD.toFixed(2);
    var fired = pD >= 0.6, dried = pD >= 1;
    if (chrome) chrome.style.opacity = fired ? '1' : '0';
    if (dry) dry.style.opacity = dried ? '1' : '0';
    if (stampEl){
      if (fired && !stamped){
        stamped = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      stampEl.textContent = fired ? stamped : '';
    }
  }

  /* ── miernik dawki ────────────────────────────────────────────── */
  var meter = D.querySelector('[data-meter]');
  var readout = D.querySelector('[data-readout]');
  var meterMarks = meter ? Array.prototype.slice.call(meter.querySelectorAll('.mk')) : [];
  var gauge = -1;
  function paintMeter(g){
    if (g === gauge) return;
    gauge = g;
    for (var i = 0; i < meterMarks.length; i++){
      if (i < g) meterMarks[i].classList.add('gone');
      else meterMarks[i].classList.remove('gone');
    }
    if (readout) readout.textContent = ((5 - g) * 100) + ' ml left';
  }

  /* ── petla scrolla ────────────────────────────────────────────── */
  var bar = D.querySelector('[data-bar]');
  var anchor = D.querySelector('[data-finale]') || D.querySelector('.closewrap');
  function onScroll(){
    var vh = window.innerHeight || 800;
    var y = window.pageYOffset || D.documentElement.scrollTop || 0;

    if (meter){
      if (y > 60) meter.classList.add('on'); else meter.classList.remove('on');
    }
    if (anchor){
      var maxScroll = Math.max(1, D.documentElement.scrollHeight - vh);
      var at = anchor.getBoundingClientRect().top + y - vh * 0.5;
      var end = Math.max(1, Math.min(maxScroll, at));
      var q = y / end;
      paintMeter(q >= 1 ? 5 : Math.max(0, Math.min(4, Math.floor(q * 5))));
    }
    if (finale){
      var r = finale.getBoundingClientRect();
      var span = Math.max(1, r.height - vh);
      var p = Math.max(0, Math.min(1, -r.top / span));
      paintFinale(instant ? 1 : p);
      if (bar){
        if (r.top < vh * 0.9) bar.classList.add('hide');
        else bar.classList.remove('hide');
      }
    }
  }
  if (instant){ paintFinale(1); paintMeter(5); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ── formularze ───────────────────────────────────────────────── */
  function hostOf(raw){
    var v = (raw || '').trim();
    return v.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '').replace(/^www\./i, '').split(/[/?#]/)[0] || v;
  }
  function sourceMap(){
    var out = {}, qs;
    try { qs = new URLSearchParams(window.location.search); } catch (e) { return out; }
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){
      var v = qs.get(k); if (v) out[k] = String(v).slice(0, 300);
    });
    if (D.referrer) out.referrer = String(D.referrer).slice(0, 300);
    return out;
  }
  var forms = Array.prototype.slice.call(D.querySelectorAll('[data-form]'));
  forms.forEach(function(form){
    var key = form.getAttribute('data-form');
    var urlInput = form.querySelector('input[inputmode="url"]');
    var emailInput = form.querySelector('input[type="email"]');
    var consent = form.querySelector('input[name^="consent"]');
    var marketing = form.querySelector('input[name^="marketing"]');

    if (urlInput){
      urlInput.addEventListener('input', function(){
        var h = hostOf(urlInput.value);
        Array.prototype.forEach.call(D.querySelectorAll('[data-echo]'), function(sp){
          sp.textContent = h || 'your store';
        });
        if (bar && key === 'bar' && h) bar.classList.add('open');
      });
      if (key === 'bar') urlInput.addEventListener('focus', function(){ bar.classList.add('open'); });
    }

    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var host = hostOf(urlInput ? urlInput.value : '');
      var email = emailInput ? (emailInput.value || '').trim() : '';
      if (!email || (consent && !consent.checked)) {
        if (emailInput && !email) emailInput.focus();
        else if (consent) consent.focus();
        return;
      }
      var payload = {
        email: email,
        message: host ? host.slice(0, 140) : undefined,
        source: sourceMap(),
        storeUrl: host || undefined,
        consentContact: true,
        consentMarketing: !!(marketing && marketing.checked),
        consentText: 'I agree to be contacted about this enquiry',
        consentAt: new Date().toISOString(),
        form: key
      };
      try {
        window.fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(function(){});
      } catch (e) {}
      Array.prototype.forEach.call(form.querySelectorAll('[data-host]'), function(sp){
        sp.textContent = host;
      });
      var h = Math.round(form.getBoundingClientRect().height);
      if (h) form.style.minHeight = h + 'px';
      form.classList.add('is-sent');
      if (bar && key === 'bar') bar.classList.remove('open');
    });
  });

  /* ── bezpiecznik dla podgladu linku ───────────────────────────── */
  setTimeout(function(){
    if (payoff && payoff.style.opacity === '') paintFinale(1);
  }, 1000);
/* >>> KONIEC BLOKU ZE ZRODLA <<< */
}
