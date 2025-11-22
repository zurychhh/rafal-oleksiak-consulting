# CLAUDE CODE + NOTION BRANDING
## Jak Zlecić Wdrożenie SI w Notion Używając Claude Code

**Data:** 2025-11-14  
**Projekt:** Rafał Oleksiak Consulting  
**Cel:** Automatyzacja generowania 48 branded assets

---

## 📊 EXECUTIVE SUMMARY

**Co Claude Code MOŻE:**
✅ Batch generacja AI prompts w strukturze folderów
✅ Integracja z MCP servers dla image generation (Stability AI, Replicate, Hugging Face)
✅ Automatyzacja workflow (download, rename, organize)
✅ Tworzenie SVG images przez kod
✅ Setup custom commands dla powtarzalnych tasków

**Czego Claude Code NIE MOŻE natywnie:**
❌ Bezpośrednia generacja obrazów PNG/JPG (wymaga MCP servers)
❌ Generacja high-quality grafik bez external APIs

**RECOMMENDED APPROACH:**
1. **Claude Code** → Setup struktur + AI prompts
2. **MCP Server** → Image generation (Stability AI lub Hugging Face)
3. **Claude Code** → Batch processing + optimization

---

## 🎯 PLAN WDROŻENIA - 3 SCENARIUSZE

### SCENARIUSZ A: Pełna Automatyzacja z MCP (Advanced - 3h setup)
**Najlepsze dla:** Tech-savvy users, want full automation
**Wymagania:** Claude Code + MCP server + API keys
**Rezultat:** Automatyczne generowanie 48 assets w jednej sesji

### SCENARIUSZ B: Semi-Automated (Recommended - 1h setup)
**Najlepsze dla:** Balance między automatyzacją a kontrolą
**Wymagania:** Claude Code + external tool (Midjourney/DALL-E)
**Rezultat:** Claude Code przygotowuje prompts, Ty generujesz w external tool

### SCENARIUSZ C: Manual z Claude Code Support (Fastest - 30 min setup)
**Najlepsze dla:** Quick start, minimal setup
**Wymagania:** Claude Code only
**Rezultat:** Claude Code daje strukturę + checklists, rest manual

---

## 🚀 SCENARIUSZ A: FULL AUTOMATION (MCP)

### Step 1: Install MCP Server dla Image Generation

**Option 1: Stability AI (Recommended)**
```bash
# Zdobądź API key z https://platform.stability.ai/account/keys

# Add MCP server do Claude Code
claude mcp add --transport stdio stability-ai \
  --env STABILITY_AI_API_KEY=YOUR_API_KEY \
  --env IMAGE_STORAGE_DIRECTORY=/path/to/output \
  -- npx -y mcp-server-stability-ai
```

**Option 2: Hugging Face FLUX (Free tier)**
```bash
# Create free account: https://huggingface.co
# Connect Claude from: https://huggingface.co/mcp/settings

# Add FLUX.1-Krea-dev to "Spaces Tools"
# Hugging Face MCP server auto-configured
```

**Option 3: Replicate (Pay-per-use)**
```bash
# Get API key from https://replicate.com/account/api-tokens

# Follow: https://github.com/replicate/mcp-server-replicate
claude mcp add --transport stdio replicate \
  --env REPLICATE_API_TOKEN=YOUR_TOKEN \
  -- npx -y @replicate/mcp-server
```

---

### Step 2: Create Custom Command dla Batch Generation

**File:** `.claude/commands/generate-notion-branding.md`

