import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { PickerCalendarPart } from '../date/PickerParts';
import { Stack } from '../Stack/Stack';
import {
  Description as TextFieldDescription,
  Error as TextFieldError,
  Label as TextFieldLabel,
} from '../TextField/TextField';
import { DatePicker, Group, Input, Popover, Root, Trigger } from './DatePicker';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(DatePicker.Calendar, {
        displayName: 'DatePicker.Calendar',
      });
      Object.assign(DatePicker.Description, {
        displayName: 'DatePicker.Description',
      });
      Object.assign(DatePicker.Error, { displayName: 'DatePicker.Error' });
      Object.assign(DatePicker.Group, { displayName: 'DatePicker.Group' });
      Object.assign(DatePicker.Input, { displayName: 'DatePicker.Input' });
      Object.assign(DatePicker.Label, { displayName: 'DatePicker.Label' });
      Object.assign(DatePicker.Popover, {
        displayName: 'DatePicker.Popover',
      });
      Object.assign(DatePicker.Root, { displayName: 'DatePicker.Root' });
      Object.assign(DatePicker.Trigger, {
        displayName: 'DatePicker.Trigger',
      });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Calendar: PickerCalendarPart,
    Description: TextFieldDescription,
    Error: TextFieldError,
    Group,
    Input,
    Label: TextFieldLabel,
    Popover,
    Trigger,
  },
  title: 'Date and Time/DatePicker',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;
function Parts() {
  return (
    <>
      <DatePicker.Label>Date</DatePicker.Label>
      <DatePicker.Group>
        <DatePicker.Input />
        <DatePicker.Trigger />
      </DatePicker.Group>
      <DatePicker.Popover>
        <DatePicker.Calendar />
      </DatePicker.Popover>
    </>
  );
}
function Controlled() {
  const [value, setValue] = useState<string | null>('2026-07-13');

  return (
    <DatePicker.Root onChange={setValue} value={value}>
      <Parts />
    </DatePicker.Root>
  );
}
/**
 * Opens an uncontrolled long-date field, verifies anchored popup geometry and
 * calendar controls, then selects a date and updates the visible trigger text.
 *
 * @summary uncontrolled calendar popup selection
 */
export const CalendarSelection: Story = {
  args: { children: null },
  decorators: [
    (Story) => (
      <StoryConstraint size="bounded-control">
        <Story />
      </StoryConstraint>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Calendar Date/ });
    const group = trigger.parentElement;
    const root = group?.parentElement;

    if (!(group instanceof HTMLElement) || !(root instanceof HTMLElement)) {
      throw new Error('Expected the DatePicker field hierarchy.');
    }

    const rootBounds = root.getBoundingClientRect();
    const groupBounds = group.getBoundingClientRect();
    const triggerBounds = trigger.getBoundingClientRect();
    const view = canvasElement.ownerDocument.defaultView;
    const defaultBorderColour = view?.getComputedStyle(trigger).borderTopColor;

    await expect(groupBounds.width).toBeCloseTo(rootBounds.width, 0);
    await expect(triggerBounds.width).toBeCloseTo(groupBounds.width, 0);
    await expect(triggerBounds.height).toBeGreaterThanOrEqual(44);
    await expect(
      Math.abs(rootBounds.width - groupBounds.width),
    ).toBeLessThanOrEqual(1);
    await expect(
      Math.abs(groupBounds.width - triggerBounds.width),
    ).toBeLessThanOrEqual(1);
    await userEvent.hover(trigger);
    await expect(trigger).toHaveAttribute('data-hovered');
    await waitFor(() =>
      expect(view?.getComputedStyle(trigger).borderTopColor).not.toBe(
        defaultBorderColour,
      ),
    );
    await userEvent.unhover(trigger);
    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    const calendarElement = body.getByRole('application');
    const popover = calendarElement.closest<HTMLElement>('[data-placement]');

    if (popover === null) {
      throw new Error('Expected the positioned DatePicker popover.');
    }

    const popoverBounds = popover.getBoundingClientRect();
    const calendar = within(calendarElement);
    const [previous] = calendar.getAllByRole('button', { name: 'Previous' });
    const [next] = calendar.getAllByRole('button', { name: 'Next' });

    await expect(popover.dataset.placement).toBe('bottom');
    await expect(
      Math.abs(popoverBounds.right - triggerBounds.right),
    ).toBeLessThanOrEqual(1);
    await expect(
      Math.abs(popoverBounds.top - triggerBounds.bottom - 8),
    ).toBeLessThanOrEqual(1);
    await expect(previous.querySelector('svg')).toBeVisible();
    await expect(next.querySelector('svg')).toBeVisible();
    await userEvent.click(
      body.getByRole('button', { name: /14.*July.*2026/i }),
    );
    await expect(trigger).toHaveTextContent('14 July 2026');
  },
  render: () => (
    <DatePicker.Root defaultValue="2026-07-13">
      <DatePicker.Label>Date</DatePicker.Label>
      <DatePicker.Group>
        <DatePicker.Input />
        <DatePicker.Trigger />
      </DatePicker.Group>
      <DatePicker.Popover>
        <DatePicker.Calendar />
      </DatePicker.Popover>
    </DatePicker.Root>
  ),
};
/**
 * Compares a mutable application-controlled picker with an immutable
 * controlled picker using the same complete label, group, input, trigger,
 * popover, and calendar anatomy.
 *
 * @summary controlled and read-only date picker states
 */
export const ControlledAndReadOnly: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="md">
      <Controlled />
      <DatePicker.Root readOnly value="2026-07-13">
        <Parts />
      </DatePicker.Root>
    </Stack>
  ),
};
/**
 * Documents form association, required invalid feedback, month boundaries,
 * and a synchronously unavailable date on one date-picker root.
 *
 * @summary bounded invalid date picker with form value
 */
export const BoundariesAndForm: Story = {
  args: { children: null },
  render: () => (
    <DatePicker.Root
      form="booking"
      invalid
      isDateUnavailable={(date) => date === '2026-07-14'}
      maxValue="2026-07-31"
      minValue="2026-07-01"
      name="date"
      required
    >
      <Parts />
      <DatePicker.Description>July only.</DatePicker.Description>
      <DatePicker.Error>Select an available date.</DatePicker.Error>
    </DatePicker.Root>
  ),
};
/**
 * Constrains a disabled picker with a long localized date to a narrow width,
 * demonstrating non-interactive content wrapping and full-width control
 * geometry.
 *
 * @summary disabled long-date picker in a narrow host
 */
export const DisabledExtreme: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="narrow-control">
      <DatePicker.Root disabled defaultValue="2026-12-31">
        <Parts />
      </DatePicker.Root>
    </StoryConstraint>
  ),
};
