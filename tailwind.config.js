/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#061E30',
          900: '#0B3C5D',
          800: '#0F4E7A',
          700: '#135B8E',
          600: '#1A6FA8',
          200: '#A8CBE8',
          100: '#D6E8F5',
          50:  '#EBF4FB',
        },
        teal: {
          700: '#0A7A70',
          600: '#0D9488',
          500: '#14B8A6',
          400: '#2DD4BF',
          100: '#CCFBF1',
          50:  '#F0FDFA',
        },
        surface: '#F7F9FB',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter:   ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 2px 16px rgba(11, 60, 93, 0.07)',
        'card-hover': '0 10px 40px rgba(11, 60, 93, 0.14)',
        soft:       '0 1px 8px rgba(0,0,0,0.05)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(120deg, rgba(6,30,48,0.92) 0%, rgba(11,60,93,0.70) 60%, rgba(13,148,136,0.30) 100%)',
        'section-gradient': 'linear-gradient(135deg, #0B3C5D 0%, #0D9488 100%)',
      },
    },
  },
  plugins: [],
};
