/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#EEF2F7',
          100: '#D7E0EC',
          400: '#2C5282',
          600: '#163A63',
          700: '#0F2D50',
          800: '#0B2545',
          900: '#071A33',
        },
        teal: {
          50: '#EAFBF6',
          100: '#CFF5EA',
          400: '#1FB894',
          500: '#12967A',
          600: '#0E7C64',
          700: '#0B6350',
        },
        surface: '#F6F8F7',
        line: '#E3E9E6',
        ink: {
          700: '#33403D',
          500: '#5B6663',
          400: '#7C8683',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,37,69,0.04), 0 8px 24px -12px rgba(11,37,69,0.12)',
        raised: '0 12px 32px -12px rgba(11,37,69,0.24)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
