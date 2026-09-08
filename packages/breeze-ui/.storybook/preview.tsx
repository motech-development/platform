import type { Preview } from '@storybook/react-vite';
import { BreezeProvider } from '../src/provider/BreezeProvider';
import '../src/styles/reset.css';
import '../src/styles/styles.css';
import './preview.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <BreezeProvider locale="en-GB">
        <Story />
      </BreezeProvider>
    ),
  ],
  parameters: {
    a11y: {
      test: 'error',
    },
    backgrounds: {
      default: 'canvas',
      values: [
        {
          name: 'canvas',
          value: '#f6f9fc',
        },
        {
          name: 'surface',
          value: '#ffffff',
        },
      ],
    },
    controls: {
      expanded: true,
    },
    docs: {
      source: {
        type: 'dynamic',
      },
    },
    jsx: {
      functionValue: () => '() => {}',
    },
  },
};

export default preview;
