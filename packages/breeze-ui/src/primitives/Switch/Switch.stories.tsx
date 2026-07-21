import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Stack } from '../Stack/Stack';
import { Description, Error as ErrorPart } from '../TextField/TextField';
import {
  Control as SwitchControl,
  Label,
  Root,
  Switch,
  Thumb,
  Track,
} from './Switch';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Switch.Control, { displayName: 'Switch.Control' });
      Object.assign(Switch.Description, {
        displayName: 'Switch.Description',
      });
      Object.assign(Switch.Error, { displayName: 'Switch.Error' });
      Object.assign(Switch.Label, { displayName: 'Switch.Label' });
      Object.assign(Switch.Root, { displayName: 'Switch.Root' });
      Object.assign(Switch.Thumb, { displayName: 'Switch.Thumb' });
      Object.assign(Switch.Track, { displayName: 'Switch.Track' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Control: SwitchControl,
    Description,
    Error: ErrorPart,
    Label,
    Thumb,
    Track,
  },
  title: 'Selection/Switch',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

function Control({
  label,
  size,
}: {
  label: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <Switch.Control>
      <Switch.Track size={size}>
        <Switch.Thumb size={size} />
      </Switch.Track>
      <Switch.Label>{label}</Switch.Label>
    </Switch.Control>
  );
}
function ControlledExample() {
  const [selected, setSelected] = useState(true);

  return (
    <Switch.Root onChange={setSelected} selected={selected}>
      <Control label="Controlled alerts" />
      <Switch.Description>{selected ? 'On' : 'Off'}</Switch.Description>
    </Switch.Root>
  );
}

/**
 * Exercises the complete uncontrolled switch anatomy, Space-key toggling,
 * native form value, and description association for one immediate setting.
 *
 * @summary uncontrolled labelled switch with keyboard activation
 */
export const AnatomyAndKeyboard: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('switch', {
      name: 'Email alerts',
    });
    control.focus();
    await userEvent.keyboard(' ');
    await expect(control).toBeChecked();
    await expect(control).toHaveAccessibleDescription(
      'Receive important workspace activity.',
    );
  },
  render: () => (
    <Switch.Root name="alerts" value="email">
      <Switch.Control>
        <Switch.Track>
          <Switch.Thumb />
        </Switch.Track>
        <Switch.Label>Email alerts</Switch.Label>
      </Switch.Control>
      <Switch.Description>
        Receive important workspace activity.
      </Switch.Description>
    </Switch.Root>
  ),
};
/**
 * Keeps the selected Boolean in application state and reflects each semantic
 * change through concise supporting status text.
 *
 * @summary application-controlled Boolean setting
 */
export const Controlled: Story = {
  args: { children: null },
  render: () => <ControlledExample />,
};
/**
 * Compares immutable selected, disabled selected, and required invalid switch
 * states while demonstrating the default and large control geometries.
 *
 * @summary read-only disabled and invalid switch states
 */
export const ReadOnlyAndStates: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readOnlyControl = canvas.getByRole('switch', {
      name: 'Read-only enabled',
    });
    const disabledControl = canvas.getByRole('switch', { name: 'Disabled' });
    const readOnlyTrack = readOnlyControl
      .closest('label')
      ?.querySelector<HTMLElement>(':scope > span[aria-hidden="true"]');
    const disabledTrack = disabledControl
      .closest('label')
      ?.querySelector<HTMLElement>(':scope > span[aria-hidden="true"]');

    if (!readOnlyTrack || !disabledTrack) {
      throw new Error('Expected read-only and disabled Switch tracks.');
    }

    const readOnlyBounds = readOnlyTrack.getBoundingClientRect();
    const disabledBounds = disabledTrack.getBoundingClientRect();

    await expect(disabledBounds.width).toBe(readOnlyBounds.width);
    await expect(disabledBounds.height).toBe(readOnlyBounds.height);
    await expect(disabledBounds.width).toBe(40);
    await expect(disabledBounds.height).toBe(24);
  },
  render: () => (
    <Stack gap="compact">
      <Switch.Root readOnly selected>
        <Control label="Read-only enabled" />
      </Switch.Root>
      <Switch.Root disabled defaultSelected>
        <Control label="Disabled" />
      </Switch.Root>
      <Switch.Root invalid required>
        <Control label="Required setting" size="lg" />
        <Switch.Error>Enable this setting.</Switch.Error>
      </Switch.Root>
    </Stack>
  ),
};
/**
 * Associates the hidden native checkbox with an external form id and submits
 * the configured name and value only while selected.
 *
 * @summary selected switch with native form participation
 */
export const NativeForm: Story = {
  args: { children: null },
  render: () => (
    <form id="preferences" onSubmit={(event) => event.preventDefault()}>
      <Switch.Root
        defaultSelected
        form="preferences"
        name="security"
        value="enabled"
      >
        <Control label="Security notifications" />
      </Switch.Root>
    </form>
  ),
};
/**
 * Constrains long label and description copy to a narrow host while preserving
 * the full touch target and accessible text association.
 *
 * @summary long switch content in a narrow layout
 */
export const ContentExtreme: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="narrow-control">
      <Switch.Root>
        <Control label="A long switch label that wraps without reducing the touch target" />
        <Switch.Description>
          Detailed guidance remains associated in narrow layouts.
        </Switch.Description>
      </Switch.Root>
    </StoryConstraint>
  ),
};
