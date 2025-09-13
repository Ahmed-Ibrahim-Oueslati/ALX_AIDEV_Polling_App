
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-purple': '#8A2BE2',
        'primary-blue': '#007BFF',
        'accent-green': '#39FF14',
        'accent-pink': '#FF1493',
        'gradient-start': '#FF0080',
        'gradient-mid': '#7928CA',
        'gradient-end': '#4F46E5',
        'glow-purple': 'rgba(138, 43, 226, 0.35)',
        'glow-blue': 'rgba(0, 123, 255, 0.35)',
        'glow-green': 'rgba(57, 255, 20, 0.35)',
        'glow-pink': 'rgba(255, 20, 147, 0.35)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      boxShadow: {
        'glow-sm': '0 2px 8px -1px var(--tw-shadow-color)',
        'glow-md': '0 4px 12px -1px var(--tw-shadow-color)',
        'glow-lg': '0 8px 16px -2px var(--tw-shadow-color)',
      },
      animation: {
        'gradient-x': 'gradient-x 10s ease infinite',
        'gradient-y': 'gradient-y 10s ease infinite',
        'gradient-xy': 'gradient-xy 10s ease infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
