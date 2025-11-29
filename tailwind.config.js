/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep gray backgrounds for dark mode
        'dark-bg': '#1a1a1a',
        'dark-surface': '#2d2d2d',
        'dark-border': '#404040',
        // Emergency red (reserved exclusively for alerts)
        'emergency': '#dc2626',
      },
    },
  },
  plugins: [],
}
