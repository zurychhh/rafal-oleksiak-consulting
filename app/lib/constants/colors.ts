/**
 * Custom color palette for Rafal Oleksiak Consulting
 * These colors are also defined in tailwind.config.ts and globals.css
 */
export const COLORS = {
  moonlitGrey: "#2D3142",
  vividPurple: "#7B2CBF",
  electricBlue: "#0066FF",
  white: "#FFFFFF",
  softLavender: "#E8E3F7",
} as const;

export type ColorName = keyof typeof COLORS;
