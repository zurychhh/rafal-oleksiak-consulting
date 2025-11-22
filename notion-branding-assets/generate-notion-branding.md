---
allowed-tools:
  - Bash(*)
  - mcp__stability-ai__*
  - mcp__replicate__*
  - mcp__huggingface__*
description: Generates all 48 Notion branding assets for Oleksiak Consulting using AI image generation
---

# Generate Complete Notion Branding Package

You are tasked with generating **48 professional branded assets** for Rafał Oleksiak Consulting's Notion workspace.

## 🎨 BRAND GUIDELINES

**Colors:**
- Moonlit Grey Dark: `#1A1A2E` (backgrounds)
- Moonlit Grey: `#2D3142` (secondary backgrounds)
- Vivid Purple: `#7B2CBF` (primary accents, CTAs)
- Vivid Purple Light: `#9D4EDD` (hover states)
- Electric Blue: `#0066FF` (highlights, links)
- Electric Blue Light: `#00BFFF` (secondary accents)
- White: `#FFFFFF` (text on dark)

**Typography:**
- Headings: Poppins Bold
- Body: DM Sans Regular

**Style:**
- Tech-forward, minimalist, professional
- B2B consulting aesthetic
- Dark theme with purple/blue accents
- Clean lines, no clutter

---

## 📋 WORKFLOW

### STEP 1: Create Directory Structure

Create complete folder structure for all assets:

```bash
mkdir -p notion-branding-assets/{logos,covers,icons/{service-icons,database-icons},emojis/{status,category,action},database-cards}
```

### STEP 2: Read Source Prompts

Read the complete prompt specifications from:
`/Users/user/projects/rafal-oleksiak-consulting/NOTION-IMPLEMENTATION-GUIDE.md`

This file contains all 48 AI prompts with exact specifications.

### STEP 3: Generate Assets Using MCP

For each asset, use the appropriate MCP image generation tool.

**Recommended MCP servers:**
1. **Stability AI** (best quality, paid)
2. **Replicate** (good quality, pay-per-use)
3. **Hugging Face FLUX** (free tier available)

**Generation parameters:**
- Always use highest quality settings
- Match exact dimensions specified
- Save with transparent background where applicable
- Use brand colors in prompts

---

## 🎯 ASSET GENERATION SEQUENCE

### 1. LOGOS (4 assets)

**Priority: HIGHEST** - These are foundation assets

#### Logo 1: Full Logo (400x400px)
```
File: logos/oleksiak-logo-full.png
Dimensions: 400x400px
Prompt: "Minimalist consulting logo with text 'OLEKSIAK CONSULT' in bold sans-serif font (Poppins style), followed by 3 small circular dots in purple gradient (#7B2CBF to #9D4EDD). Background: dark grey #2D3142. Logo should be modern, tech-forward, professional. Text in white. Dots have subtle glow effect. 400x400px, PNG with transparency. Minimalist, clean design for B2B consulting brand. Vector graphic style, flat design, no shadows, high contrast."
```

#### Logo 2: Compact Logo (280x280px)
```
File: logos/oleksiak-logo-compact.png
Dimensions: 280x280px
Prompt: "Minimalist logo with text 'OLEKSIAK' in bold white sans-serif font (Poppins style), followed by 3 gradient purple dots (#7B2CBF to #9D4EDD). Dark background #2D3142. Modern, tech-forward consulting brand. Dots slightly glowing. 280x280px, PNG transparent. Clean, professional, B2B aesthetic. Vector style, flat design, minimalist."
```

#### Logo 3: Monogram "OC" (280x280px)
```
File: logos/oleksiak-monogram.png
Dimensions: 280x280px
Prompt: "Create minimalist monogram logo with letters 'OC' in bold modern sans-serif font, white color, with single purple dot (#7B2CBF) accent. Dark grey background #2D3142. Tech-forward, professional, B2B consulting. 280x280px, PNG transparent. Clean, geometric, high contrast design. Vector style."
```

