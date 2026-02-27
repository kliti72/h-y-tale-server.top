/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Cinzel Decorative", "Cinzel", "serif"],
        serif:   ["IM Fell English", "Georgia", "serif"],
        mono:    ["Fira Code", "Courier New", "monospace"],
      },
      colors: {
        stone: {
          950: "#0c0a09",
          900: "#1c1917",
          800: "#292524",
          700: "#44403c",
          600: "#57534e",
          500: "#78716c",
          400: "#a8a29e",
          300: "#d6d3d1",
        },
        amber: {
          950: "#1c0f00",
          900: "#451a03",
          800: "#78350f",
          700: "#92400e",
          600: "#b45309",
          500: "#d97706",
          400: "#f59e0b",
          300: "#fcd34d",
        },
      },
      backgroundImage: {
        "stone-texture": "linear-gradient(180deg, #0c0a09 0%, #0e0b09 50%, #0c0a09 100%)",
        "amber-glow": "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(120,53,15,0.12) 0%, transparent 70%)",
        "divider": "linear-gradient(90deg, transparent, #78350f 30%, #78350f 70%, transparent)",
      },
      boxShadow: {
        "stone":    "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(120,53,15,0.08)",
        "amber":    "0 0 20px rgba(120,53,15,0.3)",
        "amber-lg": "0 0 40px rgba(120,53,15,0.4)",
        "inset-amber": "inset 0 0 20px rgba(120,53,15,0.06)",
      },
      borderColor: {
        DEFAULT: "#44403c",
      },
      animation: {
        "flicker":     "flicker 4s ease-in-out infinite",
        "pulse-amber": "pulseAmber 2s ease-in-out infinite",
        "slide-in":    "slideIn 0.25s ease forwards",
        "page-in":     "pageIn 0.3s ease forwards",
        "fade-in":     "fadeIn 0.4s ease forwards",
      },
      keyframes: {
        flicker: {
          "0%,100%": { opacity: "1" },
          "88%":     { opacity: "1" },
          "90%":     { opacity: "0.6" },
          "92%":     { opacity: "1" },
          "95%":     { opacity: "0.7" },
          "97%":     { opacity: "1" },
        },
        pulseAmber: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0.5" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        pageIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
      typography: (theme: (arg0: string) => any) => ({
        stone: {
          css: {
            "--tw-prose-body":    theme("colors.stone.400"),
            "--tw-prose-headings": theme("colors.amber.500"),
            "--tw-prose-bold":    theme("colors.amber.400"),
            "--tw-prose-links":   theme("colors.amber.700"),
            "--tw-prose-code":    theme("colors.amber.500"),
            "--tw-prose-quotes":  theme("colors.stone.500"),
            "--tw-prose-hr":      theme("colors.stone.800"),
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};