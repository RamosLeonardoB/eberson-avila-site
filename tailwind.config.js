/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#1d1d1d",
        "charcoal-light": "#2a2a2a",
        brand: {
          DEFAULT: "#c05454",
          light: "#d47a7a",
          dark: "#9a4141",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Roboto",
          "sans-serif",
        ],
      },
      letterSpacing: {
        widest25: "0.25em",
      },
    },
  },
  plugins: [],
};
