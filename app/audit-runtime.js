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
