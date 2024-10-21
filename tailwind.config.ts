import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        nest: "var(--font-figtree)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "accent-yellow": "#e4f065",
        "accent-purple": "#b8a5ef",
        "accent-blue": "#adffff",
      },
      screens: {
        "m-s": "320px",
        "m-m": "375px",
        "m-l": "425px",
        t: "768px",
        "l-s": "1024px",
        "l-l": "1440px",
      },
    },
  },
  plugins: [],
};
export default config;
