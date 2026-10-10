// GENEROWANE przez scripts/ship-tool.mjs — nie edytuj recznie.
// Zrodlo: tool-index.html
export const BODY = `<div class="top"><div class="in">
  <a class="wm" href="/">Rafa&#322; Oleksiak<span class="c"> &middot; Consultant</span></a>
  <a class="back" href="/">&larr; Homepage</a>
</div></div>

<div class="page">

  <header class="hero">
    <div>
      <p class="lab soft">Instrument &mdash; reorder interval</p>
      <h1>The pack says 45 days. Customers came back at <span>69</span>.</h1>
      <p class="lede">What the label promises, against the gap between orders in your own export.
        <small>Anonymous supplement shop, the real order history with the names removed. Paste
        your own below &mdash; it is counted in this browser, free.</small></p>
      <div class="cta">
        <a class="btn" href="#data">Check your own gap</a>
        <a class="back" href="#reading">See the reading &darr;</a>
      </div>
    </div>
    <aside class="dir" aria-label="Directions for use">
      <p class="lab">Directions for use</p>
      <ol>
        <li><span><b>Paste an order export.</b> Shopify: Orders &rarr; Export &rarr; plain CSV.
          Date, customer, product title, quantity, price.</span></li>
        <li><span><b>Read the gap.</b> Label days against the rhythm buyers settle into and the
          first repurchase, one axis for every product.</span></li>
        <li><span><b>Take the four settings.</b> Paid, subscription, CRM and the product page,
          all timed to the same measured day.</span></li>
      </ol>
    </aside>
  </header>

  <section class="sec" id="data" aria-labelledby="h-data">
    <div class="sh"><p class="lab" id="h-data">01 &mdash; Your data</p><span class="n">Orders in</span></div>
    <div class="src">
      <div class="srow">
        <div class="seg" role="group" aria-label="Data source">
          <button class="chip" id="srcS" type="button" aria-pressed="true">Sample shop</button>
          <button class="chip" id="srcM" type="button" aria-pressed="false">Paste your own</button>
        </div>
        <span class="sstat" id="sstat">&nbsp;</span>
      </div>
      <p class="shelp" id="shelp" hidden></p>
      <textarea id="orders" rows="5" spellcheck="false"
        aria-label="Order export lines: date, customer, product title, quantity, price"></textarea>
    </div>
  </section>

  <section class="sec" id="reading" aria-labelledby="h-read">
    <div class="sh"><p class="lab" id="h-read">02 &mdash; The reading</p><span class="n">Days after the order</span></div>
    <p class="sub">Every subscription app sends on an interval someone typed in, and Klaviyo&rsquo;s
      predicted date ignores which product it was. Here is the gap, product by product.</p>
    <div class="legend">
      <span><i class="a"></i>label</span>
      <span><i class="b"></i>settled rhythm</span>
      <span><i class="c"></i>first repurchase</span>
      <span id="chk"></span>
    </div>
    <div class="axis" id="axis"></div>
    <div class="plot" id="plot"></div>
  </section>

  <section class="sec" aria-labelledby="h-ind">
    <div class="sh"><p class="lab" id="h-ind">03 &mdash; Indication</p><span class="n">One day, four channels</span></div>
    <p class="say" id="verdict">&nbsp;</p>
    <div class="four" id="four"></div>
    <p class="together">Set together, not one flow at a time.</p>
    <div class="widget" id="widget">
      <span class="wl">For the product page</span>
      <span class="wb" id="wb"></span>
      <span class="wn" id="wn">&nbsp;</span>
    </div>
  </section>

  <section class="sec aisec" aria-labelledby="h-ai">
    <div class="sh"><p class="lab" id="h-ai">04 &mdash; Read the labels for me</p><span class="n">AI, quoted only</span></div>
    <div class="seams">
      <div class="ai" id="ai1">
        <div class="hd"><b>Your catalogue</b><span>titles in, pack size out</span></div>
        <p class="fine">Reads the titles in the export above and returns pack size only. Never a
          dose, never a number of days.</p>
        <button class="go" id="g1" type="button">Read pack sizes</button>
        <p class="stat" id="s1"></p>
        <div class="out" id="o1"></div>
      </div>
      <div class="ai" id="ai2">
        <div class="hd"><b>The label</b><span>the maker&rsquo;s words, quoted</span></div>
        <label class="fine" for="doses">Directions off the pack, one product per line. The only
          place a dose may come from.</label>
        <textarea id="doses" rows="4" spellcheck="false"
          aria-label="Manufacturer directions, one product per line"></textarea>
        <button class="go" id="g2" type="button">Read the doses</button>
        <p class="stat" id="s2"></p>
        <div class="out" id="o2"></div>
      </div>
    </div>
  </section>

  <section class="close" aria-labelledby="h-next">
    <div>
      <p class="lab soft">Next</p>
      <h2 id="h-next">The next run is on your export, not this one.</h2>
      <p class="b">Your orders and your label text in. I re-time the exclusions in paid, the
        subscription interval, the CRM sends and the pack on the product page to the day your
        customers actually come back &mdash; together, month by month.</p>
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
