# LAMA PDF Generation Rules & Guidelines

**Last Updated**: 2025-12-08
**Status**: PRODUCTION RULES

---

## 🌍 Language Requirements

### **RULE #1: ENGLISH ONLY**

**ALL PDF reports MUST be generated in English.**

This decision was made on 2025-12-08 and applies to:
- All report content (body text, explanations, recommendations)
- All headers and section titles
- All labels (page numbers, metadata, badges)
- All code comments and technical documentation within reports
- All error messages and warnings
- All UI elements within the PDF

**Rationale**:
1. **International audience**: Reports can be shared with international stakeholders
2. **Font simplicity**: Using Helvetica (built-in font) eliminates Polish character encoding issues
3. **Consistency**: Single language ensures uniform formatting and layout
4. **Maintenance**: Easier to update and maintain one language version

**Consequences**:
- Issue #1 (Polish character corruption) is NO LONGER APPLICABLE
- Issue #4 (Mixed Polish/English headers) is NO LONGER APPLICABLE
- Font requirements simplified (Helvetica + Courier are sufficient)

---

## 🎨 Font & Typography Rules

### Font Families

**RULE #2: Use Built-in Fonts Only**

Currently supported fonts (no registration required):
```typescript
DEFAULT_FONT_FAMILY = 'Helvetica'
CODE_FONT_FAMILY = 'Courier'
```

**Why**:
- Always available in @react-pdf/renderer
- No font loading errors
- No network dependencies
- Consistent rendering across all systems

