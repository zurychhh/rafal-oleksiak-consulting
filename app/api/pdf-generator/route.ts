/**
 * PDF Generator API Route - Uses spawn to bypass Turbopack
 * Executes standalone PDF generator in separate process
 */

import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import type { AuditResult } from '@/lib/lama/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PDFRequest {
  auditResult: AuditResult;
  fullName?: string;
  company?: string;
}

export async function POST(request: NextRequest) {
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
    const startTime = Date.now();

    // Write request data to temp file
    const inputPath = join(tmpdir(), `pdf-input-${Date.now()}.json`);
    const outputPath = join(tmpdir(), `pdf-output-${Date.now()}.pdf`);

    await writeFile(inputPath, JSON.stringify({
      auditResult,
      fullName,
      company,
      outputPath
    }));

    // Spawn tsx to run PDF generator
    const pdfProcess = spawn('npx', ['tsx', join(process.cwd(), 'app/lib/lama/pro/pdf-generator-cli.ts'), inputPath], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    pdfProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pdfProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    const exitCode = await new Promise<number>((resolve) => {
      pdfProcess.on('close', resolve);
    });

    // Clean up input file
    await unlink(inputPath).catch(() => {});

    if (exitCode !== 0) {
      await unlink(outputPath).catch(() => {});
      throw new Error(`PDF generation failed: ${stderr || stdout}`);
    }

    // Read generated PDF
    const { readFile } = await import('fs/promises');
    const pdfBuffer = await readFile(outputPath);

    // Clean up output file
    await unlink(outputPath).catch(() => {});

    const duration = Date.now() - startTime;
    const sizeKB = (pdfBuffer.length / 1024).toFixed(0);

    console.log(`[PDF API] Generated in ${(duration / 1000).toFixed(1)}s (${sizeKB}KB)`);

    return NextResponse.json({
      success: true,
      pdf: pdfBuffer.toString('base64'),
      sizeBytes: pdfBuffer.length,
      generationTime: duration,
    });

  } catch (error) {
    console.error('[PDF API] Generation failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
