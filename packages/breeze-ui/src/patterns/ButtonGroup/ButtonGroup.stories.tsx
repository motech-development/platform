import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../primitives/Button/Button';
import { ButtonGroup } from './ButtonGroup';

const meta = {
  component: ButtonGroup,
  title: 'Patterns/Actions/ButtonGroup',
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Places the primary action first in compact visual flow, then restores the
 * canonical secondary-before-primary row from the small breakpoint upward.
 *
 * @summary responsive action ordering from compact stack to wide row
 */
export const Responsive: Story = {
  args: {
    'aria-label': 'Example actions',
    children: (
      <>
        <Button appearance="outline" variant="secondary">
          Cancel
        </Button>
        <Button>Save changes</Button>
      </>
    ),
    orientation: { base: 'verticalReverse', sm: 'horizontal' },
  },
};
