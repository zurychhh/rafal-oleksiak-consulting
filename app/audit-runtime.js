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

  /* Skad przyszedl odwiedzajacy. Te same pola sa wymienione w polityce
     prywatnosci: utm_* i referrer, nic wiecej.                          */
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

  /* ---- The second number --------------------------------------------------
     Dwie odpowiedzi, obie prawidlowe. "I don't know" nie jest ucieczka: to jest
     ta odpowiedz, ktora zgadza sie z rzeczywistoscia, i tekst pod spodem mowi
     to wprost. Wpisana liczba tez nie jest wpadka — dostaje przekreslenie,
     zeby pokazac, czym jest (pamiecia), a nie zeby kogokolwiek zlapac.
     Zadnego timera, zadnej petli animacji, zero bibliotek.                    */
  (function(){
    var n1=$("n1"), n2=$("n2"), q2=$("q2"), lab2=$("lab2"),
        note1=$("note1"), note2=$("note2"), qend=$("qend"), dunno=$("dunno");
    if(!n1||!n2) return;

    function digits(v){return String(v||"").replace(/[^0-9]/g,"").slice(0,3);}
    function clean(el){el.value=digits(el.value);}
    n1.addEventListener("input",function(){clean(n1);});
    n2.addEventListener("input",function(){clean(n2);});

    function open2(){
      var v=digits(n1.value);
      if(!v||Number(v)<1) return false;
      n1.value=v;
      note1.classList.add("on");
      q2.classList.add("on");
      return true;
    }
    n1.addEventListener("blur",open2);
    n1.addEventListener("keydown",function(e){
      if(e.key!=="Enter") return;
      e.preventDefault();
      if(open2()) n2.focus();
    });

    function said(){
      var v=digits(n2.value);
      if(!v||Number(v)<1) return;
      n2.value=v;
      n2.classList.add("said");
      n2.classList.remove("blank");
      lab2.textContent="how do you know?";
      note2.textContent="That was memory, not data.";
      note2.classList.add("on");
      qend.classList.add("on");
    }
    n2.addEventListener("blur",said);
    n2.addEventListener("keydown",function(e){
      if(e.key==="Enter"){e.preventDefault();said();}
    });

    dunno.addEventListener("click",function(){
      n2.value="";
      n2.classList.remove("said");
      n2.classList.add("blank");
      note2.textContent="Exactly. That number is in no system you have open.";
      note2.classList.add("on");
      qend.classList.add("on");
    });
  })();

  var form=$("form"), mail=$("mail"), msg=$("msg"), err=$("err"), sent=$("sent");
  if(!form) return;

  function bad(t){err.textContent=t;err.classList.add("on");}

  form.addEventListener("submit",function(ev){
    ev.preventDefault();
    err.classList.remove("on");
    var v=(mail.value||"").trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){
      bad("That address does not look right. Check it and send again.");
      mail.focus();
      return;
    }
    var btn=form.querySelector("button[type=submit]");
    btn.disabled=true;btn.textContent="Sending";

    /* Sygnal przerwania: bez tego wiszace zadanie zostawia przycisk
       wylaczony i odwiedzajacy nie ma jak sprobowac ponownie.          */
    var ctrl=null;
    try{ctrl=new AbortController();}catch{}
    var killer=setTimeout(function(){if(ctrl)ctrl.abort();},12000);

    fetch("/api/lead",{
      method:"POST",
      signal:ctrl?ctrl.signal:undefined,
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        email:v,
        message:(msg&&msg.value||"").trim().slice(0,140)||undefined,
        source:ARRIVED
      })
    }).then(function(r){
      clearTimeout(killer);
      if(!r.ok)throw new Error("bad status "+r.status);
      form.style.display="none";
      $("rcpt").textContent="I read every one myself and reply by hand, usually the same day. "
        +"Send your order export when you are ready — date, customer, product, quantity.";
      sent.classList.add("on");
    }).catch(function(){
      clearTimeout(killer);
      /* Odwiedzajacy zrobil swoje — nigdy nie gubimy go na 500.        */
      bad("That did not go through. Write to me directly at hello@oleksiakconsulting.com and I will reply by hand.");
    }).then(function(){
      btn.disabled=false;btn.textContent="Send";
    });
  });
/* >>> KONIEC BLOKU ZE ZRODLA <<< */
}
