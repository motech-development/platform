import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { BreezeProvider } from '../../provider/BreezeProvider';
import {
  PickerFieldGroupPart,
  PickerFieldInputPart,
  PickerFieldTriggerPart,
} from '../date/PickerFieldParts';
import { Stack } from '../Stack/Stack';
import {
  Description as TextFieldDescription,
  Error as TextFieldError,
  Label as TextFieldLabel,
} from '../TextField/TextField';
import { Calendar, DateTimePicker, Popover, Root } from './DateTimePicker';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(DateTimePicker.Calendar, {
        displayName: 'DateTimePicker.Calendar',
      });
      Object.assign(DateTimePicker.Description, {
        displayName: 'DateTimePicker.Description',
      });
      Object.assign(DateTimePicker.Error, {
        displayName: 'DateTimePicker.Error',
      });
      Object.assign(DateTimePicker.Group, {
        displayName: 'DateTimePicker.Group',
      });
      Object.assign(DateTimePicker.Input, {
        displayName: 'DateTimePicker.Input',
      });
      Object.assign(DateTimePicker.Label, {
        displayName: 'DateTimePicker.Label',
      });
      Object.assign(DateTimePicker.Popover, {
        displayName: 'DateTimePicker.Popover',
      });
      Object.assign(DateTimePicker.Root, {
        displayName: 'DateTimePicker.Root',
      });
      Object.assign(DateTimePicker.Trigger, {
        displayName: 'DateTimePicker.Trigger',
      });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Calendar,
    Description: TextFieldDescription,
    Error: TextFieldError,
    Group: PickerFieldGroupPart,
    Input: PickerFieldInputPart,
    Label: TextFieldLabel,
    Popover,
    Trigger: PickerFieldTriggerPart,
  },
  title: 'Date and Time/DateTimePicker',
} satisfies Meta<typeof Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const COMPACT_TOLERANCE = 1;

function Parts() {
  return (
    <>
      <DateTimePicker.Label>Date and time</DateTimePicker.Label>
      <DateTimePicker.Group>
        <DateTimePicker.Input />
        <DateTimePicker.Trigger />
      </DateTimePicker.Group>
      <DateTimePicker.Popover>
        <DateTimePicker.Calendar />
      </DateTimePicker.Popover>
    </>
  );
}

function Controlled() {
  const [value, setValue] = useState<string | null>(
    '2026-07-13T13:30:00+01:00',
  );

  return (
    <DateTimePicker.Root onChange={setValue} value={value}>
      <Parts />
    </DateTimePicker.Root>
  );
}

/**
 * Edits an explicit-offset instant through inline segments and the complete
 * calendar-plus-time popup while keeping the timezone suffix informative and
 * unfocusable.
 *
 * @summary explicit-offset date and time selection
 */
export const ExplicitOffset: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group');
    const trigger = canvas.getByRole('button', {
      name: /Calendar Date and time/,
    });

    await expect(group).toHaveClass('w-full', 'min-h-11', 'border');
    await expect(trigger).toHaveClass('border-0');
    await expect(trigger).not.toHaveClass('border-s', 'border-l');
    await expect(trigger.querySelector('svg')).toHaveAttribute(
      'height',
      '1.25rem',
    );
    const inlineTimeZone = group.querySelector('[data-type="timeZoneName"]');

    await expect(inlineTimeZone).toHaveTextContent('UTC');
    await expect(inlineTimeZone).not.toHaveAttribute('role');
    await expect(inlineTimeZone).not.toHaveAttribute('tabindex');
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    const timeLabel = body.getByText('Select time');
    const timeField = timeLabel.parentElement;

    if (!(timeField instanceof HTMLElement)) {
      throw new Error('Expected the DateTimePicker popover time field.');
    }

    const popoverTime = within(timeField);
    const popoverMinute = popoverTime.getByRole('spinbutton', {
      name: /minute/i,
    });
    const popoverTimeZone = timeField.querySelector(
      '[data-type="timeZoneName"]',
    );
    const popover = body.getByRole('dialog');
    const popoverBounds = popover.getBoundingClientRect();
    const triggerBounds = trigger.getBoundingClientRect();

    await expect(body.getByRole('application')).toBeVisible();
    await expect(popover).toHaveAttribute('data-placement', 'bottom');
    await expect(
      Math.abs(popoverBounds.right - triggerBounds.right),
    ).toBeLessThanOrEqual(12);
    await expect(
      Math.abs(popoverBounds.right - triggerBounds.right),
    ).toBeLessThan(Math.abs(popoverBounds.left - triggerBounds.left));
    await expect(
      body.getByRole('button', { name: /13.*July.*2026/i }),
    ).toHaveFocus();
    await expect(popoverMinute).toHaveTextContent('30');
    await expect(popoverMinute).toHaveAttribute('contenteditable', 'true');
    await expect(popoverMinute).toHaveAttribute('inputmode', 'numeric');
    await expect(popoverTimeZone).toHaveTextContent('UTC');
    await expect(popoverTimeZone).not.toHaveAttribute('role');
    await expect(popoverTimeZone).not.toHaveAttribute('tabindex');
    await userEvent.click(popoverMinute);
    await userEvent.keyboard('{ArrowUp}');
    await expect(popoverMinute).toHaveTextContent('31');
    await userEvent.click(
      body.getByRole('button', { name: /14.*July.*2026/i }),
    );
    await expect(
      canvas.getByRole('spinbutton', { name: /day/i }),
    ).toHaveTextContent('14');
    await expect(
      canvas.getByRole('spinbutton', { name: /minute/i }),
    ).toHaveTextContent('31');
  },
  render: () => (
    <DateTimePicker.Root defaultValue="2026-07-13T12:30:00+00:00">
      <DateTimePicker.Label>Date and time</DateTimePicker.Label>
      <DateTimePicker.Group>
        <DateTimePicker.Input />
        <DateTimePicker.Trigger />
      </DateTimePicker.Group>
      <DateTimePicker.Popover>
        <DateTimePicker.Calendar />
      </DateTimePicker.Popover>
    </DateTimePicker.Root>
  ),
};

