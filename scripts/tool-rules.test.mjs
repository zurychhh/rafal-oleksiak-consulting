#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   Zapadka na regulach parsera z tool-index.html.

   Narzedzie jest podmieniane z zewnatrz przez pętlę, ktora nie zna historii tych
   poprawek. Kazda z nich zostala kupiona pomiarem na prawdziwym katalogu i kazda
   da sie cofnac jednym nieuwaznym nadpisaniem. Dlatego test NIE trzyma kopii
   regul — wycina blok RULES z tool-index.html i uruchamia to, co faktycznie
   pojedzie na produkcje.

   Dwie warstwy:
     A. jednostkowa, zawsze — 22 przypadki, kazdy odpowiada jednej poprawce.
     B. regresja na prawdziwym katalogu (130 SKU), gdy dane sa dostepne.
        Dane sa cudze i NIE leza w tym repo. Sciezka z CALIB_PRODUCTS albo
        domyslna obok repo. Bez nich warstwa B jest pominieta — glosno.

   Uruchomienie:  node scripts/tool-rules.test.mjs
   --------------------------------------------------------------------------- */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "tool-index.html");

let failures = 0;
const ok = (name, cond, got) => {
  if (cond) return;
  failures++;
  console.log(`  FAIL  ${name}${got === undefined ? "" : `  — dostalem: ${JSON.stringify(got)}`}`);
};
const eq = (name, got, want) => ok(name, Object.is(got, want) || got === want, got);

/* ---------- 1. reguly WYCIETE ZE ZRODLA, nie przepisane ---------- */
const html = fs.readFileSync(SRC, "utf8");
const block = html.match(/RULES:BEGIN[\s\S]*?\*\/([\s\S]*?)\/\*\s*==== RULES:END/);
if (!block) {
  console.log("FAIL  brak bloku RULES:BEGIN/RULES:END w tool-index.html");
  process.exit(1);
}
const R = new Function(
  `${block[1]}
   return {normKey,quoteHasNumber,hasQty,hasTimes,wordQty,wordTimes,doseStatus,
           packFactor,plainUnits,med,pct,splitGaps,reactSplit,bimodal,REACT_DAYS};`
)();

/* ---------- 2. warstwa A: po jednym przypadku na poprawke ---------- */
console.log("A. reguly parsera");

/* 1 — normalizacja SKU przed dopasowaniem */
eq("normalizacja skleja drift zapisu", R.normKey("CG 60 KAPSUŁEK"), R.normKey("cg60kapsułek"));
ok("normalizacja zdejmuje interpunkcje", R.normKey("Proszek, 45 g.") === "PROSZEK45G");

/* 2 — ekwiwalent w nawiasie czyta sie jako dawke */
eq("(0,5 g) dwa razy dziennie = 1 g/dzien",
  R.doseStatus({ perDay: 1, serving: 0.5, times: 2, q: "Pol miarki (0,5 g) dwa razy dziennie." }),
  "computed");
eq("1 lyzeczka (1g) dwa razy dziennie = 2 g/dzien",
  R.doseStatus({ perDay: 2, serving: 1, times: 2, q: "1 plaska lyzeczka (1g), dwa razy dziennie." }),
  "computed");
eq("liczba wydrukowana wprost to odczyt, nie wyliczenie",
  R.doseStatus({ perDay: 1, q: "1 saszetka dziennie przed positkiem." }), "read");
eq("liczba slowem tez jest wydrukowana",
  R.doseStatus({ perDay: 1, q: "Jedna saszetka dziennie przed positkiem." }), "read");

/* 3 — sufit to nie dawka (rozszerzenie Z8) */
eq("maksymalna porcja dzienna nie jest dawka",
  R.doseStatus({ perDay: 6, q: "Maksymalna porcja dzienna to 6 kapsulek." }), "none");
eq("nie nalezy przekraczac nie jest dawka",
  R.doseStatus({ perDay: 8, q: "Nie nalezy przekraczac 8 tabletek dziennie." }), "none");

