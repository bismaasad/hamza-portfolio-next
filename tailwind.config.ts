import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "monospace"],
        urdu: [
          "var(--font-urdu)",
          "var(--font-arabic)",
          "Noto Nastaliq Urdu",
          "Jameel Noori Nastaleeq",
          "Urdu Typesetting",
          "Noto Naskh Arabic",
          "serif",
        ],
        arabic: [
          "var(--font-arabic)",
          "var(--font-urdu)",
          "Noto Naskh Arabic",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
