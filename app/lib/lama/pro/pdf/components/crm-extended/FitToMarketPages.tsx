/**
 * CRM Pages 13-15: FIT-TO-MARKET Automation Scenarios
 * Key innovation - scenarios matched to detected problems
 */

import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../../font-constants';
import { crmStyles as styles } from './styles';
import {
  PageHeader,
  PageFooter,
  SectionTitle,
  ProblemBox,
  SolutionBox,
  CalculationBox,
  AutomationWorkflow,
  EmailTemplateCard,
  ROIBadge,
  BodyText,
  Bold,
  Highlight,
  BulletList,
  Divider,
} from './helpers';
import type { FitToMarketScenario } from './types';

interface FitToMarketPagesProps {
  categoryName: string;
  scenarios: FitToMarketScenario[];
}

export const FitToMarketPages: React.FC<FitToMarketPagesProps> = ({ categoryName, scenarios }) => {
  // Typically 3 scenarios (E-commerce, SaaS, Consulting) = 3 pages
  // But we'll make it dynamic

  return (
    <>
      {scenarios.map((scenario, idx) => (
        <Page key={idx} size="A4" style={styles.page}>
          <PageHeader
            categoryName={categoryName}
            title={`FIT-TO-MARKET Scenario ${idx + 1}: ${scenario.scenario.title}`}
            subtitle={`Automation dopasowany do wykrytego problemu: ${scenario.detectedProblem.metric}`}
            pageNumber={`${13 + idx}`}
          />

          {/* Detected Problem */}
          <View style={styles.section}>
            <SectionTitle emoji="🔍" title="WYKRYTY PROBLEM" />
            <ProblemBox>
              <BodyText>
                <Bold>Kategoria: </Bold>
                {scenario.detectedProblem.category.toUpperCase()}
              </BodyText>
              <BodyText>
                <Bold>Problem: </Bold>
                {scenario.detectedProblem.metric}
              </BodyText>
              <BodyText>
                <Bold>Current value: </Bold>
                <Highlight>{scenario.detectedProblem.currentValue}</Highlight>
                {' vs benchmark '}
                {scenario.detectedProblem.benchmarkValue}
              </BodyText>
              <BodyText>
                <Bold>Gap: </Bold>
                {scenario.detectedProblem.gap}
              </BodyText>
            </ProblemBox>
          </View>

          {/* Proposed Scenario */}
          <View style={styles.section}>
            <SectionTitle emoji="○" title="PROPONOWANY SCENARIUSZ" />
            <SolutionBox>
              <Text style={[styles.bodyText, { fontSize: 9, marginBottom: 4 }]}>
                <Bold>{scenario.scenario.title}</Bold>
              </Text>
              <BodyText>{scenario.scenario.description}</BodyText>
              <View style={[styles.row, styles.mt4, { gap: 4 }]}>
                <Text style={[styles.bodyTextSmall, { fontSize: 7 }]}>
                  <Bold>Applicable to: </Bold>
                  {scenario.scenario.applicableTo.join(', ')}
                </Text>
                <Text style={[styles.bodyTextSmall, { fontSize: 7 }]}>
                  <Bold>Complexity: </Bold>
                  {scenario.scenario.complexity}
                </Text>
              </View>
            </SolutionBox>
          </View>

          {/* Automation Workflow */}
          <View style={styles.section}>
            <SectionTitle emoji="⚡" title="AUTOMATION WORKFLOW" />
            <View style={styles.infoBox}>
              <BodyText>
                <Bold>Trigger: </Bold>
                {scenario.workflow.trigger}
              </BodyText>
              {scenario.workflow.totalDuration && (
                <BodyText small>
                  <Bold>Duration: </Bold>
                  {scenario.workflow.totalDuration}
                </BodyText>
              )}
            </View>

            <AutomationWorkflow steps={scenario.workflow.steps} showTools />

            <View style={[styles.infoBox, styles.mt6]}>
              <BodyText small>
                <Bold>Tools required: </Bold>
                {scenario.workflow.tools.join(', ')}
              </BodyText>
            </View>
          </View>

          {/* Expected Impact */}
          <View style={styles.section}>
            <SectionTitle emoji="▉" title="EXPECTED IMPACT" />
            <CalculationBox
              steps={scenario.impact.calculationSteps}
              note={`Time to implement: ${scenario.impact.timeToImplement} | Cost: ${scenario.impact.cost}`}
            />
            <ROIBadge roi={scenario.impact.roi} />
          </View>

          {/* Email Templates (if available) */}
          {scenario.templates?.emails && scenario.templates.emails.length > 0 && (
            <View style={styles.section}>
              <SectionTitle emoji="✉" title="EMAIL TEMPLATES" />
              {scenario.templates.emails.slice(0, 3).map((email, emailIdx) => (
                <EmailTemplateCard key={emailIdx} email={email} showCTA />
              ))}
              {scenario.templates.emails.length > 3 && (
                  ...+ {scenario.templates.emails.length - 3} more emails (full sequence in implementation guide)
                </BodyText>
              )}
            </View>
          )}

          <PageFooter pageNum={`${13 + idx}`} />
        </Page>
      ))}
    </>
  );
};
