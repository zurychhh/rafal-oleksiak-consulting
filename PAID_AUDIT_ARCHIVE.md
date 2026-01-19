# PAID_AUDIT_ARCHIVE.md - Dokumentacja Płatnego Audytu

**Data archiwizacji:** 2026-01-17
**Powód:** Tymczasowe wyłączenie funkcji płatnego audytu - strona gotowa do reklamowania, płatny audyt do przywrócenia później
**Status:** ARCHIVED - do przywrócenia w przyszłości

---

## Streszczenie

Ten plik dokumentuje w pełni działającą funkcjonalność płatnego audytu LAMA (€99), która została tymczasowo usunięta z frontendu. Backend i logika pozostają w kodzie - wystarczy przywrócić elementy UI.

---

## Co było zaimplementowane

### 1. Flow płatnego audytu

```
User wypełnia formularz → Klika "Get Full Audit €99" →
Stripe Checkout Session created → User płaci na Stripe →
Webhook checkout.session.completed → LAMA audit z paid=true →
100+ page PDF generated → Email z PDF załączony →
/audit-success page wyświetlona
```

### 2. Pricing

- **Standard:** €99 (STRIPE_PRICE_ID w env)
- **Premium:** €199 (planowane, nie zaimplementowane)

### 3. Pliki z płatnym audytem

#### Frontend (USUNIĘTE z UI, kod pozostaje):

**app/components/sections/FinalCTA.tsx:**
- `handlePaidAudit()` function (linie ~152-239)
- State: `isPaidLoading`, `paidError`
- Przycisk "Get Full 100+ Page Report €99"
- Divider "or get the full report"
- Lista benefitów płatnego audytu

**app/components/ui/FinalSuccessScreen.tsx:**
- Path 02: "FULL REPORT PATH" - "Unlock complete paid analysis — 100+ pages..."

**lib/lama/email-template.ts:**
- Sekcja UPGRADE CTA (linie ~324-387) - "Unlock the Full 100+ Page Report"
- Warunkowe wyświetlanie dla `paid` vs `free`

**app/audit-success/page.tsx:**
- Strona sukcesu po płatności Stripe

#### Backend (POZOSTAJE bez zmian):

**app/api/stripe/create-checkout/route.ts:**
- Tworzenie Stripe Checkout Session
- Metadata z URL, email, fullName

**app/api/stripe/webhook/route.ts:**
- Obsługa `checkout.session.completed`
- Triggeruje LAMA audit z `paid=true`

**app/api/lama/audit/route.ts:**
- Obsługuje parametr `paid`
- Generuje PDF dla płatnych audytów
- Różne treści emaila dla paid vs free

**lib/stripe.ts:**
- Stripe client configuration
- STRIPE_CONFIG z price ID

### 4. Zmienne środowiskowe (POZOSTAJĄ)

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

### 5. PDF Generation

**app/lib/lama/pro/** - cały folder z generowaniem PDF:
- `pdf-generator-core.tsx` - główna logika
- `pdf/` - komponenty React-PDF
- Generuje 100+ stron raportu

---

## Jak przywrócić płatny audyt

### Krok 1: FinalCTA.tsx - przywróć przyciski

Dodaj z powrotem po przycisku submit:

```tsx
{/* Divider */}
<div className={styles.orDivider}>
  <span>or get the full report</span>
</div>

{/* Paid Audit Button */}
<button
  type="button"
  className={styles.paidAuditButton}
  onClick={handlePaidAudit}
  disabled={isPaidLoading}
>
  {isPaidLoading ? (
    'Redirecting to checkout...'
  ) : (
    <>
      Get Full 100+ Page Report
      <span className={styles.paidAuditPrice}>€99</span>
    </>
  )}
</button>

{/* Paid Audit Error */}
{paidError && (
  <p className={styles.paidAuditError}>{paidError}</p>
)}

{/* Paid Audit Benefits */}
<ul className={styles.paidAuditBenefits}>
  <li>Detailed 100+ page PDF report</li>
  <li>Actionable recommendations per category</li>
  <li>Priority email delivery</li>
</ul>
```

Przywróć state i handler:
```tsx
const [isPaidLoading, setIsPaidLoading] = useState(false);
const [paidError, setPaidError] = useState<string | null>(null);

// handlePaidAudit function - patrz git history
```

### Krok 2: FinalSuccessScreen.tsx - przywróć Path 02

Przywróć teksty:
```tsx
const text7 = 'FULL REPORT PATH'
const text8 = 'Unlock complete paid analysis — 100+ pages of actionable solutions. Target: 90/100 minimum score.'
```

I JSX dla Path 02 w pathsGrid.

### Krok 3: email-template.ts - przywróć UPGRADE CTA

Odkomentuj/przywróć sekcję `${!paid ? \`...\` : ''}` z:
- "Unlock the Full 100+ Page Report"
- 3 key benefits
- CTA Button "Get Full Report • €99"
- Stripe checkout URL

### Krok 4: CSS Styles

Upewnij się, że style są w `FinalCTA.module.css`:
- `.orDivider`
- `.paidAuditButton`
- `.paidAuditPrice`
- `.paidAuditError`
- `.paidAuditBenefits`

---

## Git reference

Aby zobaczyć pełny kod przed archiwizacją:

```bash
git log --oneline -20
# Znajdź commit przed "Remove paid audit from UI"
git show <commit-hash>:app/components/sections/FinalCTA.tsx
```

---

## Stripe Dashboard

- **Product:** LAMA Pro Audit
- **Price ID:** W STRIPE_PRICE_ID env variable
- **Webhook:** `/api/stripe/webhook`
- **Events:** `checkout.session.completed`

---

## Testy przed przywróceniem

1. `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. Wypełnij formularz, kliknij paid button
3. Użyj test card: 4242 4242 4242 4242
4. Sprawdź czy webhook triggeruje audit
5. Sprawdź czy email z PDF przychodzi

---

## Notatki

- PDF generation wymaga `runtime = 'nodejs'` (nie edge)
- Stripe webhook wymaga raw body parsing
- Email z PDF ma limit 25MB (Resend)
- Płatny audyt generuje pełny PDF, darmowy nie

---

**Ostatnia aktualizacja:** 2026-01-17
**Autor archiwizacji:** Claude Code
