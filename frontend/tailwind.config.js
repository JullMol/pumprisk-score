/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Base surfaces — shifted from near-black to charcoal slate
        ink: {
          DEFAULT:     "#0D1117",   // main bg — dark navy charcoal (not pure black)
          surface:     "#161B27",   // elevated surface
          panel:       "#1C2333",   // panels / cards
          hover:       "#1F2940",   // hover state
          border:      "rgba(255, 255, 255, 0.09)",
          borderStrong:"rgba(255, 255, 255, 0.18)",
        },
        text: {
          primary:   "#E2E8F0",    // slightly softer than pure white
          secondary: "#94A3B8",
          muted:     "#4E6380",
        },
        accent: {
          DEFAULT: "#E5C05B",
          hover:   "#F0CE78",
          glow:    "rgba(229, 192, 91, 0.20)",
        },
        cyan: {
          DEFAULT: "#38BDF8",
          glow:    "rgba(56, 189, 248, 0.15)",
        },
        tier: {
          high:          "#FF5757",
          highBg:        "rgba(255, 87, 87, 0.12)",
          medium:        "#F59E0B",
          mediumBg:      "rgba(245, 158, 11, 0.12)",
          watch:         "#EAB308",
          watchBg:       "rgba(234, 179, 8, 0.12)",
          normal:        "#34D399",
          normalBg:      "rgba(52, 211, 153, 0.10)",
          unconfirmed:   "#94A3B8",
          unconfirmedBg: "rgba(148, 163, 184, 0.08)",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body:    ["'IBM Plex Sans'", "system-ui", "-apple-system", "sans-serif"],
        mono:    ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        glass:     "0 4px 24px 0 rgba(0, 0, 0, 0.35), 0 1px 0 0 rgba(255,255,255,0.05) inset",
        glowHigh:  "0 0 28px rgba(255, 87, 87, 0.22)",
        glowAmber: "0 0 28px rgba(245, 158, 11, 0.22)",
        glowGold:  "0 0 28px rgba(229, 192, 91, 0.22)",
        glowCyan:  "0 0 28px rgba(56, 189, 248, 0.20)",
        glowGreen: "0 0 28px rgba(52, 211, 153, 0.18)",
        panel:     "0 2px 16px rgba(0,0,0,0.25)",
      },
      backgroundImage: {
        radialTop:   "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(56,189,248,0.06), transparent)",
        goldAmbient: "radial-gradient(ellipse 50% 30% at 10% 0%, rgba(229,192,91,0.08), transparent)",
      },
    },
  },
  plugins: [],
};
