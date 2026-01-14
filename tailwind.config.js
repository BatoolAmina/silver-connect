/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        slate: {
          900: "#0f172a",
          800: "#1e293b",
          400: "#94a3b8",
          50:  "#f8fafc",
        },
        brand: {
          gold: "#D4AF37",
        }
      }
    },
  },
  plugins: [],
};