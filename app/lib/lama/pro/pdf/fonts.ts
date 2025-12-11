/**
 * PDF Font Configuration
 * Registers Noto Sans font family with Polish character support
 */

import { Font } from '@react-pdf/renderer';

// TEMPORARILY DISABLED - using built-in fonts (Helvetica, Courier)
// Will re-enable once we fix font loading issues

// Font.register({
//   family: 'Noto Sans',
//   fonts: [
//     {
//       src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
//       fontWeight: 400,
//     },
//     {
//       src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf',
//       fontWeight: 700,
//     },
//   ],
// });

// Font.register({
//   family: 'Noto Sans Mono',
//   fonts: [
//     {
//       src: 'https://fonts.gstatic.com/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW4.ttf',
//       fontWeight: 400,
//     },
//   ],
// });

/**
 * IMPORTANT:
 * - DEFAULT_FONT_FAMILY, CODE_FONT_FAMILY, and ICONS are now in font-constants.ts
 * - This file only does Font.register() - imported once in pdf-generator-core.tsx
 * - This avoids circular imports and multiple font registrations
 */
