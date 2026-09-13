// GENEROWANE przez scripts/ship-tool.mjs — nie edytuj recznie.
// Zrodlo: tool-index.html
export const BODY = `<div class="page">

  <header>
    <div class="nav">
      <a class="mark wm" href="/">Oleksiak Consulting &middot; FMCG</a>
      <a class="back" href="/">&larr; Back to the homepage</a>
    </div>
    <h1>What the pack says, against <span>what your buyers do</span></h1>
    <p class="thesis">Days of supply off the label, against the gap between orders in your own
      export.</p>
  </header>

  <section class="tool">
    <div class="thead">
      <div>
        <h2>The discrepancy</h2>
        <p>Every subscription app sends on an interval someone typed in. Klaviyo&rsquo;s date ignores
          which product it was. Nothing measures the gap.</p>
      </div>
    </div>
    <div class="tbody">
      <div class="src">
        <div class="srow">
          <span class="cl" style="font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;
            text-transform:uppercase;color:var(--soft);">Running on</span>
          <button class="chip" id="srcS" type="button" aria-pressed="true">A sample shop</button>
          <button class="chip" id="srcM" type="button" aria-pressed="false">Paste your own &rarr;</button>
          <span class="sstat" id="sstat">&nbsp;</span>
        </div>
        <p class="shelp" id="shelp" hidden></p>
        <textarea id="orders" rows="3" spellcheck="false"
          aria-label="Order export lines: date, customer, product title, quantity, price"></textarea>
      </div>
      <div class="legend">
        <span><i class="a"></i>label</span>
        <span><i class="b"></i>they return</span>
        <span>days after the order</span>
        <span id="chk"></span>
      </div>
      <div class="axis" id="axis"></div>
      <div class="plot" id="plot"></div>
      <p class="say" id="verdict">&nbsp;</p>
      <div class="four" id="four"></div>
      <div class="widget" id="widget">
        <span class="wl">For the product page</span>
        <span class="wb" id="wb">&nbsp;</span>
        <span class="wn" id="wn">&nbsp;</span>
      </div>

      <div class="seams">
        <div class="ai" id="ai1">
          <div class="hd"><b>AI &middot; your catalogue</b><span>titles in, pack size out</span></div>
          <p class="fine">Reads the titles in the export above and returns pack size only. Never a
            dose, never a number of days.</p>
          <button class="go" id="g1" type="button">Read pack sizes</button>
          <p class="stat" id="s1"></p>
          <div class="out" id="o1"></div>
        </div>
        <div class="ai" id="ai2">
          <div class="hd"><b>AI &middot; the label</b><span>the maker&rsquo;s words, quoted</span></div>
          <label class="fine" for="doses">Directions off the pack. The only place a dose may come
            from.</label>
          <textarea id="doses" rows="3" spellcheck="false"
            aria-label="Manufacturer directions, one product per line"></textarea>
          <button class="go" id="g2" type="button">Read the doses</button>
          <p class="stat" id="s2"></p>
          <div class="out" id="o2"></div>
        </div>
      </div>
    </div>
  </section>




  <div class="close">
    <p><b>The next run is on your export, not this one.</b> Your orders and your label text in, the
      bands out, and I set the exclusions, the interval, the sends and the page size myself. Two to
      three weeks, <b>8&ndash;12k z&#322; net</b>.</p>
    <p class="sig">Rafa&#322; Oleksiak<br><a href="https://oleksiakconsulting.com/">oleksiakconsulting.com</a></p>
  </div>

  <!-- Poza .close celowo: regula \`.close a\` ma wyzsza specyficznosc i przywrocilaby
       akcent, ktory w jasnym motywie nie przechodzi kontrastu. -->
  <p class="backfoot"><a class="back" href="/">&larr; Back to the homepage</a></p>
</div>`
