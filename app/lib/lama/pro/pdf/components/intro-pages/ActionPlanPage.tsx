/**
 * 90-Day Action Plan Page
 * Based on V5 pattern - page with quick wins, checkboxes, badges
 */

import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY, ICONS } from '../../font-constants';

const COLORS = {
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

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 50,
  },
  title: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  accentLine: {
    width: 80,
    height: 3,
    backgroundColor: COLORS.vividPurple,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.darkGrey,
    padding: 16,
    borderRadius: 6,
    borderLeftWidth: 3,
  },
  statCardGreen: {
    borderLeftColor: COLORS.neonGreen,
  },
  statCardOrange: {
    borderLeftColor: COLORS.orange,
  },
  statCardBlue: {
    borderLeftColor: COLORS.electricBlue,
  },
  statLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  statSubtext: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
  },
  weekSection: {
    marginBottom: 16,
  },
  weekHeader: {
    fontFamily: DEFAULT_FONT_FAMILY,
    backgroundColor: COLORS.neonGreen,
    color: COLORS.moonlitGrey,
    fontSize: 8,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  weekTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
  },
  weekMeta: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    marginLeft: 4,
  },
  actionItem: {
    backgroundColor: COLORS.darkGrey,
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  actionItemGreen: {
    borderLeftColor: COLORS.neonGreen,
  },
  actionItemPink: {
    borderLeftColor: COLORS.pink,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkbox: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    lineHeight: 1,
    marginRight: 10,
    color: COLORS.lightGrey,
  },
  actionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
    flex: 1,
  },
  badge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    textTransform: 'uppercase',
    marginLeft: 6,
  },
  quickWinBadge: {
    backgroundColor: COLORS.neonGreen,
    color: COLORS.moonlitGrey,
  },
  urgentBadge: {
    backgroundColor: COLORS.yellow,
    color: COLORS.moonlitGrey,
  },
  actionMeta: {
    flexDirection: 'row',
    gap: 16,
    marginLeft: 24,
  },
  metaItem: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
  },
  metaLabel: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  metaLink: {
    color: COLORS.electricBlue,
  },
  helpBox: {
    backgroundColor: '#2D2D4A',
    padding: 12,
    borderRadius: 4,
    marginTop: 20,
  },
  helpTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 8,
  },
  helpRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  helpBullet: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.neonGreen,
    marginRight: 6,
  },
  helpText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    flex: 1,
    lineHeight: 1.4,
  },
  helpLabel: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  proTip: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#3D3D5A',
  },
  proTipLabel: {
    fontWeight: 'bold',
    color: COLORS.orange,
  },
});

interface ActionItem {
  title: string;
  category: string;
  time: string;
  roi: string;
  difficulty: string;
  details: string;
  badge?: 'QUICK WIN' | 'URGENT' | 'HIGH ROI';
}

interface ActionPlanPageProps {
  targetRecovery: string;
  quickWinsCount: number;
  totalTime: string;
  weekOneActions: ActionItem[];
}

export const ActionPlanPage: React.FC<ActionPlanPageProps> = ({
  targetRecovery,
  quickWinsCount,
  totalTime,
  weekOneActions,
}) => {
  return (
    <Page size="A4" style={styles.page}>
      {/* Title */}
      <Text style={styles.title}>Your 90-Day Action Plan</Text>
      <View style={styles.accentLine} />

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Follow this roadmap to recover {targetRecovery} in 90 days. Each action
        includes time estimate, ROI projection, and copy-paste implementation
        guide. Check boxes as you complete them. Ship fast, iterate faster.
      </Text>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statCardGreen]}>
          <Text style={styles.statLabel}>TARGET RECOVERY</Text>
          <Text style={styles.statValue}>{targetRecovery}</Text>
          <Text style={styles.statSubtext}>
            Conservative estimate (75% confidence)
          </Text>
        </View>

        <View style={[styles.statCard, styles.statCardOrange]}>
          <Text style={styles.statLabel}>QUICK WINS</Text>
          <Text style={styles.statValue}>{quickWinsCount}</Text>
          <Text style={styles.statSubtext}>Can be done in 1-2 days each</Text>
        </View>

        <View style={[styles.statCard, styles.statCardBlue]}>
          <Text style={styles.statLabel}>TOTAL TIME</Text>
          <Text style={styles.statValue}>{totalTime}</Text>
          <Text style={styles.statSubtext}>Spread over 90 days</Text>
        </View>
      </View>

      {/* Week 1-2: Quick Wins */}
      <View style={styles.weekSection}>
        <View style={styles.weekHeader}>
          <Text>Week 1-2</Text>
        </View>
        <Text style={styles.weekTitle}>
          Quick Wins - Ship This Weekend!
          <Text style={styles.weekMeta}> 8 hours | €15,000/yr</Text>
        </Text>

        {weekOneActions.map((action, idx) => (
          <View
            key={idx}
            style={[
              styles.actionItem,
              action.badge === 'QUICK WIN'
                ? styles.actionItemGreen
                : styles.actionItemPink,
            ]}
          >
            <View style={styles.actionRow}>
              <Text style={styles.checkbox}>{ICONS.square}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
              {action.badge && (
                <Text
                  style={[
                    styles.badge,
                    action.badge === 'QUICK WIN'
                      ? styles.quickWinBadge
                      : styles.urgentBadge,
                  ]}
                >
                  {action.badge}
                </Text>
              )}
            </View>
            <View style={styles.actionMeta}>
              <Text style={styles.metaItem}>
                <Text style={styles.metaLabel}>Category:</Text> {action.category}
              </Text>
              <Text style={styles.metaItem}>
                <Text style={styles.metaLabel}>Time:</Text> {action.time}
              </Text>
              <Text style={styles.metaItem}>
                <Text style={styles.metaLabel}>ROI:</Text> {action.roi}
              </Text>
              <Text style={styles.metaItem}>
                <Text style={styles.metaLabel}>Difficulty:</Text>{' '}
                {action.difficulty}
              </Text>
              <Text style={[styles.metaItem, styles.metaLink]}>
                {action.details}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* How to Use Box */}
      <View style={styles.helpBox}>
        <Text style={styles.helpTitle}>How to Use This Roadmap</Text>

        <View style={styles.helpRow}>
          <Text style={styles.helpBullet}>●</Text>
          <Text style={styles.helpText}>
            <Text style={styles.helpLabel}>Quick Win</Text> = Implement in 1-2
            days, see results fast
          </Text>
        </View>

        <View style={styles.helpRow}>
          <Text style={[styles.helpBullet, { color: COLORS.pink }]}>●</Text>
          <Text style={styles.helpText}>
            <Text style={styles.helpLabel}>Urgent</Text> = Compliance risk or
            competitive disadvantage
          </Text>
        </View>

        <View style={styles.helpRow}>
          <Text style={[styles.helpBullet, { color: COLORS.orange }]}>●</Text>
          <Text style={styles.helpText}>
            <Text style={styles.helpLabel}>High ROI</Text> = Best return on time
            investment
          </Text>
        </View>

        <Text style={styles.proTip}>
          <Text style={styles.proTipLabel}>Pro Tip:</Text> Print this page, tape
          to wall, check boxes as you ship. Each box = closer to {targetRecovery}
          /year recovery.
        </Text>
      </View>
    </Page>
  );
};
