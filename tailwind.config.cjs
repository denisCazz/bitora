/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DE7800',
          600: '#c56b00',
          700: '#a95f00',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