```markdown
---
allowed-tools: 
  - Bash(ls *)
  - Bash(curl *)
  - Bash(mkdir *)
  - Bash(mv *)
  - mcp__stability-ai__generate_image
  - mcp__replicate__invoke_api_endpoint
description: Generates all 48 branded assets for Oleksiak Consulting Notion workspace
---

# Generate Notion Branding Assets

You are tasked with generating 48 branded assets for Rafał Oleksiak Consulting.

## Brand Guidelines:
- **Primary colors:** Moonlit Grey #1A1A2E, Vivid Purple #7B2CBF, Electric Blue #0066FF
- **Typography:** Poppins Bold (headings), DM Sans (body)
- **Style:** Tech-forward, minimalist, professional, B2B consulting

## Assets to Generate:

### 1. Logos (4 assets)
Generate using Stability AI with these specs:

**Logo 1: Full Logo**
- Prompt: "Minimalist consulting logo with text 'OLEKSIAK CONSULT' in bold sans-serif font (Poppins style), followed by 3 small circular dots in purple gradient (#7B2CBF to #9D4EDD). Background: dark grey #2D3142. Logo should be modern, tech-forward, professional. Text in white. Dots have subtle glow effect. Vector graphic, flat design, no shadows, high contrast"
- Dimensions: 400x400px
- Save as: `logos/oleksiak-logo-full.png`

**Logo 2: Compact Logo**
- Prompt: "Minimalist logo with text 'OLEKSIAK' in bold white sans-serif font (Poppins style), followed by 3 gradient purple dots (#7B2CBF to #9D4EDD). Dark background #2D3142. Modern, tech-forward consulting brand. Dots slightly glowing. Clean, professional, B2B aesthetic"
- Dimensions: 280x280px
- Save as: `logos/oleksiak-logo-compact.png`

**Logo 3: Monogram**
- Prompt: "Create minimalist monogram logo with letters 'OC' in bold modern sans-serif font, white color, with single purple dot (#7B2CBF) accent. Dark grey background #2D3142. Tech-forward, professional, B2B consulting. Clean, geometric, high contrast design"
- Dimensions: 280x280px
- Save as: `logos/oleksiak-monogram.png`

**Logo 4: Dots Only**
- Prompt: "Three circular dots in horizontal line, gradient from purple (#7B2CBF) to light purple (#9D4EDD), with subtle glow effect. Dark background #2D3142. Minimalist, tech-forward icon. Clean, modern, professional aesthetic"
- Dimensions: 280x280px
- Save as: `logos/oleksiak-dots.png`

### 2. Cover Images (7 assets - 1500x600px)
[Include all 7 cover prompts from NOTION-IMPLEMENTATION-GUIDE.md]

### 3. Service Icons (6 assets - 280x280px)
[Include all 6 icon prompts]

### 4. Custom Emojis (15 assets - 128x128px)
[Include all 15 emoji prompts]

### 5. Database Cards (8 assets - 1500x600px)
[Include all 8 database card prompts]

## Workflow:
1. Create output directory structure:
   ```bash
   mkdir -p notion-branding-assets/{logos,covers,icons/{service-icons,database-icons},emojis/{status,category,action},database-cards}
   ```

2. Generate each asset using MCP image generation tool:
   - Call appropriate MCP tool (stability-ai, replicate, or hugging-face)
   - Pass exact prompt + dimensions
   - Save to correct folder with naming convention

3. After generation, create summary report:
   - List all generated files
   - Note any errors or issues
   - Provide quality checklist

4. Optimize file sizes (if needed):
   - Compress PNG files to <500KB (covers, cards)
   - Compress to <100KB (icons, emojis)

## Success Criteria:
- All 48 assets generated successfully
- Files named according to convention
- All files in correct folders
- Quality checklist passed
- Ready for upload to Notion

Begin generation now.
```

---

### Step 3: Run Custom Command w Claude Code

```bash
# Start Claude Code w project directory
cd /Users/user/projects/rafal-oleksiak-consulting

# Run custom command
/project:generate-notion-branding
```

**Claude Code will:**
1. Create folder structure
2. Generate all 48 assets via MCP
3. Save with correct naming
4. Create summary report
5. Run quality checks

**Time:** ~30-60 minutes (depending on API speed)

---

### Step 4: Review & Upload to Notion

```bash
# Review generated assets
ls -la notion-branding-assets/

# Claude Code can create upload guide
# Ask: "Create step-by-step Notion upload instructions"
```

---

## 🔧 SCENARIUSZ B: SEMI-AUTOMATED (Recommended)

**Best balance:** Claude Code prepares, You generate externally

