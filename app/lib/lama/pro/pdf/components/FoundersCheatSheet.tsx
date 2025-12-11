import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../font-constants';

const COLORS = {
  moonlitGrey: '#1A1A2E',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  darkGrey: '#2A2A3E',
  neonGreen: '#00FF00',
  hotPink: '#FF006E',
  orange: '#FF8C00',
  electricBlue: '#00BFFF',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 40,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.neonGreen,
  },
  title: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    marginBottom: 6,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  scoreItem: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
  },
  scoreBold: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
    fontSize: 11,
  },
  // Action grid
  gridContainer: {
    marginTop: 16,
  },
  gridSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    paddingLeft: 4,
  },
  weekBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  actionBox: {
    flex: 1,
    backgroundColor: COLORS.darkGrey,
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 3,
    minHeight: 80,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderRadius: 3,
    marginRight: 6,
  },
  actionNumber: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  actionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  actionMeta: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    marginBottom: 2,
  },
  actionRoi: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 4,
  },
  actionPage: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.electricBlue,
    marginTop: 4,
    textAlign: 'center',
  },
  // Legend
  legendBox: {
    backgroundColor: '#2D2D4A',
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
  },
  legendTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
  },
  // Footer
  footer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGrey,
  },
  footerText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    textAlign: 'center',
    lineHeight: 1.6,
  },
  footerBold: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

interface ActionBox {
  number: number;
  title: string;
  category: string;
  time: string;
  roi: string;
  page: string; // e.g., "p.12"
  color: string;
}

interface FoundersCheatSheetProps {
  companyName: string;
  overallScore: number;
  targetScore: number;
  totalRecoverable: number;
  quickWins: ActionBox[];
  mediumWins: ActionBox[];
  longTerm: ActionBox[];
}

export const FoundersCheatSheet: React.FC<FoundersCheatSheetProps> = ({
  companyName,
  overallScore,
  targetScore,
  totalRecoverable,
  quickWins,
  mediumWins,
  longTerm,
}) => {
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📋 Your 90-Day Execution Checklist</Text>
        <Text style={styles.subtitle}>
          {companyName} | Print this page. Tape to wall. Check boxes. Ship.
        </Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreItem}>
            Current: <Text style={styles.scoreBold}>{overallScore}/100</Text>
          </Text>
          <Text style={styles.scoreItem}>
            Target: <Text style={styles.scoreBold}>{targetScore}/100</Text>
          </Text>
          <Text style={styles.scoreItem}>
            Recovery: <Text style={styles.scoreBold}>€{totalRecoverable.toLocaleString()}/year</Text>
          </Text>
        </View>
      </View>

      {/* Week 1-2: Quick Wins */}
      <View style={styles.gridSection} wrap={false}>
        <View style={{ ...styles.weekBadge, backgroundColor: COLORS.neonGreen, color: COLORS.moonlitGrey }}>
          <Text>WEEK 1-2: QUICK WINS (Ship This Weekend!)</Text>
        </View>

        <View style={styles.actionsRow}>
          {quickWins.slice(0, 4).map((action, index) => (
            <View key={index} style={{ ...styles.actionBox, borderLeftColor: action.color }}>
              <View style={styles.checkboxRow}>
                <View style={{ ...styles.checkbox, borderColor: action.color }} />
                <Text style={styles.actionNumber}>#{action.number}</Text>
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionMeta}>{action.category} | {action.time}</Text>
              <Text style={{ ...styles.actionRoi, color: action.color }}>{action.roi}</Text>
              <Text style={styles.actionPage}>{action.page}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Week 3-6: Medium Wins */}
      <View style={styles.gridSection} wrap={false}>
        <View style={{ ...styles.weekBadge, backgroundColor: COLORS.orange, color: COLORS.white }}>
          <Text>WEEK 3-6: MEDIUM WINS (Build Momentum)</Text>
        </View>

        <View style={styles.actionsRow}>
          {mediumWins.slice(0, 4).map((action, index) => (
            <View key={index} style={{ ...styles.actionBox, borderLeftColor: action.color }}>
              <View style={styles.checkboxRow}>
                <View style={{ ...styles.checkbox, borderColor: action.color }} />
                <Text style={styles.actionNumber}>#{action.number}</Text>
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionMeta}>{action.category} | {action.time}</Text>
              <Text style={{ ...styles.actionRoi, color: action.color }}>{action.roi}</Text>
              <Text style={styles.actionPage}>{action.page}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Week 7-12: Long-Term */}
      <View style={styles.gridSection} wrap={false}>
        <View style={{ ...styles.weekBadge, backgroundColor: COLORS.electricBlue, color: COLORS.white }}>
          <Text>WEEK 7-12: LONG-TERM (Compound Growth)</Text>
        </View>

        <View style={styles.actionsRow}>
          {longTerm.slice(0, 4).map((action, index) => (
            <View key={index} style={{ ...styles.actionBox, borderLeftColor: action.color }}>
              <View style={styles.checkboxRow}>
                <View style={{ ...styles.checkbox, borderColor: action.color }} />
                <Text style={styles.actionNumber}>#{action.number}</Text>
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionMeta}>{action.category} | {action.time}</Text>
              <Text style={{ ...styles.actionRoi, color: action.color }}>{action.roi}</Text>
              <Text style={styles.actionPage}>{action.page}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendBox} wrap={false}>
        <Text style={styles.legendTitle}>How To Use This Checklist</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={{ ...styles.legendDot, backgroundColor: COLORS.neonGreen }} />
            <Text style={styles.legendText}>Quick Win (1-2 days) = Fast results</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={{ ...styles.legendDot, backgroundColor: COLORS.orange }} />
            <Text style={styles.legendText}>Medium (3-7 days) = Good ROI</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={{ ...styles.legendDot, backgroundColor: COLORS.electricBlue }} />
            <Text style={styles.legendText}>Long-term (1-3 weeks) = Compound growth</Text>
          </View>
        </View>
        <Text style={{ ...styles.legendText, marginTop: 6 }}>
          Page numbers (e.g., "p.12") link to detailed implementation guides with copy-paste code.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          <Text style={styles.footerBold}>Founder Tip:</Text> Screenshot this page → Send to team Slack →
          Assign tasks → Ship in parallel. Each checkbox = closer to €{totalRecoverable.toLocaleString()}/year.
        </Text>
        <Text style={{ ...styles.footerText, marginTop: 8, fontSize: 7 }}>
          💬 Questions? Join the LAMA PRO community (link in your email) | ↻ Re-scan in 90 days to measure progress
        </Text>
      </View>
    </Page>
  );
};
