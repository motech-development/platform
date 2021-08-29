const forms = require('@tailwindcss/forms');

module.exports = {
  darkMode: false,
  mode: 'jit',
  plugins: [forms],
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cabin"', 'sans-serif'],
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  variants: {},
};
