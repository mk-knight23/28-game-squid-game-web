/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        squid: {
          pink: '#ed1b76',
          cyan: '#037a76',
          bg: '#1a1a1a',
          dead: '#ef4444',
          alive: '#10b981',
          dark: '#0a0a0f',
          light: '#f8fafc',
        }
      },
      fontFamily: {
        game: ['"Press Start 2P"', 'system-ui'],
        display: ['system-ui', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00f5ff, 0 0 10px #00f5ff' },
          '100%': { boxShadow: '0 0 20px #00f5ff, 0 0 30px #00f5ff' },
        },
      },
      boxShadow: {
        'glow-pink': '0 0 20px rgba(255, 0, 85, 0.5)',
        'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.5)',
      },
    },
  },
  plugins: [],
}
