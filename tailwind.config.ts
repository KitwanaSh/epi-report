// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F172A",
          dark: "#0B1220",
          light: "#E2E8F0",
          hover: "#1E293B",
        },

        surface: {
          white: "#FFFFFF",
          light: "#F8FAFC",
          border: "#E2E8F0",
        },

        text: {
          primary: "#0F172A",
          muted: "#64748B",
        },

        status: {
          error: "#DC2626",
          "error-light": "#FEE2E2",
          success: "#16A34A",
          "success-light": "#DCFCE7",
        },
      },

      borderRadius: {
        card: "16px",
      },

      boxShadow: {
        card: "0 4px 6px rgba(0,0,0,0.05)",
        "card-md": "0 10px 15px rgba(0,0,0,0.08)",
      },

      fontFamily: {
        serif: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;