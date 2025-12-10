/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cat-blue': '#8CE4FF',
        'cat-yellow': '#ffc22f',
        'cat-orange': '#f58b05',
        'cat-red': '#FF5656',
        'cat-black': '#1a1a1a',
      },
    },
  },
  plugins: [],
}
