import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../Icon/Icon';
import { VisuallyHidden } from './VisuallyHidden';

const meta = {
  component: VisuallyHidden,
  title: 'Content/VisuallyHidden',
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An icon-only native example whose accessible name remains available. */
export const IconLabel: Story = {
  args: {
    children: 'Add transaction',
  },
  render: (args) => (
    <button type="button">
      <Icon name="add" />
      <VisuallyHidden>{args.children}</VisuallyHidden>
    </button>
  ),
};
