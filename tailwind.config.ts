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
        "brand":        "#0B3B3C",
        "brand-deep":   "#062A2B",
        "brand-soft":   "#0F4F4A",
        "accent":       "#2DD4BF",
        "accent-hover": "#14B8A6",
        "accent-text":  "#0F766E",
        "hero-bg":      "#062A2B",
        "trust-bg":     "#F4F8F7",
      },
    },
  },
  plugins: [],
};
export default config;
