#!/usr/bin/env tsx
/**
 * PDF Generator CLI - Standalone script for spawned process
 * Bypasses Turbopack by running in separate Node.js process
 */

import { readFile, writeFile } from 'fs/promises';
import { generateLAMAProPDF } from './pdf-generator-core';
import type { AuditResult } from '@/lib/lama/types';

interface CLIInput {
  auditResult: AuditResult;
  fullName?: string;
  company?: string;
  outputPath: string;
}

async function main() {
  try {
    // Get input file path from command line argument
    const inputPath = process.argv[2];

    if (!inputPath) {
      console.error('[PDF CLI] Error: Missing input file path argument');
      process.exit(1);
    }

    console.log(`[PDF CLI] Reading input from: ${inputPath}`);

    // Read input JSON
    const inputJson = await readFile(inputPath, 'utf-8');
    const { auditResult, fullName, company, outputPath } = JSON.parse(inputJson) as CLIInput;

    console.log(`[PDF CLI] Generating PDF for ${auditResult.url}...`);
    const startTime = Date.now();

    // Generate PDF
    const pdfBuffer = await generateLAMAProPDF({
      auditResult,
      fullName,
      company,
    });

    const duration = Date.now() - startTime;
    const sizeKB = (pdfBuffer.length / 1024).toFixed(0);

    // Write PDF to output path
    await writeFile(outputPath, pdfBuffer);

    console.log(`[PDF CLI] Generated ${sizeKB}KB PDF in ${(duration / 1000).toFixed(1)}s`);
    console.log(`[PDF CLI] Written to: ${outputPath}`);

    process.exit(0);

  } catch (error) {
    console.error('[PDF CLI] Generation failed:', error);
    process.exit(1);
  }
}

main();