#### Logo 4: Dots Only (280x280px)
```
File: logos/oleksiak-dots.png
Dimensions: 280x280px
Prompt: "Three circular dots in horizontal line, gradient from purple (#7B2CBF) to light purple (#9D4EDD), with subtle glow effect. Dark background #2D3142. Minimalist, tech-forward icon. 280x280px, PNG transparent. Clean, modern, professional aesthetic. Vector style, simple geometric shapes."
```

---

### 2. COVER IMAGES (7 assets)

**Priority: HIGH** - Main visual impact

#### Cover 1: Hero - Transform Revenue (1500x600px)
```
File: covers/cover-hero-transform-revenue.png
Dimensions: 1500x600px
Prompt: "Modern dark-themed consulting website banner. Background: deep navy/grey gradient (#1A1A2E to #2D3142). Text overlay in bold white typography: 'I double revenue from owned channels'. Accent: purple gradient dots pattern (#7B2CBF to #9D4EDD) floating in background. Tech-forward, B2B professional aesthetic. Minimalist, high contrast, dramatic. 1500x600px horizontal banner. Professional consulting design, clean layout."
```

#### Cover 2: Services - What I Deliver (1500x600px)
```
File: covers/cover-services-what-i-deliver.png
Dimensions: 1500x600px
Prompt: "Professional consulting services banner. Dark grey background (#2D3142) with 6 clean line icons arranged in grid: chart (CRM), envelope (Email), gears (Automation), people (Retention), analytics chart, graduation cap. Each icon different gradient color (purple, blue, green, orange, red, purple). Text: 'Revenue-Driving Services' in white bold font. Minimalist, organized, tech-forward. 1500x600px. Vector style icons."
```

#### Cover 3: Case Studies - Transformation Results (1500x600px)
```
File: covers/cover-case-studies-results.png
Dimensions: 1500x600px
Prompt: "Dramatic consulting results banner. Background: dark grey to purple gradient (#1A1A2E to #7B2CBF). Large bold metrics overlay: '+11.5pp', '102% YoY', '$2M' in white with glow effects. Text: 'By the Numbers' in purple. Modern, data-focused, ROI-driven aesthetic. Tech-forward, professional, B2B. 1500x600px horizontal banner. Bold typography, metric-focused."
```

#### Cover 4: Process - How We Work (1500x600px)
```
File: covers/cover-process-how-we-work.png
Dimensions: 1500x600px
Prompt: "Professional process timeline banner. Dark background (#1A1A2E) with 5-step horizontal timeline visualization. Each step connected by gradient line (purple to blue). Clean icons above each step. Text: 'Transformation Methodology' in white. Minimalist, structured, organized. Tech-forward consulting aesthetic. 1500x600px. Vector style, clean lines."
```

#### Cover 5: Contact - Let's Talk (1500x600px)
```
File: covers/cover-contact-lets-talk.png
Dimensions: 1500x600px
Prompt: "Bold call-to-action banner. Background: vibrant purple to electric blue gradient (#7B2CBF to #0066FF). Large white bold text: 'Book Free Consultation'. Minimalist, high-energy, engaging. Modern B2B consulting aesthetic. 1500x600px horizontal banner. Clean typography, strong CTA design."
```

#### Cover 6: Team/About - Meet Rafał (1500x600px)
```
File: covers/cover-team-meet-rafal.png
Dimensions: 1500x600px
Prompt: "Professional personal branding banner. Dark grey background (#2D3142) with space for photo integration on left third. Right side: text '8+ Years Transforming CRM' in white and purple gradient. Minimalist, credibility-building, personal yet professional. Tech-forward consulting aesthetic. 1500x600px. Clean layout, space for photo."
```

#### Cover 7: Generic Branded (1500x600px)
```
File: covers/cover-generic-branded.png
Dimensions: 1500x600px
Prompt: "Versatile branded banner template. Dark background (#1A1A2E) with subtle geometric pattern or dots. Small 'OLEKSIAK' logo in top-left corner in white. Minimalist, clean, reusable. Professional B2B consulting aesthetic. 1500x600px horizontal banner. Subtle pattern, branded."
```

