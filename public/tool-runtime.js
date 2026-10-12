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
  /* PRZEBIEG 42. CZYTANIE PLIKU, KTORY SKLEP MA POD REKA — NIE TEGO, O KTORY
     PROSILEM. Trzej founderzy na trzech i trzej recenzenci UX na trzech, szesciu
     na szesciu, niezaleznie od siebie, nazwali TO SAMO najslabsza rzecza strony:
     wklejony plik z przycisku "Export orders" w Shopify — czyli dokladnie ten,
     ktory pierwszy ekran kaze zrobic — dawal 140 rodzin o nazwie "paid" i sciane
     powtorzen "too few repeat orders to read". Sciezka POZYCYJNA (data, klient,
     ...tytul..., szt., cena) jest zalozeniem o pliku, ktorego nikt nie eksportuje:
     prawdziwy eksport ma wiersz naglowka, siedemnascie nazwanych kolumn, tytuly w
     cudzyslowach, przecinek wewnatrz cudzyslowu i druga pozycje zamowienia z
     pustymi polami zamowienia. Z5 mowi, ze narzedzie ma dzialac na danych, ktore
     klient ma pod reka, w minute i bez wdrozenia; Z13 stawia prawde najwyzej, a
     "Shopify: Orders -> Export -> plain CSV" na pierwszym ekranie bylo obietnica,
     ktorej plik nie spelnial. Reguly ponizej sa CZYSTE i stoja w bloku RULES, zeby
     nie dalo sie ich zdjac nieuwaznym nadpisaniem.
     SCIEZKA POZYCYJNA ZOSTAJE NIETKNIETA i jest bramka braku regresu: plik bez
     naglowka musi dac dokladnie ten sam wynik, co wczoraj.                      */

  /* Podzial wiersza z poszanowaniem cudzyslowow: przecinek w "Plyn Fresh 1,5 l"
     albo w "Kowalski, Jan" NIE rozbija wiersza. Podwojny cudzyslow w cudzyslowie
     ("") jest jednym znakiem, tak jak w RFC 4180.                              */
  function splitFields(line,sep){
    var out=[],cur="",q=false,i,c;
    for(i=0;i<line.length;i++){
      c=line.charAt(i);
      if(q){
        if(c==='"'){ if(line.charAt(i+1)==='"'){cur+='"';i++;} else q=false; }
        else cur+=c;
      }else if(c==='"') q=true;
      else if(c===sep){ out.push(cur); cur=""; }
      else cur+=c;
    }
    out.push(cur);
    return out.map(function(x){return x.replace(/^\s+|\s+$/g,"");});
  }
  /* Separator bierzemy z WIERSZA NAGLOWKA, nie z calego pliku: tytuly produktow
     sypia przecinkami niezaleznie od tego, czym plik jest rozdzielony.          */
  function sniffSep(line){
    var best=",",n=-1;
    [",",";","\t"].forEach(function(s){
      var c=splitFields(line,s).length;
      if(c>n){n=c;best=s;}
    });
    return n>1?best:null;
  }
  /* Kolumny po NAZWIE, przez normKey — te same nazwy, ktorych uzywaja eksporty
     Shopify, WooCommerce i arkusz zlozony recznie. Kolumny klienta NIE bierzemy
     z "Name": w Shopify to numer zamowienia, nie czlowiek, a grupowanie odstepow
     po numerze zamowienia daje kazdemu jedno zamowienie i zero odstepow.        */
  var COLS={
    d:["CREATEDAT","PAIDAT","PROCESSEDAT","ORDERDATE","DATE","DATA"],
    c:["EMAIL","CUSTOMEREMAIL","CUSTOMERID","BILLINGEMAIL","CUSTOMER","KLIENT"],
    t:["LINEITEMNAME","LINEITEMTITLE","PRODUCTTITLE","ITEMNAME","PRODUCT","TITLE","NAZWA"],
    q:["LINEITEMQUANTITY","QUANTITY","QTY","SZT","ILOSC"],
    p:["LINEITEMPRICE","PRICE","UNITPRICE","CENA","TOTAL","SUBTOTAL"]
  };
  function colMap(head){
    var norm=head.map(normKey), m={}, ok=true;
    ["d","c","t","q","p"].forEach(function(f){
      var i=-1;
      COLS[f].some(function(want){ i=norm.indexOf(want); return i>=0; });
      m[f]=i;
    });
    /* Bez daty, kupujacego i tytulu nie ma czego liczyc — wtedy plik nie jest
       eksportem z naglowkiem i wraca na sciezke pozycyjna albo na ekran drzwi. */
    if(m.d<0||m.c<0||m.t<0) ok=false;
    return ok?m:null;
  }

  /* ==== RULES:END =========================================================== */

  /* p.41: PRZEDZIAL UFNOSCI MEDIANY, liczony z kolejnosci, nie z zalozenia o
     rozkladzie. Founderzy zbijali pytanie o zmiane interwalu, bo ekran drukowal
     jedna pewna liczbe bez wagi.                                               */
  function medBand(a){
    if(!a||a.length<8) return null;
    var x=a.slice().sort(function(p,q){return p-q;}), n=x.length, k;
    if(n<50){
      var pmf=Math.pow(0.5,n), c=0, i;
      k=0;
      for(i=0;i<n;i++){
        if(c+pmf>0.025) break;
        c+=pmf; k=i+1;
        pmf=pmf*(n-i)/(i+1);
      }
    }else{
      k=Math.floor(n/2-1.959964*Math.sqrt(n)/2);
    }
    if(k<1) k=1;
    if(k>Math.floor(n/2)) k=Math.floor(n/2);
    var lo=x[k-1], hi=x[n-k];
    if(lo==null||hi==null||hi<lo) return null;
    return {lo:lo,hi:hi,n:n};
  }

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
     dir:"1-2 saszetki dziennie przed posilkiem.",
     nf:334, nl:246,
     qf:[1,17,24,29,31,33,38,41,49,57,64,81,101,120,148,197,221,283,353,446,1313],
     ql:[5,15,25,28,30,30,33,36,40,44,52,61,72,82,104,120,143,173,248,320,683],
     vars:[]},
    {k:"jun", t:"Saszetki junior 30 szt.",       units:30, unit:"szt.", price:69,
     dir:"1 saszetka dziennie przed posilkiem.",
     nf:180, nl:138,
     qf:[4,18,24,31,32,39,42,51,57,63,66,76,87,96,108,125,159,206,247,369,859],
     ql:[2,19,28,30,35,39,44,51,56,65,71,77,89,99,125,151,192,208,259,331,613],
     vars:[]},
    {k:"fib", t:"Saszetki blonnik 15 szt.",      units:15, unit:"szt.", price:49,
     dir:"1 saszetka dziennie przed posilkiem.",
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
            imm:{perDay:null,q:"1-2 saszetki dziennie przed posilkiem."},
            jun:{perDay:1,q:"1 saszetka dziennie przed posilkiem."},
            fib:{perDay:1,q:"1 saszetka dziennie przed posilkiem."}};

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

  /* Sciezka POZYCYJNA — nietknieta od przebiegu 21 i taka ma zostac. Kazda zmiana
     tutaj jest regresja na pliku, ktory czytal sie wczoraj.                      */
  function parsePositional(txt){
    return txt.split("\n").map(function(l){
      var p=l.split(",").map(function(x){return x.trim();});
      if(p.length<5) return null;
      var d=Date.parse(p[0]); if(isNaN(d)) return null;
      /* Tytul sam bywa z przecinkiem, wiec sklejamy srodek: data, klient, ...tytul..., szt, cena. */
      return {d:d/86400000,c:p[1],t:p.slice(2,p.length-2).join(", "),
              price:parseFloat(p[p.length-1])||null};
    }).filter(Boolean);
  }
  /* Sciezka Z NAGLOWKIEM. Wchodzi tylko wtedy, gdy pierwszy niepusty wiersz NIE
     jest zamowieniem (jego pierwsze pole nie jest data) i da sie w nim znalezc
     kolumny daty, kupujacego i tytulu po nazwie. Pusta data albo pusty kupujacy
     w kolejnym wierszu to druga pozycja TEGO SAMEGO zamowienia — dziedziczy oba
     pola z wiersza wyzej, bo Shopify tak wlasnie eksportuje wieloliniowe
     zamowienia.                                                                 */
  function parseHeaded(txt){
    var lines=txt.split("\n"), i=0;
    while(i<lines.length&&!lines[i].replace(/^\s+|\s+$/g,"")) i++;
    if(i>=lines.length) return null;
    var sep=sniffSep(lines[i]); if(!sep) return null;
    var head=splitFields(lines[i],sep);
    if(!isNaN(Date.parse(head[0]))) return null;   /* to jest zamowienie, nie naglowek */
    var m=colMap(head); if(!m) return null;
    var out=[], lastD=null, lastC=null;
    for(i=i+1;i<lines.length;i++){
      if(!lines[i].replace(/^\s+|\s+$/g,"")) continue;
      var f=splitFields(lines[i],sep);
      var ds=f[m.d]||"", cs=f[m.c]||"";
      if(!ds) ds=lastD; else lastD=ds;
      if(!cs) cs=lastC; else lastC=cs;
      if(!ds||!cs) continue;
      var d=Date.parse(String(ds).replace(" ","T"));
      if(isNaN(d)) d=Date.parse(String(ds).slice(0,10));
      if(isNaN(d)) continue;
      var t=(f[m.t]||"").replace(/^\s+|\s+$/g,"");
      if(!t) continue;
      out.push({d:d/86400000,c:cs,t:t,
                price:(m.p>=0?parseFloat(String(f[m.p]).replace(",","."))||null:null)});
    }
    return out.length?out:null;
  }
  function parseExport(txt){
    var h=parseHeaded(txt);
    return h||parsePositional(txt);
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
  /* HELD: czytelnik przelaczyl sie na swoj plik, ale nie ma w nim jeszcze czego
     czytac. Przyrzad liczy wtedy dalej PROBKE, a ekran mowi wprost, czyja to
     odpowiedz — zamiast skasowac dowod w chwili, gdy zada sie najwiecej pracy. */
  var HELD=false;
  function srcText(){return HELD?SAMPLE_TXT:$("orders").value;}
  function observe(){
    var rows=parseExport(srcText()), by={};
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
  /* Dwa i tylko dwa brzmienia: CZEKAM (pole puste) i NIE UMIEM TEGO PRZECZYTAC
     (cos wklejone, zero wierszy). Do tej wersji byly jednym stanem, wiec czytelnik
     nie odroznial "nie wkleilem" od "moj plik nie zadzialal" i nie dostawal nic do
     naprawienia — trzech recenzentow UX na trzech nazwalo to najwieksza usterka
     uzytkowa strony. Drugie brzmienie mowi, czego szukalo, ile linii przeczytalo
     i co poprawic.                                                              */
  function door(on){
    document.body.classList.toggle("held",on);
    $("door").hidden=!on;
    /* Numeracja sekcji ZOSTAJE 01-02-03-04. Pierwsza proba zdejmowala numery z 02
       i 03 w stanie przyciszonym, zeby drzwi mogly wziac "02" — i recenzent zlapal
       to natychmiast: strona szla 01, 02, 04, a brakujacy numer kroku czyta sie jak
       blad renderowania, nawet kiedy nim nie jest. Drzwi nie sa wiec krokiem, tylko
       przerwa w krokach, i numeru nie maja wcale.                                 */
    /* Trzy sekcje pod rzad z tym samym napisem to nie podpis, tylko bebnienie —
       sedzia ogladajacy same zrzuty policzyl je i mial racje. Pierwsza mowi, czyj
       to plik; nastepne tylko przypominaja, ze to ten sam.                       */
    /* p.40: ekran pusty jest JEDNYM blokiem — linia stanu sekcji 01, licznik,
     dzwignie i linia pomocy schodza na czas czekania. Numeracja 01-02-03-04
     zostaje nietknieta: drzwi mieszkaja WEWNATRZ 01.                           */
    var sr=$("srow"), sh=$("shelp"), nd=$("n-data");
    if(sr) sr.hidden=on;
    if(sh) sh.hidden=on;
    $("n-read").textContent=on?"still the sample shop":"Days after the order";
    $("n-ind").textContent=on?"the same file":"One day, four channels";
    /* Podpis sekcji 04 nie moze zaklamac jej stanu: kiedy model jest nieosiagalny,
       sekcja stoi wylaczona i tak ma byc podpisana, niezaleznie od tego, czyj plik
       jest czytany wyzej.                                                        */
    $("n-ai").textContent=aiNote(on);
    if(!on){ if(nd) nd.textContent="Orders in"; return; }
    var raw=$("orders").value.replace(/^\s+|\s+$/g,"");
    var lines=raw?raw.split("\n").length:0;
    if(!raw){
      if(nd) nd.textContent="waiting";
      $("dsay").textContent="Your export goes here.";
      /* Sciezka eksportu z Shopify stoi juz w "Directions for use" na pierwszym
         ekranie; powtorzona tutaj byla trzecim wystapieniem tej samej instrukcji
         na jednej stronie. Drzwi mowia to, czego tamta lista nie mowi: co sie z
         plikiem dzieje.                                                          */
      /* Linia pomocy sekcji 01 schodzi razem z jej naglowkiem stanu, wiec droga
         przez przeciagniecie musi stanac TUTAJ — inaczej ginie z ekranu zupelnie. */
      /* p.42: zdanie musi opisywac to, co plik naprawde przechodzi. "Piec pol w linii"
     bylo warunkiem surowszym niz kod, odkad naglowek czyta sie po nazwach kolumn. */
      /* PRZEBIEG 45. Zaproszenie stoi odtad NAD linia wlosowa pola, nie w akapicie
         pod nim: pusta powierzchnia miedzy dwiema kreskami czytala sie jak dziura,
         a nie jak miejsce do pisania. Zadnych nowych slow &mdash; zdanie o wklejaniu
         i przeciaganiu wychodzi z .dfix i staje tam, gdzie sie zaczyna pisanie.   */
      $("dhint").innerHTML="Paste it here, or drop the file anywhere in this block.";
      $("dfix").innerHTML="A <b>Shopify</b> or <b>WooCommerce</b> order export as it downloads, "
        +"header row and all &mdash; or five fields a line: date, customer, product title, "
        +"quantity, price. No customer row leaves this browser; "+privClause()+".";
    }else{
      if(nd) nd.textContent="nothing read";
      $("dsay").textContent="I read "+lines+(lines===1?" line":" lines")
        +" and found no order in them.";
      /* Ten sam mark nad polem, inne zdanie: przy nieczytelnym pliku wiersze w polu
         nie sa juz zaproszeniem, tylko dowodem. Bez tej linii trzej sedziowie ukladu
         czytali je jako zrzut z terminala wrzucony pod naglowek.                  */
      $("dhint").innerHTML="The lines as they came, still yours to edit.";
      /* Recenzent ujal to jednym zdaniem: "diagnostic-shaped but not diagnostic" —
         narzedzie trzyma plik w rekach, widzi srednik i mimo to podaje czytelnikowi
         liste trzech mozliwych przyczyn do samodzielnego przebrania. Skoro potrafi
         nazwac przyczyne, ma ja NAZWAC. Sama zamiana separatora zostaje po stronie
         czlowieka: przerabianie cudzego pliku bez pytania to nie jest uprzejmosc. */
      var semi=(raw.match(/;/g)||[]).length, comma=(raw.match(/,/g)||[]).length;
      var tab=(raw.match(/\t/g)||[]).length, why;
      if(semi>comma&&semi>=lines) why="This file is separated by semicolons, not commas. "
        +"Replace <b>;</b> with <b>,</b> and it will read &mdash; Excel does it under "
        +"<b>Save as &rarr; CSV UTF-8</b>, or find-and-replace in any text editor.";
      else if(tab>=lines) why="This file is separated by tabs. Save it again as a "
        +"comma-separated CSV and it will read.";
      else why="Nothing here parses as <b>date, customer, product title, quantity, price</b>. "
        +"The first field has to be a date, and the last two a quantity and a price.";
      $("dfix").innerHTML=why+" With a header row I find the columns by name "
        +"(<b>Created at</b>, <b>Email</b>, <b>Lineitem name</b>); without one I read five "
        +"fields a line, like this: <code>2026-03-14, 1042, Colostrum Premium 120 kaps., 1, "
        +"129.00</code>. Titles may hold commas either way.";
    }
  }

  /* PRZEBIEG 45. Zdanie nad czterema ustawieniami jest odtad zdaniem RAFALA,
     doslownie z briefu stratega (system/USP.md v33, punkt 2), a nie opisem
     mechaniki. Powod jest zmierzony, nie estetyczny: trzej founderzy na trzech,
     pytani czym ten czlowiek sie zajmuje, odpowiedzieli "retencja" — wynik zerowy
     na pytaniu, ktore rubryka stawia najwyzej. Dawne "Set together, not one flow
     at a time." mowilo, JAK ustawiac; to mowi, KTO to robi i po czym.           */
  var TOGETHER="I set your ads, emails and subscriptions by this gap \u2014 a range, not a date.";

  var PAINTED=false;
  function paint(){
    PAINTED=true;
    HELD = mine && parseExport($("orders").value).length===0;
    door(HELD);
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
      F._band=F._thin?null:medBand(L);
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
    /* p.33: siatka pionowych kresek co 30 dni zeszla z plotna — czytana jako siatka
     arkusza. Skala idzie przez podpisy, nie przez linie.                        */
    var AX=Math.ceil(maxd*1.08/30)*30;
    var at=function(d){return (d/AX*100);};

    var lead=null, best=0, thin=0, checked=0, flagged=0; /* best = liczba odstepow rodziny wiodacej */
    /* Pierwsze przejscie liczy wszystko, drugie rysuje. Inaczej nie da sie wyjac
       rodziny wiodacej PRZED stosem — a to ona jest bohaterem zdania nad wykresem. */
    rows.forEach(function(F){
      var pd=F._pd, m=(F._m&&!F._thin)?F._m:null;
      F._mm=m;
      if(F._thin) thin++;
      if(pd&&m){
        var g=m-pd;
        F._g=g; F._cls=g>=5?"late":(g<=-5?"early":"");
        /* p.41 proba trzecia — regula 41(b): rodzina wiodaca to ta z NAJWIEKSZA liczba
     zmierzonych odstepow, nie ta z najwiekszym rozjazdem. Najwiekszy rozjazd
     wybieral zwykle najcienszy ogon, czyli liczbe najslabiej ugruntowana.       */
        if((F._n||0)>best){best=F._n||0;lead=F;}
      }else{F._g=null;F._cls="";}
      /* Sprawdzenie ceny jednostkowej liczy sie dalej i dalej krzyczy, kiedy cos
         jest nie tak — ale kiedy wszystko sie zgadza, schodzi na dol, do listy.  */
      var U=unitPrices(F.k,plainUnits);
      if(U){ checked++; if(U.bad.length) flagged++; }
      F._U=U;
    });

    /* Dlugosc, nie pozycja: kropka na osi wymaga przeczytania osi, dlugosc paska
     czyta sie sama, a wspolna skala pozwala porownac rodziny miedzy soba.
     p.33: pusty pasek-widmo na calej szerokosci zdjety.                        */
    /* JEDEN znacznik na calej stronie: pasek i jego liczba tuz za nim. Ta sama
       gramatyka w figurze wiodacej i w cichym stosie — rozni je wylacznie stopien
       pisma i podpis slowem pod paskiem w figurze. Skala jest wspolna, a liczba
       nie moze sie od paska oderwac, bo stoi na jego koncu.                      */
    /* p.49: mark() zdjety razem z trzema miernikami. Skala figury wiodacej
       nalezy odtad do NIEJ SAMEJ, nie do calego pliku — pasek konczy sie na
       krawedzi kolumny, a nie na siedmiu dziesiatych jej szerokosci, bo jakas
       inna rodzina ma dalszy dzien. Porownuje sie dwie liczby jednej rodziny,
       wiec obca skala niczego tu nie dodawala.                                */
    var gmark=function(v,word,cls){
      return '<span class="gmk '+cls+'"><b>'+v+'</b><i>'+word+'</i></span>';
    };
    /* JEDNA cicha linia pod nazwa. Od przebiegu 36 niesie takze rozjazd, ktory
       do tej pory stal w osobnej, trzeciej kolumnie — i to ta kolumna robila
       z rzedu wiersz tabeli. "not on the pack" z niej NIE wraca nigdzie: linia
       i tak zaczyna sie od slow "no dose on the pack", wiec bylo to powiedziane
       dwa razy w jednym rzedzie.                                                */
    /* p.44: to bylo podpisem pod paskami i mowilo skrotami. Paskow nie ma, wiec
     mowi zdaniem — te same liczby, ta sama kolejnosc mysli, glos strony.        */
    var firstLine=function(F){
      return (F._fm&&F._fn>=8)
        ? '<i>First repurchase at <b>'+F._fm+'</b> days.</i>' : "";
    };
    var subline=function(F){
      var ds=doseStatus(DOSE[F.k]);
      if(F._thin) return "Too few repeat orders to read.";
      if(F._pd&&F._mm){
        var t="<b>"+F._mm+"</b> days in the orders against <b>"+F._pd+"</b> on the label";
        if(F._g!==null&&F._g!==0)
          t+=' &mdash; <em class="'+F._cls+'">'+Math.abs(F._g)+" day"+(Math.abs(F._g)===1?"":"s")
            +(F._g>0?" later":" sooner")+"</em>";
        t+=".";
        if(ds==="computed") t+=" Dose worked out from the pack.";
        return t+firstLine(F);
      }
      if(F._mm) return "<b>"+F._mm+"</b> days in the orders. No dose on the pack."+firstLine(F);
      return "No reading yet.";
    };

    /* FIGURA WIODACA. Nie powtarza zdania nad soba — rysuje je. Kazdy pasek dostaje
       swoj podpis SLOWEM tuz pod soba, wiec legenda nie ma czego tlumaczyc, a regula
       26 (klucz nie opisuje serii, ktorej nie ma) spelnia sie sama: podpis powstaje
       wylacznie razem ze swoim paskiem.                                            */
    /* p.39, naprawa niespojnosci: gdy zadna rodzina nie ma dawki na opakowaniu,
     figura wiodaca i zdanie nad nia brały rozne rodziny. Biora te sama.         */
    var lf=lead;
    if(!lf){
      var lfn=0;
      rows.forEach(function(F){
        if(F._mm&&!F._thin&&(F._n||0)>lfn){lfn=F._n||0;lf=F;}
      });
    }
    if(!lf) lf=rows.length?rows[0]:null;
    if(lf&&!lf._pd&&!lf._mm) lf=null;
    if(lf){
      /* Miara powstaje WYLACZNIE wtedy, gdy jest co z czym porownac: dwie liczby
         tej samej rodziny, dzien z opakowania i dzien z zamowien. Gdy opakowanie
         nie drukuje dawki — a na prawdziwym katalogu to wiekszosc pozycji (17 SKU
         na 130, STATUS.md) — pojedynczy pasek nie mowi nic, bo nie ma sie do czego
         odniesc, wiec go nie ma. Zdanie ponizej mowi wtedy wszystko, co jest do
         powiedzenia. Stan pusty jest zaprojektowany, nie doklejony.            */
      var mm="";
      if(lf._pd&&lf._mm){
        var lo=Math.min(lf._pd,lf._mm), hi=Math.max(lf._pd,lf._mm);
        var cut=hi?(lo/hi*100):0;
        /* Gdy podzial siedzi przy samej krawedzi, adnotacja przestaje byc
           srodkowana i staje sie wyrownana do tej krawedzi — inaczej wychodzi
           poza kolumne.                                                        */
        var near=(cut<18)?"st":(cut>82?"en":"");
        var wLo=(lo===lf._pd)?"days of supply printed on the pack"
                             :"days before they settled into ordering again";
        var wHi=(hi===lf._mm)?"days before they settled into ordering again"
                             :"days of supply printed on the pack";
        var gcls=(lf._g>0?"late":(lf._g<0?"early":"flat"));
        mm='<div class="gauge '+gcls+'">'
          +'<div class="gtop">'
          +'<span class="gmk '+near+'"'+(near?"":' style="left:'+cut+'%"')
          +'><b>'+lo+'</b><i>'+wLo+'</i></span>'
          +'</div>'
          +'<div class="gband"><i class="a" style="width:'+cut+'%"></i><i class="b"></i></div>'
          +'<div class="gfoot">'+gmark(hi,wHi,"en")+'</div>';
        if(lf._fm&&lf._fn>=8)
          mm+='<p class="gnote">First repurchase at <b>'+lf._fm+'</b> days.</p>';
        mm+='</div>';
      } else if(lf._mm&&lf._fm&&lf._fn>=8){
        mm='<p class="gnote" style="margin-top:0">First repurchase at <b>'
          +lf._fm+'</b> days.</p>';
      }
      var tail="";
      if(lf._g!==null&&lf._g!==0)
        tail='<p class="lfd '+lf._cls+'"><span class="v">'+Math.abs(lf._g)+" day"
          +(Math.abs(lf._g)===1?"":"s")+'</span>'+(lf._g>0?" later":" sooner")
          +" than the pack says, on "+esc(shortName(lf))+".</p>";
      else if(lf._mm&&!lf._pd)
        tail='<p class="lfd">No dose on this pack, so there is nothing to be late for '
          +"— the orders are the only reading, on "+esc(shortName(lf))+".</p>";
      $("lead").innerHTML=mm+tail;
    } else $("lead").innerHTML="";

    /* Zdanie wprowadzajace powstaje z liczby wierszy, ktore naprawde stoja
       ponizej — nie z niczego. Gdy nie ma ich wcale, nie ma i zdania.          */
    var rest=rows.filter(function(F){return F!==lf;});
    if($("plothead")) $("plothead").textContent = rest.length
      ? (rest.length===1 ? "The other pack in this file, in one line."
                         : "The other "+rest.length+" packs in this file, one line each.")
      : "";
    $("plot").innerHTML=rest.map(function(F){
      var U=F._U;
      var warn=(U&&U.bad.length)
        ? '<s class="warn">price per unit says a pack size is misread</s>' : "";
      return '<div class="pr"><span class="pn">'+esc(shortName(F))
        +'<s>'+subline(F)+'</s>'+warn+'</span></div>';
    }).join("");
    behind(rows);
    /* Walidacja ma byc widoczna wtedy, kiedy przechodzi, a nie tylko kiedy krzyczy.
       Inaczej czytelnik nie wie, ze cokolwiek zostalo sprawdzone.                  */
    /* Dowod pod duzym zdaniem powstaje z TEGO pliku, nie z niczego: ile rodzin
       dostalo wlasna mediane i jak daleko od siebie one stoja. Jedna rodzina to
       nie rozrzut, wiec zdanie mowi wtedy co innego, a bez zadnej mediany nie
       mowi nic.                                                                 */
    if($("apn")){
      var meds=rows.map(function(F){return F._mm;})
        .filter(function(x){return typeof x==="number"&&x>0;});
      var lo=Math.min.apply(null,meds), hi=Math.max.apply(null,meds);
      $("apn").innerHTML = meds.length>1
        ? (lo===hi
            ? "Here that is <b>"+meds.length+"</b> packs counted apart, and they land on the "
              +"same day."
            : "Here that is <b>"+meds.length+"</b> packs counted apart, from <b>"+lo
              +"</b> to <b>"+hi+"</b> days.")
        : (meds.length===1
            ? "Here that is one pack counted on its own, at <b>"+meds[0]+"</b> days."
            : "");
    }
    /* PRZEBIEG 47. Founder na trzech odpowiadal na pytanie "widzialem to u kogos
       innego" nie Klaviyo, tylko raportem kohortowym: "cohort/RFM-based
       reorder-interval analysis is bread and butter for retention agencies".
       Blok RTB odpowiadal dotad TYLKO na predykcje daty, a na raport kohortowy
       nie odpowiadal wcale — a to on jest najblizszym sasiadem tego ekranu.
       Roznica nie jest retoryczna i nie jest nowa: wedlug dokumentu definicji
       produktu drugiej liczby — dni zapasu — nie ma w zadnym eksporcie zamowien,
       bo wymaga liczby sztuk w opakowaniu i dziennej dawki z instrukcji
       producenta. Zdanie ponizej mowi to LICZBAMI Z TEGO PLIKU, nie ogolnie,
       i ma stan dla pliku bez ani jednej dawki.                                */
    if($("den")){
      var dl=(lead&&lead._pd)?lead:null, dn=0;
      if(!dl) rows.forEach(function(F){
        if(F._pd&&(F._n||0)>dn){dn=F._n||0;dl=F;}
      });
      var dd=dl?DOSE[dl.k]:null;
      $("den").innerHTML = (dl&&dd&&dd.perDay>0&&dl.units>0)
        ? "That second number is in no order export: <b>"+dl._pd+"</b> is "
          +dl.units+" "+dl.unit+" in the pack divided by "+dd.perDay+" "+dl.unit
          +" a day, both taken off the label."
        : "That second number is in no order export &mdash; and until a pack here "
          +"prints its daily amount, this file has one number where the sample shop "
          +"has two.";
    }
    if($("chk")) $("chk").innerHTML = checked
      ? (flagged?'<b>'+flagged+' of '+checked
                 +' families: price per unit says a pack size is wrong.</b>'
                : checked+(checked===1?' family':' families')
                  +' cross-checked on price per unit; nothing out of line.')
      : "";
    verdict(lead);
  }

  /* ---------------------------------------------------------------------
     SZCZEGOLY, NA KONCU, ZA KLIKNIECIEM, JAKO LISTA.
     Nic z dawnej szarej kolumny nie zniklo — zmienilo miejsce i, co wazniejsze,
     zostalo rozszyfrowane. Recenzent UX zlapal to precyzyjnie: "39 / 71 / 151"
     nie jest nigdzie na stronie nazwane, wiec ekran krzyczy przypisem, ktorego
     nie tlumaczy. Tutaj kazda liczba stoi przy slowie, ktore mowi, czym jest.
     Skladane jak lista: bez ramek, bez kolumn, bez zebry.
     --------------------------------------------------------------------- */
  function behind(rows){
    var bl=$("blist"); if(!bl) return;
    /* p.36: rozwinieta lista byla czterema JEDNAKOWYMI stosami drobnego szarego
     tekstu bez hierarchii. Slownik idzie RAZ, na gorze, jako wstep.             */
    var html='<p class="blkey">Settled gaps are the intervals between a buyer&rsquo;s second, '
      +'third and later orders; the first repurchase, from a first order to a second, is '
      +'counted apart because it is a different thing. Three numbers are the 25th percentile, '
      +'the median and the 75th. Gaps longer than a year are counted as reactivations and kept '
      +'out of the median, not dropped.</p>';
    html+=rows.map(function(F){
      var out='<div><h3>'+esc(shortName(F))+'</h3>';
      if(F._thin){
        out+='<p>'+F._n+(F._n===1?' settled gap':' settled gaps')
            +' &mdash; too few to read a rhythm from. The bar is left empty rather '
            +'than drawn from a handful of orders.</p>';
      }else{
        out+='<p><b>'+F._n+'</b> settled gaps &middot; '+F._lo+' / <b>'+F._m+'</b> / '
            +F._hi+' days</p>';
      }
      if(F._fm&&F._fn>=8)
        out+='<p><b>'+F._fn+'</b> first repurchases &middot; '+F._flo+' / <b>'+F._fm+'</b> / '
            +F._fhi+' days</p>';
      if(F._re)
        out+='<p><b>'+F._re+'</b> gaps longer than a year, counted as reactivations '
            +'and kept out</p>';
      if(F._bi)
        out+='<p class="caveat">The 75th percentile is twice the median here &mdash; two '
            +'distributions lying on top of each other, not one with a long tail. An average '
            +'for this product means nothing.</p>';
      if(F._pd)
        out+='<p><b>'+F._pd+'</b> days of supply, from the pack&rsquo;s own directions'
            +(doseStatus(DOSE[F.k])==="computed"?", worked out from the two figures it prints"
                                                :", read off it literally")+'</p>';
      else
        out+='<p>No days of supply: these directions do not state a single daily amount, '
            +'so nothing is calculated from them</p>';
      var U=F._U;
      if(U){
        out+= U.bad.length
          ? '<p class="flag">'+esc(shortName1(U.bad[0].t))+' works out at '+zl(U.bad[0].per,U.mid)
            +' z&#322;/'+U.unit+' against '+zl(U.mid,U.mid)+' z&#322;/'+U.unit
            +' across the rest of this family &mdash; the pack size behind it is almost '
            +'certainly misread, and the days of supply with it.</p>'
          : '<p>'+U.list.length+' pack sizes, '+zl(U.lo,U.mid)+'&ndash;'+zl(U.hi,U.mid)
            +' z&#322;/'+U.unit+' &mdash; price per unit agrees across them, so the sizes read '
            +'off the titles hold up</p>';
      }
      return out+'</div>';
    }).join("");
    bl.innerHTML=html;
    var gaps=rows.reduce(function(a,F){return a+(F._n||0);},0);
    $("bsum").textContent="The counts behind this reading \u2014 "+gaps
      +" gaps, quartiles, reactivations, price checks";
  }

  /* Czy szew czytajacy etykiety jest w ogole dostepny w tej kopii. Sekcja 04 jest
     jedynym miejscem, z ktorego dawka moze wejsc — kiedy stoi wylaczona, zdania
     odsylajace do niej sa nieprawda.                                            */
  function labelSeam(){
    var el=document.querySelector(".aisec");
    return !(el&&el.classList.contains("off"));
  }
  function verdict(F){
    if(!F){
      /* Brak etykiety nie znaczy brak wyniku. Sama mediana odstepu jest interwalem
         subskrypcji i nie wymaga od sklepu niczego poza eksportem, ktory juz wklei. */
      var best=null;
      Object.keys(OBS).forEach(function(k){var C=CAT[k];
        if(C&&C._m&&!C._thin&&(!best||C._n>best._n)) best=C;});
      HEAD_F=best; HEAD_LAB=false;
      $("verdict").innerHTML=best
        ? "<b>"+esc(shortName(best))+"</b>: once they are in the habit they come back every <b>"
          +best._m+" days</b>, half of them between "+best._lo+" and "+best._hi
          /* p.39, naprawa nieprawdy: zdanie TWIERDZILO "runs longer" niezaleznie od liczb
     i na prawdziwym eksporcie drukowalo zdanie sprzeczne z wlasnymi danymi.      */
          +(best._fm?". The first repurchase "
            +(best._fm>best._m?"runs longer, ":best._fm<best._m?"runs shorter, ":"matches it, ")
            +best._fm+" days":"")
          +(best._re?", and "+best._re+" came back only after a year &mdash; those are "
            +"reactivations, counted apart from the rhythm":"")
          +". That is the subscription interval, before any label is read."
          /* p.40, naprawa nieprawdy: zdanie kazalo wkleic instrukcje w sekcje 04 takze
     wtedy, gdy sekcja 04 stoi wylaczona — a na produkcji stoi wylaczona zawsze.  */
          +(labelSeam()
            ? " Paste the maker&rsquo;s directions and the days of supply line up beside it."
            : " The label day beside it stays empty: reading labels is off on this copy.")
          +(best._bi?" <em>Its p75 is twice its median: two distributions sit on top of each "
            +"other here, so an average for this one means nothing.</em>":"")
        : (Object.keys(OBS).length
        ? "Read and counted, but no family here has enough repeat orders yet to give a median."
        : "Nothing to read yet. Paste an export: date, customer, product title, quantity, price.");
      /* p.30: ta jedna linia kasowala CALA sekcje 03, gdy zaden produkt nie mial dawki
     — czyli w wiekszosci prawdziwych katalogow (STATUS.md: 17 policzalnych SKU na
     130). Brak dawki jest pelnoprawnym wynikiem, nie stanem bledu: trzy z czterech
     kanalow nie potrzebuja etykiety wcale, czwarty czeka nazwany po imieniu.     */
      if(best){
        $("together").textContent=TOGETHER;
        var bl=best._lo, bh=best._hi, bn=esc(shortName(best));
        chan("Paid","Exclude "+bl+" days",bn+" buyers, out of prospecting",{from:0,to:bl});
        chan("Subscription",best._m+" days","new subscribers only &mdash; nobody already on a plan is moved",{to:best._m});
        crm(bl,best._m,bh,best._bi);
        chan("Store &middot; PDP","Not without the label",
             "days of supply need the dose printed on the pack, and nothing else "
             +"may supply it",null,true);
        oneDay(best._m,bl,bh,bn,best._bi,best._band);
        $("wb").textContent="No dose on these packs.";
        $("wn").innerHTML="The three settings above come from the orders alone. This one "
          +"stays empty until the maker&rsquo;s own words give a daily amount.";
      }else{
        /* Nawet tu sekcja nie zostaje naglowkiem nad pustka: zdanie mowi, na co
           te cztery ustawienia czekaja. Numeracja 01-02-03 zostaje nietknieta —
           znikajacy numer kroku czyta sie jak blad renderowania (przebieg 28).  */
        noDay();$("wb").textContent="";$("wn").textContent="";
        $("together").textContent="Four settings wait on one measured day, and this "
          +"file has not yet given one.";
      }
      return;}
    HEAD_F=F; HEAD_LAB=true;
    $("together").textContent=TOGETHER;
    var g=F._m-F._pd;
    /* "in your data" o cudzym pliku jest po prostu nieprawda, a w stanie przyciszonym
       to zdanie stalo w pelnej skali nad szarym wykresem probki. Trzech recenzentow
       UX na trzech nazwalo je najwieksza usterka tej wersji: "a shop owner can walk
       away believing 71 days is their number".                                    */
    $("verdict").innerHTML="<b>"+esc(shortName(F))+"</b> has the most repeat orders here: "+F._pd
      +" on the label, "+F._m+(HELD?" in this shop&rsquo;s orders. ":" in your data. ")+(g>0
        ? "They skip doses or they bought ahead &mdash; either way a "+F._pd
          +"-day interval refills a cupboard that is not empty."
        : g<0
        ? "They restock before the pack can be out, so the bigger size is the offer and the "
          +"reminder is not the problem."
        : "Label and behaviour agree, so this one you set from the pack and leave alone.");
    var lo=F._lo, hi=F._hi, m=F._m, u=F.unit.replace(/\.$/,"");
    var need=Math.ceil(m/F._pd);
    var n=esc(shortName(F));
    chan("Paid","Exclude "+lo+" days",n+" buyers, out of prospecting",{from:0,to:lo});
    chan("Subscription",m+" days, not "+F._pd,"new subscribers only &mdash; nobody already on a plan is moved",{to:m});
    crm(lo,m,hi,F._bi);
    chan("Store &middot; PDP","Show "+(need>1?need*F.units:F.units)+" "+esc(u),
         "covers one full cycle",{from:0,to:need*F._pd});
    oneDay(m,lo,hi,n,F._bi,F._band);
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
      +(st==="computed"?", the pack’s own two figures multiplied.":".");
    $("wn").innerHTML="&ldquo;"+esc(DOSE[F.k].q)+"&rdquo; &mdash; the maker."
      +(st==="computed"
        ? " The daily figure is not printed as one number; it is "+DOSE[F.k].serving
          +" &times; "+DOSE[F.k].times+", both of them in those words. Nothing was chosen."
        : " No date, no free text.");
  }
  /* "Omega-3 120 kaps." skracalo sie do "Omega-" — nazwa produktu z wiszacym
     myslnikiem, ktora sedzia ukladu nazwal najbrzydszym miejscem strony i
     przeczytal jako uciety string, czyli blad renderowania. Konce interpunkcyjne
     schodza; reszta ciecia zostaje bez zmian.                                   */
  function trimName(t){return String(t).replace(/[\s\-\u2013\u2014\u00b7|,.:;(\[]+$/,"").trim();}
  function shortName(F){return trimName(F.t.split(/[,0-9]/)[0])||F.t;}
  function shortName1(t){return trimName(t.split(/[,0-9]/)[0])||t;}
  /* Cztery ustawienia na JEDNEJ osi dni. Kazde ma swoj ksztalt, bo kazde jest innym
     rodzajem rzeczy: okno wykluczenia w paid to odcinek od zera, interwal subskrypcji
     to punkt, okno CRM to pasmo, a gramatura na karcie to odcinek pokrywajacy jeden
     pelny cykl. Zadna liczba nie jest nowa — wszystkie cztery stoja na ekranie od
     przebiegu 30, tylko nie bylo widac, ze dotycza tego samego dnia.              */
  var CH=[];
  function chan(b,s,e,mark,wait){CH.push({b:b,s:s,e:e,mark:mark,wait:wait});}
  /* p.38: okno CRM bylo rozstepem kwartyli z wymyslona stala odjeta od dolu.
     Reguly 25, 30 i 34 tego specu zabraniaja wymyslonych stalych — okno idzie
     od zmierzonego kwartyla do zmierzonej mediany i od niczego innego.          */
  function crm(lo,m,hi,bi){
    /* Dwa rytmy to DWIE wysylki, wiec wiersz nie ma prawa narysowac ciaglego
       odcinka miedzy nimi: odcinek czyta sie jako okno, czyli jako dokladnie to,
       czego zdanie obok zaprzecza. Linia konczy sie na pierwszej z dwoch wysylek;
       druga stoi w tekscie, bo na tej stronie jeden znak ma jedno znaczenie.   */
    if(bi) return chan("CRM","Day "+lo+" and day "+hi,
      "two rhythms here, not one &mdash; two sends, not one window",{to:lo});
    if(lo>=m) return chan("CRM","Send day "+m,
      "a quarter are back by the median, so this one has no width",{to:m});
    /* Jeden dzien roznicy miedzy p25 a mediana to nadal nie jest okno, a podpis
       "window, not a date" bylby wtedy zdaniem nieprawdziwym o wlasnym rysunku —
       sedzia rzemiosla zlapal to na pierwszej probie. Liczby zostaja obie, bo obie
       sa zmierzone; zmienia sie wylacznie to, co ekran o nich twierdzi. Rozszerzenie
       takiego okna stala jest dokladnie tym bledem, za ktory ta karta byla poprawiana
       juz trzy razy (reguly 24, 29, 34) i nie wraca.                              */
    if(m-lo<2) return chan("CRM","Send day "+lo+"&ndash;"+m,
      "one day wide, so not a window either",{from:lo,to:m});
    return chan("CRM","Send day "+lo+"&ndash;"+m,"window, not a date",{from:lo,to:m});
  }
  function oneDay(day,lo,hi,name,bi,band){
    /* p.39: zadnego rysunku. Cztery ustawienia sa czterema wpisami, zmierzony dzien
     stoi obok nich raz, duzo, jako liczba. Nic nie zniklo z tresci.             */
    $("four").innerHTML=CH.map(function(c){
      return '<div class="ch'+(c.wait?" wait":"")+'"><div class="cl"><b>'+c.b+'</b><span>'
        +c.s+'</span>'+(c.e?'<em>'+c.e+'</em>':"")+'</div></div>';
    }).join("");
    if($("cax")){
      var on=!!(CH.length&&day>0);
      if(on){
        $("daynum").textContent=day;
        /* p.39 proba druga: linia podawala ZAWSZE rozstep miedzykwartylowy, takze tam,
     gdzie kwartyl rownal sie medianie i zdanie stawalo sie puste. Klauzula
     pojawia sie tylko wtedy, kiedy ma co powiedziec.                            */
        /* p.41: ILE TA LICZBA WAZY, TUZ POD NIA. Founderzy zbijali pytanie o interwal
     subskrypcji, bo ekran drukowal jedna pewna liczbe i nic o jej wadze.        */
        /* p.42: pasmo i licznik schodza z linii podpisu; z podpisu wypada "half by day N",
     bo to byla ta sama liczba, ktora stoi obok w 116 px.                        */
        /* PRZEBIEG 50. "settled repeats" bylo slowem, ktorego czytelnik nie mial jak
     sprawdzic. Trzej founderzy na trzech postawili najnizsza ocene calej strony na
     pytaniu, czy zmieniliby po tej liczbie interwal subskrypcji (3/3/3), a DWAJ
     z trzech nazwali dokladnie to slowo: "I don't know exactly what counts as a
     'settled' repeat", "the sample size behind 1197 settled repeats". Liczba sie
     nie zmienia i zadna nowa nie wchodzi — zmienia sie tylko to, ze linia MOWI,
     co policzyla: luki od jednego dokupienia do nastepnego, z pierwszym czekaniem
     liczonym osobno. To jest dokladnie to, co robi splitGaps() od przebiegu 20.  */
        var bandEl=$("dayband"), cntEl=$("daycount");
        if(bandEl){
          if(band){ bandEl.textContent=band.lo+"\u2013"+band.hi; bandEl.hidden=false; }
          else bandEl.hidden=true;
        }
        /* p.42, poprawka po sedzim rzemiosla: gdy dolny kwartyl rowna sie medianie,
     klauzula znika i zostawala SAMA pogrubiona nazwa rodziny. Nazwa wchodzi
     wtedy do linii licznika, zeby nic nie stalo osobno.                         */
        var clause=(bi&&lo!=null&&hi!=null&&hi>lo)
              ? "half of its buyers between "+lo+" and "+hi+" days"
              : (lo!=null&&lo<day) ? "a quarter back by day "+lo : "";
        if(cntEl){
          if(band){ cntEl.textContent=(clause?"":(name?name+". ":""))
              +"Where the median holds, across "+band.n+" gaps from one reorder to the next "
              +"\u2014 the wait before the first one is counted apart."; cntEl.hidden=false; }
          else cntEl.hidden=true;
        }
        $("dayq").innerHTML=((clause||!band)
          ? ((name?"<b>"+name+"</b>":"")+(clause?(name?" &middot; ":"")+clause:""))
          : "")
          /* p.41 zostawil wniosek, ktory nadal obowiazuje: ta sama tresc postawiona jako
     OSOBNY blok pod kreska zbila uklad (4,20 -> 3,80) i nie wolno jej tam wracac. */
          ;
      }
      $("cax").hidden=!on;
    }
    CH=[];
  }
  function noDay(){$("four").innerHTML="";if($("cax"))$("cax").hidden=true;CH=[];}

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
  /* Format pliku mowi teraz EKRAN DRZWI, wiec ta linijka go nie powtarza: dwa bloki
     o tym samym to przyrost slow bez przyrostu decyzji (Z2).                      */
  var HELP_M="Paste it below, drop the file anywhere in this block, or open it from disk.";
  /* Kiedy plik jest juz przeczytany, pole stoi schowane — wiec zdanie "paste it below"
     wskazuje na cos, czego nie ma. Ten sam stan, inne zdanie.                     */
  /* p.40, naprawa nieprawdy: "Nothing leaves this browser" stalo obok "only the
     product titles are ever sent to a model". Klauzula idzie za stanem szwu.    */
  function privClause(){
    return labelSeam()
      ? "product titles go to a model only when you ask for the labels to be read"
      : "nothing at all goes to a model on this copy";
  }
  function helpF(){
    return "Counted here; no customer row leaves this browser, and "+privClause()
      +". Drop another file anywhere in this block to replace it.";
  }
  /* Pole CSV jest kontrolka tylko wtedy, kiedy czytelnik ma cos w nie wpisac.
     Przy probce jest dowodem, a dowod nie musi stac otwarty: dwoch sedziow na
     trzech nazwalo to pole "oknem terminala" i drugim najbrzydszym miejscem
     strony. Wiersze zostaja, na jedno klikniecie.                             */
  function rawView(){
    var filed=mine&&!HELD;
    document.body.classList.toggle("sample",!mine);
    document.body.classList.toggle("filed",filed);
    /* Drzwi: nie ma czego chowac i pole MUSI stac otwarte. */
    if(mine&&!filed) return;
    var pre=$("rawpre"); if(!pre) return;
    var ls=(mine?$("orders").value:SAMPLE_TXT).replace(/\s+$/,"").split("\n");
    pre.textContent=ls.slice(0,14).join("\n")
      +(ls.length>14?"\n\u2026 and "+(ls.length-14).toLocaleString("en-GB")+" more lines":"");
    var sm=$("rawsum"); if(sm) sm.textContent=mine
      ? "Show the rows I read from your file"
      : "Show the rows this reading is counted from";
    if(mine) $("shelp").innerHTML=helpF();
  }
  /* Naglowek strony mowi "45 / 69" i mowi o cudzym sklepie. Dopoki podpis pod nim
     twierdzil to samo takze po wklejeniu wlasnego eksportu, najbardziej widoczne
     zdanie na ekranie czytelnika dotyczylo nie jego danych — dwoch founderow na
     trzech i trzech recenzentow UX na trzech zlapalo to osobno.                 */
  /* p.40, naprawa nieprawdy: naglowek mowil o jednej rodzinie, a odczyt o innej —
     dwaj recenzenci uzyli slowa "cherry-picking". Biora te sama rodzine.        */
  /* p.41: zdanie tlumaczace rozjazd naglowka i odczytu nie jest juz potrzebne,
     odkad oba biora rodzine z najwieksza liczba zmierzonych odstepow.           */
  var WHOSE_S="Anonymous supplement shop, the real order history with the names removed. "
    +"Those two days are Proszek dzienny\u2019s \u2014 the pack with the most repeat orders "
    +"in the file, and the one the reading below is built on. Paste your own below "
    +"\u2014 it is counted in this browser, free.";
  var HEAD_F=null, HEAD_LAB=false;
  var HL_S='The pack says 45 days. <span>Customers came back at <span class="v">69</span>.</span>';
  var LEDE_S="What the label promises, against the gap between orders in your own export.";
  /* p.31: po wklejeniu wlasnego eksportu NAJWIEKSZY tekst na ekranie nadal mowil
     o cudzym sklepie — nazwane w trzech kolejnych pomiarach. Naglowek idzie za
     plikiem, ktory jest czytany.                                               */
  function headline(){
    var h=$("hl"), lt=$("ledetop"), c1=$("cta1"), c2=$("cta2");
    if(!h) return;
    var filed=mine&&!HELD&&HEAD_F;
    if(!filed){
      h.innerHTML=HL_S;
      if(lt) lt.textContent=LEDE_S;
      if(c1){c1.setAttribute("href","#data");c1.textContent="Check your own gap";}
      if(c2){c2.setAttribute("href","#reading");c2.innerHTML="See the reading \u2193";}
      return;
    }
    var F=HEAD_F, nm=esc(shortName(F));
    h.innerHTML=HEAD_LAB
      ? "The pack says "+F._pd+" days. <span>Your orders say <span class=\"v\">"+F._m+"</span>.</span>"
      : "Your orders say <span class=\"v\">"+F._m+" days</span>.";
    /* p.41: liczba odstepow wchodzi takze tutaj, bo to jest najwiekszy tekst na
     ekranie czytelnika — szesnascie odstepow i tysiac dwiescie nie moga wygladac
     tak samo.                                                                  */
    if(lt) lt.innerHTML=HEAD_LAB
      ? "<b>"+nm+"</b> has the most repeat orders in your file, and it is the one number the "
        +"four settings below are set from"
        +(F._band?", on "+F._band.n+" settled repeats.":".")
      : "<b>"+nm+"</b>, the line with the most repeat orders in your file"
        +(F._band?" &mdash; "+F._band.n+" of them":"")
        +": half of its buyers between "+F._lo+" and "+F._hi+" days. No pack in this file "
        +"prints a dose yet, so the label day beside it is still missing.";
    if(c1){c1.setAttribute("href","#reading");c1.textContent="See your reading";}
    if(c2){c2.setAttribute("href","#data");c2.innerHTML="Use another file \u2193";}
  }
  function whose(){
    var el=$("whose"); if(!el) return;
    var n=parseExport($("orders").value).length;
    el.innerHTML=(mine&&n)
      ? "Counted from your own export, in this browser; no customer row leaves it. "
        +"The sample shop\u2019s own reading is one click away below."
      : WHOSE_S;
    headline();
  }
  function srcStat(){
    var rows=parseExport($("orders").value), fams={}, n=0;
    rows.forEach(function(r){fams[key(r.t)]=1;n++;});
    var f=Object.keys(fams).length;
    /* Stan zrodla stoi odtad w ZDANIU, nie w wypelnionym przycisku, a dzwignia
       do drugiego zrodla znika, kiedy to wlasnie ono jest czytane. Jedno miejsce
       mowi, czyj plik jest pod reka — i jest nim tekst, nie kontrolka.          */
    $("srcnow").textContent = !mine ? "Reading the sample shop."
      : n ? "Reading your export." : "Waiting for your export.";
    $("srcS").hidden = !mine; $("srcM").hidden = mine;
    $("srcF").textContent = mine ? "open another file" : "open a file";
    $("sstat").innerHTML = n
      ? "<b>"+n+"</b> orders &middot; <b>"+f+"</b> famil"+(f===1?"y":"ies")
        +" &middot; "+(mine?"your export":"a real shop, 4.8 years")
      : (mine
          ? ($("orders").value.replace(/^\s+|\s+$/g,"")
             ? "nothing readable in that file" : "waiting for your export")
          : "nothing to read");
  }
  function setSrc(m){
    mine=m;
    /* Widoczne w OBU stanach: dopoki podpis probki byl chowany, ekran nie mowil
       nigdzie, ze liczby pochodza z prawdziwego sklepu.                        */
    $("shelp").innerHTML=m?HELP_M:HELP_S; $("shelp").hidden=false;
    $("orders").value=m?"":SAMPLE_TXT;
    paint(); doseSkeleton(); srcStat(); rawView(); whose();
    if(m){$("orders").focus();}
  }
  $("srcS").onclick=function(){setSrc(false);};
  $("srcM").onclick=function(){setSrc(true);};
  $("dout").onclick=function(){setSrc(false);
    $("reading").scrollIntoView({behavior:"smooth",block:"start"});};

  /* Eksport z Shopify przychodzi PLIKIEM, nie schowkiem: dwoch recenzentow UX na
     trzech nazwalo wejscie wylacznie przez wklejenie rzecza, ktora czyni stan pusty
     trwalym, a na telefonie sciezke do wlasnych danych po prostu niemozliwa. Plik
     wchodzi wiec trzema drogami — wybor z dysku, przeciagniecie na pole, wklejenie —
     i zadna z nich nigdzie go nie wysyla.                                        */
  function takeFile(f){
    if(!f) return;
    var r=new FileReader();
    r.onload=function(){
      mine=true;
      $("shelp").innerHTML=HELP_M;$("shelp").hidden=false;
      $("orders").value=String(r.result||"");
      paint(); doseSkeleton(); srcStat(); rawView(); whose();
    };
    r.readAsText(f);
  }
  $("srcF").onclick=function(){$("file").click();};
  $("dfile2").onclick=function(){$("file").click();};
  $("file").addEventListener("change",function(){takeFile(this.files&&this.files[0]);});
  ["dragenter","dragover"].forEach(function(e){
    $("orders").addEventListener(e,function(ev){ev.preventDefault();
      this.classList.add("drop");});});
  ["dragleave","drop"].forEach(function(e){
    $("orders").addEventListener(e,function(ev){ev.preventDefault();
      this.classList.remove("drop");});});
  $("orders").addEventListener("drop",function(ev){
    var dt=ev.dataTransfer; if(dt&&dt.files&&dt.files.length) takeFile(dt.files[0]);});
  /* Od kiedy plik jest przeczytany, pole stoi schowane — wiec cela przeciagniecia
     jest CALA sekcja 01, nie tylko pole. Inaczej druga proba z innym plikiem
     traci najkrotsza droge.                                                     */
  ["dragenter","dragover","drop"].forEach(function(e){
    $("data").addEventListener(e,function(ev){ev.preventDefault();
      if(e==="drop"){var dt=ev.dataTransfer;
        if(dt&&dt.files&&dt.files.length) takeFile(dt.files[0]);}});});

  /* Puste pole na instrukcje po wklejeniu wlasnego eksportu to slepy zaulek.
     Szkielet z nazwami rodzin z EKSPORTU zamienia je w formularz do uzupelnienia. */
  var dosesTouched=false;
  $("doses").addEventListener("input",function(){dosesTouched=true;});
  function doseSkeleton(){
    if(dosesTouched) return;
    $("doses").value=Object.keys(OBS).map(function(k){
      var F=CAT[k]; if(!F) return null;
      return shortName(F)+" | "+((mine&&!HELD)?"":F.dir);
    }).filter(Boolean).join("\n");
  }
  $("orders").value=SAMPLE_TXT;
  $("shelp").innerHTML=HELP_S; $("shelp").hidden=false;
  $("orders").addEventListener("input",function(){
    if(!mine&&$("orders").value!==SAMPLE_TXT){mine=true;
      $("shelp").innerHTML=HELP_M;$("shelp").hidden=false;}
    paint(); doseSkeleton(); srcStat(); rawView(); whose();
  });
  paint(); doseSkeleton(); srcStat(); rawView(); whose();

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
  /* Stan "off" jest STANEM, nie zniknieciem: sekcja zostaje, naglowek zostaje,
     a jej prawy podpis mowi, ze czytanie etykiet jest wylaczone na tej kopii.  */
  var AISEC=document.querySelector(".aisec");
  /* Element pobierany LENIWIE: held() na starcie strony biegnie wczesniej niz
     przypisanie AISEC nizej, wiec odczyt ze zmiennej dawal undefined.           */
  function aiNote(held){
    var el=document.querySelector(".aisec");
    return (el&&el.classList.contains("off")) ? "Off on this copy"
         : (held ? "the same file" : "AI, quoted only");
  }
  /* Zdania sekcji 02 i linia prywatnosci zaleza od tego, czy szew etykiet zyje,
     wiec kazda zmiana tego stanu musi przemalowac odczyt. Bez tego strona zastyga
     w zdaniu, ktore bylo prawda przez pierwsza sekunde zycia dokumentu.         */
  function aiPaint(){ if(PAINTED) paint(); }
  function aiOff(){
    AISEC.classList.add("off");
    ["ai1","ai2"].forEach(function(id){$(id).style.display="none";});
    $("n-ai").textContent=aiNote(document.body.classList.contains("held"));
    aiPaint();
  }
  function aiOn(){
    AISEC.classList.remove("off");
    ["ai1","ai2"].forEach(function(id){$(id).style.display="grid";});
    $("n-ai").textContent=aiNote(document.body.classList.contains("held"));
    aiPaint();
  }
  aiOff();
  if(window.claude&&claude.use) claude.use("sample").then(function(fn){
    if(!fn) return; SAMPLE=fn; aiOn();
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

  /* ==== WYNIK DO FORMULARZA — port Tool v12, NIE silnik ======================
     Tylko CZYTA to, co silnik policzyl w paint() i pokazal w verdict(): zadnej
     wlasnej mediany, kwartyli ani wyboru rodziny. verdict() zostaje bajt w bajt;
     ten blok owija go i po kazdym przeliczeniu przepisuje wynik do data-*
     formularza #tool-enquiry. Zmieni sie liczenie w silniku — formularz pojedzie
     za nim sam.
     Wynik idzie TYLKO z wlasnego eksportu (mine&&!HELD): przykladowy sklep nie moze
     wyjsc mailem jako czyjas analiza, wiec formularz jest wtedy schowany.
     sampleN = F._n, czyli „settled gaps" z ekranu — tak silnik mierzy probe.
     windowDays = rozpietosc dat zamowien w pliku: odczyt wyniku parseExport()
     na tym samym tekscie, ktory silnik wlasnie przeczytal — nie nowa regula.
     Bez niego mail nie ostrzeze, ze pewna liczba stoi na trzech miesiacach.   */
  (function(){
    var form=$("tool-enquiry"), box=$("send-analysis");
    if(!form||!box) return;
    var KEYS=["interval","labelDay","sampleN","windowDays","bimodal","intervalLow","intervalHigh"];
    function put(r){
      KEYS.forEach(function(k){form.dataset[k]=(r&&r[k]!=null)?String(r[k]):"";});
      box.hidden=!r;
    }
    /* Ktora rodzina: przy etykiecie ta, ktora verdict() dostal; bez etykiety ta,
       ktorej nazwe verdict() wlasnie wypisal w <b> — odczyt z ekranu, nie wybor. */
    function shown(F){
      if(F) return F;
      var b=$("verdict").querySelector("b"), name=b?b.textContent:null, hit=null;
      if(!name) return null;
      Object.keys(OBS).forEach(function(k){var C=CAT[k];if(C&&shortName(C)===name) hit=C;});
      return hit;
    }
    /* Rozpietosc w dniach miedzy najwczesniejsza a najpozniejsza data zamowienia. */
    function windowDays(){
      var lo=Infinity, hi=-Infinity;
      parseExport(srcText()).forEach(function(r){
        if(r.d<lo) lo=r.d; if(r.d>hi) hi=r.d;});
      var w=Math.round(hi-lo);
      return isFinite(w)&&w>=1?w:null;
    }
    var engineVerdict=verdict;
    verdict=function(F){
      engineVerdict(F);
      /* Wersja petli: HELD = wlasne zrodlo wybrane, ale plik pusty — silnik liczy
         wtedy dalej PROBKE (srcText()). Wynik idzie tylko, gdy jest z pliku
         czytelnika: to samo „filed", ktorego uzywa silnik (mine&&!HELD).     */
      var C=(mine&&!HELD)?shown(F):null;
      put(C&&C._m&&!C._thin?{interval:C._m,labelDay:F?C._pd:null,sampleN:C._n,
        windowDays:windowDays(),bimodal:C._bi,intervalLow:C._lo,intervalHigh:C._hi}:null);
    };
    put(null);
  })();
})();
