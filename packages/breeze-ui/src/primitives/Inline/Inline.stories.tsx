import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge/Badge';
import { Inline } from './Inline';

const meta = {
  args: {
    children: (
      <>
        <Badge>Draft</Badge>
        <Badge variant="positive">Paid</Badge>
        <Badge variant="warning">No receipt</Badge>
      </>
    ),
  },
  component: Inline,
  title: 'Layout/Inline',
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A horizontal row using the default three-token gap. */
export const Default: Story = {};

/** A row whose items wrap rather than overflow. */
export const Wrapped: Story = {
  args: {
    gap: 2,
    wrap: true,
  },
};

/** Replaces the row's content while data is loading. */
export const Loading: Story = {
  args: { loading: true },
};
