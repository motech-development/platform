import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Stack } from '../Stack/Stack';
import { Description, Error, Input, Label, Root, TextField } from './TextField';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(TextField.Description, {
        displayName: 'TextField.Description',
      });
      Object.assign(TextField.Error, { displayName: 'TextField.Error' });
      Object.assign(TextField.Input, { displayName: 'TextField.Input' });
      Object.assign(TextField.Label, { displayName: 'TextField.Label' });
      Object.assign(TextField.Root, { displayName: 'TextField.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Description,
    Error,
    Input,
    Label,
  },
  title: 'Fields/TextField',
} satisfies Meta<typeof Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledExample() {
  const [value, setValue] = useState('PROJECT-2026');

  return (
    <TextField.Root onChange={setValue} value={value}>
      <TextField.Label>Project reference</TextField.Label>
      <TextField.Input />
      <TextField.Description>Current value: {value}</TextField.Description>
    </TextField.Root>
  );
}

/**
 * Composes the complete labelled field anatomy and verifies native typing plus
 * the accessible relationship to persistent supporting guidance.
 *
 * @summary uncontrolled single-line entry with complete field anatomy
 */
export const AnatomyAndUncontrolled: Story = {
  args: {
    children: null,
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Email address',
    });

    await userEvent.type(input, 'team@example.com');
    await expect(input).toHaveValue('team@example.com');
    await expect(input).toHaveAccessibleDescription(
      'Used for workspace notices.',
    );
  },
  render: () => (
    <TextField.Root>
      <TextField.Label>Email address</TextField.Label>
      <TextField.Input
        name="email"
        placeholder="team@example.com"
        type="email"
      />
      <TextField.Description>Used for workspace notices.</TextField.Description>
    </TextField.Root>
  ),
};

/**
 * Stores the text value in application state and mirrors each change through
 * associated description content without moving validation into Breeze.
 *
 * @summary application-controlled text value with reflected guidance
 */
export const Controlled: Story = {
  args: { children: null },
  render: () => <ControlledExample />,
};

/**
 * Compares immutable, disabled, and required-invalid inputs across all control
 * sizes so consumers can distinguish their semantics and presentation.
 *
 * @summary read-only disabled and invalid text-field states
 */
export const ReadOnlyAndStates: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="bounded">
      <Stack gap="lg">
        <TextField.Root readOnly value="Immutable value">
          <TextField.Label>Read-only</TextField.Label>
          <TextField.Input />
        </TextField.Root>
        <TextField.Root disabled defaultValue="Unavailable">
          <TextField.Label>Disabled</TextField.Label>
          <TextField.Input size="sm" />
        </TextField.Root>
        <TextField.Root invalid required>
          <TextField.Label>Required reference</TextField.Label>
          <TextField.Input size="lg" />
          <TextField.Error>Enter a reference.</TextField.Error>
        </TextField.Root>
      </Stack>
    </StoryConstraint>
  ),
};

/**
 * Verifies Tab reaches the labelled input while demonstrating a stable name,
 * required state, initial value, and native form participation.
 *
 * @summary keyboard focus with native form field integration
 */
export const KeyboardAndNativeForm: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Project code' }),
    ).toHaveFocus();
  },
  render: () => (
    <form onSubmit={(event) => event.preventDefault()}>
      <TextField.Root defaultValue="BRZ-3" required>
        <TextField.Label>Project code</TextField.Label>
        <TextField.Input autoComplete="off" name="projectCode" />
        <TextField.Description>
          Submitted through the native form.
        </TextField.Description>
      </TextField.Root>
    </form>
  ),
};

/**
 * Places unusually long label, value, and description content in a narrow
 * column to verify wrapping without breaking accessible relationships.
 *
 * @summary long single-line field content in a narrow column
 */
export const ContentExtreme: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="narrow-control">
      <TextField.Root defaultValue="A very long field value that remains usable in a constrained application column">
        <TextField.Label>
          A persistent label with unusually detailed wording
        </TextField.Label>
        <TextField.Input />
        <TextField.Description>
          Long guidance wraps without changing the field&apos;s accessible
          relationships.
        </TextField.Description>
      </TextField.Root>
    </StoryConstraint>
  ),
};
