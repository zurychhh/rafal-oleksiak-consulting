# Design System - Tech-Forward Innovator

**Last Updated**: 2025-11-11  
**Theme**: Sophisticated, Minimalist, Professional

---

## 🎨 Color Palette

### Primary Colors
```css
/* Dark Backgrounds */
--moonlit-grey-900: #0D0D14;    /* Deepest background */
--moonlit-grey-800: #1A1A2E;    /* Main background */
--moonlit-grey-700: #16213E;    /* Elevated surfaces */

/* Purple Accents (Primary Brand) */
--vivid-purple-600: #7B2CBF;    /* Primary CTA */
--vivid-purple-500: #9D4EDD;    /* Hover states */
--vivid-purple-400: #C77DFF;    /* Subtle highlights */

/* Blue Accents (Secondary) */
--electric-blue-600: #0066FF;   /* Links, secondary CTAs */
--electric-blue-500: #00BFFF;   /* Hover, interactive elements */
--electric-blue-400: #33CCFF;   /* Subtle highlights */

/* Neutral Grays */
--gray-100: #F5F5F7;            /* White text */
--gray-200: #E5E5EA;            /* Light text */
--gray-300: #C7C7CC;            /* Muted text */
--gray-400: #8E8E93;            /* Placeholder text */
--gray-500: #636366;            /* Disabled text */

/* Semantic Colors */
--success-green: #10B981;       /* Success states */
--warning-yellow: #F59E0B;      /* Warning states */
--error-red: #EF4444;           /* Error states */
```

### Color Usage Rules

**Backgrounds:**
- Hero section: `#1A1A2E` (Moonlit Grey 800)
- Content sections: Alternate between `#0D0D14` (900) and `#1A1A2E` (800)
- Cards/elevated surfaces: `#16213E` (Moonlit Grey 700)

**Text:**
- Headings: `#F5F5F7` (Gray 100) - 100% white
- Body text: `#E5E5EA` (Gray 200) - 90% white
- Muted text: `#C7C7CC` (Gray 300) - 70% white
- Disabled: `#8E8E93` (Gray 400) - 50% white

**CTAs (Call-to-Action):**
- Primary button background: `#7B2CBF` (Vivid Purple 600)
- Primary button hover: `#9D4EDD` (Vivid Purple 500)
- Primary button text: `#F5F5F7` (Gray 100)

**Links:**
- Default: `#0066FF` (Electric Blue 600)
- Hover: `#00BFFF` (Electric Blue 500)
- Visited: `#9D4EDD` (Vivid Purple 500)

**Accents:**
- Service card icons: Gradient from Purple to Blue
- Dividers: `rgba(255, 255, 255, 0.1)`
- Borders: `rgba(255, 255, 255, 0.15)`

---

## 🔤 Typography

### Font Families
```css
/* Primary: Poppins (Headings, Bold Statements) */
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Secondary: DM Sans (Body, Descriptions) */
font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Scales (Mobile-First)

**Headings (Poppins, Bold)**
```css
/* H1 - Hero Headline */
font-size: 32px;  /* Mobile: 320px-768px */
font-size: 48px;  /* Tablet: 769px-1024px */
font-size: 60px;  /* Desktop: 1025px+ */
font-weight: 700;
line-height: 1.2;
letter-spacing: -0.02em;

/* H2 - Section Headlines */
font-size: 28px;  /* Mobile */
font-size: 36px;  /* Tablet */
font-size: 42px;  /* Desktop */
font-weight: 700;
line-height: 1.3;

/* H3 - Card Titles */
font-size: 20px;  /* Mobile */
font-size: 24px;  /* Desktop */
font-weight: 600;
line-height: 1.4;
```

**Body Text (DM Sans)**
```css
/* Large Body (Subheadlines) */
font-size: 18px;  /* Mobile */
font-size: 20px;  /* Desktop */
font-weight: 400;
line-height: 1.6;

/* Regular Body */
font-size: 16px;  /* All devices */
font-weight: 400;
line-height: 1.6;

/* Small Text (Captions, Labels) */
font-size: 14px;
font-weight: 400;
line-height: 1.5;
```

**Special Cases**
```css
/* CTA Button Text */
font-family: 'Poppins', sans-serif;
font-size: 16px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;

/* Navigation Links */
font-family: 'DM Sans', sans-serif;
font-size: 14px;
font-weight: 500;
text-transform: uppercase;
letter-spacing: 0.1em;
```

---

## 📐 Spacing & Layout

### Spacing Scale (8px base unit)
```css
--space-1: 8px;    /* Extra small */
--space-2: 16px;   /* Small */
--space-3: 24px;   /* Medium */
--space-4: 32px;   /* Large */
--space-5: 40px;   /* Extra large */
--space-6: 48px;   /* 2X large */
--space-8: 64px;   /* 3X large */
--space-10: 80px;  /* 4X large */
--space-12: 96px;  /* 5X large */
```

### Container Widths
```css
/* Max-width containers */
--container-sm: 640px;   /* Small content (forms) */
--container-md: 768px;   /* Medium content (blog posts) */
--container-lg: 1024px;  /* Large content (sections) */
--container-xl: 1280px;  /* Extra large (hero, full-width) */
--container-2xl: 1536px; /* Maximum width */

