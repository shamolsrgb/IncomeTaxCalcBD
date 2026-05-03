/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#006A4E',
          light: '#00875E',
          dark: '#00523C',
          50: '#e6f4ef',
          100: '#b3dfd1',
        },
      },
    },
  },
  plugins: [],
};

