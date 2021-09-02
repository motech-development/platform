const forms = require('@tailwindcss/forms');
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: false,
  mode: 'jit',
  plugins: [
    forms,
    plugin(({ addVariant, e }) => {
      addVariant('webkit-progress-bar', ({ modifySelectors, separator }) => {
        modifySelectors(
          ({ className }) =>
            `.${e(
              `webkit-progress-bar${separator}${className}`,
            )}::-webkit-progress-bar`,
        );
      });

      addVariant('webkit-progress-value', ({ modifySelectors, separator }) => {
        modifySelectors(
          ({ className }) =>
            `.${e(
              `webkit-progress-value${separator}${className}`,
            )}::-webkit-progress-value`,
        );
      });

      addVariant('moz-progress-bar', ({ modifySelectors, separator }) => {
        modifySelectors(
          ({ className }) =>
            `.${e(
              `moz-progress-bar${separator}${className}`,
            )}::-moz-progress-bar`,
        );
      });
    }),
  ],
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
