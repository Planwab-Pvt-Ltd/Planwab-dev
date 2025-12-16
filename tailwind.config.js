/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
    },

    extend: {
      /* -----------------------------
       * COLORS
       * ----------------------------- */
      colors: {
        /* Primary (Blue) */
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // main
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },

        /* Secondary (Yellow) */
        secondary: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308", // main
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },

        /* UI Neutrals */
        background: "#f9fafb",
        foreground: "#111827",
        muted: "#6b7280",
        border: "#e5e7eb",

        /* Status */
        success: "#16a34a",
        warning: "#f59e0b",
        error: "#dc2626",
        info: "#0284c7",
      },

      /* -----------------------------
       * TYPOGRAPHY
       * ----------------------------- */
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      /* -----------------------------
       * BORDER RADIUS
       * ----------------------------- */
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },

      /* -----------------------------
       * SHADOWS
       * ----------------------------- */
      boxShadow: {
        soft: "0 10px 25px -10px rgba(0,0,0,0.1)",
        card: "0 8px 30px rgba(0,0,0,0.08)",
        glow: "0 0 20px rgba(59,130,246,0.35)",
      },

      /* -----------------------------
       * KEYFRAMES
       * ----------------------------- */
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },

        /* Your shimmer animation */
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },

      /* -----------------------------
       * ANIMATIONS
       * ----------------------------- */
      animation: {
        fade: "fadeIn 0.4s ease-out",
        slide: "slideUp 0.6s ease-out",
        scale: "scaleIn 0.3s ease-out",
        shimmer: "shimmer 1.5s infinite linear",
      },

      /* -----------------------------
       * SPACING
       * ----------------------------- */
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-animate"),
  ],
};
