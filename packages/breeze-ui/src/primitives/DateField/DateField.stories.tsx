import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { DateInputPart } from '../date/DateInput';
import { Stack } from '../Stack/Stack';
import {
  Description as TextFieldDescription,
  Error as TextFieldError,
  Label as TextFieldLabel,
} from '../TextField/TextField';
import { DateField, Root } from './DateField';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(DateField.Description, {
        displayName: 'DateField.Description',
      });
      Object.assign(DateField.Error, { displayName: 'DateField.Error' });
      Object.assign(DateField.Input, { displayName: 'DateField.Input' });
      Object.assign(DateField.Label, { displayName: 'DateField.Label' });
      Object.assign(DateField.Root, { displayName: 'DateField.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Description: TextFieldDescription,
    Error: TextFieldError,
    Input: DateInputPart,
    Label: TextFieldLabel,
  },
  title: 'Date and Time/DateField',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;
function Controlled() {
  const [value, setValue] = useState<string | null>('2026-07-13');

  return (
    <DateField.Root onChange={setValue} value={value}>
      <DateField.Label>Controlled date</DateField.Label>
      <DateField.Input />
    </DateField.Root>
  );
}
/**
 * Starts with an uncontrolled stable date and verifies ArrowUp increments the
 * focused locale-aware day segment without exposing internal date objects.
 *
 * @summary keyboard editing of an uncontrolled date segment
 */
export const SegmentKeyboard: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const day = within(canvasElement).getByRole('spinbutton', { name: /day/i });
    day.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(day).toHaveAttribute('aria-valuenow', '14');
  },
  render: () => (
    <DateField.Root defaultValue="2026-07-13">
      <DateField.Label>Date</DateField.Label>
      <DateField.Input />
    </DateField.Root>
  ),
};
/**
 * Compares application-controlled mutable date state with an immutable
 * controlled value so the two supported ownership contracts are visible
 * together.
 *
 * @summary controlled and immutable date-field values
 */
export const ControlledAndReadOnly: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="md">
      <Controlled />
      <DateField.Root readOnly value="2026-07-13">
        <DateField.Label>Read only</DateField.Label>
        <DateField.Input />
      </DateField.Root>
    </Stack>
  ),
};
/**
 * Combines native form naming, required invalid feedback, minimum and maximum
 * dates, and one unavailable date in a single constrained field.
 *
 * @summary constrained invalid date field with form integration
 */
export const BoundariesAndForm: Story = {
  args: { children: null },
  render: () => (
    <DateField.Root
      form="booking"
      invalid
      isDateUnavailable={(date) => date === '2026-07-14'}
      maxValue="2026-07-31"
      minValue="2026-07-01"
      name="date"
      required
    >
      <DateField.Label>Constrained date</DateField.Label>
      <DateField.Input />
      <DateField.Description>July dates only.</DateField.Description>
      <DateField.Error>Select an available date.</DateField.Error>
    </DateField.Root>
  ),
};
/**
 * Uses an English United States locale inside an explicit right-to-left
 * provider and a narrow host to document locale direction and long-label
 * behavior.
 *
 * @summary English date segments in right-to-left layout
 */
export const EnglishLocaleAndRightToLeft: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Long appointment date');
    const provider = label.closest('[dir="rtl"]');

    await expect(label).toBeVisible();
    await expect(provider).toHaveAttribute('dir', 'rtl');
    await expect(provider).toHaveAttribute('lang', 'en-US');
  },
  render: () => (
    <BreezeProvider direction="rtl" locale="en-US">
      <StoryConstraint size="compact-control">
        <DateField.Root defaultValue="2026-12-31">
          <DateField.Label>Long appointment date</DateField.Label>
          <DateField.Input />
        </DateField.Root>
      </StoryConstraint>
    </BreezeProvider>
  ),
};
