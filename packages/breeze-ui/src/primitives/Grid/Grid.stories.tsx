import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Surface } from '../Surface/Surface';
import { Grid } from './Grid';

const meta = {
  component: Grid,
  parameters: {
    chromatic: {
      viewports: [360, 800, 1280],
    },
  },
  render: (args) => (
    <Grid
      align={args.align}
      aria-label="Grid example"
      columns={args.columns}
      gap={args.gap}
    >
      <Surface padding="md">One</Surface>
      <Surface padding="md">Two</Surface>
      <Surface padding="md">Three</Surface>
      <Surface padding="md">Four</Surface>
      <Surface padding="md">Five</Surface>
      <Surface padding="md">Six</Surface>
    </Grid>
  ),
  title: 'Layout/Grid',
} satisfies Meta<typeof Grid>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Progressively increases the column count and spacing across Breeze
 * breakpoints while leaving all six items in one stable source order.
 *
 * @summary responsive column counts and gaps
 */
export const ResponsiveColumns: Story = {
  args: {
    columns: {
      base: 1,
      lg: 6,
      md: 3,
    },
    gap: {
      base: 'sm',
      md: 'md',
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Grid example').children,
    ).toHaveLength(6);
  },
};

/**
 * Uses a two-column form-style layout above the small breakpoint and verifies
 * equal tracks plus natural wrapping for the remaining item.
 *
 * @summary equal form columns with natural row wrapping
 */
export const CanonicalFormColumns: Story = {
  args: {
    columns: {
      base: 1,
      sm: 2,
    },
  },
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByLabelText('Grid example');
    const [first, second, third] = Array.from(grid.children);

    await expect(getComputedStyle(grid).gap).toBe('20px');
    await expect(first.getBoundingClientRect().width).toBeCloseTo(
      second.getBoundingClientRect().width,
      1,
    );
    await expect(third.getBoundingClientRect().top).toBeGreaterThan(
      first.getBoundingClientRect().top,
    );
  },
  render: (args) => (
    <StoryConstraint size="bounded-layout">
      <Grid aria-label="Grid example" columns={args.columns} gap={args.gap}>
        <Surface padding="md">One</Surface>
        <Surface padding="md">Two</Surface>
        <Surface padding="md">Three</Surface>
      </Grid>
    </StoryConstraint>
  ),
};