### Step 1: Let Claude Code Create Prompt Files

**Zlecenie dla Claude Code:**
```
Create a folder structure for Notion branding assets with 48 individual prompt files.

Each file should:
1. Be named according to asset name (e.g., logo-full-prompt.txt)
2. Contain ready-to-use AI prompt
3. Include technical specs (dimensions, format)
4. Be organized in folders by asset type

Use the prompts from: /Users/user/projects/rafal-oleksiak-consulting/NOTION-IMPLEMENTATION-GUIDE.md

Create structure:
notion-prompts/
├── logos/ (4 files)
├── covers/ (7 files)
├── icons/ (14 files)
├── emojis/ (15 files)
└── database-cards/ (8 files)
```

**Claude Code will generate:**
```
notion-prompts/
├── logos/
│   ├── 01-logo-full-prompt.txt
│   ├── 02-logo-compact-prompt.txt
│   ├── 03-monogram-prompt.txt
│   └── 04-dots-only-prompt.txt
├── covers/
│   ├── 01-hero-transform-revenue-prompt.txt
│   ├── 02-services-what-i-deliver-prompt.txt
│   └── ... (5 more)
├── icons/
│   └── ... (14 files)
├── emojis/
│   └── ... (15 files)
└── database-cards/
    └── ... (8 files)
```

**Time:** 5 minutes

---

### Step 2: Batch Copy-Paste to Midjourney/DALL-E

**Manual process:**
1. Open `notion-prompts/logos/01-logo-full-prompt.txt`
2. Copy prompt
3. Paste into Midjourney Discord / DALL-E
4. Download generated image
5. Save as: `oleksiak-logo-full.png`
6. Repeat for all 48 files

**Time:** 1-2 hours (manual, but controlled quality)

**Automation helper (optional):**
Claude Code can create a bash script to monitor downloads folder and auto-rename files:

```bash
# Ask Claude Code:
"Create a bash script that:
1. Watches ~/Downloads folder
2. Auto-renames downloaded images based on order
3. Moves to correct folders in notion-branding-assets/"
```

---

### Step 3: Quality Check with Claude Code

```bash
# After downloading all assets, ask Claude Code:
"Review all assets in notion-branding-assets/ and create quality report:
- Check file sizes (<500KB for covers, <100KB for icons)
- Verify naming convention
- List missing files
- Create checklist for Notion upload"
```

**Claude Code generates report:**
```markdown
# Quality Check Report - Notion Branding Assets

## Status: ✅ 48/48 Assets Generated

### File Size Check:
✅ Covers: Average 320KB (target <500KB)
✅ Icons: Average 45KB (target <100KB)
✅ Emojis: Average 28KB (target <100KB)
✅ Database Cards: Average 280KB (target <500KB)

### Naming Convention Check:
✅ All files follow convention
✅ All files in correct folders

### Missing Files: None

### Ready for Upload: ✅ YES
```

---

## 🎨 SCENARIUSZ C: MANUAL with Claude Code Support

**Fastest to start, most manual work**

### Step 1: Claude Code Creates Checklist & Reference

**Zlecenie:**
```
Create an interactive checklist for generating 48 Notion branding assets.

Include:
1. Checkboxes for each asset
2. Link to prompt in NOTION-IMPLEMENTATION-GUIDE.md
3. Specs (dimensions, format)
4. Upload instructions for Notion

Save as interactive Markdown: notion-branding-checklist.md
```

**Claude Code generates:**
```markdown
# Notion Branding Assets Checklist

## Logos (4 assets)

### [ ] Logo 1: Full Logo (400x400px)
**Prompt:** [Link to NOTION-IMPLEMENTATION-GUIDE.md section]
**Specs:** 400x400px, PNG, transparent background
**Tool:** Midjourney / DALL-E / Canva
**Upload to Notion:** Settings > Workspace Icon

### [ ] Logo 2: Compact (280x280px)
...

## Covers (7 assets)
...

## Progress: 0/48 (0%)
```

---

### Step 2: Manual Generation + Check-off