/* Z8 w mocy: srodek przedzialu dalej odpada */
eq("srodek przedzialu odpada",
  R.doseStatus({ perDay: 45, serving: 30, times: 1.5, q: "1 miarke (30 g) 1-2 razy dziennie." }),
  "none");
eq("przedzial samej porcji odpada",
  R.doseStatus({ perDay: 3, serving: 1.5, times: 2, q: "1-2 kapsulki dwa razy dziennie." }), "none");
/* ...ale przedzial opisujacy COS INNEGO nie psuje odczytu wydrukowanego wprost */
eq("przedzial masy psa nie psuje odczytu dawki",
  R.doseStatus({ perDay: 300, q: "ok. 300 g dla psa o masie 15-20 kg" }), "read");
eq("iloczyn ktory sie nie zgadza odpada",
  R.doseStatus({ perDay: 9, serving: 0.5, times: 2, q: "Pol miarki (0,5 g) dwa razy dziennie." }),
  "none");
eq("brak cytatu odpada", R.doseStatus({ perDay: 2, q: "" }), "none");

/* 4 — wielopaki mnoza */
eq("sufiks x2", R.packFactor("Proszek dzienny 45 g x2"), 2);
eq("dwupak", R.packFactor("Proszek dzienny 45 g - dwupak"), 2);
eq("trojpak", R.packFactor("Saszetki 30 szt. trojpak"), 3);
eq("pojedyncze", R.packFactor("Proszek dzienny 45 g"), 1);
eq("dwupak mnozy zawartosc", R.plainUnits("Proszek dzienny 45 g - dwupak").v, 90);
eq("zestaw roznych produktow zostaje nieustalony",
  R.plainUnits("Zestaw: 120 kapsulek, 60 tabletek"), null);
eq("gramatura pisana slowem", R.plainUnits("FUREVER, 500 gram proszek").v, 500);

/* 5 — luka 1->2 osobno od 2->3+ */
{
  const s = R.splitGaps([0, 10, 30, 70]);
  eq("pierwsza luka osobno", JSON.stringify(s.first), "[10]");
  eq("rytm ustalony osobno", JSON.stringify(s.later), "[20,40]");
}

/* 6 — rozklad, nie mediana */
eq("p75 dwa razy mediana to dwa rozklady", R.bimodal(52, 120), true);
eq("waski rozrzut to jeden rozklad", R.bimodal(69, 135), false);

/* 7 — reaktywacje liczone osobno */
{
  const s = R.reactSplit([10, 70, 400, 800]);
  eq("cykl bez reaktywacji", JSON.stringify(s.cycle), "[10,70]");
  eq("reaktywacje policzone", s.react.length, 2);
  eq("prog reaktywacji to rok", R.REACT_DAYS, 365);
}

/* ---------- 3. warstwa B: regresja na prawdziwym katalogu ---------- */
const DATA = process.env.CALIB_PRODUCTS
  || path.resolve(ROOT, "../genactiv-klaviyo/data/genactiv/produkty.csv");

/* Czytnik instrukcji producenta po polsku. Odpowiada temu, o co prompt prosi
   model: porcja, czestotliwosc, cytat. Werdykt wydaje juz doseStatus ZE ZRODLA,
   wiec to jest test regul narzedzia, a nie tego czytnika.                      */
