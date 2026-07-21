import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SegmentedControl } from './SegmentedControl';

const options = [
  { label: 'List', value: 'list' },
  { label: 'Grid', value: 'grid' },
];

/**
 * Presents a short exclusive string choice with controlled, read-only, or
 * uncontrolled state and orientation-aware keyboard behaviour.
 *
 * @summary exclusive compact choice with controlled or uncontrolled state
 */
const meta = {
  component: SegmentedControl,
  title: 'Patterns/Forms/SegmentedControl',
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Starts from an application-provided default display mode, lets the group own
 * subsequent selection, and reports the next semantic string value on change.
 *
 * @summary uncontrolled horizontal mode choice reporting semantic values
 */
export const Uncontrolled: Story = {
  args: {
    'aria-label': 'Display mode',
    defaultValue: 'list',
    onChange: fn(),
    options,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('radio', { name: 'Grid' }));
    await expect(args.onChange).toHaveBeenCalledWith('grid');
  },
};

/**
 * Arranges a short exclusive visibility choice vertically so focus movement
 * and adjacent borders follow the documented vertical orientation.
 *
 * @summary vertically oriented exclusive visibility choice
 */
export const Vertical: Story = {
  args: {
    'aria-label': 'Visibility',
    defaultValue: 'visible',
    options: [
      { label: 'Visible', value: 'visible' },
      { label: 'Hidden', value: 'hidden' },
    ],
    orientation: 'vertical',
  },
};