1. Open `notion-branding-checklist.md`
2. For each item:
   - Click prompt link
   - Copy to Midjourney/DALL-E
   - Generate
   - Download
   - Check box: `[x]`
3. Claude Code tracks progress in checklist

---

### Step 3: Final Upload Guide

**Zlecenie po zakończeniu:**
```
All assets generated. Create step-by-step Notion upload guide with screenshots placeholders.
```

---

## 🔥 PRO TIPS - Claude Code Workflow Optimization

### Tip 1: Create Project-Specific .mcp.json

**File:** `.mcp.json` (w project root)

```json
{
  "mcpServers": {
    "stability-ai": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-server-stability-ai"],
      "env": {
        "STABILITY_AI_API_KEY": "YOUR_KEY",
        "IMAGE_STORAGE_DIRECTORY": "/Users/user/projects/rafal-oleksiak-consulting/notion-branding-assets"
      }
    }
  }
}
```

**Benefit:** Team members can use same setup

---

### Tip 2: Use Claude Code Hooks

**File:** `.claude/hooks/post-generate.sh`

```bash
#!/bin/bash
# Auto-optimize images after generation
find notion-branding-assets -name "*.png" -exec pngquant --force --output {} {} \;
echo "✅ All images optimized"
```

---

### Tip 3: Version Control Assets

```bash
# Ask Claude Code:
"Setup git LFS for large assets and create .gitattributes"
```

**Claude Code creates:**
```
# .gitattributes
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
```

---

### Tip 4: Create Upload Automation

**Custom Command:** `/upload-notion-assets`

```markdown
---
description: Automates uploading assets to Notion workspace
---

1. Check if all 48 assets exist
2. Create upload sequence script
3. Generate Notion API calls (if using Notion API)
4. Create manual upload checklist with screenshots
```

---

## 📊 COMPARISON: Which Scenario to Choose?

| Criteria | Scenario A (Full Auto) | Scenario B (Semi-Auto) | Scenario C (Manual) |
|----------|------------------------|------------------------|---------------------|
| **Setup Time** | 3 hours | 1 hour | 30 minutes |
| **Generation Time** | 30-60 min (automated) | 1-2 hours (manual) | 2-3 hours (manual) |
| **Quality Control** | Medium (automated) | High (manual review) | High (manual) |
| **Repeatability** | High (reusable) | Medium | Low |
| **Tech Skills Required** | Advanced (MCP setup) | Intermediate | Beginner |
| **Cost** | API fees ($5-20) | API fees ($5-20) | API fees ($5-20) |
| **Best For** | Tech teams, frequent use | Balance, one-time | Quick start, learning |

**Moja Rekomendacja:** **Scenario B (Semi-Automated)**

**Dlaczego:**
- ✅ Szybki setup (1h)
- ✅ Pełna kontrola jakości
- ✅ Nie wymaga advanced MCP knowledge
- ✅ Claude Code robi heavy lifting (prompts, structure)
- ✅ Ty generujesz w znanym tool (Midjourney/DALL-E)

---

## 🚀 QUICK START COMMAND

**Najszybszy sposób by zacząć:**

```bash
# 1. Open Claude Code w project directory
cd /Users/user/projects/rafal-oleksiak-consulting

# 2. Tell Claude Code:
"Read NOTION-IMPLEMENTATION-GUIDE.md and create:
1. Folder structure for 48 assets
2. Individual prompt files (one per asset)
3. Quality checklist
4. Upload guide

Follow Scenario B (Semi-Automated) workflow."

# 3. Claude Code will do everything in ~10 minutes
# 4. You generate assets using prompt files
# 5. Done!
```

---

## 🆘 TROUBLESHOOTING

### Problem: MCP Server Not Connecting
**Solution:**
```bash
# Check MCP status
/mcp

# Restart Claude Code
# Verify API key in .mcp.json
```

---

### Problem: Generated Images Low Quality
**Solution:**
```bash
# Ask Claude Code to enhance prompts:
"Improve all prompts in notion-prompts/ to add:
- High resolution keywords
- Professional quality descriptors
- 4K, ultra-detailed, masterpiece"
```

