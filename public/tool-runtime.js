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


  /* ==== RULES:BEGIN =========================================================
     Czyste reguly, bez DOM-u i bez stanu. Ten blok jest WYCINANY Z TEGO PLIKU
     i uruchamiany przez scripts/tool-rules.test.mjs — test czyta zrodlo, nie
     kopie, wiec poluzowanie ktorejkolwiek reguly tutaj wywraca test zamiast
     przejsc cicho. Kolejnosc warunkow w doseStatus() jest czescia kontraktu.
     ========================================================================= */

  /* Normalizacja PRZED jakimkolwiek dopasowaniem. Drift zapisu — ten sam towar
     jako "CG 60 KAPSULEK" w starych zamowieniach i "CG60KAPSULEK" w nowych —
     rozszczepia jeden produkt na dwa klucze. Skutek nie jest kosmetyczny:
     polowa powtorzen laduje w osobnym koszyku, wiec odstepow jest mniej, a te
     ktore zostaja sa dluzsze. Zmierzone na katalogu prawdziwego sklepu: szesc
     punktow dopasowania i mediana w gore.                                     */
  function normKey(s){return String(s==null?"":s).toUpperCase().replace(/[^A-Z0-9]/g,"");}

  /* Kropke i przecinek zdejmujemy z KONCA i POCZATKU tokenu, nigdy ze srodka:
     replace(/[.,]/g," ") na calym cytacie rozbijalo "1,5 miarki" na "1" i "5",
     wiec uczciwy odczyt dostawal falszywy alarm. Przecinek dziesietny do kropki,
     porownanie i tekstem, i liczba, zeby "30" zgadzalo sie z 30, a "1.50" z 1.5. */
  function quoteHasNumber(q,n){
    if(typeof n!=="number"||!isFinite(n)) return false;
    var toks=String(q).split(/[^0-9.,]+/);
    for(var i=0;i<toks.length;i++){
      var t=toks[i].replace(/^[.,]+/,"").replace(/[.,]+$/,"").replace(",",".");
      if(!t) continue;
      if(t===String(n)||parseFloat(t)===n) return true;
    }
    return false;
  }

  /* Sufit to nie dawka. "Maksymalna porcja dzienna to 6 kapsulek" mowi, czego NIE
     przekraczac. Wziecie tej liczby za dawke jest tym samym bledem co srodek
     przedzialu, tylko popelnionym na gornym koncu — wiec blokada jest po stronie
     kodu, nie w prompcie: prompt sam tego nie utrzyma.                         */
  var CEIL=/maksymaln|nie przekracz|nie nalezy przekracz|do not exceed|maximum|\bmax\b|at most|no more than/i;
  /* Przedzial unieważnia WYLICZENIE, nigdy odczytu. Kolejnosc w doseStatus() jest
     wiec istotna: "ok. 300 g dla psa o masie 15-20 kg" ma przedzial, ale opisuje
     on mase psa, a dawka 300 JEST wydrukowana i ma zostac odczytem.            */
  var RANGEQ=/\d\s*(?:[-–—]|\bdo\b|\bto\b)\s*\d/;
  /* Liczba bywa slowem, nie cyfra: "Jedna saszetka dziennie" jest wydrukowana
     wprost i jednoznaczna. ALE to samo slowo przed "razy" jest CZESTOTLIWOSCIA,
     nie iloscia — bez tego rozroznienia narzedzie czytalo "dwa razy dziennie"
     jako dwie sztuki na dobe i z wyliczenia robil sie falszywy odczyt.
     Stad dwa osobne testy, a nie jedna lista slow.                             */
  var UNITN=/^(?:kapsu|tabletk|tabletek|saszetk|saszetek|miark|[lł]y[zż]eczk|ml\b|g\b)/i;
  var NUMW={1:/\b(jedna|jeden|jedno|jednej|one)\s+(\S+)/i,
            2:/\b(dwie|dwa|two)\s+(\S+)/i,
            3:/\b(trzy|three)\s+(\S+)/i,
            4:/\b(cztery|four)\s+(\S+)/i};
  /* liczba slowna liczy sie jako ILOSC tylko tuz przed jednostka */
  function wordQty(q,n){
    var re=NUMW[n]; if(!re) return false;
    var m=re.exec(String(q));
    return !!(m&&UNITN.test(m[2]));
  }
  /* ...a jako CZESTOTLIWOSC tylko w zwrocie "N razy dziennie" */
  var FREQW={1:"raz",2:"dwa|dwie",3:"trzy",4:"cztery"};
  function wordTimes(q,x){
    var W=FREQW[x]; if(!W) return false;
    return new RegExp("\\b(?:"+W+")\\s+razy?\\s+dziennie","i").test(String(q));
  }
  function hasQty(q,n){return quoteHasNumber(q,n)||wordQty(q,n);}
  function hasTimes(q,x){return quoteHasNumber(q,x)||wordTimes(q,x);}

  /* Trzy stany, nie dwa.
       read     — liczba dobowa stoi doslownie w cytacie.
       computed — cytat podaje POJEDYNCZA porcje i POJEDYNCZA czestotliwosc, obie
                  doslownie ("Pol miarki (0,5 g) dwa razy dziennie"), a dawka jest
                  ich iloczynem. Tu nie ma czego zgadnac: arytmetyka jest wymuszona,
                  nie wybrana, wiec to NIE jest ten sam blad co srodek przedzialu.
                  Bez tego stanu odpada najwiekszy wolumenowo produkt prawdziwego
                  katalogu — producenci sami drukuja ekwiwalent w nawiasie.
       none     — przedzial, sufit, albo brak liczby. To pelnoprawny wynik.
     Stan wraca nazwany, bo ekran ma powiedziec, ZA CO podaje liczbe.           */
  function doseStatus(D){
    if(!D||typeof D.perDay!=="number"||!(D.perDay>0)) return "none";
    var q=String(D.q||""); if(!q) return "none";
    if(CEIL.test(q)) return "none";
    if(hasQty(q,D.perDay)) return "read";
    if(RANGEQ.test(q)) return "none";
    var s=D.serving, x=D.times;
    if(typeof s==="number"&&s>0&&typeof x==="number"&&x>0
       && Math.abs(s*x-D.perDay)<1e-9
       && hasQty(q,s) && hasTimes(q,x)) return "computed";
    return "none";
  }

  /* Wielopak MNOZY dni zapasu, nie dzieli: dwupak to dwa razy tyle w tym samym
     rytmie. Krotnosc z sufiksu (…x2) albo ze slowa w tytule. Uwaga na podwojne
     liczenie — jesli tytul podaje juz laczna zawartosc ("180 kapsulek") i do tego
     krotnosc, iloczyn bylby falszywy; dlatego czytamy krotnosc TYLKO z zapisow,
     ktore opisuja opakowanie zbiorcze, nie zawartosc.                          */
  function packFactor(title){
    var s=String(title==null?"":title).toLowerCase().replace(/,/g,".");
    var m=s.match(/\bzestaw\s*(\d+)\b/)||s.match(/(\d+)\s*[x×]\s*\d/)
        ||s.match(/[\s\-–]x\s*(\d+)\b/)||s.match(/\bx(\d+)\s*$/);
    if(m){var n=parseInt(m[1],10); if(n>1&&n<40) return n;}
    if(/\bdwupak\b|\bdwu-pak\b|\btwin ?pack\b/.test(s)) return 2;
    if(/\btr[oó]jpak\b|\btrzypak\b|\b3-?pack\b/.test(s)) return 3;
    if(/\bczteropak\b|\b4-?pack\b/.test(s)) return 4;
    return 1;
  }

  /* Czytanie tytulu bez modelu. Sluzy do jednego: zlapac model na rozjezdzie.
     Konwersja jednostek jest najslabsza strona modeli, wiec nie ufamy jej na slowo.
     Zestaw ROZNYCH produktow ("120 kapsulek, 60 tabletek") nie ma wspolnej
     jednostki — wtedy zwracamy null, czyli NIEUSTALONE. Zgadniety mnoznik bylby
     tu gorszy od braku wyniku.                                                 */
  function plainUnits(t){
    var s=String(t==null?"":t).toLowerCase().replace(/,/g,"."), m, best=null, units={};
    /* gram\w* MUSI stac przed golym g: alternatywa jest uporzadkowana, wiec przy
       "500 gram" najpierw dopasuje sie g, potem \b oblewa na "r" i cale trafienie
       przepada. Prawdziwe tytuly pisza i tak, i tak.                            */
    var re=/(\d+(?:\.\d+)?)\s*(kaps|kapsul\w*|szt|tabl\w*|saszet\w*|ml|gram\w*|l|g|kg)\b/g;
    while((m=re.exec(s))){
      var v=parseFloat(m[1]), u=m[2];
      if(u.indexOf("gram")===0)u="g";
      if(u==="kg"){v*=1000;u="g";} if(u==="l"){v*=1000;u="ml";}
      if(u.indexOf("kaps")===0)u="kaps."; if(u.indexOf("tabl")===0)u="szt.";
      if(u.indexOf("saszet")===0)u="szt."; if(u==="szt")u="szt.";
      units[u]=1;
      if(!best||v>best.v) best={v:v,u:u};
    }
    if(!best) return null;
    if(Object.keys(units).length>1) return null;   /* zestaw mieszany — nieustalone */
    var n=packFactor(s);
    if(n>1) best={v:best.v*n,u:best.u};
    return best;
  }

  function med(a){a=a.slice().sort(function(x,y){return x-y;});
    if(!a.length) return null;
    var h=a.length/2;
    return a.length%2?a[Math.floor(h)]:Math.round((a[h-1]+a[h])/2);}
  function pct(a,p){a=a.slice().sort(function(x,y){return x-y;});
    if(!a.length) return null; return a[Math.min(a.length-1,Math.floor(a.length*p))];}

  /* Pierwsze dokupienie to nie ten sam odstep co rytm ustalony. W danych
     prawdziwego sklepu mediana 1->2 wynosi 77 dni, a 2->3+ juz 70, przy
     rozrzucie szerszym o polowe: w pierwszej luce siedza ludzie, ktorzy
     wrocili po miesiacach, i sciagaja wynik w gore. Mieszanie ich zawyza. */
  function splitGaps(ds){
    var g=[],i;
    for(i=1;i<ds.length;i++) g.push(Math.round(ds[i]-ds[i-1]));
    return {first:g.slice(0,1), later:g.slice(1), all:g};
  }
  /* Luka dluzsza niz rok to nie cykl zuzycia, tylko powrot po odejsciu.
     Liczymy ja OSOBNO i pokazujemy — nie wycinamy po cichu.               */
  var REACT_DAYS=365;
  function reactSplit(g){
    var cyc=[],re=[],i;
    for(i=0;i<g.length;i++) (g[i]>REACT_DAYS?re:cyc).push(g[i]);
    return {cycle:cyc,react:re};
  }
  /* Gdy trzeci kwartyl jest co najmniej dwukrotnoscia mediany, to nie jest jeden
     rozkald z dlugim ogonem, tylko dwa nalozone — i srednia dla takiego SKU nie
     znaczy nic. Ekran ma to powiedziec wprost, a nie zostawiac czytelnikowi.   */
  function bimodal(m,hi){return !!(m&&hi&&hi>=2*m);}
  /* ==== RULES:END =========================================================== */

  /* ============ katalog ============
     units/unit sa faktem z etykiety. perDay pochodzi WYLACZNIE z instrukcji producenta,
     wklejonej nizej, i niesie ze soba cytat. Gdy instrukcja nie mowi nic o dobie,
     perDay jest null i dni zapasu po prostu nie istnieja — to nie jest brak do wypelnienia.

     PROBKA JEST PRAWDZIWA. Cztery rodziny to wycinek eksportu anonimowego sklepu
     z suplementami, 4,8 roku historii zamowien. Rozklady odstepow ponizej (qf/ql)
     to kwantyle co 5% policzone z tamtych danych, a nie krzywa dobrana na oko —
     wiec ogon reaktywacji i rozjazd kwartyli sa takie, jakie byly naprawde.
     Nazwy sa zdjete celowo: to cudze dane, uzyte za zgoda, ale bez marki.       */
  var FAM=[
    {k:"pwd", t:"Proszek dzienny 45 g",          units:45, unit:"g",    price:89,
     dir:"Pol miarki (0,5 g) dwa razy dziennie.",
     nf:1306, nl:1197,
     qf:[1,17,25,30,36,42,46,51,58,65,73,86,100,116,146,174,206,254,336,413,908],
     ql:[1,18,25,31,35,40,44,51,56,61,69,78,90,99,114,135,166,205,259,334,744],
     vars:[["Proszek dzienny 45 g - dwupak",169]]},
    {k:"imm", t:"Saszetki odpornosc 30 szt.",    units:30, unit:"szt.", price:79,
     dir:"1-2 saszetki dziennie przed positkiem.",
     nf:334, nl:246,
     qf:[1,17,24,29,31,33,38,41,49,57,64,81,101,120,148,197,221,283,353,446,1313],
     ql:[5,15,25,28,30,30,33,36,40,44,52,61,72,82,104,120,143,173,248,320,683],
     vars:[]},
    {k:"jun", t:"Saszetki junior 30 szt.",       units:30, unit:"szt.", price:69,
     dir:"1 saszetka dziennie przed positkiem.",
     nf:180, nl:138,
     qf:[4,18,24,31,32,39,42,51,57,63,66,76,87,96,108,125,159,206,247,369,859],
     ql:[2,19,28,30,35,39,44,51,56,65,71,77,89,99,125,151,192,208,259,331,613],
     vars:[]},
    {k:"fib", t:"Saszetki blonnik 15 szt.",      units:15, unit:"szt.", price:49,
     dir:"1 saszetka dziennie przed positkiem.",
     nf:207, nl:64,
     qf:[2,9,13,15,17,18,20,24,29,31,34,39,43,47,53,60,76,93,135,210,274],
     ql:[2,15,16,18,21,25,27,28,31,34,39,45,49,50,54,66,70,81,128,201,300],
     vars:[]}
  ]; /* FAM jest KATALOGIEM PROBKI, nie katalogiem narzedzia. CAT jest katalogiem
     narzedzia i rosnie z tego, co faktycznie stoi we wklejonym eksporcie — bez tego
     "wlasny eksport" pokazywalby cudze rodziny albo nic.                          */
  var CAT={};
  FAM.forEach(function(F){CAT[F.k]=F;});
  /* Trzy stany parsera widoczne od razu na otwarciu: proszek jest WYLICZONY
     (0,5 g x dwa razy = 1 g), saszetki junior i blonnik ODCZYTANE wprost,
     a saszetki odpornosc nie maja dawki, bo etykieta podaje przedzial.       */
  var DOSE={pwd:{perDay:1,serving:0.5,times:2,q:"Pol miarki (0,5 g) dwa razy dziennie."},
            imm:{perDay:null,q:"1-2 saszetki dziennie przed positkiem."},
            jun:{perDay:1,q:"1 saszetka dziennie przed positkiem."},
            fib:{perDay:1,q:"1 saszetka dziennie przed positkiem."}};

  /* ============ przykladowy eksport ============
     Generowany deterministycznie, zeby ekran otwieral sie policzony, a nie pusty.
     Kazda liczba nizej jest liczona z TYCH linii — nic nie jest wpisane na sztywno.
     Odstepy bierzemy z tablicy kwantyli przez odwrotna dystrybuante, próbkowana
     rownomiernie (i+0.5)/n, wiec empiryczne kwartyle wychodza na kropke tam,
     gdzie stoja w danych zrodlowych.                                           */
  var seed=20260912;
  function rnd(){seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff;}
  function invq(T,u){
    if(u<=0) return T[0];
    if(u>=1) return T[T.length-1];
    var s=u*(T.length-1), i=Math.floor(s), t=s-i;
    return T[i]+(T[i+1]-T[i])*t;
  }
  function drawGaps(T,n){
    var out=[],i;
    for(i=0;i<n;i++) out.push(Math.max(1,Math.round(invq(T,(i+0.5)/n))));
    /* tasujemy deterministycznie, zeby kolejnosc w eksporcie nie byla posortowana */
    for(i=out.length-1;i>0;i--){var j=Math.floor(rnd()*(i+1)),v=out[i];out[i]=out[j];out[j]=v;}
    return out;
  }
  var SPAN=1762;                       /* 2021-11-15 .. 2026-09-12, 4,8 roku */
  function makeExport(){
    var rows=[],c=0;
    FAM.forEach(function(F){
      var first=drawGaps(F.qf,F.nf), later=drawGaps(F.ql,F.nl);
      /* kazdy kupujacy ma luke 1->2; luki 2->3+ rozkladamy po kolei na tych samych
         kupujacych, wiec liczba odstepow na ekranie zgadza sie ze zrodlem         */
      var extra=[],i;
      for(i=0;i<F.nf;i++) extra.push([]);
      for(i=0;i<later.length;i++) extra[i%F.nf].push(later[i]);
      for(i=0;i<F.nf;i++){
        c++;
        var id="c-"+(10000+c), gaps=[first[i]].concat(extra[i]);
        var total=gaps.reduce(function(a,b){return a+b;},0);
        var day=Math.floor(rnd()*Math.max(1,SPAN-total));
        var j;
        for(j=0;j<=gaps.length;j++){
          var d=new Date(2021,10,15); d.setDate(d.getDate()+day);
          /* Jedna rodzina niesie kilka gramatur — i to wlasnie porownanie ceny za
             jednostke MIEDZY NIMI wylapuje zla ekstrakcje. Bez wariantow nie ma czego
             walidowac, bo pojedynczy wiersz nie ma sie z czym rozjechac.              */
          var V=(F.vars&&F.vars.length&&rnd()<0.30)
                ? F.vars[Math.floor(rnd()*F.vars.length)] : null;
          rows.push([d.toISOString().slice(0,10),id,V?V[0]:F.t,"1",
                     (V?V[1]:F.price).toFixed(2)]);
          if(j<gaps.length) day+=gaps[j];
        }
      }
    });
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
  /* Dopasowanie idzie po kluczu ZNORMALIZOWANYM — inaczej "Proszek dzienny 45 g"
     i "Proszek dzienny 45g" z dwoch roznych lat eksportu sa dla narzedzia dwoma
     produktami. Prefiks liczymy po normalizacji, bo spacje juz z niego wypadly. */
  function key(title){
    var t=normKey(title);
    for(var i=0;i<FAM.length;i++){
      var pre=normKey(FAM[i].t).slice(0,12);
      if(pre&&t.indexOf(pre)===0) return FAM[i].k;
    }
    return t.slice(0,16);
  }

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
      var k=id.split("|")[0], ds=by[id].sort(function(a,b){return a-b;});
      var O=(OBS[k]=OBS[k]||{gaps:[],first:[],later:[],buyers:0});
      var s=splitGaps(ds);
      O.gaps=O.gaps.concat(s.all); O.first=O.first.concat(s.first);
      O.later=O.later.concat(s.later);
      O.buyers++;
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

  /* Dni zapasu istnieja tylko wtedy, gdy etykieta daje dobowa ilosc — odczytana
     wprost albo wymuszona iloczynem dwoch pojedynczych liczb. Stan "none" nie jest
     bledem do naprawienia; dla wiekszosci katalogu to jedyna uczciwa odpowiedz.
     Na prawdziwym katalogu policzylo sie 17 pozycji na 130, a glowny powod
     odrzucenia — 69 pozycji — to przedzial dawki.                               */
  function packDays(F){var D=DOSE[F.k];
    if(doseStatus(D)==="none") return null;
    return (D&&D.perDay>0&&F.units>0)?Math.round(F.units/D.perDay):null;}

  /* Jedna os dla calego katalogu. Poprzednia wersja skalowala kazdy wiersz do siebie,
     wiec szesc par slupkow wygladalo identycznie i pod kazdym musialo stac zdanie
     tlumaczace obrazek. Na wspolnej osi rozjazd widac z POZYCJI i zdania sa zbedne. */
  function paint(){
    observe();
    var rows=[], maxd=1;
    Object.keys(OBS).map(function(k){return CAT[k];}).filter(Boolean).forEach(function(F){
      var o=OBS[F.k]||{gaps:[],first:[],later:[],buyers:0}, pd=packDays(F);
      /* Domyslna liczba narzedzia to RYTM USTALONY (2->3+). Pierwsze dokupienie
         dostaje wlasny pasek i wlasny wiersz, bo to inne zjawisko: siedza w nim
         ludzie, ktorzy wrocili po miesiacach, i ciagna mediane w gore.        */
      var L=o.later, R=reactSplit(L), Fi=o.first, Ri=reactSplit(Fi);
      F._m=med(L); F._lo=pct(L,0.25); F._hi=pct(L,0.75);
      F._n=L.length; F._thin=L.length<8; F._re=R.react.length;
      F._bi=bimodal(F._m,F._hi);
      F._fm=med(Fi); F._flo=pct(Fi,0.25); F._fhi=pct(Fi,0.75);
      F._fn=Fi.length; F._fre=Ri.react.length;
      F._pd=pd;
      if(pd) maxd=Math.max(maxd,pd);
      if(F._m&&!F._thin) maxd=Math.max(maxd,F._m);
      if(F._fm&&F._fn>=8) maxd=Math.max(maxd,F._fm);
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
      /* Trzeci pasek: pierwsze dokupienie. Osobno, bo to nie ten sam odstep. */
      marks+=(F._fm&&F._fn>=8)?'<i class="b3" style="width:'+at(F._fm)+'%"></i>':"";
      /* Trzy stany dawki, nie dwa. "computed" znaczy: liczby nie ma w cytacie, ale
         jest iloczynem dwoch pojedynczych liczb, ktore w nim stoja — to odczyt
         wymuszony, nie zgadniety, i ekran nazywa go po imieniu.                  */
      var ds=doseStatus(DOSE[F.k]);
      if(pd&&m&&ds==="computed") d+='<s>worked out from the pack</s>';
      if(!pd&&m) d='<s>not on the pack</s>';
      if(!m) d="";
      /* Rozklad, nie mediana. Kwartyle stoja przy liczbie odstepow, bez nowej
         kolumny. Reaktywacje licza sie OSOBNO i sa widoczne — nie wycinamy ich
         po cichu, ale tez nie udajemy, ze powrot po roku to cykl zuzycia.      */
      var spread=(m&&F._lo&&F._hi)?(" &middot; "+F._lo+" / "+m+" / "+F._hi):"";
      var react=F._re?(" &middot; "+F._re+" back after a year"):"";
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
      var l2=(F._fm&&F._fn>=8)
        ? '<s>first repurchase '+F._fn+' &middot; '+F._flo+' / '+F._fm+' / '+F._fhi+'</s>' : "";
      var bi=F._bi?'<s>p75 is twice the median &mdash; two distributions, not one; '
                  +'an average here means nothing</s>':"";
      return '<div class="pr"><span class="pn">'+esc(shortName(F))
        +'<s>'+F._n+' settled gaps'+(F._thin?" &middot; too few":spread)+react+price+'</s>'
        +l2+bi+'</span>'
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
        ? "<b>"+esc(shortName(best))+"</b>: once they are in the habit they come back every <b>"
          +best._m+" days</b>, half of them between "+best._lo+" and "+best._hi
          +(best._fm?". The first repurchase runs longer, "+best._fm+" days":"")
          +(best._re?", and "+best._re+" came back only after a year &mdash; those are "
            +"reactivations, counted apart from the rhythm":"")
          +". That is the subscription interval, before any label is read. Paste the "
          +"maker&rsquo;s directions and the days of supply line up beside it."
          +(best._bi?" <em>Its p75 is twice its median: two distributions sit on top of each "
            +"other here, so an average for this one means nothing.</em>":"")
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
    /* Ekran ma powiedziec, ZA CO podaje te liczbe. Test jest literalny, wiec wie tylko
       tyle, ze liczby nie ma w cytowanych slowach — i tylko tyle wolno mu twierdzic.
       Poprzednia wersja pisala "to srodek przedzialu", czyli zgadywala, skad liczba
       pochodzi, choc sprawdzala co innego.                                          */
    /* Ekran ma powiedziec, ZA CO podaje te liczbe. "computed" to nie to samo co
       zgadniete: iloczyn dwoch pojedynczych liczb, obu wydrukowanych, nie zostawia
       nic do wyboru. Poprzednia wersja mowila o tym "the pack does not print it",
       co bylo prawda o cyfrze i falszem o odczycie.                              */
    var st=doseStatus(DOSE[F.k]);
    $("wb").textContent=F._pd+" days at "+DOSE[F.k].perDay+" "+F.unit+" a day"
      +(st==="computed"?", the pack&rsquo;s own two figures multiplied.":".");
    $("wn").innerHTML="&ldquo;"+esc(DOSE[F.k].q)+"&rdquo; &mdash; the maker."
      +(st==="computed"
        ? " The daily figure is not printed as one number; it is "+DOSE[F.k].serving
          +" &times; "+DOSE[F.k].times+", both of them in those words. Nothing was chosen."
        : " No date, no free text.");
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
  /* Probka nie jest wymyslona i ekran ma to powiedziec. Nazwy sklepu ani produktow
     nie ma celowo — dane sa cudze i uzyte za zgoda, ale marka nie jest czescia zgody. */
  var HELP_S="Four families from an anonymous supplement shop, <b>4.8 years of orders</b>. "
    +"The gap distributions are the real ones, quantile for quantile; only the names are gone.";
  var HELP_M="Shopify: <b>Orders &rarr; Export &rarr; plain CSV</b>, then paste it here. Any file "
    +"works that carries date, customer, product title, quantity, price. Parsed in this browser; "
    +"only the product titles are ever sent to a model, never a customer row.";
  function srcStat(){
    var rows=parseExport($("orders").value), fams={}, n=0;
    rows.forEach(function(r){fams[key(r.t)]=1;n++;});
    var f=Object.keys(fams).length;
    $("sstat").innerHTML = n
      ? "<b>"+n+"</b> orders &middot; <b>"+f+"</b> famil"+(f===1?"y":"ies")
        +" &middot; "+(mine?"your export":"a real shop, 4.8 years")
      : (mine?"waiting for your export":"nothing to read");
  }
  function setSrc(m){
    mine=m;
    $("srcS").setAttribute("aria-pressed",m?"false":"true");
    $("srcM").setAttribute("aria-pressed",m?"true":"false");
    /* Widoczne w OBU stanach: dopoki podpis probki byl chowany, ekran nie mowil
       nigdzie, ze liczby pochodza z prawdziwego sklepu.                        */
    $("shelp").innerHTML=m?HELP_M:HELP_S; $("shelp").hidden=false;
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
  $("shelp").innerHTML=HELP_S; $("shelp").hidden=false;
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
        +"form: product | directions. Reply with ONLY a JSON array: one single [ ... ] holding "
        +"one object per input line, in the same order. Do not emit bare objects separated by "
        +"newlines. Each object: {\"perDay\":number|null,\"serving\":number|null,"
        +"\"times\":number|null,\"doseUnit\":string,\"quote\":string,"
        +"\"note\":string}. perDay = the amount used in ONE DAY, in the unit the "
        +"directions themselves use. It is a single JSON number, never a range and never a "
        +"string. Return it in exactly two cases and in no others. (1) The line prints that "
        +"daily number outright, and it appears verbatim in your quote; leave serving and times "
        +"null. (2) The line prints ONE serving amount and ONE frequency, both verbatim — "
        +"\"half a scoop (0.5 g) twice a day\" — in which case perDay is their product, "
        +"serving is that single amount, times is that single frequency, and both must appear "
        +"in the quote. Nothing is chosen in case (2): it is arithmetic that is forced, not a "
        +"judgement. Everywhere else perDay is null. Do NOT average. Do NOT take the middle of "
        +"a range: one scoop of 30 g taken 1-2 times a day is null, not 45 and not 1.5, because "
        +"the frequency is a range. Do NOT return a ceiling as a dose — \"maximum daily portion "
        +"is 6 capsules\" says what not to exceed, and taking it is the same error as taking the "
        +"middle of a range; perDay is null. A daily amount that IS printed but carries a "
        +"condition — so much a day for a given body weight, for instance — still counts, "
        +"because the number itself is on the pack: return it. quote = the exact "
        +"run of words from that line which carries the amount, copied character for character, no "
        +"paraphrase. When perDay is null, still return the words that come closest to a dose, so "
        +"the reader sees what the pack does say; leave quote empty only when the line mentions no "
        +"amount at all. note says in at most eight words what the directions "
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
          var q=String(r.quote||"");
          var n=(typeof r.perDay==="number"&&r.perDay>0)?r.perDay:null;
          /* Sprawdzenie po stronie kodu, bo sam prompt tego nie utrzyma. Model moze
             zwrocic sufit albo srodek przedzialu mimo zakazu — doseStatus() to lapie
             i odbiera liczbie status, a gdy nie ma zadnego stanu, odbiera tez liczbe.
             Trzy stany: odczytana, wymuszona iloczynem, brak.                       */
          var cand={perDay:n,serving:(typeof r.serving==="number"?r.serving:null),
                    times:(typeof r.times==="number"?r.times:null),q:q.slice(0,120)};
          var st=doseStatus(cand);
          if(st==="none") cand.perDay=null;
          if(F) DOSE[F.k]=cand;
          return row(esc(nm)+(q?' <span style="color:var(--soft)">&mdash; &ldquo;'
              +esc(q.slice(0,52))+'&rdquo;</span>':""),
            st==="read"     ? (n+" "+esc(r.doseUnit||"")+"/day")
          : st==="computed" ? (n+" "+esc(r.doseUnit||"")+"/day &middot; worked out")
          : (q?"not on the pack":"no dose on the label"),
            st==="none");
        }).join("");
        /* Liczymy tylko te, ktore przeszly reguly po stronie kodu. Wczesniej licznik
           mowil "states an amount" takze o liczbie, ktorej na opakowaniu nie ma.     */
        var got=0, wk=0;
        arr.forEach(function(r){
          var s=doseStatus({perDay:(typeof r.perDay==="number"?r.perDay:null),
                            serving:(typeof r.serving==="number"?r.serving:null),
                            times:(typeof r.times==="number"?r.times:null),
                            q:String(r.quote||"")});
          if(s==="read") got++; else if(s==="computed") wk++;
        });
        $("s2").textContent=got+" of "+lines.length
          +" labels print a daily amount outright"
          +(wk?", "+wk+" more give two figures that multiply to one":"")
          +". The rest get no number, and no model may work one out.";
        paint(); flash(["plot","widget"]);
      });
    });
  };
})();
