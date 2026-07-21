import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AddIcon, CloseIcon, DeleteIcon, SettingsIcon } from '../../icons';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { TextField } from '../TextField/TextField';
import { IconButton } from './IconButton';

const meta = {
  component: IconButton,
  title: 'Actions/IconButton',
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Activates an icon-only add action and verifies that its semantic callback is
 * invoked once through the button's required accessible name.
 *
 * @summary labelled icon-button activation
 */
export const Activation: Story = {
  args: { 'aria-label': 'Add item', children: <AddIcon />, onAction: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Add item' }),
    );
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
};
/**
 * Compares canonical square sizes and uses solid danger emphasis for a
 * destructive action without changing the decorative status of its icon.
 *
 * @summary icon-button sizes and semantic emphasis
 */
export const SizesAndEmphasis: Story = {
  args: { 'aria-label': 'Settings', children: <SettingsIcon /> },
  render: () => (
    <Inline gap="compact" wrap={false}>
      <IconButton aria-label="Settings small" size="sm">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="Settings">
        <SettingsIcon />
      </IconButton>
      <IconButton
        aria-label="Delete"
        appearance="solid"
        size="lg"
        variant="danger"
      >
        <DeleteIcon />
      </IconButton>
    </Inline>
  ),
};
/**
 * Compares disabled and loading icon actions so unavailable and in-progress
 * behavior remain accessible without replacing the button's name.
 *
 * @summary disabled and loading icon-button states
 */
export const States: Story = {
  args: { 'aria-label': 'Settings', children: <SettingsIcon /> },
  render: () => (
    <Inline align="stretch" gap="compact" wrap={false}>
      <IconButton aria-label="Disabled settings" disabled>
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="Loading settings" loading>
        <SettingsIcon />
      </IconButton>
    </Inline>
  ),
};
/**
 * Uses a subtle danger treatment for removal and verifies the minimum target,
 * semantic surface colour, and visible keyboard focus indicator.
 *
 * @summary subtle danger removal action and focus treatment
 */
export const SemanticRemove: Story = {
  args: {
    appearance: 'subtle',
    'aria-label': 'Remove category',
    children: <CloseIcon />,
    variant: 'danger',
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Remove category',
    });
    const defaultStyle = getComputedStyle(button);

    await expect(Number.parseFloat(defaultStyle.width)).toBeGreaterThanOrEqual(
      44,
    );
    await expect(Number.parseFloat(defaultStyle.height)).toBeGreaterThanOrEqual(
      44,
    );
    await expect(defaultStyle.borderWidth).toBe('0px');
    await expect(defaultStyle.backgroundColor).toBe('rgb(251, 234, 236)');
    await userEvent.tab();
    await expect(button).toHaveFocus();
    const focusedStyle = getComputedStyle(button);

    await expect(focusedStyle.outlineStyle).toBe('solid');
    await expect(focusedStyle.outlineWidth).toBe('2px');
    await expect(focusedStyle.outlineColor).toBe('rgb(79, 134, 255)');
    await expect(focusedStyle.outlineOffset).toBe('2px');
  },
};
/**
 * Demonstrates the deliberately bounded native button and submit types inside
 * a form while leaving form submission behavior application-owned.
 *
 * @summary safe native button and submit behavior
 */
export const NativeFormBehaviors: Story = {
  args: { 'aria-label': 'Button', children: <SettingsIcon /> },
  render: () => (
    <form onSubmit={(event) => event.preventDefault()}>
      <Stack gap="compact">
        <TextField.Root defaultValue="Initial value">
          <TextField.Label>Example value</TextField.Label>
          <TextField.Input />
        </TextField.Root>
        <Inline gap="compact">
          <IconButton aria-label="Button" type="button">
            <SettingsIcon />
          </IconButton>
          <IconButton aria-label="Submit" type="submit">
            <AddIcon />
          </IconButton>
        </Inline>
      </Stack>
    </form>
  ),
};
