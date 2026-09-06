/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidienne: {
          DEFAULT: '#0D0D12',
          deep: '#060609',
          surface: '#14141C',
          light: '#1B1B26'
        },
        champagne: {
          DEFAULT: '#C9A84C',
          light: '#DFC478',
          dark: '#9E8033',
          glow: 'rgba(201, 168, 76, 0.25)',
          subtle: 'rgba(201, 168, 76, 0.12)'
        },
        ivoire: {
          DEFAULT: '#FAF8F5',
          muted: '#F0ECE4',
          subtle: '#E5DFD5'
        },
        ardoise: {
          DEFAULT: '#2A2A35',
          light: '#4E4E60',
          muted: '#7A7A90',
          subtle: '#B0B0C2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace']
      },
      borderRadius: {
        '2rem': '2rem',
        '2.5rem': '2.5rem',
        '3rem': '3rem',
        '4rem': '4rem'
      },
      boxShadow: {
        'luxe': '0 20px 40px -15px rgba(0, 0, 0, 0.35)',
        'champagne-glow': '0 0 35px -5px rgba(201, 168, 76, 0.3)',
        'champagne-sm': '0 4px 20px rgba(201, 168, 76, 0.15)',
        'inner-gold': 'inset 0 1px 1px 0 rgba(201, 168, 76, 0.2)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
