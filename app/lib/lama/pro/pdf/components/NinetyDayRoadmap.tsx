import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../font-constants';

// Neon accents for startup energy!
const COLORS = {
  moonlitGrey: '#1A1A2E',
  vividPurple: '#7B2CBF',
  electricBlue: '#00BFFF',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  darkGrey: '#2A2A3E',
  neonGreen: '#00FF00',  // ⚡ Quick wins
  hotPink: '#FF006E',    // ⚠️ Urgent/Compliance
  orange: '#FF8C00',     // € High ROI
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 50,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginBottom: 20,
  },
  accentLine: {
    width: 80,
    height: 3,
    backgroundColor: COLORS.neonGreen,
    marginBottom: 20,
  },
  // KPI Summary Row
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.darkGrey,
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
  },
  kpiLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  kpiValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  kpiDetail: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    marginTop: 3,
  },
  // Timeline sections
  timelineSection: {
    marginBottom: 20,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
  },
  timelineBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 10,
  },
  timelineTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  timelineStats: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    marginLeft: 'auto',
  },
  // Action items
  actionItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  actionCheckbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 3,
    marginRight: 10,
    marginTop: 2,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 3,
  },
  actionMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
  },
  metaBold: {
    fontWeight: 'bold',
  },
  badge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginLeft: 6,
  },
  // Legend
  legendBox: {
    backgroundColor: '#2D2D4A',
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  legendTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
  },
});

interface ActionItem {
  title: string;
  category: string;
  timeEstimate: string;
  roi: string;
  difficulty: 'Low' | 'Medium' | 'High';
  isQuickWin: boolean;
  isUrgent: boolean;
  pageReference: string; // "See page 12 for details"
}

interface TimelinePhase {
  phase: 'Week 1-2' | 'Week 3-6' | 'Week 7-12';
  focus: string;
  totalTime: string;
  expectedROI: string;
  actions: ActionItem[];
}

interface NinetyDayRoadmapProps {
  totalRecoverable: number;
  quickWinsCount: number;
  totalTimeInvestment: string;
  timeline: TimelinePhase[];
}

