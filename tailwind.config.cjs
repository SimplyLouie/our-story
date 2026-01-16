/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#d4af37',
        champagne: '#f7e7ce',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        'serif-sc': ['Playfair Display SC', 'serif'],
        body: ['Lato', 'sans-serif'],
        cursive: ['Great Vibes', 'cursive'],
      },
    },
  },
  plugins: [],
}
