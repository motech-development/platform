import { Preview } from '@storybook/react';
import '../src/styles/tailwind.css';

export const tags = ['autodocs'];

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
