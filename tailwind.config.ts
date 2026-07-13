import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "system-ui", "-apple-system", "Segoe UI", "sans-serif"]
      },
      colors: {
        ink: "#FFFFFF",
        muted: "#A7B3AE",
        line: "rgba(255,255,255,0.08)",
        panel: "#121F1A",
        canvas: "#070A09",
        surface: "#0E1714",
        trust: "#D8FF3E",
        "trust-light": "rgba(216,255,62,0.10)",
        "trust-mid": "rgba(216,255,62,0.25)",
        growth: "#38D9C8",
        "growth-light": "rgba(56,217,200,0.10)",
        caution: "#FFC857",
        "caution-light": "rgba(255,200,87,0.10)",
        danger: "#FF6B6B",
        "danger-light": "rgba(255,107,107,0.10)",
        success: "#7CFFB2",
        "success-light": "rgba(124,255,178,0.10)",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
      },
      boxShadow: {
        soft: "0 14px 40px rgba(0,0,0,0.3)",
        card: "0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.3)",
        elevated: "0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)",
        panel: "0 1px 2px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.04)",
        glass: "0 8px 32px rgba(0,0,0,0.25)",
        glow: "0 0 24px rgba(216,255,62,0.12)",
        "glow-teal": "0 0 24px rgba(56,217,200,0.10)",
      },
      backdropBlur: {
        glass: "24px",
        xs: "4px",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-down": { from: { opacity: "0", transform: "translateY(-4px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { from: { opacity: "0", transform: "scale(0.96)" }, to: { opacity: "1", transform: "scale(1)" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        "gradient-x": { "0%, 100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        pulse: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.5" } },
        glow: { "0%, 100%": { boxShadow: "0 0 20px rgba(216,255,62,0.1)" }, "50%": { boxShadow: "0 0 30px rgba(216,255,62,0.2)" } },
      },
      animation: {
        "fade-in": "fade-in 0.25s cubic-bezier(0.23,1,0.32,1)",
        "slide-up": "slide-up 0.25s cubic-bezier(0.23,1,0.32,1)",
        "slide-down": "slide-down 0.2s cubic-bezier(0.23,1,0.32,1)",
        "scale-in": "scale-in 0.2s cubic-bezier(0.23,1,0.32,1)",
        shimmer: "shimmer 1.5s cubic-bezier(0.77,0,0.175,1) infinite",
        float: "float 4s cubic-bezier(0.77,0,0.175,1) infinite",
        "gradient-x": "gradient-x 8s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.77,0,0.175,1) infinite",
        glow: "glow 3s cubic-bezier(0.77,0,0.175,1) infinite",
      }
    }
  },
  plugins: []
};

export default config;
