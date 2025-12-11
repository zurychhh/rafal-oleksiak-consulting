import React from 'react';
import { Document, Font } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from './fonts';
import { Cover } from './components/Cover';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { CategorySection } from './components/CategorySection';

// Category colors matching the brand design system
const CATEGORY_COLORS = {
  Find: '#7B2CBF',      // Vivid Purple
  Stay: '#00BFFF',      // Electric Blue
  Understand: '#9D4EDD', // Light Purple
  Trust: '#10B981',     // Green
  Convert: '#F59E0B',   // Yellow/Orange
  Engage: '#EC4899',    // Pink
};

interface Issue {
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface Solution {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  implementation: string;
  codeExample?: string;
  estimatedImpact?: string;
}

interface CategoryData {
  category: 'Find' | 'Stay' | 'Understand' | 'Trust' | 'Convert' | 'Engage';
  score: number;
  description: string;
  issues: Issue[];
  solutions: Solution[];
}

interface LAMAProReportProps {
  websiteUrl: string;
  companyName?: string;
  overallScore: number;
  categories: CategoryData[];
  generatedDate: string;
  keyFindings: string[];
  estimatedRevenueLoss: number;
  recoverable: number;
}

export const LAMAProReport: React.FC<LAMAProReportProps> = ({
  websiteUrl,
  companyName,
  overallScore,
  categories,
  generatedDate,
  keyFindings,
  estimatedRevenueLoss,
  recoverable,
}) => {
  // Prepare category scores for executive summary
  const categoryScores = categories.map((cat) => ({
    category: cat.category,
    score: cat.score,
    description: cat.description,
    borderColor: CATEGORY_COLORS[cat.category],
  }));

  return (
    <Document
      title={`LAMA PRO Report - ${websiteUrl}`}
      author="Oleksiak Consulting"
      subject="Lead Acquisition Maturity Assessment"
      creator="LAMA PRO System"
      producer="Oleksiak Consulting"
    >
      {/* Cover Page */}
      <Cover
        websiteUrl={websiteUrl}
        companyName={companyName}
        overallScore={overallScore}
        generatedDate={generatedDate}
      />

      {/* Executive Summary */}
      <ExecutiveSummary
        overallScore={overallScore}
        categories={categoryScores}
        keyFindings={keyFindings}
        estimatedRevenueLoss={estimatedRevenueLoss}
        recoverable={recoverable}
      />

      {/* Category Sections - All 6 Categories */}
      {categories.map((category, index) => (
        <CategorySection
          key={category.category}
          categoryName={category.category}
          categoryDescription={category.description}
          score={category.score}
          categoryColor={CATEGORY_COLORS[category.category]}
          issues={category.issues}
          solutions={category.solutions}
          pageNumber={index + 1}
        />
      ))}
    </Document>
  );
};