/**
 * Constrains the complete explicit-offset field and popup to a narrow surface,
 * verifying segmented input, timezone text, trigger, and time controls remain
 * usable.
 *
 * @summary narrow explicit-offset picker geometry
 */
export const NarrowExplicitOffset: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = canvas.getByTestId('narrow-date-time-host');
    const group = canvas.getByRole('group');
    const trigger = canvas.getByRole('button', {
      name: /Date and time/,
    });
    const spinButtons = canvas.getAllByRole('spinbutton');
    const timeZone = group.querySelector('[data-breeze-time-zone]');
    const groupGeometry = group.getBoundingClientRect();
    const inputGeometry =
      spinButtons[0]?.parentElement?.getBoundingClientRect();
    const firstSegmentGeometry = spinButtons[0]?.getBoundingClientRect();
    const lastSegmentGeometry = timeZone?.getBoundingClientRect();
    const triggerGeometry = trigger.getBoundingClientRect();

    if (
      inputGeometry === undefined ||
      firstSegmentGeometry === undefined ||
      lastSegmentGeometry === undefined
    ) {
      throw new Error('Expected segmented date-time input anatomy.');
    }

    await expect(timeZone).not.toHaveAttribute('role');
    await expect(timeZone).not.toHaveAttribute('tabindex');

    await expect(groupGeometry.right).toBeLessThanOrEqual(
      host.getBoundingClientRect().right + COMPACT_TOLERANCE,
    );
    await expect(firstSegmentGeometry.left).toBeGreaterThanOrEqual(
      inputGeometry.left - COMPACT_TOLERANCE,
    );
    await expect(lastSegmentGeometry.right).toBeLessThanOrEqual(
      inputGeometry.right + COMPACT_TOLERANCE,
    );
    await expect(inputGeometry.right).toBeLessThanOrEqual(
      triggerGeometry.left + COMPACT_TOLERANCE,
    );
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    const calendarSurface = body
      .getByText('Select time')
      .closest<HTMLElement>('[data-breeze-date-time-calendar]');
    const popover = calendarSurface?.closest<HTMLElement>('[data-placement]');
    const popoverTimeInput =
      calendarSurface?.querySelector<HTMLElement>(
        '[data-type="hour"]',
      )?.parentElement;

    if (
      calendarSurface === null ||
      calendarSurface === undefined ||
      popover === null ||
      popover === undefined ||
      popoverTimeInput === null ||
      popoverTimeInput === undefined
    ) {
      throw new Error('Expected the complete narrow date-time surface.');
    }

    await expect(popover.scrollWidth).toBeLessThanOrEqual(popover.clientWidth);
    await expect(
      popoverTimeInput.getBoundingClientRect().left,
    ).toBeGreaterThanOrEqual(
      popover.getBoundingClientRect().left + COMPACT_TOLERANCE,
    );
    await expect(
      popoverTimeInput.getBoundingClientRect().right,
    ).toBeLessThanOrEqual(
      popover.getBoundingClientRect().right - COMPACT_TOLERANCE,
    );
    const compactMinute = within(popoverTimeInput).getByRole('spinbutton', {
      name: /minute/i,
    });

    await userEvent.click(compactMinute);
    await userEvent.keyboard('{ArrowUp}');
    await expect(compactMinute).toHaveTextContent('31');
  },
  render: () => (
    <StoryConstraint size="responsive-narrow" testId="narrow-date-time-host">
      <DateTimePicker.Root defaultValue="2026-07-13T12:30:00+00:00">
        <Parts />
      </DateTimePicker.Root>
    </StoryConstraint>
  ),
};

