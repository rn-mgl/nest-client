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
        "accent-yellow": "#c2ff9c",
        "accent-purple": "#524ee5",
        "accent-blue": "#0039c7",
      },
      screens: {
        "m-s": "320px",
        "m-m": "375px",
        "m-l": "425px",
        t: "768px",
        "l-s": "1024px",
        "l-l": "1440px",
      },
      keyframes: {
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%": { transform: "translateY(-1rem)" },
          "100%": { transform: "translateY(1rem)" },
        },
      },
      animation: {
        fade: "fade ease-in-out 150ms",
        float: "float ease-in-out 2s infinite alternate",
      },
    },
  },
  plugins: [],
};
export default config;
