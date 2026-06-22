import type { Config } from "tailwindcss"

export default {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class", // or 'media' or false; we use class for future whitelabel scoping
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-raised": "rgb(var(--surface-raised) / <alpha-value>)",
        "surface-sunken": "rgb(var(--surface-sunken) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        "text-primary": "rgb(var(--text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
        "text-muted": "rgb(var(--text-muted) / <alpha-value>)",
        "text-dim": "rgb(var(--text-dim) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        "brand-primary": "rgb(var(--brand-primary) / <alpha-value>)",
        "brand-secondary": "rgb(var(--brand-secondary) / <alpha-value>)",
        accent: "rgb(var(--brand-secondary) / <alpha-value>)", // alias for brand-secondary
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        error: "rgb(var(--error) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  safelist: [
    // Temporary safelist for dynamic classes until whitelabel theme engine is built (Phase 4)
    {
      pattern: /(bg|text|border|shadow|ring)-(orange|blue|emerald|amber|red|zinc|indigo)-(400|500|600)/,
      variants: ["hover", "md", "lg"],
    },
    {
      pattern: /(bg|text|border|shadow|ring)-(orange|blue|emerald|amber|red|zinc|indigo)-(400|500|600)\/(10|20)/,
      variants: ["hover", "md", "lg"],
    },
    {
      pattern: /shrink-(0|1|2|3|4|5|6|7|8|9|10)/,
    },
    {
      pattern: /min-w-\[.*\]/,
    },
    {
      pattern: /scale-(100|105|110|125|150)/,
    },
    {
      pattern: /md:shrink-(0|1|2|3|4|5|6|7|8|9|10)/,
    },
    // TODO: Remove this safelist in Phase 4 when whitelabel theme engine is implemented
  ],
  plugins: [
    require("tailwindcss-animate")
  ],
} as Config