/**
 * PDF Font Constants
 * Font family names and icons used in PDF components
 *
 * IMPORTANT: This file only exports string constants.
 * Actual font registration happens in fonts.ts (imported once in pdf-generator-core.tsx)
 */

// Using built-in Helvetica font (always available in @react-pdf)
export const DEFAULT_FONT_FAMILY = 'Helvetica';
export const CODE_FONT_FAMILY = 'Courier';

/**
 * Icon replacements - Unicode symbols that work without emoji fonts
 * Use these instead of emojis (💰, 📊, etc.) which don't render in PDFs
 */
export const ICONS = {
  // Financial
  money: '€',           // Euro symbol (replaces 💰)
  dollar: '$',          // Dollar symbol
  growth: '↗',          // Up-right arrow (replaces 📈)
  decline: '↘',         // Down-right arrow (decline)

  // Status indicators
  checkmark: '✓',       // Check mark (replaces ✅)
  cross: '✗',           // Cross mark (replaces ❌)
  warning: '⚠',         // Warning triangle (already Unicode ⚠)
  info: 'ℹ',            // Info symbol
  lightbulb: '○',       // Light bulb idea (replaces 💡)

  // Business & Productivity
  target: '◉',          // Target/goal (replaces 🎯)
  computer: '▥',        // Computer/laptop (replaces 💻)
  email: '✉',           // Email envelope (replaces 📧)
  clock: '⏱',           // Clock/timer (already Unicode ⏱)
  rocket: '▲',          // Rocket/launch (replaces 🚀)
  refresh: '↻',         // Refresh/cycle (replaces 🔄)

  // Directional
  arrow_right: '→',     // Right arrow
  arrow_left: '←',      // Left arrow
  arrow_up: '↑',        // Up arrow
  arrow_down: '↓',      // Down arrow

  // Misc
  bullet: '•',          // Bullet point
  star: '★',            // Star (rating)
  circle: '○',          // Circle (empty)
  circle_filled: '●',   // Circle (filled)
  square: '☐',          // Checkbox (empty)
  square_checked: '☑',  // Checkbox (checked)

  // Data visualization
  chart_bar: '▉',       // Bar chart (replaces 📊)
  chart_line: '⌇',      // Line chart representation

  // Priority badges (use text instead of colored icons)
  priority_high: 'HIGH',
  priority_medium: 'MED',
  priority_low: 'LOW',
} as const;
