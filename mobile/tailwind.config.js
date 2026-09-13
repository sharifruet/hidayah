/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefbf3',
          100: '#d6f5e1',
          200: '#aeeac8',
          300: '#7adaa9',
          400: '#45c087',
          500: '#22a06d',
          600: '#15805a',
          700: '#12654a',
          800: '#12503d',
          900: '#0f4233',
          950: '#07261d',
        },
        gold: {
          400: '#e0b361',
          500: '#c99a45',
          600: '#a97c33',
        },
        ink: {
          50: '#f6f7f8',
          100: '#eceef1',
          200: '#d5d9e0',
          300: '#adb5c2',
          400: '#7d879a',
          500: '#5b6579',
          600: '#454e60',
          700: '#333a49',
          800: '#20242f',
          900: '#14171f',
          950: '#0a0c11',
        },
      },
      fontFamily: {
        sans: ['Inter'],
        body: ['Inter'],
        'body-medium': ['InterMedium'],
        'body-semibold': ['InterSemiBold'],
        'body-bold': ['InterBold'],
        arabic: ['Amiri'],
        'arabic-bold': ['AmiriBold'],
      },
    },
  },
  plugins: [],
};
