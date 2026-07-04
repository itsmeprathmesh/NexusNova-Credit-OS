import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101318",
        muted: "#667085",
        line: "#d9e0ea",
        panel: "#ffffff",
        canvas: "#f5f7fa",
        trust: "#215f7a",
        growth: "#13795b",
        caution: "#b7791f",
        danger: "#b42318"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(16, 19, 24, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