const CUT = /(maksymaln\w+ porcj|nie nale[zż]y przekracz|uwaga|zachowa[cć] ostro[zż]no)/i;
const RANGE = /(\d+[.,]?\d*)\s*(?:[-–—]|\bdo\b)\s*(\d+[.,]?\d*)\s*(kapsu\w*|tabletk\w*|tabletek|saszetk\w*|saszetek|miark\w*|ml|g)\b/i;
const SINGLE = /(\d+[.,]?\d*|jedn[aąeoj]\w*|jeden|dwie|dwa|trzy|cztery|p[oó][lł])\s*(kapsu\w*|tabletk\w*|tabletek|saszetk\w*|saszetek|miark\w*|ml|g)\b/i;
const PAREN = /(?:\d+[.,]?\d*|jedn\w*|p[oó][lł]|dwie|dwa|trzy)\s*(?:miark\w*|kapsu\w*|tabletk\w*|saszetk\w*|ly[zż]eczk\w*|ły[zż]eczk\w*)\s*\(\s*(\d+[.,]?\d*)\s*(g|ml)\s*\)/i;
const TIMES = /(raz|dwa|dwie|trzy|cztery)\s+razy?\s+dziennie/i;
const DAILY = /dziennie|na dob[eę]|dobowo/i;
const VAGUE = /(co drugi dzie|w zale[zż]no|wg potrzeb|wed[lł]ug potrzeb|w razie potrzeb|zazwyczaj|co najmniej)/i;
const WORDN = { jedn: 1, jeden: 1, dwie: 2, dwa: 2, trzy: 3, cztery: 4, pol: 0.5, pól: 0.5 };
const FREQ = { raz: 1, dwa: 2, dwie: 2, trzy: 3, cztery: 4 };

const toNum = (s) => {
  const t = String(s).trim().toLowerCase();
  if (/^\d/.test(t)) return parseFloat(t.replace(",", "."));
  for (const k of Object.keys(WORDN)) if (t.startsWith(k)) return WORDN[k];
  return null;
};
const unitOf = (s) => {
  if (/kapsu/i.test(s)) return "kaps.";
  if (/tabletk|tabletek/i.test(s)) return "szt.";
  if (/saszetk|saszetek/i.test(s)) return "szt.";
  if (/miark/i.test(s)) return "miarka";
  if (/^ml$/i.test(s)) return "ml";
  if (/^g$/i.test(s)) return "g";
  return null;
};

function readDirections(txt) {
  const t = String(txt || "").replace(/\s+/g, " ").trim();
  if (!t) return { reason: "brak tekstu producenta" };
  const c = CUT.exec(t);
  const head = (c ? t.slice(0, c.index) : t).trim() || t;
  const quote = head.slice(0, 120);
  if (RANGE.test(head)) return { quote, reason: "przedzial dawki" };
  if (!DAILY.test(head)) return { quote, reason: "brak czestotliwosci dziennej" };
  if (VAGUE.test(head)) return { quote, reason: "czestotliwosc nieostra" };

  const tm = TIMES.exec(head);
  const times = tm ? (FREQ[tm[1].toLowerCase()] ?? 1) : 1;
  const cand = {};
  const sm = SINGLE.exec(head);
  if (sm) {
    const q = toNum(sm[1]);
    const u = unitOf(sm[2]);
    if (q !== null && u) cand[u] = q;
  }
  const pe = PAREN.exec(head);
  if (pe) cand[pe[2].toLowerCase() === "ml" ? "ml" : "g"] = parseFloat(pe[1].replace(",", "."));
  if (!Object.keys(cand).length) return { quote, reason: "brak dawki liczbowej" };
  return { quote, times, servings: cand };
}

function readPack(gram) {
  const g = String(gram || "").trim();
  if (!g) return { reason: "brak gramatury" };
  const found = [...g.matchAll(/(\d+[.,]?\d*)\s*(kapsu\w*|tabletk\w*|tabletek|saszetk\w*|saszetek|ml\b|gram\w*|g\b)/gi)];
  if (!found.length) return { reason: "gramatura nieczytelna" };
  const units = new Set(found.map((f) => unitOf(f[2]) || (/gram|^g$/i.test(f[2]) ? "g" : null)));
  if (units.size > 1) return { reason: "zestaw roznych produktow" };
  if (found.length > 1) return { reason: "gramatura niejednoznaczna" };
  return { v: parseFloat(found[0][1].replace(",", ".")), u: [...units][0] };
}

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (ch !== "\r") cell += ch;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

