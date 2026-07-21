import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Typography } from '../primitives/Typography/Typography';
import { BreezeProvider } from './BreezeProvider';

/**
 * Establishes the locale, direction, messages, routing, portal, and toast
 * environment required by every Breeze component subtree.
 *
 * @summary required environment boundary for every Breeze component
 */
const meta = {
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: [undefined, 'ltr', 'rtl'],
    },
  },
  args: {
    children: <Typography>Provider content</Typography>,
    direction: undefined,
    locale: 'en-GB',
  },
  component: BreezeProvider,
  title: 'Foundation/BreezeProvider',
} satisfies Meta<typeof BreezeProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Uses the required en-GB locale with inferred direction and verifies that the
 * provider stamps matching language and left-to-right attributes on its root.
 *
 * @summary locale-inferred left-to-right provider environment
 */
export const LeftToRight: Story = {
  play: async ({ canvasElement }) => {
    const content = within(canvasElement).getByText('Provider content');

    await expect(content.parentElement).toHaveAttribute('dir', 'ltr');
    await expect(content.parentElement).toHaveAttribute('lang', 'en-GB');
  },
};

/**
 * Overrides direction to right-to-left while retaining English content so
 * locale-sensitive behaviour and layout direction can be configured separately.
 *
 * @summary explicit right-to-left direction with an English locale
 */
export const ExplicitRightToLeft: Story = {
  args: {
    direction: 'rtl',
    locale: 'en-GB',
  },
  play: async ({ canvasElement }) => {
    const content = within(canvasElement).getByText('Provider content');

    await expect(content.parentElement).toHaveAttribute('dir', 'rtl');
    await expect(content.parentElement).toHaveAttribute('lang', 'en-GB');
  },
};
