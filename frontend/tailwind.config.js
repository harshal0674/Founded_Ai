/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        apple: {
          black: "#000000",
          charcoal: "#080808",
          dark: "#0C0C0E",
          surface: "#121214",
          "surface-elevated": "#18181B",
          "surface-hover": "#222226",
          border: "#232327",
          "border-light": "#33333A",
          blue: "#0071E3",
          "blue-bright": "#0A84FF",
          "blue-hover": "#0077ED",
          text: "#F5F5F7",
          "text-secondary": "#86868B",
          "text-tertiary": "#515154",
          green: "#30D158",
          orange: "#FF9F0A",
          red: "#FF453A",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "SF Pro Text", "Helvetica Neue", "sans-serif"],
        display: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "Courier New", "monospace"],
      },
      borderRadius: {
        "apple-sm": "8px",
        "apple": "12px",
        "apple-lg": "18px",
        "apple-xl": "24px",
        "apple-full": "9999px",
      },
      boxShadow: {
        "apple-card": "0 2px 20px -2px rgba(0, 0, 0, 0.5)",
        "apple-elevated": "0 10px 40px -10px rgba(0, 0, 0, 0.7)",
        "glow-blue": "0 0 60px -15px rgba(10, 132, 255, 0.3)",
        "glow-blue-subtle": "0 0 35px -10px rgba(10, 132, 255, 0.15)",
      },
      backgroundImage: {
        "radial-apple": "radial-gradient(circle at 50% 0%, rgba(10, 132, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
        "radial-glow": "radial-gradient(circle at center, rgba(10, 132, 255, 0.12) 0%, rgba(0, 0, 0, 0) 65%)",
        "gradient-dark": "linear-gradient(180deg, #121214 0%, #080808 100%)",
      },
    },
  },
  plugins: [],
}
