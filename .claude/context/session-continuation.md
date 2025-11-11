# 🔄 Instrukcja Kontynuacji Sesji - Rafał Oleksiak Consulting

**Dla:** Claude Desktop (macOS)  
**Cel:** Bezproblemowa kontynuacja pracy między chatami  
**Last Updated:** 2025-11-11

---

## 🚨 KRYTYCZNE: Jak Zacząć Nowy Czat

Gdy otwierasz nowy czat w Claude Desktop, **ZAWSZE** zacznij od:

### Komenda Startowa (skopiuj i wklej):

```
Witaj! Kontynuujemy pracę nad projektem Rafał Oleksiak Consulting.

PRZECZYTAJ NAJPIERW:
1. /mnt/project/ROADMAP.md - sprawdź sekcję "Currently In Progress" i "Recently Completed"
2. /mnt/project/CLAUDE.md - przypomnij sobie standardy projektu
3. /mnt/project/.claude/context/project-brief.md - kontekst biznesowy

Następnie powiedz mi:
- Co było ostatnio robione (z ROADMAP.md)
- Co jest teraz "In Progress"
- Co powinienem robić dalej

Jesteś moim AI Project Managerem - trackujesz progress w ROADMAP.md.
```

---

## 📋 Co Claude Musi Zrobić na Początku Każdej Sesji

### 1. Przeczytać ROADMAP.md
**Lokalizacja:** `/mnt/project/ROADMAP.md`

**Sprawdzić:**
- Sekcja "Currently In Progress" (co jest w trakcie)
- Sekcja "Recently Completed" (co było ostatnio zrobione)
- Timestampy (🏗️ = w trakcie, ✅ = ukończone)

### 2. Przeczytać CLAUDE.md
**Lokalizacja:** `/mnt/project/CLAUDE.md`

**Przypomnieć sobie:**
- Standardy kodowania (TypeScript, CSS, React patterns)
- Strategię CSS (Hybrid: Tailwind + CSS Modules)
- Design system (Tech-Forward Innovator)
- Workflow (Git, deployment)

### 3. Przeczytać Kontekst Projektu
**Lokalizacja:** `/mnt/project/.claude/context/`

**Pliki:**
- `project-brief.md` - Cele biznesowe, target audience
- `design-system.md` - Kolory, typografia, komponenty
- `tech-stack.md` - Architektura, dependencies

---

## 🎯 Workflow Między Sesjami

### Koniec Poprzedniej Sesji (Ty - Rafał):

**Przed zamknięciem czatu:**

1. **Zapytaj Claude:** "Co trzeba zapisać przed końcem sesji?"

2. **Claude zrobi:**
   - Update ROADMAP.md (przesuń taski, dodaj timestampy)
   - Git commit jeśli były zmiany w kodzie
   - Podsumowanie co zostało zrobione

3. **Ty zapisujesz:**
   - Notatkę w Notes (opcjonalnie): "Skończone: X, Next: Y"
   - Nic więcej! Wszystko jest w ROADMAP.md

### Początek Nowej Sesji (Ty - Rafał):

1. **Otwórz nowy czat w Claude Desktop**

2. **Wklej komendę startową** (z góry tego pliku)

3. **Claude odpowie:**
   - "Widzę że ostatnio pracowaliśmy nad: [X]"
   - "Aktualnie w trakcie: [Y] (rozpoczęte: data)"
   - "Proponuję kontynuować: [Y] lub zacząć: [Z]"

4. **Ty decydujesz:**
   - "Kontynuujmy [Y]" → Claude prowadzi dalej
   - "Zróbmy [Z]" → Claude aktualizuje ROADMAP.md
   - "Co było zrobione wczoraj?" → Claude czyta ROADMAP.md

---

## 📝 Format Aktualizacji ROADMAP.md

### Gdy Zaczynasz Task:

**Ty mówisz:**
> "Zaczynam Google Analytics 4"

**Claude robi:**
```markdown
## 🎯 Currently In Progress

- [-] **Google Analytics 4 Setup** 🏗️ 2025-11-11
  - Status: Started, reading documentation
  - Blocker: None
  - Next: Install @next/third-parties
```

### Gdy Kończysz Task:

