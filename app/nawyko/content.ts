/* Teksty wspolne dla klienta (NawykoClient) i serwera (JSON-LD w page.tsx).
   Osobny modul bez 'use client': stala importowana z pliku 'use client' do komponentu serwerowego
   jest referencja klienta, nie wartoscia. JSON-LD bierze tekst STAD, wiec znacznik jest zawsze slowo w slowo
   z widocznym tekstem (scripts/jsonld-rules.test.mjs to sprawdza na wyrenderowanej stronie). */

export const FAQ = [
  {
    q: 'Will customers really tick every day?',
    a: 'Not every customer, and not every day. A card takes seconds, a missed day never costs a level, and the brand sees how often customers tick as totals, never one person’s ticks.',
  },
  {
    q: 'What about GDPR and health data?',
    a: 'A tick is stored only as a ticked date, and only with the customer’s consent. Nothing about symptoms or goals is collected, and ticks never reach ads, analytics, push messages or email.',
  },
  {
    q: 'What does a reward cost, and who sets it?',
    a: 'The brand sets every reward and threshold, so the most a customer can earn is known before the programme starts. Rewards are fixed and shown in advance, never random.',
  },
  {
    q: 'How long does setup take?',
    a: 'Setup time depends on your store and the tools to connect. Both are mapped in the first call.',
  },
  {
    q: 'Does it work for pharmacy purchases?',
    a: 'Yes. A scanned pharmacy receipt confirms the purchase; the code on the box registers the pack, not where it was bought.',
  },
  {
    q: 'What if a customer does not give consent?',
    a: 'Every feature stays visible. The daily card and streak show as locked, with one button to turn them on. No reward depends on push or email consent.',
  },
] as const

/* Naglowki scen /nawyko — te same ciagi stoja w NawykoClient (h2); test JSON-LD sprawdza, ze kazdy jest widoczny. */
export const FEATURES = [
  'You set what each point is worth.',
  'A second product, earned in five short lessons.',
  'Pharmacy buyers show up in your data after one scan.',
  'Health data never reaches your marketing.',
  'Reorder lift, measured against customers who never get the app.',
  'Any store engine: pick yours, from Shopify to a custom build.',
] as const

/* PILNE 2 pkt 3 (Rafal 28.11.2026 11:33: „nie rozumiem kolejnosci, dlaczego co jest po czym”): przerywniki rozdzialow
   przed kazda sekcja /nawyko — numer, nazwa (ta sama w pasku rozdzialow) i jedno zdanie, dlaczego to wlasnie teraz.
   {b} = nazwa marki odwiedzajacego (albo marki pokazowej). Kolejnosc sekcji bez zmian. Bramka tekstow: copy-voice +
   czytelnik-kupujacy (agencja/recenzje/58-*). */
export const NK_CHAPTERS = [
  { id: 'ch-store', label: 'Start here', why: 'Ready to start? Two fields and you are done. Want detail first? Every section below shows what {b} customers get.' },
  { id: 'ch-how', label: 'How it works', why: 'The whole app in four steps, from purchase to the next pack. Each section after this opens one part of it.' },
  { id: 'ch-rewards', label: 'Rewards', why: 'Next, what customers earn: cashback and points they can spend only on the next {b} order.' },
  { id: 'ch-side', label: 'Your side', why: 'Now your side: what you set, from rewards to consents, and when packs are due to run out.' },
  { id: 'ch-engine', label: 'Store engine', why: 'Rewards are redeemed as single-use codes in the {b} online store. Shopify is ready; other engines connect through an adapter.' },
  { id: 'ch-faq', label: 'FAQ', why: 'Before a first call: answers on data, cost, setup, pharmacy purchases and consent.' },
  { id: 'ch-morning', label: 'One morning', why: 'A recap: one customer’s morning in {b}’s colours, with every part above working together.' },
  { id: 'ch-next', label: 'Next step', why: 'Send your store address. Rafał replies personally within 24 hours.' },
] as const
