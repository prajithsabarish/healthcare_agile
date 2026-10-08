/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'healthcare-blue': '#0A66C2',
        'healthcare-teal': '#0097A7',
        'healthcare-dark': '#0F172A',
        'healthcare-light': '#F8FAFC',
      }
    },
  },
  plugins: [],
}
