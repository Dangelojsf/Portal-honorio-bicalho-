import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./api/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      boxShadow: {
        soft: "0 20px 60px rgba(19, 75, 50, 0.12)",
        float: "0 15px 45px rgba(31, 111, 74, 0.18)"
      },
      backgroundImage: {
        "paper-grid":
          "linear-gradient(rgba(31, 111, 74, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(31, 111, 74, 0.06) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(circle at top left, rgba(245, 158, 11, 0.22), transparent 38%), radial-gradient(circle at bottom right, rgba(31, 111, 74, 0.18), transparent 30%)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        "fade-up": "fade-up 700ms ease forwards",
        shimmer: "shimmer 3s linear infinite"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;

export default config;
