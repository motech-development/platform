import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './Separator';

const meta = {
  component: Separator,
  title: 'Content/Separator',
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A divider between vertically stacked regions. */
export const Horizontal: Story = {};

/** A divider between horizontally arranged regions. */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  decorators: [
    (Story) => (
      <div className="breeze-story-separator">
        <Story />
      </div>
    ),
  ],
};
