/**
 * PDF Generator API Route - Direct import (no subprocess)
 * Uses @react-pdf/renderer directly in Node.js runtime
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateLAMAProPDF } from '@/app/lib/lama/pro/pdf-generator-core';
import type { AuditResult } from '@/lib/lama/types';

// Force Node.js runtime for React PDF compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Increase timeout for PDF generation (max 60s on Vercel Pro)
export const maxDuration = 60;

interface PDFRequest {
  auditResult: AuditResult;
  fullName?: string;
  company?: string;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { auditResult, fullName, company } = await request.json() as PDFRequest;

    // Validation
    if (!auditResult || !auditResult.url) {
      return NextResponse.json(
        { error: 'Missing required fields: auditResult.url' },
        { status: 400 }
      );
    }

    console.log(`[PDF API] Generating PDF for ${auditResult.url}...`);

    // Generate PDF directly (no subprocess)
    const pdfBuffer = await generateLAMAProPDF({
      auditResult,
      fullName,
      company,
    });

    const duration = Date.now() - startTime;
    const sizeKB = (pdfBuffer.length / 1024).toFixed(0);

    console.log(`[PDF API] Generated ${sizeKB}KB PDF in ${(duration / 1000).toFixed(1)}s`);

    return NextResponse.json({
      success: true,
      pdf: pdfBuffer.toString('base64'),
      sizeBytes: pdfBuffer.length,
      generationTime: duration,
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[PDF API] Generation failed after ${(duration / 1000).toFixed(1)}s:`, error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        generationTime: duration,
      },
      { status: 500 }
    );
  }
}
