/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFAF0',
          100: '#FAF6E1',
          200: '#F5EFC6', // Primary Transparent Yellow
          300: '#EDE2A5',
          400: '#E4D383',
          DEFAULT: '#F5EFC6',
        },
        sceptre: {
          light: '#7A1C23',
          DEFAULT: '#4D0E12', // Sceptre Red
          dark: '#38090C',
        },
        cerulean: {
          light: '#C2D4E8',
          DEFAULT: '#A5BCD6', // Cerulean Blue
          dark: '#85A2C4',
        },
        softBlue: {
          DEFAULT: '#A0BEDA', // Additional Blue
          light: '#BBD3E7',
        },
        soil: {
          light: '#654038',
          DEFAULT: '#4A2E27', // Potting Soil
          dark: '#3D2520',
        },
        java: {
          light: '#362622',
          DEFAULT: '#231815', // Java Brown
          dark: '#17100E',
        },
        darkBrown: {
          DEFAULT: '#34211B', // Additional Dark Brown
          dark: '#261713',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(74, 46, 39, 0.08)',
        'warm': '0 8px 30px -4px rgba(77, 14, 18, 0.12)',
        'lift': '0 12px 32px -4px rgba(35, 24, 21, 0.15)',
        'glow-red': '0 0 20px -2px rgba(77, 14, 18, 0.35)',
        'glow-blue': '0 0 20px -2px rgba(165, 188, 214, 0.5)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'sweep': 'sweep 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(200%) rotate(45deg)' },
        }
      }
    },
  },
  plugins: [],
}
