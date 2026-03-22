import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Match main PsalMix app colors
        primary: "#8B4BCF",
        "primary-hover": "#7B3BBF",
        "primary-light": "#A66BD9",
        background: "#111826",
        "background-elevated": "#1C2333",
        "background-overlay": "#0F1420",
        surface: "#1C2333",
        "surface-hover": "#262D3D",
        "text-primary": "#FFFFFF",
        "text-secondary": "#94A3B8",
        // Legacy (keep for any existing uses)
        "background-light": "#fdfaf6",
        "background-dark": "#111826",
        "cream-accent": "#1C2333",
      },
      fontFamily: {
        display: ["Be Vietnam Pro", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
      },
      animation: {
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(139, 75, 207, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(139, 75, 207, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
