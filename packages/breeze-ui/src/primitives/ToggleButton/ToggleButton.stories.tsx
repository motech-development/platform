import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { EyeIcon } from '../../icons';
import { Inline } from '../Inline/Inline';
import { ToggleButton } from './ToggleButton';

const meta = {
  component: ToggleButton,
  title: 'Actions/ToggleButton',
} satisfies Meta<typeof ToggleButton>;
export default meta;
type Story = StoryObj<typeof meta>;

function ControlledToggleButtonExample() {
  const [selected, setSelected] = useState(false);

  return (
    <ToggleButton onChange={setSelected} selected={selected}>
      Controlled {selected ? 'on' : 'off'}
    </ToggleButton>
  );
}

/**
 * Starts unselected, combines a decorative icon with visible text, and verifies
 * activation updates aria-pressed plus the semantic change callback.
 *
 * @summary uncontrolled icon-and-text toggle activated by the user
 */
export const Uncontrolled: Story = {
  args: {
    children: (
      <>
        <EyeIcon />
        Preview
      </>
    ),
    onChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Preview',
    });
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onChange).toHaveBeenCalledWith(true);
  },
};
/**
 * Places an initially selected toggle beside a disabled toggle to compare
 * persistent pressed state with a control that cannot receive interaction.
 *
 * @summary selected and disabled toggle-button states
 */
export const SelectedAndDisabled: Story = {
  args: { children: 'Bold', defaultSelected: true },
  render: () => (
    <Inline align="stretch" gap="compact" wrap={false}>
      <ToggleButton defaultSelected>Selected</ToggleButton>
      <ToggleButton disabled>Disabled</ToggleButton>
    </Inline>
  ),
};
/**
 * Stores selected state in the application and updates the visible label after
 * each change request, demonstrating the mutable controlled contract.
 *
 * @summary application-controlled toggle selection and visible state
 */
export const Controlled: Story = {
  args: { children: 'Controlled off', onChange: fn(), selected: false },
  render: () => <ControlledToggleButtonExample />,
};
/**
 * Keeps a selected toggle immutable while preserving focus and ordinary button
 * semantics, distinguishing read-only state from disabled interaction.
 *
 * @summary focusable read-only controlled toggle selection
 */
export const ReadOnlyControlled: Story = {
  args: { children: 'Pinned selection', readOnly: true, selected: true },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Pinned selection',
    });
    await userEvent.click(button);
    await expect(button).toHaveFocus();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(button).not.toHaveAttribute('aria-disabled');
  },
};
