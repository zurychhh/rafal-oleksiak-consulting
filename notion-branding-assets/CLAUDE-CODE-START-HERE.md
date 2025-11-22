# 🚀 CLAUDE CODE - START HERE
## Automatyczna Generacja 48 Notion Branding Assets

**Projekt:** Rafał Oleksiak Consulting  
**Data:** 2025-11-14  
**Status:** ✅ Ready to Run

---

## ⚡ QUICK START (Copy-Paste to Claude Code)

### STEP 1: Setup MCP Server (Choose One)

**OPTION A: Stability AI (Recommended - Best Quality)**
```bash
# 1. Get API key from: https://platform.stability.ai/account/keys
# 2. Install MCP server:

claude mcp add --transport stdio stability-ai \
  --env STABILITY_AI_API_KEY=YOUR_API_KEY_HERE \
  --env IMAGE_STORAGE_DIRECTORY=/Users/user/projects/rafal-oleksiak-consulting/notion-branding-assets \
  -- npx -y mcp-server-stability-ai

# 3. Restart Claude Code
```

**OPTION B: Hugging Face (Free Tier)**
```bash
# 1. Create free account: https://huggingface.co
# 2. Go to: https://huggingface.co/mcp/settings
# 3. Add "mcp-tools/FLUX.1-Krea-dev" to "Spaces Tools"
# 4. Connect Claude from "Search and tools" menu
# 5. Restart Claude Code
```

**OPTION C: Replicate (Pay-per-use)**
```bash
# 1. Get API key from: https://replicate.com/account/api-tokens
# 2. Install MCP server:

claude mcp add --transport stdio replicate \
  --env REPLICATE_API_TOKEN=YOUR_TOKEN_HERE \
  -- npx -y @replicate/mcp-server

# 3. Restart Claude Code
```

---

### STEP 2: Verify MCP Setup

```bash
# In Claude Code, check MCP status:
/mcp

# You should see your image generation server connected
# Example output:
# ⎿ MCP Server Status ⎿
# • stability-ai: connected ✅
```

---

### STEP 3: Run Automated Generation

```bash
# Navigate to project:
cd /Users/user/projects/rafal-oleksiak-consulting

# Run custom command:
/project:generate-notion-branding

# Claude Code will now:
# 1. Create folder structure
# 2. Generate all 48 assets via MCP
# 3. Save with correct naming
# 4. Create quality report
# 5. Prepare for Notion upload

# Expected time: 30-60 minutes
```

---

## 🎯 WHAT HAPPENS NEXT

### During Generation:

You'll see progress like:
```
✅ [1/48] Generated: oleksiak-logo-full.png
   Dimensions: 400x400px
   File size: 245KB
   Status: Success

✅ [2/48] Generated: oleksiak-logo-compact.png
   Dimensions: 280x280px
   File size: 156KB
   Status: Success

...continuing for all 48 assets...
```

### Output Structure:

```
notion-branding-assets/
├── logos/ (4 files)
│   ├── oleksiak-logo-full.png
│   ├── oleksiak-logo-compact.png
│   ├── oleksiak-monogram.png
│   └── oleksiak-dots.png
├── covers/ (7 files)
│   ├── cover-hero-transform-revenue.png
│   ├── cover-services-what-i-deliver.png
│   └── ... (5 more)
├── icons/
│   ├── service-icons/ (6 files)
│   └── database-icons/ (8 files)
├── emojis/
│   ├── status/ (5 files)
│   ├── category/ (5 files)
│   └── action/ (5 files)
└── database-cards/ (8 files)

TOTAL: 48 branded assets
```

---

## 🆘 TROUBLESHOOTING

### Problem: MCP Server Not Connecting

**Check 1: Is MCP installed?**
```bash
/mcp
# If no servers shown, reinstall using STEP 1
```

**Check 2: API Key Valid?**
```bash
# Verify your API key at provider's dashboard:
# - Stability AI: https://platform.stability.ai/account/keys
# - Replicate: https://replicate.com/account/api-tokens
# - Hugging Face: https://huggingface.co/settings/tokens
```

**Check 3: Restart Claude Code**
```bash
# Quit Claude Code completely
# Reopen and try again
```

---

### Problem: Images Not Generating

**Solution 1: Check Allowed Tools**
```bash
# Custom command may need permission
# If prompted, approve MCP tool usage
```

**Solution 2: Manual Fallback**
```bash
# If automated generation fails, switch to Semi-Auto:
# 1. Read: NOTION-IMPLEMENTATION-GUIDE.md
# 2. Copy prompts to Midjourney/DALL-E manually
# 3. Use NOTION-QUICK-REFERENCE.md for upload
```

**Solution 3: Increase Timeout**
```bash
# In terminal, before running Claude Code:
export MCP_TIMEOUT=30000
# Then restart Claude Code
```

---

### Problem: Low Quality Images

**Solution: Enhance Prompts**
```bash
# Ask Claude Code:
"Regenerate [asset_name] with enhanced prompt. Add:
- professional quality
- high resolution
- 4K ultra-detailed
- masterpiece
- photorealistic (if needed)"
```

---

## 📊 AFTER GENERATION - QUALITY CHECK

### Automatic Quality Report

Claude Code will generate:
```markdown
# Notion Branding Assets - Quality Report

✅ Status: 48/48 assets generated successfully

## File Sizes:
- Logos: Average 180KB (target <500KB) ✅
- Covers: Average 320KB (target <500KB) ✅
- Icons: Average 45KB (target <100KB) ✅
- Emojis: Average 28KB (target <100KB) ✅
- Database Cards: Average 280KB (target <500KB) ✅

## Visual Quality:
- Brand colors accurate ✅
- Professional appearance ✅
- Proper dimensions ✅
- Transparent backgrounds where needed ✅

## Ready for Upload: ✅ YES
```