/* Padding (responsive) */
padding: 0 16px;  /* Mobile: 320px-768px */
padding: 0 32px;  /* Tablet: 769px-1024px */
padding: 0 48px;  /* Desktop: 1025px+ */
```

### Section Spacing
```css
/* Vertical spacing between sections */
padding-top: 48px;     /* Mobile */
padding-bottom: 48px;

padding-top: 80px;     /* Desktop */
padding-bottom: 80px;
```

---

## 🔘 Components

### Buttons

**Primary CTA**
```css
background: linear-gradient(135deg, #7B2CBF, #9D4EDD);
color: #F5F5F7;
padding: 16px 48px;  /* Desktop */
padding: 14px 32px;  /* Mobile */
border-radius: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;
transition: all 0.3s ease;

/* Hover */
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(123, 44, 191, 0.3);
```

**Secondary Button**
```css
background: transparent;
border: 2px solid #0066FF;
color: #0066FF;
padding: 14px 32px;
border-radius: 8px;

/* Hover */
background: rgba(0, 102, 255, 0.1);
border-color: #00BFFF;
color: #00BFFF;
```

### Cards
```css
background: #16213E;  /* Moonlit Grey 700 */
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
padding: 32px;
transition: all 0.3s ease;

/* Hover */
transform: translateY(-4px);
box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
border-color: rgba(123, 44, 191, 0.3);
```

### Form Inputs
```css
background: rgba(255, 255, 255, 0.05);
border: 2px solid rgba(255, 255, 255, 0.1);
border-radius: 8px;
padding: 16px 20px;
color: #F5F5F7;
font-size: 16px;

/* Focus */
border-color: #7B2CBF;
background: rgba(255, 255, 255, 0.08);
box-shadow: 0 0 0 4px rgba(123, 44, 191, 0.1);

/* Touch targets (mobile) */
min-height: 44px;
```

---

## 🎭 Animations

### Transitions (Subtle, Professional)
```css
/* Default transition */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Hover effects */
transition: transform 0.3s ease, box-shadow 0.3s ease;

/* Loading states */
transition: opacity 0.2s ease;
```

### Hover States
```css
/* Cards */
transform: translateY(-4px);

/* Buttons */
transform: translateY(-2px);

/* Links */
opacity: 0.8;
```

### Scroll Animations
```css
/* Fade in on scroll */
opacity: 0;
transform: translateY(20px);
transition: opacity 0.6s ease, transform 0.6s ease;

/* When visible */
opacity: 1;
transform: translateY(0);
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile: 320px - 768px (default) */
/* No media query needed */

/* Tablet: 769px - 1024px */
@media (min-width: 769px) { }

/* Desktop: 1025px - 1439px */
@media (min-width: 1025px) { }

/* Large Desktop: 1440px+ */
@media (min-width: 1440px) { }
```

### Mobile-First Principles
1. **Typography**: Start small (32px H1), scale up
2. **Spacing**: Minimum 16px padding mobile, 48px desktop
3. **Touch targets**: 44x44px minimum
4. **Images**: Responsive, use srcset
5. **Navigation**: Hamburger menu < 769px

---

## ⚠️ DON'T Use (Anti-Patterns)

### Visual Effects to AVOID
- ❌ Flashy gradient text (90s-style)
- ❌ Excessive animations (distracting)
- ❌ Tag badges cluttering hero
- ❌ Too many colors (stick to palette)
- ❌ Comic Sans or decorative fonts
- ❌ Skeuomorphism (fake 3D effects)
- ❌ Stock photos (prefer custom graphics)

### Design Principles Violated
- ❌ Cognitive overload (too much info in hero)
- ❌ Poor contrast (text unreadable)
- ❌ Inconsistent spacing (random gaps)
- ❌ Non-responsive (broken on mobile)
- ❌ Slow loading (heavy images/fonts)

---

## ✅ Best Practices

### Visual Hierarchy
1. **Most important**: Hero headline (60px, bold, white)
2. **Important**: Section headlines (42px, bold)
3. **Supporting**: Body text (16px, 90% white)
4. **Least important**: Captions (14px, 70% white)

### White Space Usage
- More white space = higher perceived value
- Minimum 48px between sections
- 24-32px within sections
- Let content breathe

### Consistency Checklist
- [ ] All CTAs use same style (purple gradient)
- [ ] All cards use same border-radius (16px)
- [ ] All headings use Poppins (bold)
- [ ] All body text uses DM Sans (regular)
- [ ] All transitions use same timing (0.3s ease)

---

## 🎯 Brand Personality

### Adjectives that describe the design:
✅ **Sophisticated** - Dark theme, premium feel  
✅ **Minimalist** - Clean, no clutter  
✅ **Professional** - Corporate-ready  
✅ **Modern** - Tech-forward aesthetic  
✅ **Trustworthy** - Stable, reliable  

### Adjectives that DO NOT describe the design:
❌ Playful, Fun, Quirky  
❌ Loud, Flashy, Aggressive  
❌ Cheap, Generic, Template-like  
❌ Corporate-stuffy, Boring  

---

**References:**
- See `/public/` for brand assets (logos, icons)
- See `app/globals.css` for CSS variables
- See `tailwind.config.ts` for Tailwind theme
