import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "international-orange": "#FF4F00",
        "light-gray": "#F5F5F5",
        "border-gray": "#E0E0E0",
        "te-bg-dark": "#111111",
        "te-surface-dark": "#1C1C1C",
        "te-border-dark": "#333333",
        "te-text-main-dark": "#EDEDED",
        "te-text-muted-dark": "#666666",
        "te-accent": "#FF4F00",
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
