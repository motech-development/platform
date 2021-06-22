const {
  default: palette,
} = require('tailwindcss/lib/util/flattenColorPalette');
const plugin = require('tailwindcss/plugin');

module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        black: '#161616',
        danger: '#c7384f',
        primary: {
          DEFAULT: '#007fa8',
          dark: '#005875',
        },
        secondary: '#f6f9fc',
        success: '#00805d',
      },
      transformOrigin: {
        0: '0%',
      },
      zIndex: {
        '-1': '-1',
      },
    },
    fontFamily: {
      display: ['"Cabin"', 'sans-serif'],
      sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
  variants: {
    borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
    extend: {},
  },
  plugins: [
    plugin(({ addComponents, addUtilities, e, theme, variants }) => {
      addComponents({
        input: {
          '&::placeholder': {
            '@apply text-white': {},
          },
          '&:focus-within': {
            '&::placeholder': {
              '@apply text-gray-400': {},
            },
            '~ label': {
              '@apply text-blue-500 transform scale-75 translate-y-0.5 z-0 ml-3.5 px-1 py-0':
                {},
            },
          },
          '&:not(:placeholder-shown)': {
            '~ label': {
              '@apply text-blue-500 transform scale-75 translate-y-0.5 z-0 ml-3.5 px-1 py-0':
                {},
            },
          },
        },
      });

      const colours = palette(theme('borderColor'));

      const colourMap = Object.keys(colours)
        .filter((colour) => colour !== 'default')
        .map((colour) => ({
          [`.border-t-${colour}`]: { borderTopColor: colours[colour] },
          [`.border-r-${colour}`]: { borderRightColor: colours[colour] },
          [`.border-b-${colour}`]: { borderBottomColor: colours[colour] },
          [`.border-l-${colour}`]: { borderLeftColor: colours[colour] },
        }));
      const utilities = {
        ...colourMap,
      };

      addUtilities(utilities, variants('borderColor'));
    }),
  ],
};
