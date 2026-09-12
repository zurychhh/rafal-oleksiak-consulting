/* --------------------------------------------------------------------------
   Szew AI. W artefakcie Claude wstrzykuje window.claude sam; tutaj podstawiamy
   ten sam interfejs, kierujacy na /api/label. Panele chowaja sie dalej same,
   gdy endpoint nie jest skonfigurowany — kod ponizej jest nietkniety.
   -------------------------------------------------------------------------- */
(function(){
  "use strict";
  if(window.claude && window.claude.use) return;
  function call(prompt){
    return fetch("/api/label",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({prompt:String(prompt)})
    }).then(function(r){
      return r.json().catch(function(){throw {code:"invalid_json"};})
        .then(function(j){
          if(!r.ok) throw {code:(j&&j.code)||"refused"};
          return j;
        });
    });
  }
  window.claude={
    use:function(name){
      if(name!=="sample") return Promise.resolve(null);
      return fetch("/api/label",{method:"GET"})
        .then(function(r){ return r.ok ? {json:function(p){return call(p);}} : null; })
        .catch(function(){ return null; });
    }
  };
})();



(function(){
  "use strict";
  var $=function(id){return document.getElementById(id);};


  /* ============ katalog ============
     units/unit sa faktem z etykiety. perDay pochodzi WYLACZNIE z instrukcji producenta,
     wklejonej nizej, i niesie ze soba cytat. Gdy instrukcja nie mowi nic o dobie,
     perDay jest null i dni zapasu po prostu nie istnieja — to nie jest brak do wypelnienia. */
  var FAM=[
    {k:"col", t:"Colostrum Premium 40% IgG 120 kaps.",              units:120,  unit:"kaps.", price:149,
     dir:"Zalecane spozycie: 2 kapsulki dziennie, popic woda.",      target:78,
     vars:[["Colostrum Premium 40% IgG 60 kaps.",79],
           ["Colostrum Premium 40% IgG 240 kaps.",269]]},
    {k:"dog", t:"Karma sucha dla psa doroslego 12 kg, srednie rasy", units:12000,unit:"g",     price:189,
     dir:"Dzienna porcja ok. 300 g dla psa o masie 15-20 kg.",       target:44,
     vars:[["Karma sucha dla psa doroslego 3 kg, srednie rasy",59]]},
    {k:"whe", t:"Odzywka bialkowa WPC 80 - 2270 g, wanilia",         units:2270, unit:"g",     price:219,
     dir:"1 miarke (30 g) rozpuscic w wodzie, 1-2 razy dziennie.",   target:52,
     vars:[["Odzywka bialkowa WPC 80 - 900 g, wanilia",99]]},
    {k:"gel", t:"Zel pod prysznic 400 ml - zestaw 3 sztuki",         units:1200, unit:"ml",    price:69,
     dir:"Naniesc na wilgotna skore, spienic i splukac.",            target:63,
     vars:[["Zel pod prysznic 400 ml",29]]},
    {k:"lau", t:"Kapsulki do prania Universal 60 szt.",              units:60,   unit:"szt.",  price:59,
     dir:"Jedna kapsulke wlozyc do bebna przed praniem.",            target:41,
     vars:[["Kapsulki do prania Universal 15 szt.",23]]},
    {k:"gif", t:"Zestaw prezentowy - swieca zapachowa",              units:null, unit:"",      price:129,
     dir:"Swieca sojowa 180 g, czas palenia ok. 40 godzin.",         target:0, vars:[]}
  ]; /* FAM jest KATALOGIEM PROBKI, nie katalogiem narzedzia. CAT jest katalogiem
     narzedzia i rosnie z tego, co faktycznie stoi we wklejonym eksporcie — bez tego
     "wlasny eksport" pokazywalby cudze szesc rodzin albo nic.                      */
  var CAT={};
  FAM.forEach(function(F){CAT[F.k]=F;});
  var DOSE={col:{perDay:2,q:"2 kapsulki dziennie"},
            dog:{perDay:300,q:"ok. 300 g dla psa o masie 15-20 kg"},
            whe:{perDay:45,q:"1 miarke (30 g) ... 1-2 razy dziennie"},
            gel:{perDay:null,q:""},
            lau:{perDay:null,q:""},
            gif:{perDay:null,q:""}};

  /* ============ przykladowy eksport ============
     Generowany deterministycznie, zeby ekran otwieral sie policzony, a nie pusty.
     Kazda liczba nizej jest liczona z TYCH linii — nic nie jest wpisane na sztywno. */
  var seed=20260912;
  function rnd(){seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff;}
  function makeExport(){
    var rows=[],f,i,j,c=0;
    for(f=0;f<FAM.length;f++){
      var F=FAM[f], buyers=26+f*3;
      for(i=0;i<buyers;i++){
        c++;
        var id="c-"+(1000+c);
        var day=Math.floor(rnd()*70);
        /* Rzecz kupowana raz zostaje kupiona raz. Katalog nie sklada sie z samych powrotow. */
        var n=F.target?1+Math.floor(rnd()*3.4):(rnd()<0.12?2:1);
        for(j=0;j<n;j++){
          var d=new Date(2026,0,5); d.setDate(d.getDate()+day);
          /* Jedna rodzina niesie kilka gramatur — i to wlasnie porownanie ceny za
             jednostke MIEDZY NIMI wylapuje zla ekstrakcje. Bez wariantow nie ma czego
             walidowac, bo pojedynczy wiersz nie ma sie z czym rozjechac.              */
          var V=(F.vars&&F.vars.length&&rnd()<0.45)
                ? F.vars[Math.floor(rnd()*F.vars.length)] : null;
          rows.push([d.toISOString().slice(0,10),id,V?V[0]:F.t,"1",
                     (V?V[1]:F.price).toFixed(2)]);
          /* odstep losowany wokol mediany rodziny, z ogonem w prawo */
          day+=Math.max(6,Math.round((F.target||120)*(0.72+rnd()*0.30+(rnd()<0.18?rnd()*0.55:0))));
          if(day>300) break;
        }
      }
    }
    rows.sort(function(a,b){return a[0]<b[0]?-1:a[0]>b[0]?1:0;});
    return rows.map(function(r){return r.join(", ");}).join("\n");
  }

  function parseExport(txt){
    return txt.split("\n").map(function(l){
      var p=l.split(",").map(function(x){return x.trim();});
      if(p.length<5) return null;
      var d=Date.parse(p[0]); if(isNaN(d)) return null;
      /* Tytul sam bywa z przecinkiem, wiec sklejamy srodek: data, klient, ...tytul..., szt, cena. */
      return {d:d/86400000,c:p[1],t:p.slice(2,p.length-2).join(", "),
              price:parseFloat(p[p.length-1])||null};
    }).filter(Boolean);
  }
  function key(title){
    var t=title.toLowerCase();
    for(var i=0;i<FAM.length;i++) if(t.indexOf(FAM[i].t.slice(0,14).toLowerCase())===0) return FAM[i].k;
    return t.slice(0,18);
  }
  function med(a){a=a.slice().sort(function(x,y){return x-y;});
    if(!a.length) return null;
    var h=a.length/2;
    return a.length%2?a[Math.floor(h)]:Math.round((a[h-1]+a[h])/2);}
  function pct(a,p){a=a.slice().sort(function(x,y){return x-y;});
    if(!a.length) return null; return a[Math.min(a.length-1,Math.floor(a.length*p))];}

  var OBS={}, VARS={};
  function observe(){
    var rows=parseExport($("orders").value), by={};
    OBS={}; VARS={};
    rows.forEach(function(r){
      var k=key(r.t), id=k+"|"+r.c;
      if(!CAT[k]) CAT[k]={k:k,t:r.t,units:null,unit:"",price:r.price,dir:""};
      /* Kazda gramatura tej samej rodziny osobno, z cena faktycznie zaplacona.
         To jest material na walidacje ceny jednostkowej W OBREBIE TYPU PRODUKTU. */
      var V=(VARS[k]=VARS[k]||{});
      if(!V[r.t]) V[r.t]={t:r.t,price:r.price,n:0};
      if(r.price) V[r.t].price=r.price;
      V[r.t].n++;
      (by[id]=by[id]||[]).push(r.d);
    });
    Object.keys(by).forEach(function(id){
      var k=id.split("|")[0], ds=by[id].sort(function(a,b){return a-b;}), i;
      for(i=1;i<ds.length;i++){
        (OBS[k]=OBS[k]||{gaps:[],buyers:0}).gaps.push(Math.round(ds[i]-ds[i-1]));
      }
      if(!OBS[k]) OBS[k]={gaps:[],buyers:0};
      OBS[k].buyers++;
    });
  }

  /* ============ walidacja ceny jednostkowej w obrebie typu produktu ============
     Cena za jednostke porownana MIEDZY gramaturami tej samej rodziny — nie miedzy
     rodzinami, bo karma po 0,016 zl/g i odzywka po 0,096 zl/g roznia sie szesciokrotnie
     zupelnie legalnie. Wewnatrz jednej rodziny taka rozbieznosc nie jest legalna: wieksze
     opakowanie bywa tansze na jednostke o kilkanascie procent, nigdy o rzad wielkosci.
     Wiersz odstajacy oznacza zwykle zle odczytana gramature, a nie dziwna cene — i
     wylapuje to bez zadnego modelu, z samego tytulu i paragonu.                      */
  function unitPrices(k,reader){
    var V=VARS[k]; if(!V) return null;
    var list=[];
    Object.keys(V).forEach(function(t){
      var u=reader?reader(t):null, p=V[t].price;
      if(u&&u.v>0&&p>0) list.push({t:t,per:p/u.v,u:u.u,units:u.v,price:p,n:V[t].n});
    });
    if(list.length<2) return null;
    var per=list.map(function(x){return x.per;}).sort(function(a,b){return a-b;});
    var mid=per[Math.floor(per.length/2)];
    var bad=list.filter(function(x){return x.per>mid*2.2||x.per<mid/2.2;});
    return {list:list,mid:mid,lo:per[0],hi:per[per.length-1],bad:bad,unit:list[0].u};
  }
  /* Jedna rodzina, jeden format — inaczej 0,983 obok 1,53 czyta sie jak dwie skale. */
  function zl(p,ref){var r=(ref==null?p:ref);
    return (r>=0.5?p.toFixed(2):p.toFixed(3)).replace(".",",");}

  /* Dawka z przedzialu ("1-2 razy dziennie" -> 45 g) jest srodkiem, nie odczytem, i dwoch
     czytelnikow na trzech nazwalo ja wymyslona. Test jest doslowny i dlatego pewny: czy ta
     liczba stoi w zacytowanych slowach. Stoi - to odczyt. Nie stoi - to wyliczenie i ekran
     ma to powiedziec. Zadnej liczby to nie zmienia; zmienia to, czym sie ona podaje.     */
  function derived(D){
    if(!D||!D.perDay||!D.q) return false;
    return String(D.q).replace(/[.,]/g," ").split(/\s+/)
      .indexOf(String(D.perDay))<0;
  }

  /* dni zapasu istnieja tylko wtedy, gdy etykieta podaje dobowa ilosc */
  function packDays(F){var D=DOSE[F.k];
    return (D&&D.perDay&&F.units>0)?Math.round(F.units/D.perDay):null;}

  /* Jedna os dla calego katalogu. Poprzednia wersja skalowala kazdy wiersz do siebie,
     wiec szesc par slupkow wygladalo identycznie i pod kazdym musialo stac zdanie
     tlumaczace obrazek. Na wspolnej osi rozjazd widac z POZYCJI i zdania sa zbedne. */
  function paint(){
    observe();
    var rows=[], maxd=1;
    Object.keys(OBS).map(function(k){return CAT[k];}).filter(Boolean).forEach(function(F){
      var o=OBS[F.k]||{gaps:[],buyers:0}, m=med(o.gaps), pd=packDays(F);
      F._m=m; F._lo=pct(o.gaps,0.25); F._hi=pct(o.gaps,0.75); F._pd=pd;
      F._n=o.gaps.length; F._thin=o.gaps.length<8;
      if(pd) maxd=Math.max(maxd,pd);
      if(m&&!F._thin) maxd=Math.max(maxd,m);
      rows.push(F);
    });
    /* Najwiekszy rozjazd na gorze, wiersze bez wyniku na dole. Czytelnik ma dwie minuty. */
    var tier=function(F){return F._thin?0:(F._pd&&F._m?2:1);};
    rows.sort(function(a,b){
      if(tier(a)!==tier(b)) return tier(b)-tier(a);
      if(tier(a)===2) return Math.abs(b._m-b._pd)-Math.abs(a._m-a._pd);
      return (b._m||0)-(a._m||0);
    });
    var AX=Math.ceil(maxd*1.08/30)*30, step=30/AX*100;
    var grid="repeating-linear-gradient(90deg,var(--rule) 0 1px,transparent 1px "+step+"%)";
    var at=function(d){return (d/AX*100);};

    var ax='<span class="al">Product</span><span class="ax">';
    for(var t=0;t<=AX;t+=30) ax+='<b style="left:'+at(t)+'%">'+t+'</b>';
    ax+='</span><span class="ar">days later</span>';
    $("axis").innerHTML=ax;

    var lead=null, best=0, thin=0, checked=0, flagged=0;
    $("plot").innerHTML=rows.map(function(F){
      var pd=F._pd, m=(F._m&&!F._thin)?F._m:null, marks="", d="", cls="";
      if(F._thin) thin++;
      if(pd&&m){
        var g=m-pd;
        d=(g>0?"+":"")+g; cls=g>=5?" late":(g<=-5?" early":"");
        if(Math.abs(g)>Math.abs(best)){best=g;lead=F;}
      }
      /* Dlugosc, nie pozycja. Kropka na osi wymaga przeczytania osi; dlugosc paska
         czyta sie sama, a wspolna skala pozwala porownac rodziny miedzy soba.      */
      marks+=pd?'<i class="b1" style="width:'+at(pd)+'%"></i>'
               :'<i class="b0" style="width:100%"></i>';
      marks+=m ?'<i class="b2" style="width:'+at(m)+'%"></i>'
               :'<i class="b0" style="width:100%"></i>';
      /* Dwoch czytelnikow na trzech, dwa pomiary z rzedu: "1-2 razy dziennie" wraca jako
         twarde 45 g i dni zapasu stoja na srodku przedzialu. Dawka nadal jest z etykiety
         i tylko z niej — ale wiersz ma powiedziec, ze to srodek, a nie odczyt.        */
      if(pd&&m&&derived(DOSE[F.k])) d+='<s>not on the pack</s>';
      if(!pd&&m) d='<s>no dose</s>';
      if(!m) d="";
      /* "median or mean? outliers?" — szesc odczytow na szesc dzisiaj. Kwartyle stoja
         przy liczbie odstepow, bez nowej kolumny i bez nowego zdania.                */
      var spread=(m&&F._lo&&F._hi)?(" &middot; half "+F._lo+"&ndash;"+F._hi):"";
      /* Sprawdzone bez modelu, z tytulu i z ceny zaplaconej. Zgodne gramatury sa
         cicha zielona linia; odstajaca krzyczy, bo to ona psuje dni zapasu.      */
      var U=unitPrices(F.k,plainUnits), price="";
      if(U){ checked++;
        price=U.bad.length
          ? ' &middot; <b style="color:var(--acc)">'+zl(U.bad[0].per,U.mid)+' z&#322;/'+U.unit
            +' against '+zl(U.mid,U.mid)+' &mdash; pack size misread</b>'
          : ' &middot; '+U.list.length+' packs, '+zl(U.lo,U.mid)+'&ndash;'+zl(U.hi,U.mid)+' z&#322;/'+U.unit;
        if(U.bad.length) flagged++;
      }
      return '<div class="pr"><span class="pn">'+esc(shortName(F))
        +'<s>'+F._n+' gaps'+(F._thin?" &middot; too few":spread)+price+'</s></span>'
        +'<span class="pt" style="background-image:'+grid+'">'+marks+'</span>'
        +'<span class="pd'+cls+'">'+d+'</span></div>';
    }).join("");
    /* Walidacja ma byc widoczna wtedy, kiedy przechodzi, a nie tylko kiedy krzyczy.
       Inaczej czytelnik nie wie, ze cokolwiek zostalo sprawdzone.                  */
    if($("chk")) $("chk").innerHTML = checked
      ? (flagged?'<b style="color:var(--acc)">'+flagged+' of '+checked
                 +' families: price per unit says a pack size is wrong</b>'
                : checked+' families cross-checked on price per unit')
      : "";
    verdict(lead);
  }

  function verdict(F){
    if(!F){
      /* Brak etykiety nie znaczy brak wyniku. Sama mediana odstepu jest interwalem
         subskrypcji i nie wymaga od sklepu niczego poza eksportem, ktory juz wklei. */
      var best=null;
      Object.keys(OBS).forEach(function(k){var C=CAT[k];
        if(C&&C._m&&!C._thin&&(!best||C._n>best._n)) best=C;});
      $("verdict").innerHTML=best
        ? "<b>"+esc(shortName(best))+"</b>: your buyers come back every <b>"+best._m
          +" days</b>, half of them between "+best._lo+" and "+best._hi+". That is the "
          +"subscription interval, before any label is read. Paste the maker&rsquo;s directions "
          +"and the days of supply line up beside it."
        : (Object.keys(OBS).length
        ? "Read and counted, but no family here has enough repeat orders yet to give a median."
        : "Nothing to read yet. Paste an export: date, customer, product title, quantity, price.");
      $("four").innerHTML="";$("wb").textContent="";$("wn").textContent="";return;}
    var g=F._m-F._pd;
    $("verdict").innerHTML="<b>"+esc(shortName(F))+"</b> drifts furthest: "+F._pd
      +" on the label, "+F._m+" in your data. "+(g>0
        ? "They skip doses or they bought ahead &mdash; either way a "+F._pd
          +"-day interval refills a cupboard that is not empty."
        : g<0
        ? "They restock before the pack can be out, so the bigger size is the offer and the "
          +"reminder is not the problem."
        : "Label and behaviour agree, so this one you set from the pack and leave alone.");
    var lo=F._lo, hi=F._hi, m=F._m, u=F.unit.replace(/\.$/,"");
    var need=Math.ceil(m/F._pd);
    var n=esc(shortName(F));
    $("four").innerHTML=
      card("Paid","Exclude "+lo+" days",n+" buyers, out of prospecting")
     +card("Subscription",m+" days, not 30","new subscribers only")
     +card("CRM","Send day "+Math.max(1,lo-7)+"&ndash;"+hi,"window, not a date")
     +card("Store &middot; PDP","Show "+(need>1?need*F.units:F.units)+" "+esc(u),
           "covers one full cycle");
    /* Dwoch czytelnikow na trzech: "1-2 razy dziennie" wraca jako twarde 45 g i to jest
       ta sama choroba, przeciw ktorej to narzedzie ma regule. Dawka nadal pochodzi
       wylacznie z etykiety — ale jesli etykieta daje przedzial, ekran ma to powiedziec. */
    var rng=derived(DOSE[F.k]);
    $("wb").textContent=F._pd+" days at "+DOSE[F.k].perDay+" "+F.unit+" a day"
      +(rng?", worked out from the range on the pack.":".");
    $("wn").innerHTML="&ldquo;"+esc(DOSE[F.k].q)+"&rdquo; &mdash; the maker."
      +(rng?" That daily figure is not printed there; it is the middle of the range."
           :" No date, no free text.");
  }
  function shortName(F){return F.t.split(/[,0-9]/)[0].trim();}
  function shortName1(t){return t.split(/[,0-9]/)[0].trim()||t;}
  function card(b,s,e){return '<div><b>'+b+'</b><span>'+s+'</span>'
    +(e?'<em>'+e+'</em>':"")+'</div>';}

  function esc(t){return String(t==null?"":t)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

  /* ============ zrodlo danych ============
     Dwa stany, jedno pole. Probka jest nazwana probka, bo dziesieciu czytelnikow na
     dwunastu rozpoznalo ja jako cudzy eksport i przestawalo czytac. Wlasny eksport
     wchodzi tu, przed wynikiem, i nie wymaga niczego poza plikiem, ktory sklep juz ma. */
  var SAMPLE_TXT=makeExport(), mine=false;
  var HELP_S="";
  var HELP_M="Shopify: <b>Orders &rarr; Export &rarr; plain CSV</b>, then paste it here. Any file "
    +"works that carries date, customer, product title, quantity, price. Parsed in this browser; "
    +"only the product titles are ever sent to a model, never a customer row.";
  function srcStat(){
    var rows=parseExport($("orders").value), fams={}, n=0;
    rows.forEach(function(r){fams[key(r.t)]=1;n++;});
    var f=Object.keys(fams).length;
    $("sstat").innerHTML = n
      ? "<b>"+n+"</b> orders &middot; <b>"+f+"</b> famil"+(f===1?"y":"ies")
        +" &middot; "+(mine?"your export":"demo data")
      : (mine?"waiting for your export":"nothing to read");
  }
  function setSrc(m){
    mine=m;
    $("srcS").setAttribute("aria-pressed",m?"false":"true");
    $("srcM").setAttribute("aria-pressed",m?"true":"false");
    $("shelp").innerHTML=m?HELP_M:HELP_S; $("shelp").hidden=!m;
    $("orders").value=m?"":SAMPLE_TXT;
    paint(); doseSkeleton(); srcStat();
    if(m){$("orders").focus();}
  }
  $("srcS").onclick=function(){setSrc(false);};
  $("srcM").onclick=function(){setSrc(true);};

  /* Puste pole na instrukcje po wklejeniu wlasnego eksportu to slepy zaulek.
     Szkielet z nazwami rodzin z EKSPORTU zamienia je w formularz do uzupelnienia. */
  var dosesTouched=false;
  $("doses").addEventListener("input",function(){dosesTouched=true;});
  function doseSkeleton(){
    if(dosesTouched) return;
    $("doses").value=Object.keys(OBS).map(function(k){
      var F=CAT[k]; if(!F) return null;
      return shortName(F)+" | "+(mine?"":F.dir);
    }).filter(Boolean).join("\n");
  }
  $("orders").value=SAMPLE_TXT;
  $("orders").addEventListener("input",function(){
    if(!mine&&$("orders").value!==SAMPLE_TXT){mine=true;
      $("srcS").setAttribute("aria-pressed","false");
      $("srcM").setAttribute("aria-pressed","true");
      $("shelp").innerHTML=HELP_M;$("shelp").hidden=false;}
    paint(); doseSkeleton(); srcStat();
  });
  paint(); doseSkeleton(); srcStat();

  /* ==================== AI ==================== */
  var COPY={
    not_granted:"Claude is not allowed for this page in your view.",
    sampling_disabled:"Claude is not available on this account.",
    rate_limited:"Too many requests just now — give it a minute.",
    cancelled:"Stopped.",
    invalid_json:"Claude answered in the wrong shape. Try again.",
    refused:"Claude declined that one."
  };
  function oops(e){return COPY[e&&e.code]||"That did not go through. Try again.";}
  var SAMPLE=null;
  ["ai1","ai2"].forEach(function(id){$(id).style.display="none";});
  if(window.claude&&claude.use) claude.use("sample").then(function(fn){
    if(!fn) return; SAMPLE=fn;
    ["ai1","ai2"].forEach(function(id){$(id).style.display="grid";});
  }).catch(function(){});

  function run(btn,stat,work){
    btn.disabled=true;stat.textContent="Thinking…";
    work().then(function(){if(stat.textContent==="Thinking…")stat.textContent="";},
                function(e){stat.textContent=oops(e);})
      .then(function(){btn.disabled=false;});
  }
  function row(k,v,bad){
    return '<div class="orow"><span class="k">'+k+'</span>'
      +'<span class="v'+(bad?" no":"")+'">'+v+'</span></div>';
  }
  function flash(ids){ids.forEach(function(id){var el=$(id);if(!el)return;
    el.classList.add("wrote");setTimeout(function(){el.classList.remove("wrote");},1800);});}

  /* Czytanie tytulu bez modelu. Sluzy do jednego: zlapac model na rozjezdzie.
     Konwersja jednostek jest najslabsza strona modeli, wiec nie ufamy jej na slowo. */
  function plainUnits(t){
    var s=t.toLowerCase().replace(/,/g,"."), m, best=null;
    var re=/(\d+(?:\.\d+)?)\s*(kaps|kapsul\w*|szt|tabl\w*|ml|l|g|kg)\b/g;
    while((m=re.exec(s))){
      var v=parseFloat(m[1]), u=m[2];
      if(u==="kg"){v*=1000;u="g";} if(u==="l"){v*=1000;u="ml";}
      if(u.indexOf("kaps")===0)u="kaps."; if(u.indexOf("tabl")===0)u="szt."; if(u==="szt")u="szt.";
      if(!best||v>best.v) best={v:v,u:u};
    }
    if(!best) return null;
    var pack=s.match(/zestaw\s*(\d+)|(\d+)\s*[x×]\s*\d/);
    if(pack){var n=parseInt(pack[1]||pack[2],10); if(n>1&&n<40) best.v*=n;}
    return best;
  }

  $("g1").onclick=function(){
    var titles=[],seen={},rows=parseExport($("orders").value);
    rows.forEach(function(r){if(!seen[r.t]){seen[r.t]=r.price;titles.push(r.t);}});
    titles=titles.slice(0,12);
    if(!titles.length) return;
    /* Trzykrotna ekstrakcja. Konwersja jednostek jest najslabsza strona modeli i
       pojedynczy odczyt nie ma sie z czym rozjechac. Trzy niezalezne odczyty tego
       samego tytulu: zgoda dwoch z trzech jest wynikiem, brak zgody jest flaga.   */
    var ASK=function(){
      return SAMPLE.json(
        "You are reading ecommerce product titles for consumable goods, with the price paid. "
        +"Reply with ONLY a JSON array, one object per title, in the same order, each: "
        +"{\"units\":number|null,\"unit\":string,\"confidence\":\"high\"|\"low\",\"note\":string}. "
        +"units = everything inside the pack, so a multipack is the sum of its parts and a title "
        +"reading 400 ml in a set of 3 is 1200. unit = the pack's own measure exactly as the title "
        +"writes it (kaps., g, ml, szt.); convert kg to g and l to ml and say so in the note. "
        +"Do NOT return a dose, a daily rate, a serving or a number of days, and do not reason "
        +"about any of them: how much leaves the pack in a day is not in a title, and guessing it "
        +"is the single failure this tool exists to prevent. "
        +"confidence = \"low\" whenever the title carries more than one number and you had to "
        +"choose between them, or does not state the quantity outright at all; \"high\" only when "
        +"one quantity is stated plainly. note = max eight words, naming which words in the title "
        +"you took the number from, or what is missing. Titles, each with the price paid in zloty:\n"
        +titles.map(function(t){return t+"  ["+(seen[t]||"?")+" zl]";}).join("\n"),
        {modelTier:"quick"}
      ).then(function(res){return Array.isArray(res)?res:(res&&res.items)||[];});
    };
    run($("g1"),$("s1"),function(){
      return Promise.all([ASK(),ASK(),ASK()]).then(function(reads){
        var out=[], byTitle={};
        titles.forEach(function(t,i){
          /* Zgoda dwoch z trzech jest odczytem. Trzy rozne liczby to brak odczytu. */
          var vals=reads.map(function(a){var x=(a[i]||{}).units;
            return (typeof x==="number"&&x>0)?x:null;});
          var tally={}, win=null, wn=0;
          vals.forEach(function(v){if(v===null)return;
            tally[v]=(tally[v]||0)+1; if(tally[v]>wn){wn=tally[v];win=v;}});
          var agree=(wn>=2);
          var r=Object.assign({},reads[0][i]||{});
          if(agree) r.units=win; else if(wn<2) r.units=null;
          var p=plainUnits(t), disagree=false;
          if(r.units&&p&&Math.abs(r.units-p.v)>Math.max(1,p.v*0.01)) disagree=true;
          var lowConf=reads.some(function(a){
            return String((a[i]||{}).confidence).toLowerCase()==="low";});
          var split=!agree&&vals.some(function(v){return v!==null;});
          var low=lowConf||disagree||split||!r.units;
          var per=(r.units&&seen[t])?(seen[t]/r.units):null;
          out.push({t:t,r:r,low:low,disagree:disagree,split:split,vals:vals,per:per,p:p});
          byTitle[t]={v:r.units,u:r.unit};
          var F=null; Object.keys(CAT).forEach(function(k){if(CAT[k].t===t)F=CAT[k];});
          if(F&&r.units>0){F.units=r.units; if(r.unit)F.unit=String(r.unit).slice(0,6);}
        });
        /* Ta sama walidacja co na wykresie, tylko czytana modelem zamiast regexem. */
        var famBad={}, famSeen={};
        Object.keys(VARS).forEach(function(k){
          var U=unitPrices(k,function(t){var b=byTitle[t];
            return (b&&b.v>0)?{v:b.v,u:b.u||""}:null;});
          if(!U) return; famSeen[k]=U;
          U.bad.forEach(function(x){famBad[x.t]=[x,U];});
        });
        out.forEach(function(x){if(famBad[x.t]) x.low=true;});
        /* Wiersze niepewne ida na gore. Na dole nikt ich nie zatwierdza. */
        /* Piec poprawnych wierszy nikogo nie interesuje. Pokazujemy wylacznie te,
           ktore czlowiek musi obejrzec; reszta jest jedna liczba w statusie.      */
        var bad=out.filter(function(x){return x.low;});
        $("o1").innerHTML=bad.map(function(x){
          var right=x.r.units?(x.r.units+" "+esc(x.r.unit||"")):"three reads disagree";
          var note=famBad[x.t]
            ? (zl(famBad[x.t][0].per,famBad[x.t][1].mid)+" z\u0142/"+famBad[x.t][1].unit
               +" against "+zl(famBad[x.t][1].mid,famBad[x.t][1].mid)+" in its own family")
            : x.split ? ("read "+x.vals.map(function(v){return v===null?"\u2014":v;}).join(" / "))
            : x.disagree ? ("title reads "+x.p.v+" "+x.p.u)
            : esc(x.r.note||"");
          return row(esc(shortName1(x.t))+' <span style="color:var(--soft)">&mdash; '+note+'</span>',
            right,true);
        }).join("");
        var nf=Object.keys(famSeen).length;
        $("s1").textContent=(bad.length
          ? bad.length+" of "+out.length+" need your eye."
          : "All "+out.length+" clean.")
          +" Read three times each"
          +(nf?"; "+nf+" famil"+(nf===1?"y":"ies")+" cross-checked on price per unit.":".");
        paint(); flash(["plot"]);
      });
    });
  };

  $("g2").onclick=function(){
    var lines=$("doses").value.split("\n").map(function(x){return x.trim();})
      .filter(function(x){return x.length;}).slice(0,12);
    if(!lines.length) return;
    run($("g2"),$("s2"),function(){
      return SAMPLE.json(
        "Below are the directions printed on consumer product packs, one product per line, in the "
        +"form: product | directions. Reply with ONLY a JSON array, one object per line, in the "
        +"same order, each: {\"perDay\":number|null,\"doseUnit\":string,\"quote\":string,"
        +"\"note\":string}. perDay = how much of the product is used in ONE DAY, in the unit the "
        +"directions themselves use, and taken ONLY from the words on that line. It is a single "
        +"JSON number, never a range, never a string: where the directions give a range or a "
        +"number of times a day, multiply out and return the MIDPOINT as a number, and let the "
        +"quote carry the range. quote = the exact "
        +"run of words from that line which carries the amount, copied character for character, no "
        +"paraphrase. If nothing on the line states an amount per day, perDay is "
        +"null, quote is the empty string, and note says in at most eight words what the directions "
        +"do tell you instead. Never take a dose from the product name, from a body weight you were "
        +"not given, from what people typically do, or from anywhere outside that line; a missing "
        +"dose is a correct answer and an invented one is the failure this tool exists to prevent. "
        +"Lines:\n"+lines.join("\n"),
        {modelTier:"quick"}
      ).then(function(res){
        var arr=Array.isArray(res)?res:(res&&res.items)||[];
        $("o2").innerHTML=lines.map(function(l,i){
          var r=arr[i]||{}, nm=l.split("|")[0].trim();
          var F=null; Object.keys(CAT).forEach(function(k){if(shortName(CAT[k])===nm)F=CAT[k];});
          if(F) DOSE[F.k]={perDay:(r.perDay>0?r.perDay:null),q:String(r.quote||"").slice(0,80)};
          return row(esc(nm)+(r.quote?' <span style="color:var(--soft)">&mdash; &ldquo;'
              +esc(String(r.quote).slice(0,52))+'&rdquo;</span>':""),
            r.perDay>0?(r.perDay+" "+esc(r.doseUnit||"")+"/day"):"no dose on the label",!(r.perDay>0));
        }).join("");
        var got=arr.filter(function(r){return r&&r.perDay>0;}).length;
        $("s2").textContent=got+" of "+lines.length
          +" labels state an amount. The rest get no number, and no model may invent one.";
        paint(); flash(["plot","widget"]);
      });
    });
  };
})();
