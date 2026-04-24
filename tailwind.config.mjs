/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans TC"', '"Noto Sans"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', '"Noto Serif TC"', 'serif'],
      },
      colors: {
        brand: {
          50:  '#fbf7f1',
          100: '#f3e8d5',
          200: '#e6cfa9',
          300: '#d5b07c',
          400: '#c4925a',
          500: '#a9773f',
          600: '#8a5f33',
          700: '#6b4a2a',
          800: '#4d3521',
          900: '#2f2018',
        },
      },
    },
  },
  plugins: [],
};
