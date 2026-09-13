// app/api/label/route.ts
//
// Backend dla dwoch szwow AI narzedzia (/tool). Klucz nie trafia do przegladarki.
//
// GET   — sonda: 200 gdy skonfigurowane, 503 gdy nie. Shim w tool-runtime.js
//         pyta o to przy starcie i chowa panele, gdy dostanie 503.
// POST  — {prompt: string} → tablica JSON zwrocona przez model, albo {code}.
//
// Slownik kodow jest ten sam, ktory narzedzie juz zna:
// rate_limited · invalid_json · refused · sampling_disabled · not_configured

import { NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Aktualne ID z dokumentacji modeli, nie z pamieci. Nie ma sufiksu daty —
// `claude-opus-5-2026...` i podobne warianty daja 404.
const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-opus-5'
const MAX_PROMPT = 12_000

// Na tym modelu myslenie jest wlaczone domyslnie, a max_tokens jest wspolnym
// sufitem dla myslenia I odpowiedzi. Przy 2000 dwanascie obiektow z notatka
// potrafi zostac przyciete w polowie, co trasa zglasza jako invalid_json —
// awaria wygladajaca na blad modelu, a bedaca bledem budzetu.
const MAX_TOKENS = 4_000

const Body = z.object({
  prompt: z.string().min(1).max(MAX_PROMPT),
})

// Hamulec na przypadkowy zalew, nie ochrona: pamiec procesu, wiec kazda instancja
// liczy swoje. Przy realnym ruchu zamien na Vercel KV albo Upstash.
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_HOUR = Number(process.env.LABEL_MAX_PER_HOUR ?? 30)
const hits = new Map<string, number[]>()

// Znacznik dopisujemy wylacznie dla zadania przepuszczonego — inaczej odbite
// zadanie tez przesuwa koniec okna i ponawianie nigdy nie przechodzi. Ta sama
// poprawka co w /api/lead; prog bez zmian.
function overLimit(ip: string): boolean {
  if (process.env.NODE_ENV !== 'production') return false
  const now = Date.now()
  const seen = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (seen.length >= MAX_PER_HOUR) {
    hits.set(ip, seen)
    return true
  }
  seen.push(now)
  hits.set(ip, seen)
  if (hits.size > 5_000) hits.clear()
  return false
}

const fail = (code: string, status: number) => NextResponse.json({ code }, { status })

export async function GET() {
  return process.env.ANTHROPIC_API_KEY
    ? NextResponse.json({ ok: true })
    : fail('sampling_disabled', 503)
}

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return fail('sampling_disabled', 503)

  // Origin liczony z zadania, nie ze stalej w env — dziala tak samo na produkcji,
  // na preview i na localhoscie.
  const origin = req.headers.get('origin')
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get('host')) return fail('refused', 403)
    } catch {
      return fail('refused', 403)
    }
  }

  const ip = (req.headers.get('x-forwarded-for') ?? 'local').split(',')[0]!.trim()
  if (overLimit(ip)) return fail('rate_limited', 429)

  let parsed: z.infer<typeof Body>
  try {
    parsed = Body.parse(await req.json())
  } catch {
    return fail('invalid_json', 422)
  }

  let res: Response
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        // Odczyt etykiety to zadanie plytkie. `effort: low` sciaga myslenie do
        // minimum zamiast wylaczac je calkiem: wylaczone myslenie na tym modelu
        // potrafi wypuscic znaczniki <thinking> do widocznej odpowiedzi, a to
        // trafia prosto w parser ponizej.
        thinking: { type: 'adaptive' },
        output_config: { effort: 'low' },
        system:
          'You return data, not prose. Reply with ONLY the JSON the user asks for — ' +
          'no preamble, no code fence, no trailing commentary. If you cannot answer a ' +
          'field, use null rather than inventing a value.',
        messages: [{ role: 'user', content: parsed.prompt }],
      }),
    })
  } catch {
    return fail('refused', 502)
  }

  if (res.status === 429) return fail('rate_limited', 429)
  if (!res.ok) return fail('refused', 502)

  let text: string
  try {
    const json = (await res.json()) as { content?: Array<{ type?: string; text?: string }> }
    text = (json.content ?? [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text ?? '')
      .join('')
      .trim()
  } catch {
    return fail('invalid_json', 502)
  }

  // Model bywa uprzejmy mimo instrukcji: zdejmij plot i wytnij pierwszy
  // kompletny obiekt albo tablice.
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
  const first = text.search(/[[{]/)
  const last = Math.max(text.lastIndexOf(']'), text.lastIndexOf('}'))
  if (first === -1 || last <= first) return fail('invalid_json', 502)

  try {
    return NextResponse.json(JSON.parse(text.slice(first, last + 1)))
  } catch {
    return fail('invalid_json', 502)
  }
}
