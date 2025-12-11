/**
 * Three-Path Implementation Component
 * Reusable component for DIY / Agency / Hybrid implementation paths
 * Based on V5 pattern
 */

import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY, CODE_FONT_FAMILY, ICONS } from '../../font-constants';

const COLORS = {
  moonlitGrey: '#1A1A2E',
  vividPurple: '#7B2CBF',
  electricBlue: '#00BFFF',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  darkGrey: '#2A2A3E',
  neonGreen: '#00FF00',
  orange: '#FF8C00',
  codeBackground: '#0D0D1A',
  codeGreen: '#00FF00',
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  pathBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  diyBorder: {
    borderLeftColor: COLORS.neonGreen,
  },
  agencyBorder: {
    borderLeftColor: COLORS.orange,
  },
  hybridBorder: {
    borderLeftColor: COLORS.electricBlue,
  },
  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  pathTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  pathNumber: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginRight: 4,
  },
  difficultyBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    textTransform: 'uppercase',
  },
  lowBadge: {
    backgroundColor: COLORS.neonGreen,
    color: COLORS.moonlitGrey,
  },
  mediumBadge: {
    backgroundColor: COLORS.orange,
    color: COLORS.white,
  },
  highBadge: {
    backgroundColor: COLORS.red,
    color: COLORS.white,
  },
  costTimeRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 6,
  },
  costTimeLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  costTimeValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  forWhom: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  forWhomLabel: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  stepsList: {
    marginBottom: 6,
  },
  step: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  stepNumber: {
    fontWeight: 'bold',
    color: COLORS.electricBlue,
  },
  roiBox: {
    backgroundColor: '#1A2B3D',
    padding: 6,
    borderRadius: 3,
    marginTop: 4,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.neonGreen,
  },
  roiLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
    marginBottom: 2,
  },
  roiText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
  },
  roiValue: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  codeBox: {
    backgroundColor: COLORS.codeBackground,
    padding: 8,
    borderRadius: 3,
    marginTop: 6,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  codeTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    fontWeight: 'bold',
    color: COLORS.codeGreen,
    textTransform: 'uppercase',
  },
  readyBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 6,
    fontWeight: 'bold',
    backgroundColor: COLORS.neonGreen,
    color: COLORS.moonlitGrey,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  code: {
    fontFamily: CODE_FONT_FAMILY,
    fontSize: 6,
    color: COLORS.codeGreen,
    lineHeight: 1.5,
  },
  whyItWorks: {
    backgroundColor: '#2D2D4A',
    padding: 8,
    borderRadius: 3,
    marginTop: 8,
  },
  whyTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 4,
  },
  whyText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    lineHeight: 1.4,
  },
  whyHighlight: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

interface ImplementationPath {
  number: number;
  title: string; // "DIY", "Agency", "Hybrid"
  difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
  cost: string; // e.g., "€200"
  time: string; // e.g., "4-6h"
  forWhom: string; // e.g., "Tech-savvy founders. Full control, save €2k+ agency fees."
  steps: string[]; // Array of step descriptions
  breakEven: string; // e.g., "Break-even w 2 tygodnie"
  roi: string; // e.g., "€200 koszt vs €3,500/mc gain = 1,650% ROI"
}

interface CodeSnippet {
  title: string; // e.g., "SKOPIUJ-WKLEJ W HTML"
  code: string; // The actual code
}

interface WhyItWorks {
  text: string; // Can include **bold** markers
}

interface ThreePathImplementationProps {
  paths: ImplementationPath[];
  codeSnippet?: CodeSnippet;
  whyItWorks?: WhyItWorks;
}

export const ThreePathImplementation: React.FC<
  ThreePathImplementationProps
> = ({ paths, codeSnippet, whyItWorks }) => {
  const getDifficultyBadgeStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'LOW':
        return styles.lowBadge;
      case 'MEDIUM':
        return styles.mediumBadge;
      case 'HIGH':
        return styles.highBadge;
      default:
        return styles.mediumBadge;
    }
  };

  const getPathBorderStyle = (title: string) => {
    if (title.toLowerCase().includes('diy')) return styles.diyBorder;
    if (title.toLowerCase().includes('agency')) return styles.agencyBorder;
    if (title.toLowerCase().includes('hybrid')) return styles.hybridBorder;
    return styles.diyBorder;
  };

  return (
    <View style={styles.container}>
      {/* Implementation Paths */}
      {paths.map((path, idx) => (
        <View
          key={idx}
          style={[styles.pathBox, getPathBorderStyle(path.title)]}
        >
          {/* Header */}
          <View style={styles.pathHeader}>
            <Text style={styles.pathTitle}>
              <Text style={styles.pathNumber}>{path.number}. </Text>
              {path.title}
            </Text>
            <Text
              style={[
                styles.difficultyBadge,
                getDifficultyBadgeStyle(path.difficulty),
              ]}
            >
              {path.difficulty}
            </Text>
          </View>

          {/* Cost & Time */}
          <View style={styles.costTimeRow}>
            <View>
              <Text style={styles.costTimeLabel}>COST</Text>
              <Text style={styles.costTimeValue}>{path.cost}</Text>
            </View>
            <View>
              <Text style={styles.costTimeLabel}>TIME</Text>
              <Text style={styles.costTimeValue}>{path.time}</Text>
            </View>
          </View>

          {/* For Whom */}
          <Text style={styles.forWhom}>
            <Text style={styles.forWhomLabel}>For:</Text> {path.forWhom}
          </Text>

          {/* Steps */}
          <View style={styles.stepsList}>
            {path.steps.map((step, stepIdx) => (
              <Text key={stepIdx} style={styles.step}>
                <Text style={styles.stepNumber}>{stepIdx + 1}.</Text> {step}
              </Text>
            ))}
          </View>

          {/* ROI Box */}
          <View style={styles.roiBox}>
            <Text style={styles.roiLabel}>{ICONS.money} ROI</Text>
            <Text style={styles.roiText}>
              {path.breakEven}
              {'\n'}
              <Text style={styles.roiValue}>{path.roi}</Text>
            </Text>
          </View>
        </View>
      ))}

      {/* Code Snippet (Optional) */}
      {codeSnippet && (
        <View style={styles.codeBox}>
          <View style={styles.codeHeader}>
            <Text style={styles.codeTitle}>{codeSnippet.title}</Text>
            <Text style={styles.readyBadge}>READY TO USE</Text>
          </View>
          <Text style={styles.code}>{codeSnippet.code}</Text>
        </View>
      )}

      {/* Why It Works (Optional) */}
      {whyItWorks && (
        <View style={styles.whyItWorks}>
          <Text style={styles.whyTitle}>Why it works</Text>
          <Text style={styles.whyText}>
            {whyItWorks.text.split('**').map((part, idx) =>
              idx % 2 === 1 ? (
                <Text key={idx} style={styles.whyHighlight}>
                  {part}
                </Text>
              ) : (
                <Text key={idx}>{part}</Text>
              ),
            )}
          </Text>
        </View>
      )}
    </View>
  );
};
