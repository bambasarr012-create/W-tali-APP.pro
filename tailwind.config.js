/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wetaliBlue: {
          DEFAULT: '#1E3A8A', // Bleu royal
        },
        wetaliGold: {
          DEFAULT: '#D4AF37', // Or/Champagne
        },
        wetaliBlack: {
          DEFAULT: '#0F172A', // Noir profond
        },
        wetaliCream: {
          DEFAULT: '#FFFBF0', // Blanc crème
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 35px -5px rgba(212, 175, 55, 0.4)',
        'gold-sm': '0 4px 20px rgba(212, 175, 55, 0.2)',
      },
    },
  },
  plugins: [],
}