**Ty mówisz:**
> "Skończyłem GA4, działa"

**Claude robi:**
1. Usuwa z "Currently In Progress"
2. Dodaje do "Recently Completed":

```markdown
## ✅ Recently Completed

- [x] **Google Analytics 4 Setup** ✅ 2025-11-11
  - Installed @next/third-parties
  - Added tracking to app/layout.tsx
  - Configured events: CTA clicks, form submissions
  - Tested in GA4 DebugView - working!
```

### Gdy Przerywasz Task w Połowie:

**Ty mówisz:**
> "Muszę kończyć, jestem w połowie GA4"

**Claude robi:**
```markdown
## 🎯 Currently In Progress

- [-] **Google Analytics 4 Setup** 🏗️ 2025-11-11
  - Status: 50% complete
  - Done: Installed @next/third-parties, created GA4 property
  - Blocker: None
  - Next: Add tracking code to app/layout.tsx (line 15)
  - Notes: Measurement ID is G-XXXXXXXXX (saved in .env.local)
```

**Następnym razem Claude wie dokładnie gdzie wrócić!**

---

## 🔍 Przykładowe Komendy na Początku Nowej Sesji

### Komenda 1: "Gdzie byliśmy?"
```
Przeczytaj ROADMAP.md i powiedz mi:
- Co było ostatnio robione?
- Co jest teraz "In Progress"?
- Co powinienem zrobić dalej?
```

**Claude odpowie:** Konkretne podsumowanie z ROADMAP.md

---

### Komenda 2: "Kontynuujemy poprzedni task"
```
Przeczytaj ROADMAP.md sekcję "Currently In Progress" 
i kontynuujmy pracę od miejsca gdzie skończyliśmy.
```

**Claude odpowie:** "Widziałem że byłeś w połowie [X], następny krok to [Y]..."

---

### Komenda 3: "Co jest do zrobienia w Week 1?"
```
Pokaż mi wszystkie taski z ROADMAP.md sekcji "Week 1-2" 
które nie są jeszcze zrobione. Posortuj według priorytetu.
```

**Claude odpowie:** Lista tasków + rekomendacja co robić następne

---

### Komenda 4: "Commit i start nowego taska"
```
1. Zrób git commit wszystkich zmian z opisem co było zrobione
2. Zaktualizuj ROADMAP.md - przesuń ukończone taski
3. Zaproponuj co robić dalej
```

**Claude zrobi:** Wszystko automatycznie + propozycja

---

## 📂 Struktura Plików (Dla Odniesienia)

```
/Users/user/projects/rafal-oleksiak-consulting/
├── CLAUDE.md                    # Standardy kodowania ⭐
├── ROADMAP.md                   # Plan pracy & tracking ⭐
├── .env.example                 # Template env variables
├── .claude/
│   └── context/
│       ├── project-brief.md     # Cele biznesowe
│       ├── design-system.md     # Design guidelines
│       ├── tech-stack.md        # Architektura
│       └── session-continuation.md  # Ten plik!
├── app/                         # Next.js app
├── PROJECT_SUMMARY.md           # Kompletna historia projektu
└── ... (reszta projektu)
```

---

## ⚠️ Najczęstsze Błędy (Unikaj!)

### ❌ Błąd 1: "Nie przeczytałem ROADMAP.md"
**Objaw:** Claude nie wie co było robione, zaczyna od zera  
**Rozwiązanie:** Zacznij od komendy startowej (wklej z góry)

### ❌ Błąd 2: "Zapomniałem zaktualizować ROADMAP.md"
**Objaw:** Następna sesja nie wie co było zrobione  
**Rozwiązanie:** Na koniec sesji: "Claude, zapisz progress w ROADMAP.md"

### ❌ Błąd 3: "Nie wiem od czego zacząć"
**Objaw:** Stoisz i nie wiesz co robić  
**Rozwiązanie:** "Claude, co powinienem teraz robić według ROADMAP.md?"

### ❌ Błąd 4: "Zgubiłem się w taskach"
**Objaw:** Nie wiesz co jest priorytetem  
**Rozwiązanie:** "Claude, pokaż mi TYLKO high priority tasks z Week 1"

---