---

### Problem: File Sizes Too Large
**Solution:**
```bash
# Ask Claude Code:
"Create bash script to compress all PNG files in notion-branding-assets/ to <500KB using pngquant"

# Claude Code generates script:
#!/bin/bash
find notion-branding-assets -name "*.png" -exec pngquant --quality=65-80 --force --output {} {} \;
```

---

### Problem: Naming Convention Inconsistent
**Solution:**
```bash
# Ask Claude Code:
"Rename all files in notion-branding-assets/ to follow naming convention from NOTION-QUICK-REFERENCE.md"

# Claude Code creates rename script
```

---

## 📦 DELIVERABLES (Co Claude Code Może Stworzyć)

### Scenario A (Full Auto):
✅ 48 generated assets (automated)
✅ Folder structure
✅ Quality report
✅ Upload guide

### Scenario B (Semi-Auto):
✅ 48 prompt files (ready to copy-paste)
✅ Folder structure
✅ Download monitoring script (optional)
✅ Quality checklist
✅ Upload guide

### Scenario C (Manual):
✅ Interactive checklist with links
✅ Folder structure template
✅ Upload step-by-step guide

---

## ⏱️ TIME ESTIMATES

### Scenario A:
- Setup MCP: 2-3 hours (one-time)
- Create custom command: 30 min
- Run generation: 30-60 min (automated)
- Review & upload: 30 min
**TOTAL: 4-5 hours (first time), 1 hour (subsequent)**

### Scenario B:
- Claude Code setup: 10 min
- Generate prompts: 5 min
- Manual generation: 1-2 hours
- Quality check: 15 min
- Upload: 30 min
**TOTAL: 2-3 hours**

### Scenario C:
- Create checklist: 10 min
- Manual generation: 2-3 hours
- Upload: 30 min
**TOTAL: 3-4 hours**

---

## 🎯 FINAL RECOMMENDATION

**START WITH SCENARIO B (Semi-Automated):**

1. **Right Now (15 minutes):**
   ```bash
   cd /Users/user/projects/rafal-oleksiak-consulting
   
   # Tell Claude Code:
   "Create notion-prompts folder with 48 prompt files from NOTION-IMPLEMENTATION-GUIDE.md. 
   Include specs and naming convention."
   ```

2. **This Week (2 hours):**
   - Copy prompts to Midjourney/DALL-E
   - Generate 48 assets
   - Download & organize

3. **Upload to Notion (30 minutes):**
   - Follow NOTION-QUICK-REFERENCE.md
   - Upload workspace icon
   - Upload 15 custom emojis
   - Test on sample page

**Total Time Investment: 2.5-3 hours**
**Result: Professional branded Notion workspace** ✨

---

## 🔗 RESOURCES

- **NOTION-BRANDING-PACKAGE.md** - Complete specification
- **NOTION-IMPLEMENTATION-GUIDE.md** - 48 AI prompts
- **NOTION-QUICK-REFERENCE.md** - Cheat sheet

**Claude Code Documentation:**
- Custom Commands: https://docs.claude.com/en/docs/claude-code/slash-commands
- MCP Servers: https://docs.claude.com/en/docs/claude-code/mcp
- Best Practices: https://anthropic.com/engineering/claude-code-best-practices

**MCP Servers for Image Generation:**
- Stability AI: https://github.com/stability-ai/mcp-server
- Replicate: https://github.com/replicate/mcp-server-replicate
- Hugging Face: https://huggingface.co/mcp/settings

---

**Created by:** Rafał Oleksiak + Claude AI  
**Version:** 1.0  
**Date:** 2025-11-14  
**Status:** ✅ READY TO IMPLEMENT

---

## ✨ ONE-LINER TO START

```bash
# Copy-paste this into Claude Code:
"Read NOTION-IMPLEMENTATION-GUIDE.md and create Scenario B setup: 
48 prompt files in notion-prompts/ folder, organized by type. 
Include quality checklist and upload guide. Start now."
```

**DONE!** 🚀 Claude Code will handle the rest.

