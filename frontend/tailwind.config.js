/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        "paper-2": "var(--color-paper-2)",
        "paper-3": "var(--color-paper-3)",
        ink: "var(--color-ink)",
        "ink-2": "var(--color-ink-2)",
        muted: "var(--color-muted)",
        rule: "var(--color-rule)",
        "rule-2": "var(--color-rule-2)",
        graphite: "var(--color-graphite)",
        "graphite-2": "var(--color-graphite-2)",
        "graphite-ink": "var(--color-graphite-ink)",
        "graphite-muted": "var(--color-graphite-muted)",
        accent: "var(--color-accent)",
        "accent-2": "var(--color-accent-2)",
        "accent-wash": "var(--color-accent-wash)",
        "accent-ink": "var(--color-accent-ink)",
        "accent-deep": "var(--color-accent-deep)",
        "key-face": "var(--color-key-face)",
        "key-edge": "var(--color-key-edge)",
        danger: "var(--color-error)",
        success: "var(--color-success)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-outlier)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        input: "var(--radius-input)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        key: "var(--shadow-key)",
        "key-accent": "var(--shadow-key-accent)",
        "key-press": "var(--shadow-key-press)",
      }
    },
  },
  plugins: [],
}
