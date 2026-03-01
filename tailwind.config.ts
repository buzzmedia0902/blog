import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#0a0a0f",
        "dark-card": "#111118",
        "dark-border": "#222235",
        "dark-text": "#f8fafc",
        "dark-muted": "#94a3b8",
        "accent-purple": "#7c3aed",
        "accent-indigo": "#4f46e5",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans JP", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