---

### 3. SERVICE ICONS (6 assets)

**Priority: MEDIUM** - Database visualization

**Common specs for all:**
- Size: 280x280px
- Format: PNG transparent
- Style: Clean line icon, modern, tech-forward
- Line weight: Medium (3-4px)

#### Icon 1: CRM Strategy
```
File: icons/service-icons/icon-crm-strategy.png
Prompt: "Minimalist line icon of ascending chart or growth graph. Purple gradient (#7B2CBF to #9D4EDD). Clean, geometric lines. Tech-forward consulting aesthetic. 280x280px transparent PNG. Modern, professional, B2B style. Vector line icon, simple and clear."
```

#### Icon 2: Email Marketing
```
File: icons/service-icons/icon-email-marketing.png
Prompt: "Minimalist line icon of email envelope or mail. Blue gradient (#0066FF to #00BFFF). Clean, modern lines. Tech-forward aesthetic. 280x280px transparent PNG. Professional, B2B style. Vector line icon."
```

#### Icon 3: Marketing Automation
```
File: icons/service-icons/icon-marketing-automation.png
Prompt: "Minimalist line icon of two interlocking gears or cog wheels. Green gradient (#10B981 to #34D399). Clean, mechanical, modern lines. Tech-forward aesthetic. 280x280px transparent PNG. Professional, B2B. Vector line icon."
```

#### Icon 4: Customer Retention
```
File: icons/service-icons/icon-customer-retention.png
Prompt: "Minimalist line icon of two or three people figures or community. Orange gradient (#FF6B6B to #FFA07A). Friendly, clean lines. Tech-forward aesthetic. 280x280px transparent PNG. Professional, B2B. Vector line icon."
```

#### Icon 5: Analytics
```
File: icons/service-icons/icon-analytics.png
Prompt: "Minimalist line icon of bar chart or dashboard with data. Red/pink gradient (#E91E63 to #F06292). Clean, data-focused lines. Tech-forward aesthetic. 280x280px transparent PNG. Professional, B2B. Vector line icon."
```

#### Icon 6: Team Training
```
File: icons/service-icons/icon-team-training.png
Prompt: "Minimalist line icon of graduation cap or mortarboard. Purple gradient (#7B2CBF to #9D4EDD). Clean, educational lines. Tech-forward aesthetic. 280x280px transparent PNG. Professional, B2B. Vector line icon."
```

---

### 4. DATABASE ICONS (8 assets)

**Priority: MEDIUM**

**Common specs:** 280x280px, PNG transparent, minimalist line style

#### Icon: Projects
```
File: icons/database-icons/db-icon-projects.png
Prompt: "Minimalist purple folder icon. Line style, gradient (#7B2CBF to #9D4EDD). 280x280px transparent PNG. Clean, professional."
```

#### Icon: Clients
```
File: icons/database-icons/db-icon-clients.png
Prompt: "Minimalist blue handshake icon. Line style, gradient (#0066FF to #00BFFF). 280x280px transparent PNG. Clean, professional."
```

#### Icon: Tasks
```
File: icons/database-icons/db-icon-tasks.png
Prompt: "Minimalist green checkmark icon. Line style, gradient (#10B981 to #34D399). 280x280px transparent PNG. Clean, professional."
```

#### Icon: Meetings
```
File: icons/database-icons/db-icon-meetings.png
Prompt: "Minimalist orange calendar icon. Line style, gradient (#FF6B6B to #FFA07A). 280x280px transparent PNG. Clean, professional."
```

#### Icon: Resources
```
File: icons/database-icons/db-icon-resources.png
Prompt: "Minimalist pink books icon. Line style, gradient (#E91E63 to #F06292). 280x280px transparent PNG. Clean, professional."
```

#### Icon: Analytics
```
File: icons/database-icons/db-icon-analytics.png
Prompt: "Minimalist red chart icon. Line style, gradient (#DC2626 to #EF4444). 280x280px transparent PNG. Clean, professional."
```

