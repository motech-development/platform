import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Surface } from '../Surface/Surface';
import { Stack } from './Stack';

const meta = {
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'stretch'],
    },
    justify: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'between'],
    },
  },
  args: {
    gap: 'md',
  },
  component: Stack,
  render: (args) => (
    <Stack
      align={args.align}
      aria-label="Stack example"
      gap={args.gap}
      justify={args.justify}
    >
      <Surface padding="md">First</Surface>
      <Surface padding="md">Second</Surface>
      <Surface padding="md">Third</Surface>
    </Stack>
  ),
  title: 'Layout/Stack',
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Arranges three related surfaces in the canonical stretched vertical flow
 * and verifies that authored child order remains unchanged.
 *
 * @summary default vertical stack with stable source order
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Stack example').children,
    ).toHaveLength(3);
  },
};

/**
 * Increases only the inter-item spacing at the medium breakpoint while the
 * content order, alignment, and semantics remain constant.
 *
 * @summary breakpoint-responsive vertical spacing
 */
export const ResponsiveGap: Story = {
  args: {
    gap: {
      base: 'sm',
      md: 'xl',
    },
  },
};
