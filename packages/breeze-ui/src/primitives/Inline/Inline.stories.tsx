import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Surface } from '../Surface/Surface';
import { Inline } from './Inline';

const meta = {
  argTypes: {
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
  },
  args: {
    align: 'center',
    gap: 'md',
    justify: 'start',
    wrap: true,
  },
  component: Inline,
  render: (args) => (
    <Inline
      align={args.align}
      aria-label="Inline example"
      gap={args.gap}
      justify={args.justify}
      wrap={args.wrap}
    >
      <Surface padding="md">Alpha</Surface>
      <Surface padding="md">Bravo</Surface>
      <Surface padding="md">Charlie</Surface>
      <Surface padding="md">Delta</Surface>
    </Inline>
  ),
  title: 'Layout/Inline',
} satisfies Meta<typeof Inline>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Arranges four related surfaces in a wrapping horizontal flow with controlled
 * alignment, distribution, and responsive spacing props.
 *
 * @summary wrapping inline layout for related content
 */
export const Wrapping: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Inline example'),
    ).toHaveTextContent('AlphaBravoCharlieDelta');
  },
};

/**
 * Distributes safely bounded content across the available inline axis and
 * disables wrapping when the host width is known to be sufficient.
 *
 * @summary non-wrapping space-between distribution
 */
export const Distributed: Story = {
  args: {
    justify: 'between',
    wrap: false,
  },
};
