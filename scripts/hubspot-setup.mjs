#!/usr/bin/env node
/**
 * Zakłada w HubSpocie własne właściwości kontaktu, których potrzebuje
 * /api/lead. Idempotentny — istniejące pomija, brakujące dokłada.
 *
 *   node scripts/hubspot-setup.mjs           # pokazuje, co zrobi
 *   node scripts/hubspot-setup.mjs --apply   # tworzy
 *
 * Klucz czyta z .env.local i nigdzie go nie wypisuje.
 */
import { readFileSync } from 'node:fs';

const APPLY = process.argv.includes('--apply');
const GROUP = 'contactinformation';

function env(name) {
  if (process.env[name]) return process.env[name];
  for (const f of ['.env.local', '.env']) {
    try {
      const line = readFileSync(f, 'utf8')
        .split('\n')
        .find((l) => l.startsWith(name + '='));
      if (line) return line.slice(name.length + 1).trim().replace(/^["']|["']$/g, '');
    } catch {}
  }
  return null;
}

const KEY = env('HUBSPOT_API_KEY');
if (!KEY) {
  console.error('Brak HUBSPOT_API_KEY w .env.local — nic nie robię.');
  process.exit(1);
}

/** Jedyne pole, które naprawdę kwalifikuje: dzieli skrzynkę na dwa kubełki. */
const PROPS = [
  {
    name: 'lead_intent',
    label: 'Lead intent',
    type: 'enumeration',
    fieldType: 'select',
    description: 'Czy poprosił tylko o sheet, czy o mark-up i rozmowę o współpracy.',
    options: [
      { label: 'Wants mark-up', value: 'wants mark-up', displayOrder: 0 },
      { label: 'Sheet only', value: 'sheet only', displayOrder: 1 },
    ],
  },
  { name: 'fmcg_category', label: 'FMCG category', type: 'string', fieldType: 'text',
    description: 'Kategoria wybrana w narzędziu.' },
  { name: 'pack_days', label: 'Pack days', type: 'number', fieldType: 'number',
    description: 'Na ile dni starcza jedno opakowanie — deklaracja odwiedzającego.' },
  { name: 'reorder_band', label: 'Reorder day', type: 'string', fieldType: 'text',
    description: 'Dzień odkupu podany przez odwiedzającego, albo "unknown".' },
  {
    name: 'knows_own_interval',
    label: 'Knows own interval',
    type: 'enumeration',
    fieldType: 'select',
    description: 'Czy potrafił odczytać własny interwał z danych. Sam w sobie kwalifikator — kto zna swoją liczbę, jest innym rozmówcą.',
    options: [
      { label: 'Yes', value: 'yes', displayOrder: 0 },
      { label: 'No', value: 'no', displayOrder: 1 },
    ],
  },
  { name: 'gap_days', label: 'Gap days', type: 'number', fieldType: 'number',
    description: 'Luka między końcem opakowania a powrotem klienta.' },
  { name: 'leak_per_year_pln', label: 'Leak per year (PLN)', type: 'number', fieldType: 'number',
    description: 'Wyciek roczny policzony na liczbach podanych przez odwiedzającego.' },
  { name: 'steps_already_running', label: 'Steps already running', type: 'number', fieldType: 'number',
    description: 'Ile z osiemnastu kroków zaznaczył jako już wdrożone.' },
  { name: 'first_touch_source', label: 'First touch source', type: 'string', fieldType: 'text',
    description: 'utm_source albo referrer z pierwszego wejścia.' },
  { name: 'first_touch_campaign', label: 'First touch campaign', type: 'string', fieldType: 'text',
    description: 'utm_campaign z pierwszego wejścia.' },
];

const H = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const BASE = 'https://api.hubapi.com/crm/v3/properties/contacts';

const existing = await fetch(BASE, { headers: H }).then(async (r) => {
  if (!r.ok) {
    console.error(`HubSpot odpowiedział ${r.status}. Sprawdź uprawnienia tokena (crm.schemas.contacts.write).`);
    process.exit(1);
  }
  return new Set((await r.json()).results.map((p) => p.name));
});

let made = 0, skipped = 0, failed = 0;

for (const p of PROPS) {
  if (existing.has(p.name)) {
    console.log(`  jest       ${p.name}`);
    skipped++;
    continue;
  }
  if (!APPLY) {
    console.log(`  do zrobienia  ${p.name}  (${p.type})`);
    made++;
    continue;
  }
  const res = await fetch(BASE, {
    method: 'POST',
    headers: H,
    body: JSON.stringify({ ...p, groupName: GROUP, hasUniqueValue: false, hidden: false, formField: false }),
  });
  if (res.ok) {
    console.log(`  utworzone  ${p.name}`);
    made++;
  } else {
    console.error(`  BŁĄD       ${p.name} → ${res.status} ${await res.text()}`);
    failed++;
  }
}

console.log(
  APPLY
    ? `\nGotowe. Utworzone: ${made}, pominięte: ${skipped}, błędy: ${failed}.`
    : `\nTo był podgląd. Do utworzenia: ${made}, już istnieje: ${skipped}.\nUruchom ponownie z --apply.`,
);
