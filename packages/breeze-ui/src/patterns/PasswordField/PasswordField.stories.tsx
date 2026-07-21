import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Stack } from '../../primitives/Stack/Stack';
import { PasswordField } from './PasswordField';

const meta = {
  component: PasswordField,
  title: 'Patterns/Forms/PasswordField',
} satisfies Meta<typeof PasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Demonstrates an uncontrolled password with supporting requirements and
 * verifies the single-surface keyboard-operable show and hide action.
 *
 * @summary password visibility toggle with supporting guidance
 */
export const Visibility: Story = {
  args: {
    defaultValue: 'correct horse battery staple',
    description: 'Use at least 12 characters.',
    label: 'Password',
    onChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Password');
    const button = canvas.getByRole('button', { name: 'Show password' });
    const group = input.closest<HTMLElement>('[data-breeze-input-group]');

    if (!group) {
      throw new Error('Expected PasswordField to use InputGroup.');
    }

    const inputBounds = input.getBoundingClientRect();
    const buttonBounds = button.getBoundingClientRect();
    const perimeter = getComputedStyle(group, '::after');

    await expect(input).toHaveAttribute('type', 'password');
    await expect(inputBounds.height).toBeGreaterThanOrEqual(44);
    await expect(buttonBounds.height).toBe(inputBounds.height);
    await expect(inputBounds.right).toBe(buttonBounds.left);
    await expect(perimeter.borderTopWidth).toBe('1px');
    await expect(getComputedStyle(input).borderWidth).toBe('0px');
    await expect(getComputedStyle(button).borderWidth).toBe('0px');
    await expect(getComputedStyle(button).backgroundColor).toBe(
      'rgba(0, 0, 0, 0)',
    );
    await userEvent.hover(button);
    await expect(getComputedStyle(button).backgroundColor).toBe(
      'rgba(0, 0, 0, 0)',
    );
    await userEvent.click(button);
    await expect(input).toHaveAttribute('type', 'text');
    await expect(canvas.getByRole('button', { name: 'Hide password' })).toBe(
      button,
    );
    await expect(getComputedStyle(group).outlineStyle).toBe('solid');
    await expect(getComputedStyle(group).outlineWidth).toBe('2px');
    await expect(getComputedStyle(button).outlineStyle).toBe('none');
    await expect(getComputedStyle(button).outlineWidth).toBe('0px');
  },
};

/**
 * Presents an empty required password with application-owned validation copy
 * and invalid field state for error-message association.
 *
 * @summary invalid password entry with associated error feedback
 */
export const Invalid: Story = {
  args: {
    error: 'Enter your password.',
    invalid: true,
    label: 'Password',
  },
};

/**
 * Compares the small disabled and large read-only presentations, including
 * their distinct visibility-action and immutable-value behavior.
 *
 * @summary disabled and read-only password fields at size extremes
 */
export const SizesAndStates: Story = {
  args: {
    label: 'Password',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const smallInput = canvas.getByLabelText('Small disabled password');
    const readOnlyInput = canvas.getByLabelText('Large read-only password');
    const smallGroup = smallInput.closest<HTMLElement>(
      '[data-breeze-input-group]',
    );
    const readOnlyGroup = readOnlyInput.closest<HTMLElement>(
      '[data-breeze-input-group]',
    );

    if (!smallGroup || !readOnlyGroup) {
      throw new Error('Expected PasswordField to use InputGroup.');
    }

    const smallButton = within(smallGroup).getByRole('button', {
      name: 'Show password',
    });

    await expect(smallGroup.getBoundingClientRect().height).toBe(32);
    await expect(readOnlyGroup.getBoundingClientRect().height).toBe(48);
    await expect(smallButton).toBeDisabled();
    await expect(getComputedStyle(smallButton).borderWidth).toBe('0px');
    await expect(getComputedStyle(smallButton).backgroundColor).toBe(
      'rgba(0, 0, 0, 0)',
    );
    await expect(getComputedStyle(readOnlyInput).backgroundColor).toBe(
      'rgba(0, 0, 0, 0)',
    );
    await expect(readOnlyGroup.scrollWidth).toBe(readOnlyGroup.clientWidth);
  },
  render: () => (
    <StoryConstraint size="bounded-compact">
      <Stack gap="lg">
        <PasswordField
          defaultValue="disabled"
          disabled
          label="Small disabled password"
          size="sm"
        />
        <PasswordField
          label="Large read-only password"
          readOnly
          size="lg"
          value="read-only"
        />
      </Stack>
    </StoryConstraint>
  ),
};
