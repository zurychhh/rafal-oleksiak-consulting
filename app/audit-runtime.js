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
  /* Długość opakowania to fizyka produktu, nie zachowanie klienta: sześćdziesiąt kapsułek
     po dwie dziennie to trzydzieści dni. Dlatego te liczby mogą tu stać, w przeciwieństwie
     do zmyślonych pasm odkupu, które stąd wylecialy. Człowiek spoza kategorii ich nie zna. */
  var CATS=[
    {k:"supp",   label:"Supplements",  unit:"60-cap bottle, 2 a day",  pack:30},
    {k:"sport",  label:"Protein",      unit:"1 kg tub, 30 servings",   pack:30},
    {k:"coffee", label:"Coffee",       unit:"500 g bag",               pack:21},
    {k:"skin",   label:"Skincare",     unit:"50 ml jar",               pack:60},
    {k:"clean",  label:"Household",    unit:"1 L refill",              pack:45},
    {k:"pet",    label:"Pet food",     unit:"10 kg bag, medium dog",   pack:30},
    {k:"lens",   label:"Lenses",       unit:"30-pair box, dailies",    pack:30}
  ];

  var PROG=[
    {g:"trf",  cl:"Paid",             n:"Stop bidding on people who just bought",
     t:"Prospecting audiences still contain last cycle’s buyers", m:"CAC −10–18%",
     at:function(){return "Always on";}},
    {g:"trf",  cl:"Paid",             n:"Retarget on the consumption clock",
     t:"The pack is about to end — not “they visited three days ago”", m:"ROAS +15–25%",
     at:function(P){return "Day "+Math.max(2,P-10);}},
    {g:"trf",  cl:"SEO",              n:"Own the questions that come at the end",
     t:"How long a pack lasts, when to reorder, which size to buy", m:"Non-brand +20–35%",
     at:function(){return "Always on";}},
    {g:"trf",  cl:"SEO for LLMs",     n:"Be the source the answer engines quote",
     t:"ChatGPT, Perplexity and AI overviews answer the dosage question for you", m:"LLM referrals +",
     at:function(){return "Always on";}},
    {g:"store",cl:"Store · PDP",      n:"Put the duration on the product page",
     t:"“30 days of supply” — nobody states it, every buyer wonders", m:"CVR +6–11%",
     at:function(){return "On the page";}},
    {g:"store",cl:"Store · cart",     n:"Price the pack in months, not in units",
     t:"Two packs is two months of not thinking about it", m:"AOV +8–15%",
     at:function(){return "In the cart";}},
    {g:"store",cl:"Store · checkout", n:"Subscribe-and-save set to the real interval",
     t:"Not a round 30 chosen by the platform — the interval you actually see", m:"Take-up 9–17%",
     at:function(){return "At checkout";}},
    {g:"own",  cl:"Email",            n:"Welcome, and how to use it",
     t:"Order placed", m:"CRM rev 6–9%", at:function(){return "Day 0";}},
    {g:"own",  cl:"Email",            n:"Get the pack opened",
     t:"Delivered — the first dose is the habit", m:"CRM rev 3–5%",
     at:function(){return "Day 3–5";}},
    {g:"own",  cl:"Email",            n:"Mid-pack check-in",
     t:"Half the pack gone", m:"CRM rev 4–7%",
     at:function(P){return "Day "+Math.max(2,Math.round(P*0.5));}},
    {g:"own",  cl:"Email + push",     n:"Running low",
     t:"Seven days of product left", m:"CRM rev 20–28%", key:1,
     at:function(P){return "Day "+Math.max(2,P-7);}},
    {g:"own",  cl:"Email + push",     n:"The pack ends",
     t:"Consumption model says zero", m:"CRM rev 16–22%", key:1,
     at:function(P){return "Day "+P;}},
    {g:"own",  cl:"Push",             n:"Missed the refill",
     t:"A week empty, no order", m:"CRM rev 9–13%", at:function(P){return "Day "+(P+7);}},
    {g:"own",  cl:"SMS",              n:"Change the channel",
     t:"Two emails ignored — wrong medium, not wrong clock", m:"CRM rev 6–9%",
     at:function(P){return "Day "+(P+21);}},
    {g:"own",  cl:"Email",            n:"Win-back with a reason",
     t:"Two full cycles missed", m:"CRM rev 5–8%",
     at:function(P){return "Day "+Math.round(P*2.5);}},
    {g:"loy",  cl:"Subscription",     n:"Move them to a standing order",
     t:"Third order — the moment a subscription is accepted", m:"LTV ×1.4–1.9",
     at:function(){return "Order 3";}},
    {g:"loy",  cl:"Loyalty",          n:"A tier earned by cycles kept, not by spend",
     t:"Four packs in a row with no gap", m:"Churn −18–26%",
     at:function(){return "Cycle 4";}},
    {g:"loy",  cl:"Loyalty",          n:"Ask for the referral here, not at checkout",
     t:"Half a year of the product actually working", m:"Referrals 4–9%",
     at:function(){return "Cycle 6";}}
  ];

  /* The order is a judgment call. That judgment is the product, so it is argued. */
  var RANK=[
    {i:10,why:"It lands while the product is still in the house — the only message that arrives before the decision is made."},
    {i:11,why:"The day your own consumption model says zero. Highest revenue per send in every account I have run."},
    {i:6, why:"One checkbox at checkout removes the problem entirely for everyone who accepts it."},
    {i:12,why:"Cheap to build once the clock exists, and it catches everybody the first two missed."},
    {i:4, why:"Costs nothing, lifts conversion, and sets the expectation that makes every later message make sense."},
    {i:1, why:"Stops you paying twice — right now you are bidding on people who are already yours."},
    {i:13,why:"When two emails were ignored, the clock was right and the channel was wrong."},
    {i:15,why:"The third order is when a standing order stops feeling like a commitment."},
    {i:9, why:"Half the pack gone is the cheapest moment to find out it is not being used."},
    {i:14,why:"Two cycles missed needs a reason to come back, not another reminder."},
    {i:7, why:"The welcome flow everyone builds first, which is exactly why it is rarely the problem."},
    {i:8, why:"An unopened pack never runs out, so this row quietly protects every row after it."},
    {i:5, why:"Two packs framed as two months sells the second one without a discount."},
    {i:16,why:"A tier earned by cycles kept rewards the behaviour you actually want."},
    {i:2, why:"The questions people ask at the end of a pack are the ones you should already rank for."},
    {i:3, why:"Answer engines are quoting somebody on dosage and duration. It may as well be you."},
    {i:17,why:"Half a year of the product working is when a referral is worth asking for."},
    {i:0, why:"Housekeeping — but it is money you burn every day it waits."}
  ];

  /* Jedyna liczba na tej stronie, która jest moja, a nie odwiedzającego.
     Zmieniasz ją tutaj i zmienia się wszędzie.                          */
  var PRICE="8–12k zł net";

  var cat=CATS[0], marked={};
  var $=function(id){return document.getElementById(id);};
  var catsEl=$("cats"), daysEl=$("days"), stepsEl=$("steps");

  CATS.forEach(function(c,i){
    var b=document.createElement("button");
    b.type="button";b.setAttribute("aria-pressed",i===0?"true":"false");
    b.appendChild(document.createTextNode(c.label));
    var u=document.createElement("i");u.textContent=c.unit;b.appendChild(u);
    b.onclick=function(){
      cat=c;
      [].forEach.call(catsEl.children,function(el){el.setAttribute("aria-pressed","false");});
      b.setAttribute("aria-pressed","true");
      daysEl.value=c.pack;
      if(document.body.classList.contains("done")){paintAll();}
    };
    catsEl.appendChild(b);
  });

  function P(){var v=parseInt(daysEl.value,10);return(!v||v<3)?3:(v>400?400:v);}
  /* Ta liczba jest odwiedzającego albo jej nie ma. Nie zgadujemy jej za niego. */
  function reorderDays(){
    var e=$("reorder"); if(!e)return null;
    var v=parseInt(e.value,10);
    return (isNaN(v)||v<3||v>800)?null:v;
  }
  function knowsReorder(){return reorderDays()!==null;}
  function band(){var r=reorderDays();return r===null?"unknown":String(r);}
  function gap(){var r=reorderDays();return r===null?null:r-P();}
  daysEl.addEventListener("blur",function(){daysEl.value=P();});
  daysEl.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();go();}});

  function num(id,d){var e=$(id);if(!e)return d;var v=parseFloat(e.value);
    return (isNaN(v)||v<=0)?d:v;}
  function money(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g," ");}
  function econ(){
    var o=num("ord",800),l=num("loss",30),w=num("win",20),a=num("aov",140),
        rec=o*(l/100)*(w/100);
    return {orders:o,rec:rec,mo:rec*a,yr:rec*a*12};
  }
  ["ord","loss","win","aov","reorder"].forEach(function(id){
    var e=$(id); if(e)e.addEventListener("input",paintEcon);
  });

  function paintEcon(){
    var e=econ(),g=gap();
    if($("leakline")){
      if(g===null)
        $("leakline").innerHTML="You do not know which day your buyers come back. "
          +"Neither do most brands your size — and that is the finding, not the excuse.";
      else if(g>0)
        $("leakline").innerHTML="You are leaving about <b>"+money(e.mo)
          +" zł a month</b> in the "+Math.abs(g)
          +" days between the pack running out and your customer coming back.";
      else if(g<0)
        $("leakline").innerHTML="Your buyers restock before they run out, so the <b>"
          +money(e.mo)+" zł a month</b> is not in reminders — it is in a standing order you do not offer.";
      else
        $("leakline").innerHTML="Your pack cycle and their reorder cycle land on the same day, so the <b>"
          +money(e.mo)+" zł a month</b> is not a timing problem — it is how few of them get the message.";
    }
    if($("calcsum")) $("calcsum").innerHTML="<b>"+money(e.rec)+" orders a month</b> you are not asking for";
    if($("permo")) $("permo").textContent=money(e.mo)+" zł";
    if($("peryear")) $("peryear").innerHTML="≈ <b>"+money(e.yr)
      +" zł a year</b>. Every number above is yours — the page only multiplies them. "
      +"I have not put a single figure of my own into that sum.";
    if($("gapline")){
      $("gapline").innerHTML = g===null
        ? "Open your orders, filter to second purchases of one SKU, read the median days between "
          + "first and second order. That takes two minutes and it is the number this whole page "
          + "turns on. Until it is in the box above, the calendar below is a shape, not your shape."
        : "Day "+P()+" the pack is empty. Day "+band()+" they come back. <b>"+Math.abs(g)
          +" days</b> when nothing you own is firing.";
    }
    /* Cena stoi bezpośrednio pod roczną stratą, bo tam nie musi się bronić —
       proporcja robi to sama. Zmiana widełek to jedna stała PRICE poniżej.     */
    if($("priceline")) $("priceline").innerHTML="Closing the first slice of that is one piece of "
      +"work: <b>a fixed fee agreed up front, usually "+PRICE+"</b>, two to three weeks. "
      +"No retainer, and no discovery phase you pay for before anything moves.";
    if($("askline")) $("askline").innerHTML="I take on <b>one more brand</b> this quarter, in a "
      +"category that empties. If it is yours, I will send the arithmetic behind that "
      +money(e.yr)+" zł and where I would start.";
  }

  /* Every step is on screen from the first paint. Marking one strikes it where it
     stands; nothing is promoted, nothing is hidden, the scale stays visible.     */
  function renderSteps(){
    var p=P(),h="";
    RANK.forEach(function(r,k){
      var pr=PROG[r.i];
      h+='<li class="step ch-'+pr.g+(k>5?" extra":"")+(marked[r.i]?" done":"")
        +'" data-i="'+r.i+'">'
        +'<span class="rank">'+(k<9?"0":"")+(k+1)+'</span>'
        +'<span class="sbody">'
          +'<span class="stop"><span class="sname">'+pr.n+'</span>'
          +'<span class="stag">'+pr.cl+'</span></span>'
          +'<span class="smeta">'+pr.at(p)+' &middot; '+pr.t+' &middot; '+pr.m+'</span>'
          +'<span class="swhy">'+r.why+'</span>'
        +'</span>'
        +'<button class="tick" type="button" aria-pressed="'+(marked[r.i]?"true":"false")
        +'" aria-label="Mark as already running"></button></li>';
    });
    stepsEl.innerHTML=h;
    [].forEach.call(stepsEl.children,function(li){
      var idx=+li.getAttribute("data-i");
      li.querySelector(".tick").onclick=function(ev){
        ev.stopPropagation();
        marked[idx]=!marked[idx];
        li.classList.toggle("done",!!marked[idx]);
        li.querySelector(".tick").setAttribute("aria-pressed",marked[idx]?"true":"false");
        cover();
      };
      li.onclick=function(){li.classList.toggle("open");};
    });
    cover();
  }

  function cover(){
    var have=0,key=0,i;
    for(i=0;i<PROG.length;i++){if(marked[i]){have++;if(PROG[i].key)key++;}}
    if($("cov")) $("cov").innerHTML="<b>"+have+"</b> of "+PROG.length+" already running";
    if($("covbar")) $("covbar").style.setProperty("--pct",Math.round(have/PROG.length*100)+"%");
    if($("covnote")) $("covnote").textContent = have===0
      ? "Tap the box on any step you already run."
      : (key<2 ? "You are missing "+(2-key)+" of the two steps anchored to the pack itself — the ones that fire when the product is actually gone."
               : (have===PROG.length ? "All eighteen. Then the question is which four earn nothing, and that is a different conversation."
                                     : "Both pack-anchored steps covered, which puts you ahead of most."));
  }

  function paintAll(){paintEcon();renderSteps();}

  function go(){
    document.body.classList.add("done");
    paintAll();
    window.scrollTo({top:0,behavior:"auto"});
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      document.body.classList.add("shown");
    });});
    if($("crumb")) $("crumb").innerHTML="<b>"+cat.label+"</b> &middot; "+cat.unit
      +" &middot; "+P()+" days per pack &middot; <u>change</u>";
  }
  $("go").onclick=go;
  if($("crumb")) $("crumb").onclick=function(){
    document.body.classList.remove("done","shown");
    window.scrollTo({top:0,behavior:"auto"});daysEl.focus();
  };

  $("copy").onclick=function(){
    var p=P(),e=econ(),r=reorderDays(),lines=[
      "Growth plan — "+cat.label+" ("+cat.unit+") — pack lasts "+p+" days"
      +(r===null?" — reorder day: not measured yet":" — they reorder on day "+r),
      "Leak: "+money(e.mo)+" zl a month / "+money(e.yr)+" zl a year",""];
    RANK.forEach(function(r,k){
      var pr=PROG[r.i];
      lines.push((marked[r.i]?"[x] ":"[ ] ")+(k+1)+". "+pr.n+"  ·  "+pr.at(p)
        +"  ·  "+pr.cl+"  ·  "+pr.m);
    });
    lines.push("","NOTE: every figure above the list is yours, not mine. The percentages beside",
      "each step are ranges from past work, not measurements of your shop.",
      "One piece of work, fixed fee agreed up front, usually "+PRICE+".",
      "Built at oleksiakconsulting.com");
    var txt=lines.join("\n"),b=$("copy"),lab=b.textContent;
    var done=function(){b.textContent="Copied";setTimeout(function(){b.textContent=lab;},1600);};
    if(navigator.clipboard&&navigator.clipboard.writeText)
      navigator.clipboard.writeText(txt).then(done,done);
    else{var t=document.createElement("textarea");t.value=txt;document.body.appendChild(t);
      t.select();try{document.execCommand("copy");}catch(x){}document.body.removeChild(t);done();}
  };

  /* Day-one attribution. Without this, in twelve months there is no way to tell
     whether the one client came through this page or through a LinkedIn post. */
  function source(){
    var q={},p=new URLSearchParams(location.search),k;
    ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].forEach(function(n){
      if(p.get(n))q[n]=p.get(n);
    });
    q.referrer=document.referrer||"direct";
    q.landed=new Date().toISOString();
    return q;
  }
  var ARRIVED=source();

  function sheetRows(){
    var p=P(),out=[];
    RANK.forEach(function(r,k){
      var pr=PROG[r.i];
      out.push({rank:k+1,step:pr.n,when:pr.at(p),channel:pr.cl,moves:pr.m,
                already:!!marked[r.i]});
    });
    return out;
  }

  $("form").addEventListener("submit",function(ev){
    ev.preventDefault();
    var m=$("mail"),v=m.value.trim(),err=$("err"),btn=$("form").querySelector("button");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){
      err.textContent=v.indexOf("@")<0?"Missing the @ — try name@company.com."
                                      :"Missing the domain — try name@company.com.";
      err.classList.add("on");m.focus();return;
    }
    err.classList.remove("on");
    var have=0,i;for(i=0;i<PROG.length;i++)if(marked[i])have++;
    var e=econ(),pick=document.querySelector('input[name=intent]:checked'),
        wants=pick&&pick.value==="markup";
    /* the two answers mean different things, so they get different promises */
    $("rcpt").textContent=wants
      ? "The sheet is on its way to "+v+" — your "+cat.label.toLowerCase()+" clock at "+P()
        +" days, the arithmetic behind "+money(e.yr)+" zł, and the "+(PROG.length-have)
        +" steps you have not marked. I read it and write back by this time tomorrow: the build "
        +"order, the two steps I would cut, and what I would need from your order data."
      : "The sheet is on its way to "+v+" — your "+cat.label.toLowerCase()+" clock at "+P()
        +" days and the arithmetic behind "+money(e.yr)+" zł. That is the only mail you get from me.";
    var e2=econ(),pick2=document.querySelector('input[name=intent]:checked');
    btn.disabled=true;btn.textContent="Sending";
    var ctrl=("AbortController" in window)?new AbortController():null;
    var killer=setTimeout(function(){if(ctrl)ctrl.abort();},15000);
    fetch("/api/lead",{
      method:"POST",
      signal:ctrl?ctrl.signal:undefined,
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        email:v,
        intent:(pick2&&pick2.value)||"sheet",
        category:cat.label,
        packDays:P(),
        reorderBand:band(),
        reorderKnown:knowsReorder(),
        gapDays:gap()===null?0:gap(),
        economics:{orders:e2.orders,recovered:Math.round(e2.rec),
                   perMonth:Math.round(e2.mo),perYear:Math.round(e2.yr)},
        steps:sheetRows(),
        source:ARRIVED
      })
    }).then(function(r){
      clearTimeout(killer);
      if(!r.ok)throw new Error("bad status "+r.status);
      $("sent").classList.add("on");
      $("sent").scrollIntoView({behavior:"smooth",block:"center"});
    }).catch(function(){
      clearTimeout(killer);
      /* the visitor already did their part — never lose them to a 500 */
      err.textContent="That did not go through. Write to me directly at hello@oleksiakconsulting.com and I will send it by hand.";
      err.classList.add("on");
    }).then(function(){
      btn.disabled=false;btn.textContent="Send the sheet";
    });
  });
  $("mail").addEventListener("input",function(){$("err").classList.remove("on");});
/* >>> KONIEC BLOKU ZE ZRODLA <<< */
}
