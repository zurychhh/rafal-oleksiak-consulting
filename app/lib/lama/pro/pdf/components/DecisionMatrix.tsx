import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../font-constants';

const COLORS = {
  moonlitGrey: '#1A1A2E',
  vividPurple: '#7B2CBF',
  electricBlue: '#00BFFF',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  darkGrey: '#2A2A3E',
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 50,
  },
  title: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginBottom: 24,
  },
  accentLine: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.vividPurple,
    marginBottom: 20,
  },
  matrixContainer: {
    marginTop: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.vividPurple,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  headerCell: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkGrey,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: COLORS.darkGrey,
  },
  rowAlt: {
    backgroundColor: '#232338',
  },
  cell: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
  },
  cellBold: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  priorityBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  highPriority: {
    backgroundColor: COLORS.red,
    color: COLORS.white,
  },
  mediumPriority: {
    backgroundColor: COLORS.yellow,
    color: COLORS.moonlitGrey,
  },
  lowPriority: {
    backgroundColor: COLORS.green,
    color: COLORS.white,
  },
  legendBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: COLORS.darkGrey,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.electricBlue,
  },
  legendTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  legendText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  summaryBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#2D2D4A',
    borderRadius: 6,
  },
  summaryTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  summaryText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginBottom: 6,
  },
});

interface ActionItem {
  action: string;
  category: string;
  roiImpact: string; // e.g., "€15,000/yr"
  effort: string; // e.g., "4 hours"
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  quickWin: boolean;
}

interface DecisionMatrixProps {
  actions: ActionItem[];
}

export const DecisionMatrix: React.FC<DecisionMatrixProps> = ({ actions }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return styles.highPriority;
      case 'MEDIUM':
        return styles.mediumPriority;
      default:
        return styles.lowPriority;
    }
  };

  // Sort: HIGH priority first, then by ROI
  const sortedActions = [...actions].sort((a, b) => {
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Calculate column widths (percentage-based)
  const colWidths = {
    action: '30%',
    category: '13%',
    roi: '15%',
    effort: '15%',
    priority: '12%',
    quickWin: '15%',
  };

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Executive Decision Matrix</Text>
      <View style={styles.accentLine} />
      <Text style={styles.subtitle}>
        Prioritized action items ranked by ROI impact vs implementation effort.
        Start with HIGH priority items for maximum return in minimum time.
      </Text>

      {/* Matrix Table */}
      <View style={styles.matrixContainer}>
        {/* Header Row */}
        <View style={styles.tableHeader}>
          <Text style={{ ...styles.headerCell, width: colWidths.action }}>Action</Text>
          <Text style={{ ...styles.headerCell, width: colWidths.category }}>Category</Text>
          <Text style={{ ...styles.headerCell, width: colWidths.roi }}>ROI Impact</Text>
          <Text style={{ ...styles.headerCell, width: colWidths.effort }}>Effort</Text>
          <Text style={{ ...styles.headerCell, width: colWidths.priority }}>Priority</Text>
          <Text style={{ ...styles.headerCell, width: colWidths.quickWin }}>Quick Win</Text>
        </View>

        {/* Data Rows */}
        {sortedActions.map((item, index) => (
          <View
            key={index}
            style={[styles.tableRow, index % 2 === 1 && styles.rowAlt]}
          >
            <Text style={{ ...styles.cell, ...styles.cellBold, width: colWidths.action }}>
              {item.action}
            </Text>
            <Text style={{ ...styles.cell, width: colWidths.category }}>
              {item.category}
            </Text>
            <Text style={{ ...styles.cell, width: colWidths.roi, color: COLORS.green }}>
              {item.roiImpact}
            </Text>
            <Text style={{ ...styles.cell, width: colWidths.effort }}>
              {item.effort}
            </Text>
            <View style={{ width: colWidths.priority }}>
              <View style={{ ...styles.priorityBadge, ...getPriorityStyle(item.priority) }}>
                <Text>{item.priority}</Text>
              </View>
            </View>
            <Text style={{ ...styles.cell, width: colWidths.quickWin }}>
              {item.quickWin ? '✓ Yes' : '—'}
            </Text>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legendBox}>
        <Text style={styles.legendTitle}>How to Use This Matrix</Text>
        <Text style={styles.legendText}>
          <Text style={{ fontWeight: 'bold', color: COLORS.white }}>HIGH Priority: </Text>
          Maximum ROI with minimal effort. Implement these first for quick wins.
        </Text>
        <Text style={styles.legendText}>
          <Text style={{ fontWeight: 'bold', color: COLORS.white }}>MEDIUM Priority: </Text>
          Good ROI but requires more time/resources. Schedule after HIGH items.
        </Text>
        <Text style={styles.legendText}>
          <Text style={{ fontWeight: 'bold', color: COLORS.white }}>LOW Priority: </Text>
          Nice-to-have improvements. Consider after critical gaps are addressed.
        </Text>
        <Text style={styles.legendText}>
          <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Quick Win: </Text>
          Can be completed within 1-2 days with immediate measurable impact.
        </Text>
      </View>

      {/* Implementation Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Recommended Implementation Sequence</Text>
        <Text style={styles.summaryText}>
          <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Week 1-2: </Text>
          Focus on all HIGH priority items marked as Quick Wins. These require minimal effort
          but deliver measurable results fast, building momentum for larger initiatives.
        </Text>
        <Text style={styles.summaryText}>
          <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Week 3-6: </Text>
          Tackle remaining HIGH priority items and begin MEDIUM priority actions. At this stage,
          you should see 30-50% of total estimated ROI already realized.
        </Text>
        <Text style={styles.summaryText}>
          <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Week 7-12: </Text>
          Complete MEDIUM and LOW priority items. Focus on long-term improvements and
          optimization. By end of 90 days, target 75% of total ROI achieved.
        </Text>
      </View>
    </Page>
  );
};
