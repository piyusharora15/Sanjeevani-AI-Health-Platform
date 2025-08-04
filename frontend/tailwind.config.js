/** @type {import('tailwindcss').Config} */
export default { // Use "export default"
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        slideInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        slideInUp: 'slideInUp 0.7s ease-out forwards',
        slideInLeft: 'slideInLeft 0.7s ease-out forwards',
        fadeIn: 'fadeIn 1s ease-in-out forwards',
        zoomIn: 'zoomIn 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
}