// GENEROWANE przez scripts/ship-tool.mjs — nie edytuj recznie.
// Zrodlo: tool-index.html
export const BODY = `<div class="top"><div class="in">
  <a class="wm" href="/">Rafa&#322; Oleksiak<span class="c"> &middot; Consultant</span></a>
  <a class="back" href="/">&larr; Homepage</a>
</div></div>

<div class="page">

  <header class="hero">
    <p class="lab soft">Instrument &mdash; reorder interval</p>
    <h1 id="hl">The pack says 45 days. <span>Customers came back at <span class="v">69</span>.</span></h1>
    <p class="lede"><span id="ledetop">What the label promises, against the gap between orders
      in your own export.</span></p>
    <div class="cta">
      <a class="btn" id="cta1" href="#data">Check your own gap</a>
      <a class="back" id="cta2" href="#reading">See the reading &darr;</a>
    </div>
  </header>

  <section class="sec" id="data" aria-labelledby="h-data">
    <div class="sh"><p class="lab" id="h-data">01 &mdash; Your data</p><span class="n" id="n-data">Orders in</span></div>
    <div class="intro">
    <div class="src">
      <div class="srow" id="srow">
        <p class="srcnow" id="srcnow">Reading the sample shop.</p>
        <p class="sstat" id="sstat">&nbsp;</p>
        <p class="srcdo" role="group" aria-label="Which orders to read">
          <span class="orr">Or:</span>
          <button class="word" id="srcS" type="button" hidden>read the sample shop</button>
          <button class="word" id="srcM" type="button">paste your own export</button>
          <span class="dot" aria-hidden="true">&middot;</span>
          <button class="word" id="srcF" type="button">open a file</button>
        </p>
        <input id="file" type="file" accept=".csv,.tsv,.txt,text/csv,text/plain" hidden>
      </div>
      <p class="shelp" id="shelp" hidden></p>
    </div>
    <aside class="dir" aria-label="Directions for use">
      <p class="whose" id="whose">Anonymous supplement shop, the real order history with the
        names removed. Those two days are Proszek dzienny&rsquo;s. The reading below takes
        whichever of the four packs drifts furthest, and that is a different one. Paste your
        own below &mdash; it is counted in this browser, free.</p>
      <p class="lab">Directions for use</p>
      <ol>
        <li><span><b>Paste an order export.</b> Shopify: Orders &rarr; Export &rarr; plain CSV,
          the file exactly as it downloads &mdash; header row and all.</span></li>
        <li><span><b>Read the gap.</b> Label days against the rhythm buyers settle into and the
          first repurchase, one axis for every product.</span></li>
        <li><span><b>Take the four settings.</b> Paid, subscription, CRM and the product page,
          all timed to the same measured day.</span></li>
      </ol>
    </aside>
    </div>
    <div class="src">
      <details id="rawbox">
        <summary><span id="rawsum">Show the rows this reading is counted from</span></summary>
        <pre id="rawpre"></pre>
      </details>
      <div class="door" id="door" hidden>
        <p class="dsay" id="dsay"></p>
        <div class="dexit">
          <p class="srcdo" role="group" aria-label="Read something else instead">
            <span class="orr">Or:</span>
            <button class="word" id="dout" type="button">read the sample shop instead</button>
            <span class="dot" aria-hidden="true">&middot;</span>
            <button class="word" id="dfile2" type="button">open a CSV file</button>
          </p>
          <p class="dheld">Below, in grey, the anonymous shop&rsquo;s file is still being read.
            Yours takes its place the moment it lands.</p>
        </div>
        <div class="dpaper">
          <p class="dhint" id="dhint"></p>
          <textarea id="orders" rows="5" spellcheck="false"
            aria-label="Order export lines: date, customer, product title, quantity, price"></textarea>
          <p class="dfix" id="dfix"></p>
        </div>
      </div>
    </div>
  </section>

  <section class="sec" id="reading" aria-labelledby="h-read">
    <div class="sh"><p class="lab" id="h-read">02 &mdash; The reading</p><span class="n" id="n-read">Days after the order</span></div>
    <p class="say" id="verdict">&nbsp;</p>
    <div id="lead"></div>
    <p class="plothead" id="plothead"></p>
    <div class="plot" id="plot"></div>
    <div class="apart">
      <p class="dl">What the apps read instead</p>
      <div>
        <p class="asay">A predicted next-order date reads the <b>person</b>. This reads the
          <b>pack</b>.</p>
        <p class="aq">Every subscription app sends on an interval someone typed in,
          Klaviyo&rsquo;s predicted date ignores which product it was, and a cohort report
          counts the days between orders with nothing to set them against.<span class="num"
          id="apn"></span><span class="num" id="den"></span><span id="chk"></span></p>
      </div>
    </div>
    <details class="behind" id="behind">
      <summary><span id="bsum">The counts behind this reading</span></summary>
      <div class="bl" id="blist"></div>
    </details>
  </section>

  <section class="sec" id="indication" aria-labelledby="h-ind">
    <div class="sh"><p class="lab" id="h-ind">03 &mdash; Indication</p><span class="n" id="n-ind">One day, four channels</span></div>
    <p class="together" id="together">I set your ads, emails and subscriptions by this gap
      &mdash; a range, not a date.</p>
    <div class="ind">
      <div class="daymark" id="cax" hidden>
        <span class="dl">The measured day</span>
        <span class="dnum"><span class="dn" id="daynum"></span><span class="dband" id="dayband" hidden></span></span>
        <span class="dcount" id="daycount" hidden></span>
        <span class="dq" id="dayq"></span>
      </div>
      <div class="oneday" id="four"></div>
    </div>
    <div class="widget" id="widget">
      <span class="wl">For the product page</span>
      <span class="wb" id="wb"></span>
      <span class="wn" id="wn">&nbsp;</span>
    </div>
  </section>

  <section class="sec aisec" aria-labelledby="h-ai">
    <div class="sh"><p class="lab" id="h-ai">04 &mdash; Read the labels for me</p><span class="n" id="n-ai">AI, quoted only</span></div>
    <!-- Prywatnosc: zweryfikowane w kodzie przy wdrozeniu 2026-10-11, ponownie na silniku
         petli przy scaleniu (plik z „open a file" czyta FileReader do pola, nie wychodzi).
         Nie przepisywac.
         1. g1: titles.slice(0,12), kazdy z cena zaplacona — tylko po kliknieciu.
         2. kolumna klienta nie trafia do zadnego zadania (/api/label, /api/lead).
         3. g2: wysyla linie pola #doses, a pole jest WSTEPNIE wypelnione nazwami
            rodzin produktow (doseSkeleton) — wiec przycisk wysyla tez je. -->
    <p class="leaves">Your export is read in this browser. Two things can leave it, and only
      when you press the button: &ldquo;Read pack sizes&rdquo; sends up to 12 product titles
      with the price paid to an AI model; &ldquo;Read the doses&rdquo; sends whatever is in
      the field below &mdash; your product family names and any label text you paste.
      Customer names, emails and addresses never leave.</p>
    <div class="seams">
      <div class="ai" id="ai1">
        <p class="act">Your catalogue &mdash; titles in, pack size out.</p>
        <div class="aido">
          <p class="fine">Reads the titles in the export above and returns pack size only. Never a
            dose, never a number of days.</p>
          <button class="go" id="g1" type="button">Read pack sizes</button>
          <p class="stat" id="s1"></p>
          <div class="out" id="o1"></div>
        </div>
      </div>
      <div class="ai" id="ai2">
        <p class="act">The label, in the maker&rsquo;s own words.</p>
        <div class="aido">
          <label class="fine" for="doses">Directions off the pack, one product per line. The only
            place a dose may come from.</label>
          <textarea id="doses" rows="4" spellcheck="false"
            aria-label="Manufacturer directions, one product per line"></textarea>
          <button class="go" id="g2" type="button">Read the doses</button>
          <p class="stat" id="s2"></p>
          <div class="out" id="o2"></div>
        </div>
      </div>
    </div>
    <div id="aioff">
      <p class="dsay">Reading labels by machine is off here.</p>
      <p class="dfix">It is the one thing on this page that needs a model; the measured day
        and three of the four settings do not. The fourth &mdash; days of supply on the
        product page &mdash; needs a dose quoted off the pack, and where those words are not
        here to quote the line stays empty instead of guessing.</p>
    </div>
  </section>

  <section class="close" aria-labelledby="h-next">
    <div>
      <p class="lab soft">Next</p>
      <h2 id="h-next">The next run is on your export, not this one.</h2>
      <p class="b">Your orders and your label text in. I re-time the exclusions in paid, the
        subscription interval, the CRM sends and the pack on the product page to the range in
        which your customers actually come back &mdash; a range, not a date &mdash; together,
        month by month.</p>
    </div>
    <div class="fee">
      <p class="lab">Fee</p>
      <p class="amt">EUR 2,500 net per month.</p>
      <ul>
        <li>No setup fee. No minimum term.</li>
        <li>The first month is an as-is audit and the quick wins that come out of it.</li>
        <li>Two clients at a time.</li>
      </ul>
      <a class="btn" href="/#enquiry">Send me your store</a>
      <p class="note">Store URL and email. I reply personally within 24 hours, with a first
        observation about your store &mdash; not a calendar link.</p>
    </div>
    <div class="send" id="send-analysis" hidden>
      <p class="lab">Send me this analysis</p>
      <p class="b">I&rsquo;ll email you the numbers above &mdash; the label day, the real interval and
        the gap &mdash; so you can forward them to whoever owns the calendar.</p>
      <form id="tool-enquiry" novalidate data-interval="" data-label-day="" data-sample-n=""
        data-window-days="" data-bimodal="" data-interval-low="" data-interval-high="">
        <div class="live">
          <label class="fld" for="url-tool"><span>Your store URL (optional)</span>
            <input id="url-tool" name="url-tool" type="text" inputmode="url" autocapitalize="none"
              spellcheck="false" placeholder="yourstore.com"></label>
          <label class="fld" for="email-tool"><span>Your email</span>
            <input id="email-tool" name="email-tool" type="email" required
              placeholder="you@yourstore.com"></label>
          <label class="cons" for="consent-contact-tool"><input id="consent-contact-tool"
              name="consent-contact-tool" type="checkbox"><span>I&rsquo;d like Rafa&#322; to look at
              my store and write back about it.<span class="opt"> (optional)</span></span></label>
          <label class="cons" for="consent-marketing-tool"><input id="consent-marketing-tool"
              name="consent-marketing-tool" type="checkbox"><span>Occasional email from me &mdash;
              notes on reorder timing, new tools I build, and what I learn working on FMCG stores.
              Unsubscribe any time.<span class="opt"> (optional)</span></span></label>
          <p class="pv">Only the numbers above go with this email &mdash; not your file.</p>
          <button type="submit">Send me the analysis</button>
        </div>
        <p class="sent">Sent. The numbers above are on their way to your inbox.</p>
      </form>
    </div>
  </section>

  <footer class="foot">
    <span>Rafa&#322; Oleksiak &middot; FMCG and everything bought again</span>
    <span class="l">
      <a href="mailto:rafal@oleksiakconsulting.com">rafal@oleksiakconsulting.com</a>
      <a href="https://www.linkedin.com/in/rafa%C5%82-oleksiak-3b322981/">LinkedIn</a>
      <a href="/">&larr; Homepage</a>
    </span>
  </footer>
</div>`
