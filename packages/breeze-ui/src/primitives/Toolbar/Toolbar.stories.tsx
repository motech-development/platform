import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DeleteIcon, EditIcon } from '../../icons';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Toolbar } from './Toolbar';

const meta = {
  component: Toolbar,
  title: 'Actions/Toolbar',
} satisfies Meta<typeof Toolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Groups text and icon actions beneath one toolbar label and verifies ArrowRight
 * moves focus between enabled controls on the horizontal axis.
 *
 * @summary horizontal mixed-action toolbar with arrow navigation
 */
export const Horizontal: Story = {
  args: {
    'aria-label': 'Item actions',
    children: (
      <>
        <Button>Edit details</Button>
        <IconButton aria-label="Edit">
          <EditIcon />
        </IconButton>
        <IconButton aria-label="Delete" variant="danger">
          <DeleteIcon />
        </IconButton>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('button', { name: 'Edit details' });
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Edit' })).toHaveFocus();
  },
};
/**
 * Stacks two related actions along the vertical navigation axis so ArrowUp and
 * ArrowDown behavior and full-width placement can be evaluated.
 *
 * @summary vertical toolbar for related movement actions
 */
export const Vertical: Story = {
  args: {
    'aria-label': 'Vertical actions',
    children: (
      <>
        <Button>Move up</Button>
        <Button>Move down</Button>
      </>
    ),
    orientation: 'vertical',
  },
};
