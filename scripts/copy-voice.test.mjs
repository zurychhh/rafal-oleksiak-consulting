// Copy voice gate for hand-written routes (agencja/rubryka-tekstow.md, rules 1 and 4).
// Scans headings, one-line leads and buttons for first person and banned filler words. Usage: node scripts/copy-voice.test.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROUTES = ['app/nawyko', 'app/calculator', 'app/lab', 'app/work'];
const FIRST_PERSON = /\b(I|[Mm]e|[Mm]y|[Mm]ine|[Ww]e|[Oo]urs?)\b/;
const BANNED = /\b(seamless(ly)?|powerful|effortless(ly)?|supercharge|game[- ]chang\w+|revolutionary|unlock(s|ed|ing)?)\b/i;
// Elements whose text is a headline, a scene lead or a call to action.
const BLOCK = /<(h1|h2|h3|button)\b[^>]*>([\s\S]*?)<\/\1>|<p className="[^"]*\b(nk-one|lead|sub)\b[^"]*"[^>]*>([\s\S]*?)<\/p>/g;

export function check(source) {
  const problems = [];
  for (const m of source.matchAll(BLOCK)) {
    const text = (m[2] ?? m[4] ?? '').replace(/\{[^}]*\}/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim();
    if (!text) continue;
    if (FIRST_PERSON.test(text)) problems.push(`first person: "${text}"`);
    if (BANNED.test(text)) problems.push(`banned filler: "${text}"`);
  }
  // Second pass (R8): visible copy kept in string literals (COPY arrays, props) was invisible to the JSX pass.
  // Sentence-like literals only: starts with a capital letter, has at least three words, no code characters.
  for (const m of source.matchAll(/(['"`])([A-Z][^'"`\n{}<>=;]{8,}?)\1/g)) {
    const text = m[2].trim();
    if (text.split(/\s+/).length < 3) continue;
    // Consent wording is the owner's own legal text (decided with the form), not product copy.
    if (/^(I agree|Occasional email from me)/.test(text)) continue;
    if (FIRST_PERSON.test(text)) problems.push(`first person (literal): "${text}"`);
    if (BANNED.test(text)) problems.push(`banned filler (literal): "${text}"`);
  }
  return problems;
}

// Self-test: the gate must catch the headline that started it.
const self = check('<h2 className="x">Your name on it, not mine.</h2><h2>Your brand. Your colours. Your app.</h2>');
if (self.length !== 1) { console.error('copy-voice self-test failed', self); process.exit(2); }
// Self-test R8: copy in a string literal must be caught too (it was not, round 4).
const self2 = check("const COPY = [{ h: 'Turn on and unlock the app.' }, { h: 'We built it for you.' }];");
if (self2.length !== 2) { console.error('copy-voice literal self-test failed', self2); process.exit(2); }

let failed = 0;
for (const dir of ROUTES) {
  if (!existsSync(dir)) continue;
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(d, e.name)) : /\.tsx$/.test(e.name) ? [join(d, e.name)] : []);
  for (const file of walk(dir)) {
    for (const p of check(readFileSync(file, 'utf8'))) { console.error(`${file}: ${p}`); failed++; }
  }
}
if (failed) { console.error(`copy-voice: ${failed} problem(s). See agencja/rubryka-tekstow.md.`); process.exit(1); }
console.log('copy-voice: OK');
