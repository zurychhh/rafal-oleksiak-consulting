/**
 * Shared PDF Styles
 * Common typography and component styles used across all PDF components
 */

import { StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY, CODE_FONT_FAMILY } from './font-constants';

// Brand colors from design system
export const COLORS = {
  moonlitGrey: '#1A1A2E',
  vividPurple: '#7B2CBF',
  electricBlue: '#00BFFF',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  darkGrey: '#2A2A3E',
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
  orange: '#F97316',
  neonGreen: '#00FF00',
  hotPink: '#FF006E',
};

/**
 * Typography scale with Noto Sans
 * Use these instead of inline fontSize/fontWeight definitions
 */
export const typography = StyleSheet.create({
  // Headings
  h1: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 1,
  },
  h2: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  h3: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  h4: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.white,
  },
  h5: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.white,
  },
  h6: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.white,
  },

  // Body text
  body: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    lineHeight: 1.6,
    color: COLORS.lightGrey,
  },
  bodySmall: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    lineHeight: 1.6,
    color: COLORS.lightGrey,
  },
  bodyLarge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 13,
    lineHeight: 1.6,
    color: COLORS.lightGrey,
  },

  // Labels
  label: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.lightGrey,
  },
  labelSmall: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: COLORS.lightGrey,
  },

  // Code
  code: {
    fontFamily: CODE_FONT_FAMILY,
    fontSize: 9,
    lineHeight: 1.4,
    color: '#d4d4d4',
  },
  codeSmall: {
    fontFamily: CODE_FONT_FAMILY,
    fontSize: 8,
    lineHeight: 1.4,
    color: '#d4d4d4',
  },
});

/**
 * Common component styles
 * Reusable styles for badges, cards, etc.
 */
export const components = StyleSheet.create({
  // Page footer (consistent across all pages)
  pageFooter: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGrey,
  },
  pageFooterText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
  },

  // Section divider
  sectionDivider: {
    height: 2,
    backgroundColor: COLORS.darkGrey,
    marginVertical: 20,
  },
  sectionDividerGradient: {
    height: 2,
    marginVertical: 20,
    // Note: @react-pdf doesn't support gradients, use solid color
    backgroundColor: COLORS.vividPurple,
  },

  // Card container
  card: {
    backgroundColor: COLORS.darkGrey,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardWithBorder: {
    backgroundColor: COLORS.darkGrey,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.vividPurple,
  },

  // Badge styles
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeHigh: {
    backgroundColor: COLORS.red,
    color: COLORS.white,
  },
  badgeMedium: {
    backgroundColor: COLORS.yellow,
    color: '#1A1A2E',
  },
  badgeLow: {
    backgroundColor: COLORS.green,
    color: COLORS.white,
  },

  // Code block
  codeBlock: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
  },
  codeBlockText: {
    fontFamily: CODE_FONT_FAMILY,
    fontSize: 8,
    color: '#d4d4d4',
    lineHeight: 1.4,
  },

  // Table styles
  table: {
    marginVertical: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2D2D4A',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkGrey,
  },
  tableCell: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    flex: 1,
  },

  // Checkbox list item
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  checkbox: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    lineHeight: 1,
    marginRight: 8,
    color: COLORS.lightGrey,
  },
  checkboxText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    lineHeight: 1.5,
    color: COLORS.lightGrey,
    flex: 1,
  },
});

/**
 * Page layout constants
 */
export const PAGE_LAYOUT = {
  padding: 40,
  paddingLarge: 50,
  paddingSmall: 30,
  contentWidth: 515, // A4 width (595pt) - 2*40pt padding
  contentHeight: 762, // A4 height (842pt) - 2*40pt padding
};