### Manual Verification

```bash
# Review generated assets:
open notion-branding-assets/

# Check:
# 1. All 48 files present
# 2. Visual quality acceptable
# 3. Colors match brand (#7B2CBF, #0066FF, #1A1A2E)
# 4. File sizes reasonable
```

---

## 📤 UPLOAD TO NOTION

### Step-by-Step Upload Guide

**1. Workspace Icon (5 min)**
```
1. Open Notion
2. Click workspace name (top-left)
3. Settings & Members → Settings
4. Click workspace icon
5. Upload: oleksiak-logo-compact.png
6. Save
```

**2. Custom Emojis (15 min - 15 emojis)**
```
For EACH emoji file:
1. Edit any page in Notion
2. Type ":"
3. Click "Upload" (bottom-right)
4. Select emoji file
5. ✅ CHECK: "Add to workspace Emoji library"
6. Name it (e.g., "done" for emoji-done-oleksiak.png)
7. Save

Repeat 15 times for all emojis
```

**3. Test Page (10 min)**
```
1. Create new Notion page: "Branding Test"
2. Add page icon: Upload oleksiak-logo-full.png
3. Add cover: Upload cover-hero-transform-revenue.png
4. Test custom emoji: Type :done: (should show your custom emoji)
5. If all works → Ready to apply to real pages!
```

**Full upload guide:** See `NOTION-QUICK-REFERENCE.md`

---

## 🎉 SUCCESS CHECKLIST

- [ ] MCP server connected (verified with `/mcp`)
- [ ] Custom command run successfully
- [ ] All 48 assets generated
- [ ] Quality check passed
- [ ] Workspace icon uploaded to Notion
- [ ] All 15 custom emojis uploaded to Notion
- [ ] Test page created and looks professional
- [ ] Ready to brand all Notion pages! 🚀

---

## 📚 ADDITIONAL RESOURCES

**Complete Documentation:**
- `NOTION-BRANDING-PACKAGE.md` - Full brand specification
- `NOTION-IMPLEMENTATION-GUIDE.md` - All 48 AI prompts
- `NOTION-QUICK-REFERENCE.md` - One-page cheat sheet
- `CLAUDE-CODE-NOTION-GUIDE.md` - Detailed scenarios

**If Full Automation Fails:**
- Use Semi-Automated approach (CLAUDE-CODE-NOTION-GUIDE.md → Scenario B)
- Manual fallback with prompt files

---

## 💡 PRO TIPS

### Tip 1: Regenerate Single Asset
```bash
# If one asset needs remake:
"Regenerate notion-branding-assets/logos/oleksiak-logo-full.png 
with improved quality. Use same prompt from custom command."
```

### Tip 2: Batch Optimization
```bash
# Compress all files after generation:
"Create bash script to optimize all PNG files in notion-branding-assets/ 
using pngquant. Target: <500KB for covers, <100KB for icons."
```

### Tip 3: Version Control
```bash
# Save this version before modifications:
cp -r notion-branding-assets notion-branding-assets-v1-backup
```

---

## 🆘 NEED HELP?

### Option 1: Semi-Automated Fallback
If full automation doesn't work, switch to easier approach:
```bash
"Create prompt files for manual generation. 
Use NOTION-IMPLEMENTATION-GUIDE.md to create 48 individual text files 
in notion-prompts/ folder. I'll generate manually in Midjourney."
```

### Option 2: Check MCP Debug
```bash
# Run Claude Code with debug mode:
claude --mcp-debug

# This shows detailed MCP communication
# Helps identify connection issues
```

### Option 3: Contact Support
- MCP issues: Check MCP server documentation
- Stability AI: https://platform.stability.ai/docs
- Replicate: https://replicate.com/docs
- Hugging Face: https://huggingface.co/docs

---

## ⏱️ TIME EXPECTATIONS

### Setup (One-time):
- MCP server installation: 15-30 min
- API key setup: 5 min
- Verification: 5 min
**Total: 25-40 minutes**

### Generation:
- Automated (MCP): 30-60 min
- Quality check: 10 min
**Total: 40-70 minutes**

### Upload:
- Notion workspace setup: 5 min
- Upload 15 emojis: 15 min
- Test page: 10 min
**Total: 30 minutes**

### **GRAND TOTAL: 1.5-2.5 hours** (first time, end-to-end)

---

## 🎯 EXPECTED RESULT

### Before:
- Generic Notion workspace
- No branding
- Default emojis
- No custom icons

### After:
- ✨ Professional branded workspace
- ✨ Custom purple/blue color scheme
- ✨ 15 custom emojis matching brand
- ✨ Consistent visual identity
- ✨ Stakeholders impressed!

---

## 🚀 READY? LET'S GO!

### Copy This Command:

```bash
# 1. Setup MCP (choose Stability AI, Hugging Face, or Replicate)
# 2. Verify: /mcp
# 3. Run this:

cd /Users/user/projects/rafal-oleksiak-consulting && /project:generate-notion-branding
```

**That's it!** Claude Code handles the rest. ✨

---

**Questions? Issues? Fallbacks?**
- Check: `CLAUDE-CODE-NOTION-GUIDE.md` for detailed troubleshooting
- Or use Semi-Auto approach (Scenario B) - takes 2-3h manually

---

**Good luck!** 🎉 Your professional Notion workspace awaits!

**Created by:** Rafał Oleksiak + Claude AI  
**Version:** 1.0  
**Date:** 2025-11-14  
**Status:** ✅ READY TO LAUNCH