**DO NOT**:
- ❌ Add custom font registrations (Font.register) without approval
- ❌ Use emoji fonts (emojis don't render in PDFs)
- ❌ Use icon fonts (Font Awesome, Material Icons, etc.)

### Typography Scale

**RULE #3: Use Shared Typography Styles**

All components MUST import and use typography from `shared-styles.ts`:

```typescript
import { typography, components, COLORS } from '../shared-styles';

// ✅ CORRECT
<Text style={typography.h1}>Heading</Text>
<Text style={typography.body}>Body text</Text>

// ❌ INCORRECT
<Text style={{ fontSize: 48, fontWeight: 'bold' }}>Heading</Text>
```

Available typography styles:
- `typography.h1` through `typography.h6` (headings)
- `typography.body`, `typography.bodySmall`, `typography.bodyLarge`
- `typography.label`, `typography.labelSmall`
- `typography.code`, `typography.codeSmall`

### Font Properties

**RULE #4: Font Property Restrictions**

Allowed font properties:
- ✅ `fontFamily`: DEFAULT_FONT_FAMILY or CODE_FONT_FAMILY
- ✅ `fontSize`: Any number (use typography scale)
- ✅ `fontWeight`: 'normal', 'bold', 400, 700 ONLY
- ✅ `color`: Any hex color

NOT allowed:
- ❌ `fontStyle: 'italic'` (Helvetica italic not registered)
- ❌ `fontWeight: 300, 600` (must normalize to 400/700)
- ❌ Custom font families without approval

**RULE #5: All Text Styles MUST Include fontFamily**

Every `<Text>` element's style MUST explicitly declare `fontFamily`:

```typescript
// ✅ CORRECT
const styles = StyleSheet.create({
  myText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    color: COLORS.white,
  },
});

// ❌ INCORRECT - Missing fontFamily
const styles = StyleSheet.create({
  myText: {
    fontSize: 12,
    color: COLORS.white,
  },
});
```

---

## 🎯 Icons & Symbols

### Icon Usage

**RULE #6: Unicode Symbols Only**

Use Unicode text symbols from `ICONS` constant in `font-constants.ts`:

```typescript
import { ICONS } from '../font-constants';

// ✅ CORRECT
<Text>{ICONS.checkmark} Task completed</Text>
<Text>{ICONS.money} Revenue Impact</Text>
<Text>{ICONS.arrow_right} Next step</Text>

// ❌ INCORRECT - Emojis don't render in PDFs
<Text>✅ Task completed</Text>
<Text>💰 Revenue Impact</Text>

// ❌ INCORRECT - Icon fonts don't work in PDFs
<Text className="fa fa-check">Task completed</Text>
```

Available icons (see `font-constants.ts` for full list):
- Financial: `money` (€), `dollar` ($), `growth` (↗)
- Status: `checkmark` (✓), `cross` (✗), `warning` (⚠)
- Business: `target` (◉), `rocket` (▲), `email` (✉)
- Directional: `arrow_right` (→), `arrow_up` (↑)
- Data: `chart_bar` (▉), `bullet` (•)
- Checkboxes: `square` (☐), `square_checked` (☑)

### Adding New Icons

**RULE #7: Icon Addition Process**

1. Find Unicode character that renders in Helvetica font
2. Test rendering: `<Text style={{ fontFamily: 'Helvetica' }}>◉</Text>`
3. Add to `ICONS` constant in `font-constants.ts`
4. Document usage in component

**DO NOT**:
- ❌ Use SVG icons (not supported by @react-pdf/renderer)
- ❌ Use emoji (🚀, 📊, etc.) - they render as garbage characters
- ❌ Use multi-byte Unicode characters that may not render

---

## 📐 Layout & Styling Rules

### Component Styles

**RULE #8: Use Shared Component Styles**

Use pre-built component styles from `shared-styles.ts`:

```typescript
import { components } from '../shared-styles';

// ✅ CORRECT - Reuse shared styles
<View style={components.card}>...</View>
<Text style={components.badge}>HIGH</Text>
<View style={components.codeBlock}>...</View>

// ❌ INCORRECT - Duplicate styling
<View style={{ backgroundColor: '#2A2A3E', padding: 16 }}>...</View>
```

Available component styles:
- `components.card`, `components.cardWithBorder`
- `components.badge`, `components.badgeHigh/Medium/Low`
- `components.codeBlock`, `components.codeBlockText`
- `components.checkboxItem`, `components.checkbox`, `components.checkboxText`
- `components.table`, `components.tableRow`, `components.tableCell`
- `components.pageFooter`

### Colors

**RULE #9: Use Brand Colors from COLORS Constant**

```typescript
import { COLORS } from '../shared-styles';

// ✅ CORRECT
<Text style={{ color: COLORS.vividPurple }}>Text</Text>

// ❌ INCORRECT - Hardcoded color
<Text style={{ color: '#7B2CBF' }}>Text</Text>
```

Available colors:
- `moonlitGrey` (#1A1A2E) - backgrounds
- `vividPurple` (#7B2CBF) - accents, CTAs
- `electricBlue` (#00BFFF) - highlights
- `white` (#FFFFFF)
- `lightGrey` (#E0E0E0) - body text
- `darkGrey` (#2A2A3E) - cards
- `green`, `yellow`, `red`, `orange` - status colors

### Code Blocks

**RULE #10: Standardized Code Block Formatting**

```typescript
import { components, CODE_FONT_FAMILY } from '../shared-styles';

// ✅ CORRECT
<View style={components.codeBlock}>
  <Text style={components.codeBlockText}>{codeString}</Text>
</View>

// ❌ INCORRECT - Custom styling
<View style={{ backgroundColor: '#000' }}>
  <Text style={{ fontFamily: 'Courier' }}>{codeString}</Text>
</View>
```

### Checkboxes

**RULE #11: Interactive Checkbox Pattern**

```typescript
import { ICONS } from '../font-constants';
import { components } from '../shared-styles';

// ✅ CORRECT
<View style={components.checkboxItem}>
  <Text style={components.checkbox}>{ICONS.square}</Text>
  <Text style={components.checkboxText}>Task description</Text>
</View>

// For checked state
<Text style={components.checkbox}>{ICONS.square_checked}</Text>
```

---

## 🏗️ Architecture Rules

### File Organization

**RULE #12: Separation of Concerns**

```
/pdf/
  fonts.ts              ← Font registration ONLY (Font.register)
  font-constants.ts     ← String constants ONLY (no side effects)
  shared-styles.ts      ← Typography, colors, component styles
  /components/
    *.tsx               ← Import from font-constants.ts (NOT fonts.ts)
```

**Critical**:
- `fonts.ts` contains ONLY Font.register() and is imported ONCE in `pdf-generator-core.tsx`
- All PDF components import from `font-constants.ts` (NOT `fonts.ts`)
- This prevents circular imports and multiple font registrations

### Import Rules

**RULE #13: Component Import Pattern**

```typescript
// ✅ CORRECT
import { DEFAULT_FONT_FAMILY, CODE_FONT_FAMILY, ICONS } from '../font-constants';
import { typography, components, COLORS } from '../shared-styles';

// ❌ INCORRECT - Will cause circular import
import { DEFAULT_FONT_FAMILY } from '../fonts';
```

**RULE #14: Font Registration Import**

```typescript
// ✅ CORRECT - Import fonts.ts ONLY in entry point
// File: pdf-generator-core.tsx
import './pdf/fonts';  // Registers fonts once

// ❌ INCORRECT - Never import fonts.ts in components
// File: any-pdf-component.tsx
import './pdf/fonts';  // Will register fonts multiple times!
```

---

## ✅ Testing & Validation

### Pre-Deployment Checklist

**RULE #15: Test All PDFs Before Deploy**

1. **Language Check**:
   - [ ] All content is in English
   - [ ] No Polish text remains
   - [ ] No mixed language sections

2. **Font Rendering**:
   - [ ] All text uses Helvetica or Courier
   - [ ] No font loading errors in console
   - [ ] No missing/corrupted characters

3. **Icons Check**:
   - [ ] All icons render as Unicode symbols (not garbage)
   - [ ] No emojis present (replace with ICONS constants)
   - [ ] Checkboxes appear as ☐ or ☑

4. **Styling Check**:
   - [ ] Code blocks have dark background
   - [ ] Badges are visible and colorful
   - [ ] Tables have borders and structure
   - [ ] Page numbers are consistent

5. **File Size**:
   - [ ] PDF under 500KB (target: 200-400KB)
   - [ ] No embedded images causing bloat

### Test Command

```bash
npx tsx app/lib/lama/pro/test-pdf-v6-final.tsx
```

Expected output:
```
✅ PDF generated successfully
📐 Total: XX pages COMPLETE
🎯 Status: PRODUCTION READY
```

---

## 🚫 Common Mistakes to Avoid

### ❌ DON'T DO THIS:

1. **Don't hardcode fonts**:
   ```typescript
   // ❌ WRONG
   <Text style={{ fontFamily: 'Arial' }}>Text</Text>
   ```

2. **Don't use emojis**:
   ```typescript
   // ❌ WRONG
   <Text>🚀 Launch</Text>
   ```

3. **Don't import fonts.ts in components**:
   ```typescript
   // ❌ WRONG
   import './pdf/fonts';
   ```

4. **Don't use Polish text**:
   ```typescript
   // ❌ WRONG
   <Text>Strona {pageNum} z {totalPages}</Text>
   ```

5. **Don't skip fontFamily**:
   ```typescript
   // ❌ WRONG
   const styles = StyleSheet.create({
     text: { fontSize: 12 }  // Missing fontFamily!
   });
   ```

### ✅ DO THIS INSTEAD:

1. **Use font constants**:
   ```typescript
   // ✅ CORRECT
   <Text style={{ fontFamily: DEFAULT_FONT_FAMILY }}>Text</Text>
   ```

2. **Use Unicode icons**:
   ```typescript
   // ✅ CORRECT
   <Text>{ICONS.rocket} Launch</Text>
   ```

3. **Import font-constants.ts**:
   ```typescript
   // ✅ CORRECT
   import { DEFAULT_FONT_FAMILY } from '../font-constants';
   ```

4. **Use English text**:
   ```typescript
   // ✅ CORRECT
   <Text>Page {pageNum} of {totalPages}</Text>
   ```

5. **Always include fontFamily**:
   ```typescript
   // ✅ CORRECT
   const styles = StyleSheet.create({
     text: {
       fontFamily: DEFAULT_FONT_FAMILY,
       fontSize: 12,
     }
   });
   ```

---

## 📚 Reference Files

- **Font Setup**: `app/lib/lama/pro/pdf/fonts.ts`
- **Font Constants**: `app/lib/lama/pro/pdf/font-constants.ts`
- **Shared Styles**: `app/lib/lama/pro/pdf/shared-styles.ts`
- **Test File**: `app/lib/lama/pro/test-pdf-v6-final.tsx`
- **Task List**: `LAMA-PDF-FIX-PROMPT.md`

---

## 🔄 Change Log

### 2025-12-08
- **MAJOR**: All PDF reports now English-only (no Polish support needed)
- Font system: Using Helvetica + Courier (built-in fonts)
- Icon system: Unicode symbols in ICONS constant
- Architecture: Separated font-constants.ts from fonts.ts (no circular imports)
- Styling: Created shared-styles.ts with typography scale and component styles
- Checkboxes: Implemented with Unicode symbols (☐ / ☑)

---

**Questions?** See `LAMA_PRO_ARCHITECTURE.md` for system overview or `PROJECT_SUMMARY.md` for implementation history.
