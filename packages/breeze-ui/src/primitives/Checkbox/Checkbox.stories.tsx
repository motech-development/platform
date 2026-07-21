import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Stack } from '../Stack/Stack';
import { Description, Error } from '../TextField/TextField';
import { Checkbox, Control, Indicator, Label, Root } from './Checkbox';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Checkbox.Control, { displayName: 'Checkbox.Control' });
      Object.assign(Checkbox.Description, {
        displayName: 'Checkbox.Description',
      });
      Object.assign(Checkbox.Error, { displayName: 'Checkbox.Error' });
      Object.assign(Checkbox.Indicator, {
        displayName: 'Checkbox.Indicator',
      });
      Object.assign(Checkbox.Label, { displayName: 'Checkbox.Label' });
      Object.assign(Checkbox.Root, { displayName: 'Checkbox.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Control,
    Description,
    Error,
    Indicator,
    Label,
  },
  title: 'Selection/Checkbox',
} satisfies Meta<typeof Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function CheckboxControl({
  label,
  size,
}: {
  label: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <Checkbox.Control>
      <Checkbox.Indicator size={size} />
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Control>
  );
}

function ControlledExample() {
  const [selected, setSelected] = useState(true);

  return (
    <Checkbox.Root onChange={setSelected} selected={selected}>
      <CheckboxControl label="Controlled preference" />
      <Checkbox.Description>
        {selected ? 'Enabled' : 'Disabled'}
      </Checkbox.Description>
    </Checkbox.Root>
  );
}

/**
 * Composes every ordinary checkbox part, then uses Space to select the
 * uncontrolled native input and verifies its persistent description remains
 * programmatically associated.
 *
 * @summary Uncontrolled checkbox anatomy with Space activation.
 */
export const AnatomyAndUncontrolled: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', {
      name: 'Email notifications',
    });

    checkbox.focus();
    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();
    await expect(checkbox).toHaveAccessibleDescription(
      'Receive weekly updates.',
    );
  },
  render: () => (
    <Checkbox.Root name="notifications" value="email">
      <Checkbox.Control>
        <Checkbox.Indicator />
        <Checkbox.Label>Email notifications</Checkbox.Label>
      </Checkbox.Control>
      <Checkbox.Description>Receive weekly updates.</Checkbox.Description>
    </Checkbox.Root>
  ),
};

/**
 * Keeps `selected` in application state and reflects the current Boolean value
 * in associated guidance, demonstrating the mutable controlled checkbox
 * contract.
 *
 * @summary Application-controlled Boolean selection and status text.
 */
export const Controlled: Story = {
  args: { children: null },
  render: () => <ControlledExample />,
};

/**
 * Compares immutable selected, disabled, indeterminate, and required invalid
 * checkboxes while varying indicator size only where the supported visual
 * state calls for it.
 *
 * @summary Read-only, disabled, mixed, and invalid checkbox states.
 */
export const ReadOnlyAndStates: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="compact">
      <Checkbox.Root readOnly selected>
        <CheckboxControl label="Read-only selected" />
      </Checkbox.Root>
      <Checkbox.Root disabled defaultSelected>
        <CheckboxControl label="Disabled" size="sm" />
      </Checkbox.Root>
      <Checkbox.Root indeterminate>
        <CheckboxControl label="Indeterminate" />
      </Checkbox.Root>
      <Checkbox.Root invalid required>
        <CheckboxControl label="Required confirmation" size="lg" />
        <Checkbox.Error>Confirm before continuing.</Checkbox.Error>
      </Checkbox.Root>
    </Stack>
  ),
};

/**
 * Supplies form, name, and submitted value to the hidden native checkbox,
 * documenting how an initially selected Breeze checkbox participates in
 * browser form data.
 *
 * @summary Selected checkbox with explicit native form metadata.
 */
export const NativeForm: Story = {
  args: { children: null },
  render: () => (
    <form id="settings" onSubmit={(event) => event.preventDefault()}>
      <Checkbox.Root
        defaultSelected
        form="settings"
        name="updates"
        value="enabled"
      >
        <CheckboxControl label="Product updates" />
      </Checkbox.Root>
    </form>
  ),
};

/**
 * Constrains a long label and description to a narrow column, showing that
 * copy wraps while the checkbox target and accessible description remain
 * intact.
 *
 * @summary Long checkbox copy in a constrained column.
 */
export const ContentExtreme: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="narrow-control">
      <Checkbox.Root>
        <CheckboxControl label="A long persistent checkbox label that wraps across several lines without shrinking the interaction target" />
        <Checkbox.Description>
          Detailed guidance remains associated while wrapping in a constrained
          column.
        </Checkbox.Description>
      </Checkbox.Root>
    </StoryConstraint>
  ),
};