## 🎯 Szybki Checklist - Nowa Sesja

Przed rozpoczęciem pracy, sprawdź:

- [ ] Otworzyłem nowy czat w Claude Desktop
- [ ] Wkleiłem komendę startową (z góry tego pliku)
- [ ] Claude przeczytał ROADMAP.md i CLAUDE.md
- [ ] Claude powiedział mi co było ostatnio robione
- [ ] Wiem co będę robił w tej sesji
- [ ] ROADMAP.md jest zaktualizowany (jeśli były zmiany)

**Czas:** 2 minuty (ale oszczędza godziny!)

---

## 💡 Pro Tips

### Tip 1: Kończ sesję z checklistą
Na koniec każdej sesji poproś:
> "Claude, przygotuj checklistę co zrobiliśmy i co robić następnym razem"

### Tip 2: Git commit na koniec
Zawsze:
> "Claude, zrób git commit z opisem co było zrobione dziś"

### Tip 3: Daily standup
Zacznij dzień od:
> "Claude, daily standup - co było wczoraj, co dziś, jakie blockery?"

### Tip 4: Weekly review
Raz w tygodniu:
> "Claude, pokaż progress z tego tygodnia - co zrobiliśmy, co zostało"

---

## 🔗 Ważne Lokalizacje

### Pliki do Czytania (Claude):
- **ROADMAP.md** → `/mnt/project/ROADMAP.md`
- **CLAUDE.md** → `/mnt/project/CLAUDE.md`
- **Context files** → `/mnt/project/.claude/context/`

### Pliki do Edycji (Claude):
- **ROADMAP.md** → Tracking progress
- **Kod projektu** → `/mnt/project/app/`
- **Git commits** → Automatyczne

### Pliki NIE Dotykaj (Git ignoruje):
- `.env.local` → Lokalne env variables
- `node_modules/` → Dependencies
- `.next/` → Build output

---

## 🆘 Jeśli Coś Poszło Nie Tak

### Problem: "Claude nie pamięta projektu"
**Rozwiązanie:**
```
Claude, przeczytaj te pliki w kolejności:
1. /mnt/project/ROADMAP.md
2. /mnt/project/CLAUDE.md
3. /mnt/project/.claude/context/project-brief.md

Następnie powiedz mi co wiesz o projekcie.
```

### Problem: "ROADMAP.md jest nieaktualny"
**Rozwiązanie:**
```
Claude, zaktualizuj ROADMAP.md:
- Task X jest ukończony (dodaj ✅ timestamp)
- Task Y jest w trakcie (przenieś do In Progress)
- Pokaż mi diff przed zapisem
```

### Problem: "Nie wiem które pliki się zmieniły"
**Rozwiązanie:**
```bash
# W Terminalu:
cd /Users/user/projects/rafal-oleksiak-consulting
git status
```

### Problem: "Chcę wrócić do poprzedniej wersji"
**Rozwiązanie:**
```bash
# W Terminalu:
git log --oneline -10  # Zobacz ostatnie commity
git checkout [commit-hash]  # Wróć do konkretnego commita
```

---

## 📞 Quick Reference

| Potrzebuję... | Komenda |
|---------------|---------|
| Status projektu | "Claude, gdzie jesteśmy w ROADMAP.md?" |
| Kontynuować pracę | "Claude, kontynuujmy poprzedni task" |
| Zacząć nowy task | "Claude, zaczynam [nazwa taska]" |
| Zakończyć task | "Claude, skończyłem [nazwa taska]" |
| Git commit | "Claude, zrób commit z opisem dzisiejszej pracy" |
| Help | "Claude, przeczytaj session-continuation.md" |

---

## ✅ Podsumowanie

**Zasada #1:** Zawsze zacznij nową sesję od komendy startowej  
**Zasada #2:** ROADMAP.md to single source of truth  
**Zasada #3:** Git commit na koniec każdej sesji  
**Zasada #4:** Claude trackuje, Ty decydujesz co robić  

---

**Ten plik został stworzony:** 2025-11-11  
**Lokalizacja:** `/Users/user/projects/rafal-oleksiak-consulting/.claude/context/session-continuation.md`

**Przeczytaj go na początku każdej nowej sesji!** 🎯
