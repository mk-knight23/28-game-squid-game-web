/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        squid: {
          pink: '#ed1b76',
          cyan: '#037a76',
          bg: '#1a1a1a',
          dead: '#ef4444',
          alive: '#10b981'
        }
      },
      fontFamily: {
        game: ['"Press Start 2P"', 'system-ui'],
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
