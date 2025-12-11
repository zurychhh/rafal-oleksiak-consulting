/**
 * PDF Generator - CommonJS Wrapper
 * Uses dynamic require() to bypass Turbopack ESM module resolution issues
 */

async function generateLAMAProPDF(options) {
  // Dynamic require to avoid Turbopack compilation issues
  const { generateLAMAProPDF: generator } = await import('./pdf-generator-core.js');
  return generator(options);
}

module.exports = { generateLAMAProPDF };
