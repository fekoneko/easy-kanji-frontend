/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      primary: '#4b50f7',
      blue: '#4b93ff',
      red: '#ff4b93',
      white: '#ffffff',
      black: '#000000',
      gray: '#acacb2',
      'dark-gray': '#717180',
      'soft-black': '#2f2f36',
      'softer-black': '#454550',
      'soft-white': '#e7e7f0',
    },
  },
  plugins: [],
};
