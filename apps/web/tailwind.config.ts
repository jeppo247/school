import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors via CSS custom properties
        theme: {
          primary: "var(--theme-primary)",
          secondary: "var(--theme-secondary)",
          accent: "var(--theme-accent)",
          bg: "var(--theme-bg)",
          surface: "var(--theme-surface)",
        },
        // Upwise brand colors
        upwise: {
          blue: "#4F8CF7",
          green: "#34D399",
          amber: "#FBBF24",
          red: "#F87171",
          purple: "#A78BFA",
          orange: "#FB923C",
        },
        // Mastery traffic light
        mastery: {
          mastered: "#34D399",
          almost: "#FBBF24",
          learning: "#F87171",
          unknown: "#D1D5DB",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      animation: {
        "bounce-in": "bounceIn 0.5s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "streak-flame": "streakFlame 1s ease-in-out infinite",
      },
      keyframes: {
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px var(--theme-primary)" },
          "50%": { boxShadow: "0 0 20px var(--theme-primary)" },
        },
        streakFlame: {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.2)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
