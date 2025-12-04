/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // optional — lets you toggle dark mode with a class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}" // include all React sources
  ],
  theme: {
    extend: {
      colors: {
        // add any brand colors you need
        primary: {
          DEFAULT: '#6C4DF5',
        }
      }
    },
  },
  plugins: [],
}

