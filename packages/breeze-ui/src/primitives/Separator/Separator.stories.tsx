import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';
import { Separator } from './Separator';

const meta = {
  component: Separator,
  title: 'Content/Separator',
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A divider between vertically stacked regions. */
export const Horizontal: Story = {};

/** A divider that stretches to the height of an auto-height `Inline` row. */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  play: async ({ canvasElement }) => {
    const separator = canvasElement.querySelector('hr');
    const row = separator?.parentElement;

    if (!separator || !row) throw new Error('Missing vertical separator row.');

    const rowHeight = row.getBoundingClientRect().height;

    await expect(rowHeight).toBeGreaterThan(0);
    await expect(
      Math.abs(separator.getBoundingClientRect().height - rowHeight),
    ).toBeLessThan(1);
  },
  render: (args) => (
    <Inline gap={4}>
      <Stack gap={1}>
        <Typography tone="muted" variant="caption">
          Balance
        </Typography>
        <Typography element="span" variant="title">
          £24,180.50
        </Typography>
      </Stack>
      <Separator orientation={args.orientation} />
      <Stack gap={1}>
        <Typography tone="muted" variant="caption">
          VAT owed
        </Typography>
        <Typography element="span" variant="title">
          £3,120.00
        </Typography>
      </Stack>
    </Inline>
  ),
};
