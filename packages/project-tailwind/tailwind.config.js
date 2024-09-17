// eslint-disable-next-line import/no-extraneous-dependencies
const forms = require('@tailwindcss/forms');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [forms],
  theme: {
    extend: {},
    fontFamily: {
      display: ['"Cabin"', 'sans-serif'],
      sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
};
