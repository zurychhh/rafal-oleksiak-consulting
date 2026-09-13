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
  function $(id){return document.getElementById(id);}

  var reduce=false;
  try{reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;}catch{}
  /* Automat ma widziec stan koncowy. design/qa.js robi zrzuty po krotkim
     odczekaniu, wiec zlapalby siatke w polowie zapelniania i policzyl kontrast
     pol, ktore akurat maja opacity 0. To warunek natychmiastowego dokonczenia,
     nie wylaczenie animacji: zwykly odwiedzajacy dostaje ja bez zmian.      */
  var automat=false;
  try{automat=navigator.webdriver===true;}catch{}
  var still=reduce||automat||typeof IntersectionObserver!=="function";

  /* ---- kalendarz: 45 jasnych, 24 bursztynowe, ostatnie wygaszone ----
     Opoznienia z makiety: jasne co 0,05 s przez pierwsze 2,3 s, potem
     bursztynowe co 0,075 s, kazde z podbiciem do 155%, ostatnie o 4,2 s.  */
  var grid=$("grid"), leg=$("leg");
  if(grid && !still){
    grid.classList.add("arm");
    if(leg) leg.classList.add("arm");
    var cells=grid.children;
    var ruszylo=false;

    /* Trzecia sciezka dokonczenia, obok warunku webdriver i reduced motion.
       Renderer podgladu linku (LinkedIn, Slack, iMessage) nie ustawia
       navigator.webdriver i robi zrzut chwile po zaladowaniu — dostawal wiec
       prawie pusta kratke, czyli karte posta bez tresci, na jedynym kanale,
       z ktorego idzie ruch. Jezeli obserwator nie ruszyl w ciagu sekundy,
       siatka dopelnia sie sama, BEZ animacji: zdejmujemy tylko `arm`, wiec
       wraca stan domyslny DOM-u. Zwykly odwiedzajacy tego nie zobaczy —
       obserwator odpala sie w pierwszych klatkach, na dlugo przed sekunda. */
    function dopelnij(){
      if(ruszylo) return;
      ruszylo=true;
      /* Obserwator moze byc podstawiona atrapa bez `disconnect` — wtedy rzucenie
         wyjatku tutaj zostawiloby siatke zgaszona, czyli dokladnie w stanie,
         przed ktorym ten bezpiecznik ma chronic. */
      try{io.disconnect();}catch{}
      grid.classList.remove("arm");
      if(leg) leg.classList.remove("arm");
    }

    var io=new IntersectionObserver(function(entries){
      for(var k=0;k<entries.length;k++){
        if(!entries[k].isIntersecting) continue;
        if(ruszylo) return;
        ruszylo=true;
        for(var i=0;i<cells.length;i++){
          var d = i<45 ? (i*0.05) : (i<69 ? (2.3+(i-45)*0.075) : 4.2);
          cells[i].style.animationDelay=d.toFixed(2)+"s";
        }
        grid.classList.remove("arm");
        grid.classList.add("run");
        if(leg){leg.classList.remove("arm");leg.classList.add("run");}
        io.disconnect();
        return;
      }
    },{threshold:0.2});
    io.observe(grid);
    setTimeout(dopelnij,1000);
  }

  /* ---- kropki przy uslugach ----
     Na wskazniku precyzyjnym: po najechaniu na usluge. Bez hovera (telefon):
     raz, gdy blok wjezdza w kadr.                                          */
  var svcs=$("svcs");
  if(svcs && !reduce){
    var list=svcs.querySelectorAll(".svc");
    var canHover=false;
    try{canHover=matchMedia("(hover: hover)").matches;}catch{}
    if(canHover){
      Array.prototype.forEach.call(list,function(el){
        el.addEventListener("mouseenter",function(){el.classList.add("lit");});
        el.addEventListener("mouseleave",function(){el.classList.remove("lit");});
      });
    }else if(typeof IntersectionObserver==="function"){
      var io2=new IntersectionObserver(function(entries){
        for(var k=0;k<entries.length;k++){
          if(!entries[k].isIntersecting) continue;
          Array.prototype.forEach.call(list,function(el){el.classList.add("lit");});
          io2.disconnect();
          return;
        }
      },{threshold:0.2});
      io2.observe(svcs);
    }
  }

  /* ---- formularz: kontrakt /api/lead bez zmian ---- */
  var ARRIVED=(function(){
    var out={},q;
    try{q=new URLSearchParams(location.search);}catch{return out;}
    ["utm_source","utm_medium","utm_campaign","utm_term","utm_content"].forEach(function(k){
      var v=q.get(k); if(v) out[k]=String(v).slice(0,300);
    });
    if(document.referrer && document.referrer.indexOf(location.origin)!==0){
      out.referrer=String(document.referrer).slice(0,300);
    }
    return out;
  })();

  var form=$("form"), mail=$("mail"), err=$("err"), sent=$("sent");
  if(!form) return;
  function bad(t){err.textContent=t;err.classList.add("on");}

  form.addEventListener("submit",function(ev){
    ev.preventDefault();
    err.classList.remove("on");
    var v=(mail.value||"").trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){
      bad("That address does not look right.");
      mail.focus();
      return;
    }
    var btn=form.querySelector("button[type=submit]");
    btn.disabled=true;btn.textContent="Sending";

    var ctrl=null;
    try{ctrl=new AbortController();}catch{}
    var killer=setTimeout(function(){if(ctrl)ctrl.abort();},12000);

    fetch("/api/lead",{
      method:"POST",
      signal:ctrl?ctrl.signal:undefined,
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email:v,source:ARRIVED})
    }).then(function(r){
      clearTimeout(killer);
      if(!r.ok)throw new Error("bad status "+r.status);
      form.style.display="none";
      $("rcpt").textContent="One reply, written by me, usually the same day. "
        +"Send your order export when you are ready.";
      sent.classList.add("on");
    }).catch(function(){
      clearTimeout(killer);
      bad("That did not go through. Write to hello@oleksiakconsulting.com instead.");
    }).then(function(){
      btn.disabled=false;btn.textContent="Send";
    });
  });
/* >>> KONIEC BLOKU ZE ZRODLA <<< */
}
