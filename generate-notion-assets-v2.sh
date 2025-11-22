#!/bin/bash

# Notion Branding Assets Generator V2
# Uses Stability AI SD3 API with correct parameters
# Generated: 2025-11-14

set -e

API_KEY="sk-1VvmmPXVywYuk2V9rwSwwUUlCYpPjppOBKDBUfCI5Vh32oAQ"
OUTPUT_DIR="/Users/user/projects/rafal-oleksiak-consulting/notion-branding-assets"
API_URL="https://api.stability.ai/v2beta/stable-image/generate/sd3"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo "🎨 Notion Branding Assets Generator V2"
echo "📊 Total: 48 assets"
echo ""

count=0
total=48
failures=0

# Generate image function with error handling
generate_image() {
    local prompt="$1"
    local aspect="$2"
    local output_path="$3"
    local name="$4"

    count=$((count + 1))

    echo -e "${BLUE}[${count}/${total}]${NC} ${name}"

    # Make API request
    http_code=$(curl -w "%{http_code}" -s -X POST "${API_URL}" \
        -H "authorization: Bearer ${API_KEY}" \
        -H "accept: image/*" \
        -F "prompt=${prompt}" \
        -F "output_format=png" \
        -F "aspect_ratio=${aspect}" \
        -o "${output_path}")

    if [ "$http_code" = "200" ]; then
        size=$(du -h "${output_path}" | cut -f1)
        echo -e "   ${GREEN}✅ ${size}${NC}"
    else
        echo -e "   ${RED}❌ HTTP ${http_code}${NC}"
        failures=$((failures + 1))
    fi

    sleep 1.5  # Rate limiting
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏷️  LOGOS (4)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

generate_image \
    "Minimalist consulting logo, text 'OLEKSIAK CONSULT' in bold white Poppins font, 3 purple gradient dots (#7B2CBF to #9D4EDD), dark grey background #2D3142, modern tech-forward professional, subtle glow, clean B2B design, vector flat style, high contrast" \
    "1:1" \
    "${OUTPUT_DIR}/logos/oleksiak-logo-full.png" \
    "Logo Full"

generate_image \
    "Minimalist logo 'OLEKSIAK' white Poppins font, 3 purple gradient dots (#7B2CBF-#9D4EDD), dark background #2D3142, tech-forward, glowing dots, clean professional B2B, vector flat minimalist" \
    "1:1" \
    "${OUTPUT_DIR}/logos/oleksiak-logo-compact.png" \
    "Logo Compact"

generate_image \
    "Minimalist monogram 'OC' bold white font, single purple dot (#7B2CBF), dark grey #2D3142, tech-forward B2B consulting, geometric high contrast, vector style" \
    "1:1" \
    "${OUTPUT_DIR}/logos/oleksiak-monogram.png" \
    "Monogram"

generate_image \
    "Three circular purple gradient dots (#7B2CBF to #9D4EDD), horizontal line, subtle glow, dark background #2D3142, minimalist tech icon, vector geometric" \
    "1:1" \
    "${OUTPUT_DIR}/logos/oleksiak-dots.png" \
    "Dots Icon"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🖼️  COVERS (7)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

generate_image \
    "Dark consulting banner, navy/grey gradient #1A1A2E-#2D3142, white text 'I double revenue from owned channels', purple dots #7B2CBF floating, tech-forward B2B, minimalist dramatic, horizontal banner" \
    "5:2" \
    "${OUTPUT_DIR}/covers/cover-hero-transform-revenue.png" \
    "Cover Hero"

generate_image \
    "Consulting services banner, dark grey #2D3142, 6 line icons grid: chart, envelope, gears, people, analytics, graduation cap, gradient colors purple blue green orange red, white text 'Revenue-Driving Services', minimalist organized tech-forward, vector icons" \
    "5:2" \
    "${OUTPUT_DIR}/covers/cover-services-what-i-deliver.png" \
    "Cover Services"

generate_image \
    "Results banner, grey to purple gradient #1A1A2E-#7B2CBF, bold metrics '+11.5pp' '102% YoY' '\$2M' white glowing, 'By the Numbers' purple text, data-focused ROI-driven, bold typography" \
    "5:2" \
    "${OUTPUT_DIR}/covers/cover-case-studies-results.png" \
    "Cover Results"

generate_image \
    "Process timeline banner, dark #1A1A2E, 5-step horizontal timeline, purple-blue gradient line, clean icons, 'Transformation Methodology' white, minimalist structured, vector clean lines" \
    "5:2" \
    "${OUTPUT_DIR}/covers/cover-process-how-we-work.png" \
    "Cover Process"

generate_image \
    "Bold CTA banner, purple to blue gradient #7B2CBF-#0066FF, large white text 'Book Free Consultation', minimalist high-energy B2B, clean typography strong CTA" \
    "5:2" \
    "${OUTPUT_DIR}/covers/cover-contact-lets-talk.png" \
    "Cover Contact"

generate_image \
    "Personal branding banner, dark grey #2D3142, photo space left third, '8+ Years Transforming CRM' white purple gradient right, minimalist credibility tech-forward, clean layout" \
    "5:2" \
    "${OUTPUT_DIR}/covers/cover-team-meet-rafal.png" \
    "Cover Team"

generate_image \
    "Branded banner template, dark #1A1A2E, subtle geometric dots pattern, 'OLEKSIAK' logo top-left white, minimalist clean reusable B2B, subtle branded" \
    "5:2" \
    "${OUTPUT_DIR}/covers/cover-generic-branded.png" \
    "Cover Generic"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 SERVICE ICONS (6)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

generate_image "Minimalist line icon ascending chart, purple gradient #7B2CBF-#9D4EDD, clean geometric, tech-forward, transparent, vector" "1:1" \
    "${OUTPUT_DIR}/icons/service-icons/icon-crm-strategy.png" "CRM Strategy"

generate_image "Minimalist line icon email envelope, blue gradient #0066FF-#00BFFF, clean modern, tech-forward, transparent, vector" "1:1" \
    "${OUTPUT_DIR}/icons/service-icons/icon-email-marketing.png" "Email Marketing"

generate_image "Minimalist line icon interlocking gears, green gradient #10B981-#34D399, mechanical modern, tech-forward, transparent, vector" "1:1" \
    "${OUTPUT_DIR}/icons/service-icons/icon-marketing-automation.png" "Marketing Automation"

generate_image "Minimalist line icon people figures, orange gradient #FF6B6B-#FFA07A, friendly clean, tech-forward, transparent, vector" "1:1" \
    "${OUTPUT_DIR}/icons/service-icons/icon-customer-retention.png" "Customer Retention"

generate_image "Minimalist line icon bar chart dashboard, pink gradient #E91E63-#F06292, data-focused, tech-forward, transparent, vector" "1:1" \
    "${OUTPUT_DIR}/icons/service-icons/icon-analytics.png" "Analytics"

generate_image "Minimalist line icon graduation cap, purple gradient #7B2CBF-#9D4EDD, educational clean, tech-forward, transparent, vector" "1:1" \
    "${OUTPUT_DIR}/icons/service-icons/icon-team-training.png" "Team Training"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗂️  DATABASE ICONS (8)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

generate_image "Purple folder icon, line style gradient #7B2CBF-#9D4EDD, transparent, clean professional" "1:1" \
    "${OUTPUT_DIR}/icons/database-icons/db-icon-projects.png" "DB Projects"

generate_image "Blue handshake icon, line style gradient #0066FF-#00BFFF, transparent, clean professional" "1:1" \
    "${OUTPUT_DIR}/icons/database-icons/db-icon-clients.png" "DB Clients"

generate_image "Green checkmark icon, line style gradient #10B981-#34D399, transparent, clean professional" "1:1" \
    "${OUTPUT_DIR}/icons/database-icons/db-icon-tasks.png" "DB Tasks"

generate_image "Orange calendar icon, line style gradient #FF6B6B-#FFA07A, transparent, clean professional" "1:1" \
    "${OUTPUT_DIR}/icons/database-icons/db-icon-meetings.png" "DB Meetings"

generate_image "Pink books icon, line style gradient #E91E63-#F06292, transparent, clean professional" "1:1" \
    "${OUTPUT_DIR}/icons/database-icons/db-icon-resources.png" "DB Resources"

generate_image "Red chart icon, line style gradient #DC2626-#EF4444, transparent, clean professional" "1:1" \
    "${OUTPUT_DIR}/icons/database-icons/db-icon-analytics.png" "DB Analytics"

generate_image "Teal people icon, line style gradient #20C997-#5FD4AE, transparent, clean professional" "1:1" \
    "${OUTPUT_DIR}/icons/database-icons/db-icon-team.png" "DB Team"

generate_image "Grey note icon, line style gradient #6B7280-#9CA3AF, transparent, clean professional" "1:1" \
    "${OUTPUT_DIR}/icons/database-icons/db-icon-notes.png" "DB Notes"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎭 EMOJIS (15)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Status
generate_image "Green checkmark #10B981, bold, glow, transparent, modern" "1:1" "${OUTPUT_DIR}/emojis/status/emoji-done-oleksiak.png" "Emoji Done"
generate_image "Purple gear #7B2CBF, rotation, bold, transparent, tech" "1:1" "${OUTPUT_DIR}/emojis/status/emoji-inprogress-oleksiak.png" "Emoji Progress"
generate_image "Light grey clipboard, simple, transparent, professional" "1:1" "${OUTPUT_DIR}/emojis/status/emoji-todo-oleksiak.png" "Emoji Todo"
generate_image "Grey pause icon, two bars, simple, transparent" "1:1" "${OUTPUT_DIR}/emojis/status/emoji-onhold-oleksiak.png" "Emoji Hold"
generate_image "Purple flame #7B2CBF, glow, bold, transparent" "1:1" "${OUTPUT_DIR}/emojis/status/emoji-highpriority-oleksiak.png" "Emoji Priority"

# Category
generate_image "Purple briefcase #7B2CBF, line style, transparent" "1:1" "${OUTPUT_DIR}/emojis/category/emoji-business-oleksiak.png" "Emoji Business"
generate_image "Blue laptop #0066FF, clean tech, transparent" "1:1" "${OUTPUT_DIR}/emojis/category/emoji-tech-oleksiak.png" "Emoji Tech"
generate_image "Chart purple-blue gradient, clean, transparent" "1:1" "${OUTPUT_DIR}/emojis/category/emoji-analytics-oleksiak.png" "Emoji Analytics"
generate_image "Purple palette, creative, transparent" "1:1" "${OUTPUT_DIR}/emojis/category/emoji-design-oleksiak.png" "Emoji Design"
generate_image "Blue envelope, modern, transparent" "1:1" "${OUTPUT_DIR}/emojis/category/emoji-marketing-oleksiak.png" "Emoji Marketing"

# Action
generate_image "Purple rocket #7B2CBF, angled up, dynamic, transparent" "1:1" "${OUTPUT_DIR}/emojis/action/emoji-launch-oleksiak.png" "Emoji Launch"
generate_image "Yellow bulb #FFC107, purple outline, creative, transparent" "1:1" "${OUTPUT_DIR}/emojis/action/emoji-idea-oleksiak.png" "Emoji Idea"
generate_image "Blue lightning #0066FF, bold energetic, transparent" "1:1" "${OUTPUT_DIR}/emojis/action/emoji-quickwin-oleksiak.png" "Emoji Quick Win"
generate_image "Purple target, focused, transparent" "1:1" "${OUTPUT_DIR}/emojis/action/emoji-goal-oleksiak.png" "Emoji Goal"
generate_image "Ascending chart green-purple gradient, positive, transparent" "1:1" "${OUTPUT_DIR}/emojis/action/emoji-growth-oleksiak.png" "Emoji Growth"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎴 DATABASE CARDS (8)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

generate_image "Card gradient #1A1A2E to #7B2CBF, purple folder left, 'Projects' white text right, small OLEKSIAK logo top-left" "5:2" \
    "${OUTPUT_DIR}/database-cards/database-card-projects.png" "Card Projects"

generate_image "Card gradient #1A1A2E to #0066FF, blue handshake left, 'Clients' white text right, small OLEKSIAK logo top-left" "5:2" \
    "${OUTPUT_DIR}/database-cards/database-card-clients.png" "Card Clients"

generate_image "Card gradient #1A1A2E to #10B981, green checkmark left, 'Tasks' white text right, small OLEKSIAK logo top-left" "5:2" \
    "${OUTPUT_DIR}/database-cards/database-card-tasks.png" "Card Tasks"

generate_image "Card gradient #1A1A2E to #FF6B6B, orange calendar left, 'Meetings' white text right, small OLEKSIAK logo top-left" "5:2" \
    "${OUTPUT_DIR}/database-cards/database-card-meetings.png" "Card Meetings"

generate_image "Card gradient #1A1A2E to #E91E63, pink books left, 'Resources' white text right, small OLEKSIAK logo top-left" "5:2" \
    "${OUTPUT_DIR}/database-cards/database-card-resources.png" "Card Resources"

generate_image "Card gradient #1A1A2E to #DC2626, red chart left, 'Analytics' white text right, small OLEKSIAK logo top-left" "5:2" \
    "${OUTPUT_DIR}/database-cards/database-card-analytics.png" "Card Analytics"

generate_image "Card gradient #1A1A2E to #20C997, teal people left, 'Team' white text right, small OLEKSIAK logo top-left" "5:2" \
    "${OUTPUT_DIR}/database-cards/database-card-team.png" "Card Team"

generate_image "Card gradient #1A1A2E to #6B7280, grey note left, 'Notes' white text right, small OLEKSIAK logo top-left" "5:2" \
    "${OUTPUT_DIR}/database-cards/database-card-notes.png" "Card Notes"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Generated: ${count}/${total}"
echo "❌ Failures: ${failures}"
echo "📁 Location: ${OUTPUT_DIR}"
echo ""
