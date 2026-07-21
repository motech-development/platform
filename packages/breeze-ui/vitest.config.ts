import { resolve } from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const storybookBrowsers = ['chromium', 'firefox', 'webkit'] as const;
const configuredStorybookBrowser = process.env.BREEZE_STORYBOOK_BROWSER;
const storybookBrowser =
  storybookBrowsers.find((browser) => browser === configuredStorybookBrowser) ??
  'chromium';

export default defineConfig({
  optimizeDeps: {
    include: [
      'react-aria/PortalProvider',
      'react-aria/private/interactions/PressResponder',
      'react-aria-components/Breadcrumbs',
      'react-aria-components/Button',
      'react-aria-components/Calendar',
      'react-aria-components/Checkbox',
      'react-aria-components/CheckboxGroup',
      'react-aria-components/ComboBox',
      'react-aria-components/DateField',
      'react-aria-components/DatePicker',
      'react-aria-components/DateRangePicker',
      'react-aria-components/Dialog',
      'react-aria-components/DropZone',
      'react-aria-components/Disclosure',
      'react-aria-components/DisclosureGroup',
      'react-aria-components/FileTrigger',
      'react-aria-components/GridList',
      'react-aria-components/ListBox',
      'react-aria-components/Menu',
      'react-aria-components/Modal',
      'react-aria-components/Popover',
      'react-aria-components/ProgressBar',
      'react-aria-components/RadioGroup',
      'react-aria-components/RangeCalendar',
      'react-aria-components/Select',
      'react-aria-components/Slider',
      'react-aria-components/Switch',
      'react-aria-components/TagGroup',
      'react-aria-components/Table',
      'react-aria-components/Tabs',
      'react-aria-components/Heading',
      'react-aria-components/TimeField',
      'react-aria-components/Toast',
      'react-aria-components/Tooltip',
      'react-aria-components/Virtualizer',
    ],
  },
  test: {
    coverage: {
      exclude: ['src/**/*.stories.tsx', 'src/**/*.d.ts', 'src/index.ts'],
      include: ['src/**/*.{ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    projects: [
      {
        plugins: [react()],
        test: {
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          name: 'unit',
          setupFiles: ['./test/setup.ts'],
        },
      },
      {
        plugins: [
          tailwindcss(),
          storybookTest({
            configDir: resolve(import.meta.dirname, '.storybook'),
          }),
        ],
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: storybookBrowser }],
            provider: playwright(),
          },
          // Focus, keyboard, and portalled stories share browser document state.
          fileParallelism: false,
          name: 'storybook',
        },
      },
    ],
  },
});
