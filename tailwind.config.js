/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      primary: '#4b50f7',
      blue: '#4b93ff',
      white: '#ffffff',
      black: '#000000',
      gray: '#acacb2',
      'dark-gray': '#717171',
      'soft-black': '#2f2f36',
      'soft-white': '#e7e7eb',
    },
  },
  plugins: [],
};
