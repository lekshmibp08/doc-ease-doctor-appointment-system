/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customTeal: '#1C7787', 
        customBgLight: '#B5D3E0',
        customTealLight: '#62A6B2'
      },
    },
  },
  plugins: [],
}