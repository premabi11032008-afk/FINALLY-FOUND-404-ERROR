/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          dark: '#0f172a',
          darker: '#020617',
          green: '#10b981',
          light: '#34d399',
        }
      }
    },
  },
  plugins: [],
}
