/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0B0B0B',
          charcoal: '#171717',
          offwhite: '#F5F3EE',
          ivory: '#FAF9F6',
          gold: '#B89B5E',
          'gold-light': '#D6C49B',
          'gold-subtle': 'rgba(184, 155, 94, 0.12)',
          stone: '#8A8780',
          lightgrey: '#E5E3DE',
          surface: '#FDFBF7',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.25em',
        'subtle': '0.12em',
        'wide-editorial': '0.18em',
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(11, 11, 11, 0.07)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        'modal': '0 25px 50px -12px rgba(11, 11, 11, 0.25)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-left': 'slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
