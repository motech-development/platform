import type { Preview } from '@storybook/react-vite';
import type { Appearance } from '../src/provider/BreezeContext';
import { BreezeProvider } from '../src/provider/BreezeProvider';
import '../src/styles/reset.css';
import '../src/styles/styles.css';
import './preview.css';

function getAppearance(value: unknown): Appearance {
  if (value === 'dark' || value === 'light') {
    return value;
  }

  return 'automatic';
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const appearance = getAppearance(context.globals.appearance);

      return (
        <BreezeProvider
          defaultAppearance={appearance}
          key={appearance}
          locale="en-GB"
        >
          <Story />
        </BreezeProvider>
      );
    },
  ],
  globalTypes: {
    appearance: {
      description: 'Breeze appearance preference',
      toolbar: {
        icon: 'paintbrush',
        items: [
          {
            title: 'Light',
            value: 'light',
          },
          {
            title: 'Auto',
            value: 'automatic',
          },
          {
            title: 'Dark',
            value: 'dark',
          },
        ],
      },
    },
  },
  initialGlobals: {
    appearance: 'automatic',
  },
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
