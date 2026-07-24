/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0705',
          900: '#120c08',
          800: '#1c130d',
          700: '#2a1d12',
          600: '#3a2918',
        },
        gold: {
          50: '#fbf6ec',
          100: '#f7ecd4',
          200: '#efd8a8',
          300: '#e6c078',
          400: '#dca94a',
          500: '#c89332',
          600: '#a87528',
          700: '#835a20',
          800: '#5e411a',
          900: '#3d2b13',
        },
        cream: {
          50: '#fdfbf7',
          100: '#faf4e8',
          200: '#f4e8d0',
          300: '#ecd9b2',
          400: '#e0c490',
        },
        cocoa: {
          400: '#8a6a4a',
          500: '#6b4f35',
          600: '#523d28',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in': 'fade-in 0.6s ease forwards',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