export const NinetyDayRoadmap: React.FC<NinetyDayRoadmapProps> = ({
  totalRecoverable,
  quickWinsCount,
  totalTimeInvestment,
  timeline,
}) => {
  const getPhaseColor = (phase: string): string => {
    if (phase.includes('1-2')) return COLORS.neonGreen;
    if (phase.includes('3-6')) return COLORS.orange;
    return COLORS.electricBlue;
  };

  const getBadgeColor = (isQuickWin: boolean, isUrgent: boolean) => {
    if (isUrgent) return COLORS.hotPink;
    if (isQuickWin) return COLORS.neonGreen;
    return COLORS.orange;
  };

  const getBadgeText = (isQuickWin: boolean, isUrgent: boolean) => {
    if (isUrgent) return '⚠️ URGENT';
    if (isQuickWin) return '⚡ QUICK WIN';
    return '€ HIGH ROI';
  };

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header} wrap={false}>
        <Text style={styles.title}>Your 90-Day Action Plan</Text>
        <View style={styles.accentLine} />
        <Text style={styles.subtitle}>
          Follow this roadmap to recover €{totalRecoverable.toLocaleString()}/year in 90 days.
          Each action includes time estimate, ROI projection, and copy-paste implementation guide.
          Check boxes as you complete them. Ship fast, iterate faster.
        </Text>
      </View>

      {/* KPI Summary */}
      <View style={styles.kpiRow} wrap={false}>
        <View style={{ ...styles.kpiCard, borderLeftColor: COLORS.neonGreen }}>
          <Text style={styles.kpiLabel}>Target Recovery</Text>
          <Text style={styles.kpiValue}>€{totalRecoverable.toLocaleString()}</Text>
          <Text style={styles.kpiDetail}>Conservative estimate (75% confidence)</Text>
        </View>

        <View style={{ ...styles.kpiCard, borderLeftColor: COLORS.orange }}>
          <Text style={styles.kpiLabel}>Quick Wins</Text>
          <Text style={styles.kpiValue}>{quickWinsCount}</Text>
          <Text style={styles.kpiDetail}>Can be done in 1-2 days each</Text>
        </View>

        <View style={{ ...styles.kpiCard, borderLeftColor: COLORS.electricBlue }}>
          <Text style={styles.kpiLabel}>Total Time</Text>
          <Text style={styles.kpiValue}>{totalTimeInvestment}</Text>
          <Text style={styles.kpiDetail}>Spread over 90 days</Text>
        </View>
      </View>

      {/* Timeline Phases */}
      {timeline.map((phase, phaseIndex) => (
        <View key={phaseIndex} style={styles.timelineSection} wrap={false}>
          {/* Phase Header */}
          <View style={styles.timelineHeader}>
            <View
              style={{
                ...styles.timelineBadge,
                backgroundColor: getPhaseColor(phase.phase),
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.moonlitGrey }}>
                {phase.phase}
              </Text>
            </View>
            <Text style={styles.timelineTitle}>{phase.focus}</Text>
            <Text style={styles.timelineStats}>
              {phase.totalTime} | {phase.expectedROI}
            </Text>
          </View>

          {/* Action Items */}
          {phase.actions.map((action, actionIndex) => (
            <View
              key={actionIndex}
              style={{
                ...styles.actionItem,
                borderLeftColor: getBadgeColor(action.isQuickWin, action.isUrgent),
              }}
            >
              {/* Checkbox */}
              <View
                style={{
                  ...styles.actionCheckbox,
                  borderColor: getBadgeColor(action.isQuickWin, action.isUrgent),
                }}
              />

              {/* Content */}
              <View style={styles.actionContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <View
                    style={{
                      ...styles.badge,
                      backgroundColor: getBadgeColor(action.isQuickWin, action.isUrgent),
                      color: COLORS.white,
                    }}
                  >
                    <Text>{getBadgeText(action.isQuickWin, action.isUrgent)}</Text>
                  </View>
                </View>

                <View style={styles.actionMeta}>
                  <Text style={styles.metaItem}>
                    <Text style={styles.metaBold}>Category:</Text> {action.category}
                  </Text>
                  <Text style={styles.metaItem}>
                    <Text style={styles.metaBold}>Time:</Text> {action.timeEstimate}
                  </Text>
                  <Text style={styles.metaItem}>
                    <Text style={styles.metaBold}>ROI:</Text> {action.roi}
                  </Text>
                  <Text style={styles.metaItem}>
                    <Text style={styles.metaBold}>Difficulty:</Text> {action.difficulty}
                  </Text>
                  <Text style={{ ...styles.metaItem, marginLeft: 'auto', color: COLORS.electricBlue }}>
                    {action.pageReference}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}

      {/* Legend */}
      <View style={styles.legendBox} wrap={false}>
        <Text style={styles.legendTitle}>How to Use This Roadmap</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={{ ...styles.legendDot, backgroundColor: COLORS.neonGreen }} />
            <Text style={styles.legendText}>Quick Win = Implement in 1-2 days, see results fast</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={{ ...styles.legendDot, backgroundColor: COLORS.hotPink }} />
            <Text style={styles.legendText}>Urgent = Compliance risk or competitive disadvantage</Text>
          </View>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={{ ...styles.legendDot, backgroundColor: COLORS.orange }} />
            <Text style={styles.legendText}>High ROI = Best return on time investment</Text>
          </View>
        </View>
        <Text style={{ ...styles.legendText, marginTop: 8 }}>
          <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Pro Tip:</Text> Print this page,
          tape to wall, check boxes as you ship. Each box = closer to €{totalRecoverable.toLocaleString()}/year recovery.
        </Text>
      </View>
    </Page>
  );
};
