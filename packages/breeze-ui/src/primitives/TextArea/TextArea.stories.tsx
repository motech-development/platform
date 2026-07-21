import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Stack } from '../Stack/Stack';
import { Description, Error, Label, Root } from '../TextField/TextField';
import { Control, TextArea } from './TextArea';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(TextArea.Control, { displayName: 'TextArea.Control' });
      Object.assign(TextArea.Description, {
        displayName: 'TextArea.Description',
      });
      Object.assign(TextArea.Error, { displayName: 'TextArea.Error' });
      Object.assign(TextArea.Label, { displayName: 'TextArea.Label' });
      Object.assign(TextArea.Root, { displayName: 'TextArea.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Control,
    Description,
    Error,
    Label,
  },
  title: 'Fields/TextArea',
} satisfies Meta<typeof Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledExample() {
  const [value, setValue] = useState('Opening line');

  return (
    <TextArea.Root onChange={setValue} value={value}>
      <TextArea.Label>Controlled notes</TextArea.Label>
      <TextArea.Control rows={5} />
      <TextArea.Description>{value.length} characters</TextArea.Description>
    </TextArea.Root>
  );
}

/**
 * Composes the full labelled multiline anatomy and verifies native typing plus
 * line breaks in an internally managed textarea value.
 *
 * @summary uncontrolled multiline entry with complete field anatomy
 */
export const AnatomyAndUncontrolled: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('textbox', {
      name: 'Notes',
    });
    await userEvent.type(control, 'Line one{enter}Line two');
    await expect(control).toHaveValue('Line one\nLine two');
  },
  render: () => (
    <TextArea.Root>
      <TextArea.Label>Notes</TextArea.Label>
      <TextArea.Control name="notes" placeholder="Add context" rows={5} />
      <TextArea.Description>Use plain text.</TextArea.Description>
    </TextArea.Root>
  ),
};
/**
 * Stores multiline content in application state and reflects the current
 * character count through associated supporting guidance.
 *
 * @summary application-controlled multiline value and character count
 */
export const Controlled: Story = {
  args: { children: null },
  render: () => <ControlledExample />,
};
/**
 * Compares immutable, disabled, and required-invalid textareas across the
 * supported control sizes so their distinct semantics remain visible.
 *
 * @summary read-only disabled and invalid multiline field states
 */
export const ReadOnlyAndStates: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="bounded">
      <Stack gap="lg">
        <TextArea.Root readOnly value="Archived content">
          <TextArea.Label>Read-only</TextArea.Label>
          <TextArea.Control />
        </TextArea.Root>
        <TextArea.Root disabled defaultValue="Unavailable">
          <TextArea.Label>Disabled</TextArea.Label>
          <TextArea.Control size="sm" />
        </TextArea.Root>
        <TextArea.Root invalid required>
          <TextArea.Label>Required summary</TextArea.Label>
          <TextArea.Control size="lg" />
          <TextArea.Error>Enter a summary.</TextArea.Error>
        </TextArea.Root>
      </Stack>
    </StoryConstraint>
  ),
};
/**
 * Verifies Tab reaches the labelled textarea while documenting that native
 * Enter and text-editing behavior remain available inside the control.
 *
 * @summary keyboard focus and native multiline editing behavior
 */
export const KeyboardAndA11y: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Keyboard notes' }),
    ).toHaveFocus();
  },
  render: () => (
    <TextArea.Root>
      <TextArea.Label>Keyboard notes</TextArea.Label>
      <TextArea.Control />
      <TextArea.Description>
        Tab enters and leaves the control; Enter inserts a new line.
      </TextArea.Description>
    </TextArea.Root>
  ),
};
/**
 * Places a long wrapping value, label, and description in a narrow host to
 * demonstrate scrolling and user-controlled vertical resizing.
 *
 * @summary long multiline content constrained to a narrow field
 */
export const ContentExtreme: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="narrow-control">
      <TextArea.Root
        defaultValue={'A long paragraph demonstrates wrapping. '.repeat(12)}
      >
        <TextArea.Label>A detailed multiline content label</TextArea.Label>
        <TextArea.Control rows={10} />
        <TextArea.Description>
          Long content remains scrollable and the control remains resizable.
        </TextArea.Description>
      </TextArea.Root>
    </StoryConstraint>
  ),
};
