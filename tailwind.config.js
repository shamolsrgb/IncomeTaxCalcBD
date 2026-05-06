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
          200: '#80c9b3',
          600: '#005a42',
          700: '#004a36',
        },
        // Dark theme palette
        dark: {
          bg: '#0F1828',
          card: '#172035',
          border: '#1E2D47',
          muted: '#253A5E',
          text: '#94A3B8',
        },
        lime: {
          DEFAULT: '#BBFF47',
          dark: '#A3E83B',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          subtle: '#f1f5f9',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'card-md': '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)',
        'card-lg': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)',
        'header': '0 1px 0 0 #e2e8f0',
        'dark-card': '0 4px 20px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
};