#### Icon: Team
```
File: icons/database-icons/db-icon-team.png
Prompt: "Minimalist teal people icon. Line style, gradient (#20C997 to #5FD4AE). 280x280px transparent PNG. Clean, professional."
```

#### Icon: Notes
```
File: icons/database-icons/db-icon-notes.png
Prompt: "Minimalist grey note icon. Line style, gradient (#6B7280 to #9CA3AF). 280x280px transparent PNG. Clean, professional."
```

---

### 5. CUSTOM EMOJIS (15 assets)

**Priority: LOW** - Can be done last

**Common specs:** 128x128px, PNG transparent, bold simple style

#### Status Emojis (5)

```
emojis/status/emoji-done-oleksiak.png
"Minimalist green checkmark icon (#10B981) with subtle glow. Bold lines. 128x128px transparent PNG. Modern, professional."

emojis/status/emoji-inprogress-oleksiak.png
"Minimalist purple gear icon (#7B2CBF) with rotation implication. Bold lines. 128x128px transparent PNG. Tech-forward."

emojis/status/emoji-todo-oleksiak.png
"Minimalist white/light grey clipboard icon. Simple lines. 128x128px transparent PNG. Professional."

emojis/status/emoji-onhold-oleksiak.png
"Minimalist grey pause icon (two vertical bars). Simple. 128x128px transparent PNG. Professional."

emojis/status/emoji-highpriority-oleksiak.png
"Minimalist purple flame icon (#7B2CBF) with glow. Bold. 128x128px transparent PNG. Attention-grabbing."
```

#### Category Emojis (5)

```
emojis/category/emoji-business-oleksiak.png
"Minimalist purple briefcase icon (#7B2CBF). Clean line style. 128x128px transparent PNG. Professional."

emojis/category/emoji-tech-oleksiak.png
"Minimalist blue laptop icon (#0066FF). Clean, tech-forward. 128x128px transparent PNG."

emojis/category/emoji-analytics-oleksiak.png
"Minimalist chart with gradient (purple to blue). Clean lines. 128x128px transparent PNG."

emojis/category/emoji-design-oleksiak.png
"Minimalist purple palette icon. Clean, creative. 128x128px transparent PNG."

emojis/category/emoji-marketing-oleksiak.png
"Minimalist blue envelope icon. Clean, modern. 128x128px transparent PNG."
```

#### Action Emojis (5)

```
emojis/action/emoji-launch-oleksiak.png
"Minimalist purple rocket icon (#7B2CBF) angled upward. Dynamic. 128x128px transparent PNG."

emojis/action/emoji-idea-oleksiak.png
"Minimalist light bulb icon, yellow (#FFC107) with purple outline. Creative. 128x128px transparent PNG."

emojis/action/emoji-quickwin-oleksiak.png
"Minimalist electric blue lightning bolt (#0066FF). Bold, energetic. 128x128px transparent PNG."

emojis/action/emoji-goal-oleksiak.png
"Minimalist purple target icon. Clean, focused. 128x128px transparent PNG."

emojis/action/emoji-growth-oleksiak.png
"Minimalist ascending chart with green/purple gradient. Clean, positive. 128x128px transparent PNG."
```

---

### 6. DATABASE CARDS (8 assets)

**Priority: LOW** - Gallery view covers

**Common specs:** 1500x600px, PNG, gradient backgrounds

```
Database card template for each:
Background: dark grey (#1A1A2E) to [accent color] gradient
Left: Colored icon
Right: Bold white text with category name
Top-left: Small "OLEKSIAK" logo
Clean, minimalist design
```

#### Cards to generate:

