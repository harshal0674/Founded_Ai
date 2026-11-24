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
          black: "#FAF8F5",           // Canvas off-white
          charcoal: "#F5F0EB",        // Secondary warm off-white
          dark: "#FFFFFF",            // Clean elevated card surface
          surface: "#FFFFFF",         // Clean elevated card surface
          "surface-elevated": "#FAF6F3",
          "surface-hover": "#FCF8F6",
          border: "#EFE7E4",          // Delicate warm rose-gray border
          "border-light": "#E5DDD9",
          blue: "#B76E79",            // Classic Rose Gold primary
          "blue-bright": "#C5808B",   // Radiant Rose Gold
          "blue-hover": "#9E535E",    // Deep Rose Gold hover
          text: "#1C191A",            // Deep warm charcoal text
          "text-secondary": "#6E6468", // Warm muted text
          "text-tertiary": "#A3979C",  // Soft muted text
          green: "#248A54",           // Forest sage green
          orange: "#C26700",          // Warm amber
          red: "#C73646",             // Soft rose crimson
        },
        rosegold: {
          50: "#FDF5F6",
          100: "#FBECEE",
          200: "#F6D9DE",
          300: "#ECC1C8",
          400: "#DE9FAD",
          500: "#B76E79", // signature rose gold
          600: "#9E535E",
          700: "#83414A",
          800: "#6D363E",
          900: "#5D3137",
        },
        offwhite: {
          50: "#FFFFFF",
          100: "#FDFCFB",
          200: "#FAF8F5", // primary canvas
          300: "#F5F1EC",
          400: "#ECE5DE",
          500: "#DFD6CD",
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
        "apple-card": "0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 16px -2px rgba(183, 110, 121, 0.06)",
        "apple-elevated": "0 8px 30px -4px rgba(183, 110, 121, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        "glow-blue": "0 0 35px -5px rgba(183, 110, 121, 0.3)",
        "glow-blue-subtle": "0 2px 14px -2px rgba(183, 110, 121, 0.18)",
      },
      backgroundImage: {
        "radial-apple": "radial-gradient(circle at 50% 0%, rgba(183, 110, 121, 0.09) 0%, rgba(250, 248, 245, 0) 70%)",
        "radial-glow": "radial-gradient(circle at center, rgba(183, 110, 121, 0.08) 0%, rgba(250, 248, 245, 0) 65%)",
        "gradient-dark": "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
        "gradient-rosegold": "linear-gradient(135deg, #C5808B 0%, #B76E79 50%, #9E535E 100%)",
      },
    },
  },
  plugins: [],
}
