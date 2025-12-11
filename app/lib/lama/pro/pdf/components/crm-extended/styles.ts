/**
 * Shared styles for CRM Extended Section
 */

import { StyleSheet } from '@react-pdf/renderer';

export const COLORS = {
  moonlitGrey: '#1A1A2E',
  vividPurple: '#7B2CBF',
  electricBlue: '#00BFFF',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  darkGrey: '#2A2A3E',
  neonGreen: '#00FF00',
  orange: '#FF8C00',
  red: '#EF4444',
  yellow: '#F59E0B',
  pink: '#FF006E',
};

export const crmStyles = StyleSheet.create({
  // Page
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 40,
  },

  // Header
  pageHeader: {
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.red,
    marginRight: 10,
  },
  scoreBadge: {
    backgroundColor: COLORS.darkGrey,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.red,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  pageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
  },
  pageNumber: {
    fontSize: 7,
    color: COLORS.lightGrey,
    marginTop: 4,
  },

  // Sections
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  subsectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },

  // Boxes
  problemBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.red,
    marginBottom: 10,
  },
  calculationBox: {
    backgroundColor: '#1E1E2E',
    padding: 10,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.electricBlue,
    marginBottom: 10,
  },
  solutionBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.neonGreen,
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.orange,
    marginBottom: 10,
  },
  warningBox: {
    backgroundColor: '#2D2416',
    padding: 10,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.yellow,
    marginBottom: 10,
  },

  // Typography
  bodyText: {
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  bodyTextSmall: {
    fontSize: 7,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
    marginBottom: 3,
  },
  boldText: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  highlightText: {
    color: COLORS.electricBlue,
    fontWeight: 'bold',
  },
  successText: {
    color: COLORS.neonGreen,
    fontWeight: 'bold',
  },
  warningText: {
    color: COLORS.yellow,
    fontWeight: 'bold',
  },
  errorText: {
    color: COLORS.red,
    fontWeight: 'bold',
  },

  // Lists
  bulletList: {
    marginLeft: 6,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletDot: {
    fontSize: 8,
    color: COLORS.electricBlue,
    marginRight: 5,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
    flex: 1,
  },
  numberedItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  numberedNumber: {
    fontSize: 8,
    color: COLORS.electricBlue,
    marginRight: 5,
    fontWeight: 'bold',
    minWidth: 15,
  },

  // Calculation steps
  calcStep: {
    fontSize: 7,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
    marginBottom: 2,
  },
  calcValue: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  calcSource: {
    fontSize: 6,
    color: '#9CA3AF',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#3D3D5A',
  },

  // Badges
  roiBadge: {
    backgroundColor: COLORS.neonGreen,
    color: COLORS.moonlitGrey,
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 7,
    fontWeight: 'bold',
  },
  criticalBadge: {
    backgroundColor: COLORS.red,
    color: COLORS.white,
  },
  highBadge: {
    backgroundColor: COLORS.orange,
    color: COLORS.white,
  },
  mediumBadge: {
    backgroundColor: COLORS.yellow,
    color: COLORS.moonlitGrey,
  },
  lowBadge: {
    backgroundColor: COLORS.darkGrey,
    color: COLORS.lightGrey,
  },

  // Timeline (for roadmap)
  timelineWeek: {
    marginBottom: 10,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.darkGrey,
    padding: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  weekTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  weekImpact: {
    fontSize: 8,
    color: COLORS.neonGreen,
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    paddingLeft: 10,
    marginBottom: 3,
  },
  taskCheckbox: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderColor: COLORS.electricBlue,
    borderRadius: 1,
    marginRight: 5,
    marginTop: 2,
  },
  taskText: {
    fontSize: 7,
    color: COLORS.lightGrey,
    flex: 1,
  },
  taskTime: {
    fontSize: 6,
    color: COLORS.orange,
    marginLeft: 3,
  },

  // Code/templates
  codeBlock: {
    backgroundColor: '#0D0D1A',
    padding: 8,
    borderRadius: 3,
    marginBottom: 8,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.vividPurple,
  },
  codeText: {
    fontSize: 6,
    fontFamily: 'Courier',
    color: COLORS.neonGreen,
    lineHeight: 1.4,
  },

  // Email templates
  emailTemplate: {
    backgroundColor: '#1A1A2E',
    padding: 8,
    borderRadius: 3,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.darkGrey,
  },
  emailDay: {
    fontSize: 7,
    color: COLORS.orange,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  emailSubject: {
    fontSize: 8,
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  emailPreview: {
    fontSize: 7,
    color: COLORS.lightGrey,
    marginBottom: 2,
  },
  emailGoal: {
    fontSize: 6,
    color: COLORS.electricBlue,
  },

  // Workflow steps
  workflowStep: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 8,
  },
  workflowNumber: {
    fontSize: 7,
    color: COLORS.electricBlue,
    fontWeight: 'bold',
    marginRight: 5,
    minWidth: 12,
  },
  workflowText: {
    fontSize: 7,
    color: COLORS.lightGrey,
    flex: 1,
    lineHeight: 1.5,
  },
  workflowTiming: {
    fontSize: 6,
    color: COLORS.orange,
  },

  // Metrics/stats
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  metricLabel: {
    fontSize: 7,
    color: COLORS.lightGrey,
  },
  metricValue: {
    fontSize: 7,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  metricTarget: {
    fontSize: 7,
    color: COLORS.neonGreen,
  },

  // Footer
  pageFooter: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGrey,
  },
  footerText: {
    fontSize: 7,
    color: COLORS.lightGrey,
  },

  // Dividers
  divider: {
    height: 1,
    backgroundColor: COLORS.darkGrey,
    marginVertical: 8,
  },
  thickDivider: {
    height: 2,
    backgroundColor: COLORS.electricBlue,
    marginVertical: 10,
  },

  // Flex helpers
  row: {
    flexDirection: 'row',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },

  // Spacing helpers
  mt4: { marginTop: 4 },
  mt6: { marginTop: 6 },
  mt8: { marginTop: 8 },
  mt10: { marginTop: 10 },
  mb4: { marginBottom: 4 },
  mb6: { marginBottom: 6 },
  mb8: { marginBottom: 8 },
  mb10: { marginBottom: 10 },
  ml4: { marginLeft: 4 },
  ml6: { marginLeft: 6 },
  ml8: { marginLeft: 8 },
  pl8: { paddingLeft: 8 },
  pl10: { paddingLeft: 10 },
});
