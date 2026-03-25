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
        // Stitch design system colors
        background: "#0c1321",
        "surface-container-lowest": "#070e1c",
        "surface-container-low": "#151c2a",
        "surface-container": "#19202e",
        "surface-container-high": "#232a39",
        "surface-container-highest": "#2e3544",
        "surface-dim": "#0c1321",
        "surface-variant": "#2e3544",
        "surface-bright": "#323949",

        primary: "#dbb8ff",
        "primary-container": "#8b4bcf",
        "primary-fixed": "#efdbff",
        "on-primary": "#480082",
        "on-primary-container": "#f8eaff",
        "inverse-primary": "#7c3bc0",

        secondary: "#4cd7f6",
        "secondary-container": "#03b5d3",
        "secondary-fixed": "#acedff",
        "on-secondary": "#003640",
        "on-secondary-container": "#00424e",

        tertiary: "#f2bf5c",
        "tertiary-container": "#8d6500",
        "tertiary-fixed": "#ffdea6",
        "on-tertiary": "#412d00",
        "on-tertiary-container": "#ffecd0",

        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",

        "on-surface": "#dce2f6",
        "on-surface-variant": "#cec2d5",
        "inverse-surface": "#dce2f6",
        "inverse-on-surface": "#29303f",

        outline: "#978d9e",
        "outline-variant": "#4c4452",

        // Aliases for compatibility
        surface: "#0c1321",
        "text-primary": "#dce2f6",
        "text-secondary": "#cec2d5",
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "3.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
