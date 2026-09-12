import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge/Badge';
import { Inline } from './Inline';

const meta = {
  args: {
    children: (
      <>
        <Badge>Draft</Badge>
        <Badge variant="positive">Published</Badge>
        <Badge variant="warning">Needs review</Badge>
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
