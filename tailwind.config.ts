import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"]
      },
      colors: {
        ink: "#101318",
        muted: "#667085",
        line: "#d9e0ea",
        panel: "#ffffff",
        canvas: "#f5f7fa",
        trust: "#215f7a",
        "trust-light": "#eef5f8",
        growth: "#13795b",
        "growth-light": "#e8f4ef",
        caution: "#b7791f",
        "caution-light": "#fdf4e0",
        danger: "#b42318",
        "danger-light": "#fdeeea"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(16, 19, 24, 0.08)",
        card: "0 1px 3px rgba(16, 19, 24, 0.04), 0 1px 2px rgba(16, 19, 24, 0.06)",
        elevated: "0 4px 16px rgba(16, 19, 24, 0.08)",
        panel: "0 1px 2px rgba(16, 19, 24, 0.04), 0 0 0 1px rgba(16, 19, 24, 0.04)"
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-down": { from: { opacity: "0", transform: "translateY(-4px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { from: { opacity: "0", transform: "scale(0.96)" }, to: { opacity: "1", transform: "scale(1)" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.35s ease-out",
        "slide-down": "slide-down 0.25s ease-out",
        "scale-in": "scale-in 0.25s ease-out",
        shimmer: "shimmer 1.5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
