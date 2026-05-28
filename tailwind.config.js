/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          DEFAULT: '#F5E6C8',
          light: '#FAF0DA',
          deep: '#E8D2A0',
        },
        ocean: {
          DEFAULT: '#2B6B8C',
          deep: '#1A4A66',
          light: '#6FA8C2',
        },
        sunset: {
          DEFAULT: '#E87A4A',
          deep: '#C95A2E',
        },
        coral: '#F4A776',
        cream: '#FFF8EC',
        ink: {
          DEFAULT: '#1F2D38',
          soft: '#4A5763',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
    },
  },
  plugins: [],
}
