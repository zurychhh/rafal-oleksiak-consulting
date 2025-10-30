import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for Rafal Oleksiak Consulting
        "moonlit-grey": "#2D3142",
        "vivid-purple": "#7B2CBF",
        "electric-blue": "#0066FF",
        white: "#FFFFFF",
        "soft-lavender": "#E8E3F7",
      },
      fontFamily: {
        // Poppins for headlines
        poppins: ["var(--font-poppins)", "sans-serif"],
        // DM Sans for body text
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