console.log("\nB. regresja na prawdziwym katalogu");
if (!fs.existsSync(DATA)) {
  console.log(`  POMINIETE — brak ${DATA}`);
  console.log("  Dane sa cudze i nie leza w tym repo. Sciezka: CALIB_PRODUCTS=/…/produkty.csv");
} else {
  const rows = parseCsv(fs.readFileSync(DATA, "utf8"));
  const head = rows.shift().map((h) => h.trim());
  const col = (r, n) => r[head.indexOf(n)] || "";
  const seen = new Map();
  for (const r of rows) {
    if (!r || r.length < 5) continue;
    const k = R.normKey(col(r, "sku"));
    if (!k || seen.has(k)) continue;
    seen.set(k, r);
  }

  const reasons = new Map();
  const bump = (why) => reasons.set(why, (reasons.get(why) || 0) + 1);
  let computed = 0;
  const computedSkus = [];

  for (const [k, r] of seen) {
    const pack = readPack(col(r, "gramatura_lub_liczba_sztuk"));
    const dir = readDirections(col(r, "sposob_uzycia"));
    /* Gramatura PRZED dawka — ta sama kolejnosc co w kalibracji recznej.
       Pozycja bez czytelnej gramatury nie ma dni zapasu niezaleznie od dawki,
       wiec liczy sie tam, a nie w kubelku "przedzial".                       */
    if (pack.reason) { bump(pack.reason); continue; }
    if (dir.reason) { bump(dir.reason); continue; }

    const serving = dir.servings[pack.u];
    if (serving === undefined) {
      bump(`niezgodnosc jednostek (opakowanie w ${pack.u}, dawka w ${Object.keys(dir.servings).join("/")})`);
      continue;
    }
    const perDay = serving * dir.times;
    /* werdykt wydaje regula ZE ZRODLA narzedzia */
    const st = R.doseStatus({ perDay, serving, times: dir.times, q: dir.quote });
    if (st === "none") { bump("odrzucone przez doseStatus"); continue; }
    const mult = R.packFactor(col(r, "produkt")) || 1;
    if (!(pack.v > 0)) { bump("gramatura nieczytelna"); continue; }
    computed++;
    computedSkus.push(`${k}=${Math.round((pack.v * mult) / perDay)}d`);
  }

  const notOnPack = seen.size - computed;
  const byRange = reasons.get("przedzial dawki") || 0;
  console.log(`  SKU w katalogu          : ${seen.size}`);
  console.log(`  policzone (dni zapasu)  : ${computed}`);
  console.log(`  "not on the pack"       : ${notOnPack}`);
  console.log(`  w tym przedzial dawki   : ${byRange}`);
  for (const [w, n] of [...reasons].sort((a, b) => b[1] - a[1])) {
    console.log(`      ${String(n).padStart(4)}  ${w}`);
  }

  /* Liczby z kalibracji recznej z 13.09.2026. Rozjazd = regresja, nie "nowy stan". */
  /* UWAGA na 68, nie 69. Pierwszy raport z kalibracji podawal 69 pozycji odrzuconych
     przez przedzial dawki i 115 "not on the pack" — obie liczone po WIERSZACH pliku
     (136), nie po unikalnych SKU (130). Trzy SKU wystepuja dwukrotnie, bo maja wariant
     promocyjny albo wyprzedazowy: CIMK180KAPSUEK, CZCP30SASZETEK i BUTELKADLADZIECI….
     Z tej trojki przedzial dawki ma tylko pierwszy, stad dokladnie jeden wiersz
     nadmiarowy: 69 - 1 = 68. Tak samo 115 - 2 = 113. Liczba policzonych (17) byla od
     poczatku liczona po SKU i sie nie zmienia.                                       */
  eq("katalog ma 130 SKU", seen.size, 130);
  eq("policzonych 17", computed, 17);
  eq("not on the pack 113", notOnPack, 113);
  eq("przedzial dawki 68", byRange, 68);
  if (failures) console.log(`  policzone SKU: ${computedSkus.sort().join(" ")}`);
}

console.log(failures ? `\n${failures} FAIL` : "\nOK");
process.exit(failures ? 1 : 0);
