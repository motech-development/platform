import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { DateInputPart } from '../date/DateInput';
import { Stack } from '../Stack/Stack';
import {
  Description as TextFieldDescription,
  Error as TextFieldError,
  Label as TextFieldLabel,
} from '../TextField/TextField';
import { Root, TimeField } from './TimeField';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(TimeField.Description, {
        displayName: 'TimeField.Description',
      });
      Object.assign(TimeField.Error, { displayName: 'TimeField.Error' });
      Object.assign(TimeField.Input, { displayName: 'TimeField.Input' });
      Object.assign(TimeField.Label, { displayName: 'TimeField.Label' });
      Object.assign(TimeField.Root, { displayName: 'TimeField.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Description: TextFieldDescription,
    Error: TextFieldError,
    Input: DateInputPart,
    Label: TextFieldLabel,
  },
  title: 'Date and Time/TimeField',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;
function Controlled() {
  const [value, setValue] = useState<string | null>('14:30');

  return (
    <TimeField.Root onChange={setValue} value={value}>
      <TimeField.Label>Controlled time</TimeField.Label>
      <TimeField.Input />
    </TimeField.Root>
  );
}
/**
 * Starts with an uncontrolled stable time and verifies ArrowUp increments the
 * focused minute segment without exposing internal Time objects.
 *
 * @summary keyboard editing of an uncontrolled time segment
 */
export const SegmentKeyboard: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const minute = within(canvasElement).getByRole('spinbutton', {
      name: /minute/i,
    });
    minute.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(minute).toHaveAttribute('aria-valuenow', '31');
  },
  render: () => (
    <TimeField.Root defaultValue="14:30">
      <TimeField.Label>Time</TimeField.Label>
      <TimeField.Input />
    </TimeField.Root>
  ),
};
/**
 * Compares an application-controlled minute value with an immutable value that
 * includes seconds, documenting both supported granularities and owners.
 *
 * @summary controlled minutes and read-only seconds values
 */
export const SecondsControlledReadOnly: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="md">
      <Controlled />
      <TimeField.Root readOnly value="14:30:45">
        <TimeField.Label>Read only seconds</TimeField.Label>
        <TimeField.Input />
      </TimeField.Root>
    </Stack>
  ),
};
/**
 * Combines native form naming, required invalid feedback, and minimum and
 * maximum times in one constrained office-hours field.
 *
 * @summary constrained invalid time field with form integration
 */
export const BoundariesAndForm: Story = {
  args: { children: null },
  render: () => (
    <TimeField.Root
      form="booking"
      invalid
      maxValue="17:00"
      minValue="09:00"
      name="time"
      required
    >
      <TimeField.Label>Office hours</TimeField.Label>
      <TimeField.Input />
      <TimeField.Description>09:00 to 17:00.</TimeField.Description>
      <TimeField.Error>Select a valid time.</TimeField.Error>
    </TimeField.Root>
  ),
};
/**
 * Places a disabled seconds-level value beneath a long label in a narrow host
 * to demonstrate localized segment layout and content wrapping.
 *
 * @summary disabled time with seconds and narrow long content
 */
export const DisabledExtreme: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="compact-control">
      <TimeField.Root disabled defaultValue="23:59:59">
        <TimeField.Label>Very long disabled time label</TimeField.Label>
        <TimeField.Input />
      </TimeField.Root>
    </StoryConstraint>
  ),
};
