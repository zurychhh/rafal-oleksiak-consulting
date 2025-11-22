#!/bin/bash

# Notion Branding Assets Generator
# Uses Stability AI API directly
# Generated: 2025-11-14

set -e

API_KEY="sk-1VvmmPXVywYuk2V9rwSwwUUlCYpPjppOBKDBUfCI5Vh32oAQ"
OUTPUT_DIR="/Users/user/projects/rafal-oleksiak-consulting/notion-branding-assets"
API_URL="https://api.stability.ai/v2beta/stable-image/generate/sd3"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo "🎨 Starting Notion Branding Assets Generation"
echo "📊 Total assets to generate: 48"
echo "⏱️  Estimated time: 30-60 minutes"
echo ""

# Counter
count=0
total=48

# Function to generate image
generate_image() {
    local prompt="$1"
    local width="$2"
    local height="$3"
    local output_path="$4"
    local name="$5"

    count=$((count + 1))

    echo -e "${BLUE}[${count}/${total}]${NC} Generating: ${name}"
    echo "   Dimensions: ${width}x${height}px"
    echo "   Path: ${output_path}"

    # Create request
    response=$(curl -f -sS -X POST \
        "${API_URL}" \
        -H "authorization: Bearer ${API_KEY}" \
        -H "accept: image/*" \
        -F "prompt=${prompt}" \
        -F "output_format=png" \
        -F "width=${width}" \
        -F "height=${height}" \
        -F "aspect_ratio=${width}:${height}" \
        --output "${output_path}" 2>&1)

    if [ $? -eq 0 ]; then
        size=$(du -h "${output_path}" | cut -f1)
        echo -e "   ${GREEN}✅ Success${NC} (${size})"
    else
        echo -e "   ❌ Failed: ${response}"
        return 1
    fi

    echo ""
    sleep 2  # Rate limiting
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏷️  SECTION 1/6: LOGOS (4 assets)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Logo 1: Full Logo
generate_image \
    "Minimalist consulting logo with text 'OLEKSIAK CONSULT' in bold sans-serif font (Poppins style), followed by 3 small circular dots in purple gradient (#7B2CBF to #9D4EDD). Background: dark grey #2D3142. Logo should be modern, tech-forward, professional. Text in white. Dots have subtle glow effect. 400x400px, PNG with transparency. Minimalist, clean design for B2B consulting brand. Vector graphic style, flat design, no shadows, high contrast. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    400 400 \
    "${OUTPUT_DIR}/logos/oleksiak-logo-full.png" \
    "oleksiak-logo-full.png"

# Logo 2: Compact Logo
generate_image \
    "Minimalist logo with text 'OLEKSIAK' in bold white sans-serif font (Poppins style), followed by 3 gradient purple dots (#7B2CBF to #9D4EDD). Dark background #2D3142. Modern, tech-forward consulting brand. Dots slightly glowing. 280x280px, PNG transparent. Clean, professional, B2B aesthetic. Vector style, flat design, minimalist. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 \
    "${OUTPUT_DIR}/logos/oleksiak-logo-compact.png" \
    "oleksiak-logo-compact.png"

# Logo 3: Monogram
generate_image \
    "Create minimalist monogram logo with letters 'OC' in bold modern sans-serif font, white color, with single purple dot (#7B2CBF) accent. Dark grey background #2D3142. Tech-forward, professional, B2B consulting. 280x280px, PNG transparent. Clean, geometric, high contrast design. Vector style. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 \
    "${OUTPUT_DIR}/logos/oleksiak-monogram.png" \
    "oleksiak-monogram.png"

# Logo 4: Dots Only
generate_image \
    "Three circular dots in horizontal line, gradient from purple (#7B2CBF) to light purple (#9D4EDD), with subtle glow effect. Dark background #2D3142. Minimalist, tech-forward icon. 280x280px, PNG transparent. Clean, modern, professional aesthetic. Vector style, simple geometric shapes. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 \
    "${OUTPUT_DIR}/logos/oleksiak-dots.png" \
    "oleksiak-dots.png"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🖼️  SECTION 2/6: COVER IMAGES (7 assets)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cover 1: Hero - Transform Revenue
generate_image \
    "Modern dark-themed consulting website banner. Background: deep navy/grey gradient (#1A1A2E to #2D3142). Text overlay in bold white typography: 'I double revenue from owned channels'. Accent: purple gradient dots pattern (#7B2CBF to #9D4EDD) floating in background. Tech-forward, B2B professional aesthetic. Minimalist, high contrast, dramatic. 1500x600px horizontal banner. Professional consulting design, clean layout. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 \
    "${OUTPUT_DIR}/covers/cover-hero-transform-revenue.png" \
    "cover-hero-transform-revenue.png"

# Cover 2: Services - What I Deliver
generate_image \
    "Professional consulting services banner. Dark grey background (#2D3142) with 6 clean line icons arranged in grid: chart (CRM), envelope (Email), gears (Automation), people (Retention), analytics chart, graduation cap. Each icon different gradient color (purple, blue, green, orange, red, purple). Text: 'Revenue-Driving Services' in white bold font. Minimalist, organized, tech-forward. 1500x600px. Vector style icons. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 \
    "${OUTPUT_DIR}/covers/cover-services-what-i-deliver.png" \
    "cover-services-what-i-deliver.png"

# Cover 3: Case Studies - Transformation Results
generate_image \
    "Dramatic consulting results banner. Background: dark grey to purple gradient (#1A1A2E to #7B2CBF). Large bold metrics overlay: '+11.5pp', '102% YoY', '\$2M' in white with glow effects. Text: 'By the Numbers' in purple. Modern, data-focused, ROI-driven aesthetic. Tech-forward, professional, B2B. 1500x600px horizontal banner. Bold typography, metric-focused. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 \
    "${OUTPUT_DIR}/covers/cover-case-studies-results.png" \
    "cover-case-studies-results.png"

# Cover 4: Process - How We Work
generate_image \
    "Professional process timeline banner. Dark background (#1A1A2E) with 5-step horizontal timeline visualization. Each step connected by gradient line (purple to blue). Clean icons above each step. Text: 'Transformation Methodology' in white. Minimalist, structured, organized. Tech-forward consulting aesthetic. 1500x600px. Vector style, clean lines. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 \
    "${OUTPUT_DIR}/covers/cover-process-how-we-work.png" \
    "cover-process-how-we-work.png"

# Cover 5: Contact - Let's Talk
generate_image \
    "Bold call-to-action banner. Background: vibrant purple to electric blue gradient (#7B2CBF to #0066FF). Large white bold text: 'Book Free Consultation'. Minimalist, high-energy, engaging. Modern B2B consulting aesthetic. 1500x600px horizontal banner. Clean typography, strong CTA design. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 \
    "${OUTPUT_DIR}/covers/cover-contact-lets-talk.png" \
    "cover-contact-lets-talk.png"

# Cover 6: Team/About - Meet Rafał
generate_image \
    "Professional personal branding banner. Dark grey background (#2D3142) with space for photo integration on left third. Right side: text '8+ Years Transforming CRM' in white and purple gradient. Minimalist, credibility-building, personal yet professional. Tech-forward consulting aesthetic. 1500x600px. Clean layout, space for photo. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 \
    "${OUTPUT_DIR}/covers/cover-team-meet-rafal.png" \
    "cover-team-meet-rafal.png"

# Cover 7: Generic Branded
generate_image \
    "Versatile branded banner template. Dark background (#1A1A2E) with subtle geometric pattern or dots. Small 'OLEKSIAK' logo in top-left corner in white. Minimalist, clean, reusable. Professional B2B consulting aesthetic. 1500x600px horizontal banner. Subtle pattern, branded. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 \
    "${OUTPUT_DIR}/covers/cover-generic-branded.png" \
    "cover-generic-branded.png"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 SECTION 3/6: SERVICE ICONS (6 assets)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Icon 1: CRM Strategy
generate_image \
    "Minimalist line icon of ascending chart or growth graph. Purple gradient (#7B2CBF to #9D4EDD). Clean, geometric lines. Tech-forward consulting aesthetic. 280x280px transparent PNG. Modern, professional, B2B style. Vector line icon, simple and clear. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 \
    "${OUTPUT_DIR}/icons/service-icons/icon-crm-strategy.png" \
    "icon-crm-strategy.png"

# Icon 2: Email Marketing
generate_image \
    "Minimalist line icon of email envelope or mail. Blue gradient (#0066FF to #00BFFF). Clean, modern lines. Tech-forward aesthetic. 280x280px transparent PNG. Professional, B2B style. Vector line icon. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 \
    "${OUTPUT_DIR}/icons/service-icons/icon-email-marketing.png" \
    "icon-email-marketing.png"

# Icon 3: Marketing Automation
generate_image \
    "Minimalist line icon of two interlocking gears or cog wheels. Green gradient (#10B981 to #34D399). Clean, mechanical, modern lines. Tech-forward aesthetic. 280x280px transparent PNG. Professional, B2B. Vector line icon. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 \
    "${OUTPUT_DIR}/icons/service-icons/icon-marketing-automation.png" \
    "icon-marketing-automation.png"

# Icon 4: Customer Retention
generate_image \
    "Minimalist line icon of two or three people figures or community. Orange gradient (#FF6B6B to #FFA07A). Friendly, clean lines. Tech-forward aesthetic. 280x280px transparent PNG. Professional, B2B. Vector line icon. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 \
    "${OUTPUT_DIR}/icons/service-icons/icon-customer-retention.png" \
    "icon-customer-retention.png"

# Icon 5: Analytics
generate_image \
    "Minimalist line icon of bar chart or dashboard with data. Red/pink gradient (#E91E63 to #F06292). Clean, data-focused lines. Tech-forward aesthetic. 280x280px transparent PNG. Professional, B2B. Vector line icon. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 \
    "${OUTPUT_DIR}/icons/service-icons/icon-analytics.png" \
    "icon-analytics.png"

# Icon 6: Team Training
generate_image \
    "Minimalist line icon of graduation cap or mortarboard. Purple gradient (#7B2CBF to #9D4EDD). Clean, educational lines. Tech-forward aesthetic. 280x280px transparent PNG. Professional, B2B. Vector line icon. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 \
    "${OUTPUT_DIR}/icons/service-icons/icon-team-training.png" \
    "icon-team-training.png"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗂️  SECTION 4/6: DATABASE ICONS (8 assets)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Database Icons
generate_image "Minimalist purple folder icon. Line style, gradient (#7B2CBF to #9D4EDD). 280x280px transparent PNG. Clean, professional. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 "${OUTPUT_DIR}/icons/database-icons/db-icon-projects.png" "db-icon-projects.png"

generate_image "Minimalist blue handshake icon. Line style, gradient (#0066FF to #00BFFF). 280x280px transparent PNG. Clean, professional. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 "${OUTPUT_DIR}/icons/database-icons/db-icon-clients.png" "db-icon-clients.png"

generate_image "Minimalist green checkmark icon. Line style, gradient (#10B981 to #34D399). 280x280px transparent PNG. Clean, professional. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 "${OUTPUT_DIR}/icons/database-icons/db-icon-tasks.png" "db-icon-tasks.png"

generate_image "Minimalist orange calendar icon. Line style, gradient (#FF6B6B to #FFA07A). 280x280px transparent PNG. Clean, professional. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 "${OUTPUT_DIR}/icons/database-icons/db-icon-meetings.png" "db-icon-meetings.png"

generate_image "Minimalist pink books icon. Line style, gradient (#E91E63 to #F06292). 280x280px transparent PNG. Clean, professional. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 "${OUTPUT_DIR}/icons/database-icons/db-icon-resources.png" "db-icon-resources.png"

generate_image "Minimalist red chart icon. Line style, gradient (#DC2626 to #EF4444). 280x280px transparent PNG. Clean, professional. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 "${OUTPUT_DIR}/icons/database-icons/db-icon-analytics.png" "db-icon-analytics.png"

generate_image "Minimalist teal people icon. Line style, gradient (#20C997 to #5FD4AE). 280x280px transparent PNG. Clean, professional. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 "${OUTPUT_DIR}/icons/database-icons/db-icon-team.png" "db-icon-team.png"

generate_image "Minimalist grey note icon. Line style, gradient (#6B7280 to #9CA3AF). 280x280px transparent PNG. Clean, professional. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    280 280 "${OUTPUT_DIR}/icons/database-icons/db-icon-notes.png" "db-icon-notes.png"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎭 SECTION 5/6: CUSTOM EMOJIS (15 assets)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Status Emojis (5)
generate_image "Minimalist green checkmark icon (#10B981) with subtle glow. Bold lines. 128x128px transparent PNG. Modern, professional. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/status/emoji-done-oleksiak.png" "emoji-done-oleksiak.png"

generate_image "Minimalist purple gear icon (#7B2CBF) with rotation implication. Bold lines. 128x128px transparent PNG. Tech-forward. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/status/emoji-inprogress-oleksiak.png" "emoji-inprogress-oleksiak.png"

generate_image "Minimalist white/light grey clipboard icon. Simple lines. 128x128px transparent PNG. Professional. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/status/emoji-todo-oleksiak.png" "emoji-todo-oleksiak.png"

generate_image "Minimalist grey pause icon (two vertical bars). Simple. 128x128px transparent PNG. Professional. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/status/emoji-onhold-oleksiak.png" "emoji-onhold-oleksiak.png"

generate_image "Minimalist purple flame icon (#7B2CBF) with glow. Bold. 128x128px transparent PNG. Attention-grabbing. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/status/emoji-highpriority-oleksiak.png" "emoji-highpriority-oleksiak.png"

# Category Emojis (5)
generate_image "Minimalist purple briefcase icon (#7B2CBF). Clean line style. 128x128px transparent PNG. Professional. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/category/emoji-business-oleksiak.png" "emoji-business-oleksiak.png"

generate_image "Minimalist blue laptop icon (#0066FF). Clean, tech-forward. 128x128px transparent PNG. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/category/emoji-tech-oleksiak.png" "emoji-tech-oleksiak.png"

generate_image "Minimalist chart with gradient (purple to blue). Clean lines. 128x128px transparent PNG. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/category/emoji-analytics-oleksiak.png" "emoji-analytics-oleksiak.png"

generate_image "Minimalist purple palette icon. Clean, creative. 128x128px transparent PNG. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/category/emoji-design-oleksiak.png" "emoji-design-oleksiak.png"

generate_image "Minimalist blue envelope icon. Clean, modern. 128x128px transparent PNG. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/category/emoji-marketing-oleksiak.png" "emoji-marketing-oleksiak.png"

# Action Emojis (5)
generate_image "Minimalist purple rocket icon (#7B2CBF) angled upward. Dynamic. 128x128px transparent PNG. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/action/emoji-launch-oleksiak.png" "emoji-launch-oleksiak.png"

generate_image "Minimalist light bulb icon, yellow (#FFC107) with purple outline. Creative. 128x128px transparent PNG. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/action/emoji-idea-oleksiak.png" "emoji-idea-oleksiak.png"

generate_image "Minimalist electric blue lightning bolt (#0066FF). Bold, energetic. 128x128px transparent PNG. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/action/emoji-quickwin-oleksiak.png" "emoji-quickwin-oleksiak.png"

generate_image "Minimalist purple target icon. Clean, focused. 128x128px transparent PNG. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/action/emoji-goal-oleksiak.png" "emoji-goal-oleksiak.png"

generate_image "Minimalist ascending chart with green/purple gradient. Clean, positive. 128x128px transparent PNG. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    128 128 "${OUTPUT_DIR}/emojis/action/emoji-growth-oleksiak.png" "emoji-growth-oleksiak.png"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎴 SECTION 6/6: DATABASE CARDS (8 assets)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Database Cards
generate_image "Database gallery card. Gradient: #1A1A2E to #7B2CBF. Left: purple folder. Right: 'Projects'. Logo top-left. 1500x600px. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 "${OUTPUT_DIR}/database-cards/database-card-projects.png" "database-card-projects.png"

generate_image "Database gallery card. Gradient: #1A1A2E to #0066FF. Left: blue handshake. Right: 'Clients'. Logo top-left. 1500x600px. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 "${OUTPUT_DIR}/database-cards/database-card-clients.png" "database-card-clients.png"

generate_image "Database gallery card. Gradient: #1A1A2E to #10B981. Left: green checkmark. Right: 'Tasks'. Logo top-left. 1500x600px. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 "${OUTPUT_DIR}/database-cards/database-card-tasks.png" "database-card-tasks.png"

generate_image "Database gallery card. Gradient: #1A1A2E to #FF6B6B. Left: orange calendar. Right: 'Meetings'. Logo top-left. 1500x600px. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 "${OUTPUT_DIR}/database-cards/database-card-meetings.png" "database-card-meetings.png"

generate_image "Database gallery card. Gradient: #1A1A2E to #E91E63. Left: pink books. Right: 'Resources'. Logo top-left. 1500x600px. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 "${OUTPUT_DIR}/database-cards/database-card-resources.png" "database-card-resources.png"

generate_image "Database gallery card. Gradient: #1A1A2E to #DC2626. Left: red chart. Right: 'Analytics'. Logo top-left. 1500x600px. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 "${OUTPUT_DIR}/database-cards/database-card-analytics.png" "database-card-analytics.png"

generate_image "Database gallery card. Gradient: #1A1A2E to #20C997. Left: teal people. Right: 'Team'. Logo top-left. 1500x600px. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 "${OUTPUT_DIR}/database-cards/database-card-team.png" "database-card-team.png"

generate_image "Database gallery card. Gradient: #1A1A2E to #6B7280. Left: grey note. Right: 'Notes'. Logo top-left. 1500x600px. Professional quality, high resolution, 4K, ultra-detailed, masterpiece." \
    1500 600 "${OUTPUT_DIR}/database-cards/database-card-notes.png" "database-card-notes.png"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 GENERATION COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo "   Total assets generated: ${count}/${total}"
echo "   Output directory: ${OUTPUT_DIR}"
echo ""
echo "📁 Generated files:"
echo "   • Logos: 4 files"
echo "   • Covers: 7 files"
echo "   • Service Icons: 6 files"
echo "   • Database Icons: 8 files"
echo "   • Custom Emojis: 15 files"
echo "   • Database Cards: 8 files"
echo ""
echo "✅ Next steps:"
echo "   1. Review generated assets"
echo "   2. Upload to Notion workspace"
echo "   3. Apply branding to pages"
echo ""
echo "📖 For upload instructions, see:"
echo "   ${OUTPUT_DIR}/NOTION-QUICK-REFERENCE.md"
echo ""