```
database-cards/database-card-projects.png
"Database gallery card. Gradient: #1A1A2E to #7B2CBF. Left: purple folder. Right: 'Projects'. Logo top-left. 1500x600px."

database-cards/database-card-clients.png
"Database gallery card. Gradient: #1A1A2E to #0066FF. Left: blue handshake. Right: 'Clients'. Logo top-left. 1500x600px."

database-cards/database-card-tasks.png
"Database gallery card. Gradient: #1A1A2E to #10B981. Left: green checkmark. Right: 'Tasks'. Logo top-left. 1500x600px."

database-cards/database-card-meetings.png
"Database gallery card. Gradient: #1A1A2E to #FF6B6B. Left: orange calendar. Right: 'Meetings'. Logo top-left. 1500x600px."

database-cards/database-card-resources.png
"Database gallery card. Gradient: #1A1A2E to #E91E63. Left: pink books. Right: 'Resources'. Logo top-left. 1500x600px."

database-cards/database-card-analytics.png
"Database gallery card. Gradient: #1A1A2E to #DC2626. Left: red chart. Right: 'Analytics'. Logo top-left. 1500x600px."

database-cards/database-card-team.png
"Database gallery card. Gradient: #1A1A2E to #20C997. Left: teal people. Right: 'Team'. Logo top-left. 1500x600px."

database-cards/database-card-notes.png
"Database gallery card. Gradient: #1A1A2E to #6B7280. Left: grey note. Right: 'Notes'. Logo top-left. 1500x600px."
```

---

## 🔧 IMPLEMENTATION INSTRUCTIONS

### For Each Asset:

1. **Prepare prompt** - Use exact prompt from above
2. **Add quality keywords** - Append: "professional quality, high resolution, 4K, ultra-detailed, masterpiece"
3. **Generate via MCP** - Use available image generation tool
4. **Verify output** - Check dimensions, colors, clarity
5. **Save to correct path** - Follow naming convention exactly
6. **Log completion** - Keep track of progress

### MCP Tool Usage:

**If Stability AI available:**
```
Use: generate_image tool
Parameters:
- prompt: [full prompt]
- width: [specified width]
- height: [specified height]
- output_path: [notion-branding-assets/path/filename.png]
```

**If Replicate available:**
```
Use: invoke_api_endpoint
Model: stability-ai/sdxl or flux models
Parameters: as needed for each asset
```

**If Hugging Face FLUX available:**
```
Use: generate tool
Specify: FLUX.1-Krea-dev model
Parameters: prompt + dimensions
```

---

## 📊 PROGRESS TRACKING

After each asset, log:
```
✅ [X/48] Generated: [filename]
   Dimensions: [WxH]
   File size: [KB]
   Status: Success/Failed
```

### Quality Checks:

After generation, verify:
- [ ] Correct dimensions
- [ ] Brand colors accurate
- [ ] File size reasonable (<500KB covers, <100KB icons)
- [ ] Transparent background where needed
- [ ] Clear, professional appearance
- [ ] Follows naming convention

---

## 🎯 SUCCESS CRITERIA

**Complete success when:**
✅ All 48 assets generated
✅ All files in correct folders
✅ All filenames follow convention
✅ Quality checks passed
✅ Total folder size reasonable (<50MB)

**Generate final report:**
```markdown
# Notion Branding Assets - Generation Report

## Summary:
- Total assets: 48/48 ✅
- Failed: 0
- Total size: XX MB
- Average quality: Excellent

## File Structure:
[Tree view of notion-branding-assets/]

## Quality Metrics:
- Logos: 4/4 ✅
- Covers: 7/7 ✅
- Service Icons: 6/6 ✅
- Database Icons: 8/8 ✅
- Emojis: 15/15 ✅
- Database Cards: 8/8 ✅

## Ready for Upload: ✅ YES

## Next Steps:
1. Review visual quality
2. Upload to Notion (use NOTION-QUICK-REFERENCE.md)
3. Test in Notion workspace
```

---

## 🚀 START GENERATION NOW

Begin with highest priority assets first:
1. Logos (4) - Foundation
2. Covers (7) - Visual impact
3. Service Icons (6) - Functionality
4. Database Icons (8) - Organization
5. Emojis (15) - Details
6. Database Cards (8) - Gallery views

**Time estimate:** 30-60 minutes for all 48 assets (depending on MCP server speed)

Good luck! Generate professional, on-brand assets that will make Rafał's Notion workspace shine! ✨
