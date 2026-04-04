import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-opensans)", "Helvetica Neue", "Arial", "sans-serif"],
        heading: ["var(--font-montserrat)", "Verdana", "sans-serif"],
      },
      colors: {
        "accent":       "#ca8b2b",
        "accent-dark":  "#9d6b2a",
        "hero-bg":      "#2a1406",
        "gold-light":   "rgb(231,210,147)",
        "gold-dark":    "rgb(183,135,66)",
        "trust-bg":     "#161616",
      },
    },
  },
  plugins: [],
};
export default config;