/**
 * Compares mutable application-owned instant state with an immutable
 * explicit-offset value and verifies compound read-only styling stays
 * coherent.
 *
 * @summary controlled and read-only instant values
 */
export const ControlledAndReadOnly: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const readOnlyTrigger = within(canvasElement).getAllByRole('button', {
      name: /Calendar Date and time/,
    })[1];
    const readOnlyGroup = readOnlyTrigger?.parentElement;

    await expect(readOnlyGroup).toHaveClass(
      'group-data-[readonly]/picker-field:opacity-70',
    );
    await expect(readOnlyTrigger).not.toHaveClass('opacity-70');
  },
  render: () => (
    <Stack gap="md">
      <Controlled />
      <DateTimePicker.Root readOnly value="2026-07-13T13:30:00+01:00">
        <Parts />
      </DateTimePicker.Root>
    </Stack>
  ),
};

/**
 * Displays an explicit-offset instant through the Europe/London provider zone
 * at the daylight-saving boundary, keeping transport value and localized
 * display concerns separate.
 *
 * @summary provider timezone at a daylight-saving boundary
 */
export const TimeZoneAndDst: Story = {
  args: { children: null },
  render: () => (
    <BreezeProvider locale="en-GB" timeZone="Europe/London">
      <DateTimePicker.Root defaultValue="2026-03-29T00:30:00+00:00">
        <Parts />
      </DateTimePicker.Root>
    </BreezeProvider>
  ),
};

/**
 * Combines native form naming, required invalid feedback, and explicit-offset
 * minimum and maximum instants across both inline and popup time fields.
 *
 * @summary bounded invalid instant with form integration
 */
export const BoundariesInvalidForm: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', { name: /Calendar Date and time/ }),
    );
    const timeLabel = within(canvasElement.ownerDocument.body).getByText(
      'Select time',
    );
    const timeInput = timeLabel.parentElement?.querySelector(
      '[role="spinbutton"]',
    )?.parentElement;

    await expect(timeInput).toHaveAttribute('data-invalid');
  },
  render: () => (
    <DateTimePicker.Root
      form="booking"
      invalid
      maxValue="2026-07-31T23:59:00+01:00"
      minValue="2026-07-01T00:00:00+01:00"
      name="dateTime"
      required
    >
      <Parts />
      <DateTimePicker.Description>
        Explicit-offset instant.
      </DateTimePicker.Description>
      <DateTimePicker.Error>Select a valid instant.</DateTimePicker.Error>
    </DateTimePicker.Root>
  ),
};

/**
 * Shows a populated explicit-offset picker in its disabled state so localized
 * date, time, and timezone content remain visible without accepting
 * interaction.
 *
 * @summary disabled populated date-time picker
 */
export const Disabled: Story = {
  args: { children: null },
  render: () => (
    <DateTimePicker.Root defaultValue="2026-07-13T12:30:00+00:00" disabled>
      <Parts />
    </DateTimePicker.Root>
  ),
};

/**
 * Runs the full English date-time popup in explicit right-to-left direction
 * and verifies dialog direction, accessible naming, and mirrored month
 * navigation.
 *
 * @summary right-to-left date-time popup and navigation
 */
export const RightToLeft: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: /Date and time/,
    });

    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    const timeLabel = body.getByText('Select time');
    const timeField = timeLabel.parentElement;
    const popover = body.getByRole('dialog');
    const application = body.getByRole('application');
    const previous = within(application).getByRole('button', {
      name: 'Previous',
    });
    const next = within(application).getAllByRole('button', {
      name: 'Next',
    })[0];
    const rightToLeftRoot = canvasElement.querySelector('[dir="rtl"]');

    await expect(rightToLeftRoot).toBeVisible();
    await expect(timeField).toHaveTextContent('Select time');
    await expect(popover).toHaveAttribute('dir', 'rtl');
    await expect(popover).toHaveAccessibleName('Select date and time');
    await expect(application).toBeVisible();
    await expect(previous.querySelector('svg')).toHaveClass(
      'lucide-arrow-left',
      'rtl:rotate-180',
    );
    await expect(next?.querySelector('svg')).toHaveClass(
      'lucide-arrow-right',
      'rtl:rotate-180',
    );
    await expect(
      getComputedStyle(previous.querySelector('svg') as SVGElement).rotate,
    ).toBe('180deg');
    await expect(
      getComputedStyle(next?.querySelector('svg') as SVGElement).rotate,
    ).toBe('180deg');
    await expect(previous.getBoundingClientRect().left).toBeGreaterThan(
      next?.getBoundingClientRect().left ?? Number.POSITIVE_INFINITY,
    );
  },
  render: () => (
    <BreezeProvider direction="rtl" locale="en-GB" timeZone="Europe/London">
      <DateTimePicker.Root defaultValue="2026-07-13T12:30:00+00:00">
        <Parts />
      </DateTimePicker.Root>
    </BreezeProvider>
  ),
};
