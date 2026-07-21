import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import type { DateRangeValue } from '../../internal/types/date';
import {
  PickerPopoverPart,
  PickerRangeCalendarPart,
} from '../date/PickerParts';
import { Stack } from '../Stack/Stack';
import {
  Description as TextFieldDescription,
  Error as TextFieldError,
  Label as TextFieldLabel,
} from '../TextField/TextField';
import {
  DateRangePicker,
  EndInput,
  Group,
  Root,
  Separator,
  StartInput,
  Trigger,
} from './DateRangePicker';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(DateRangePicker.Calendar, {
        displayName: 'DateRangePicker.Calendar',
      });
      Object.assign(DateRangePicker.Description, {
        displayName: 'DateRangePicker.Description',
      });
      Object.assign(DateRangePicker.EndInput, {
        displayName: 'DateRangePicker.EndInput',
      });
      Object.assign(DateRangePicker.Error, {
        displayName: 'DateRangePicker.Error',
      });
      Object.assign(DateRangePicker.Group, {
        displayName: 'DateRangePicker.Group',
      });
      Object.assign(DateRangePicker.Label, {
        displayName: 'DateRangePicker.Label',
      });
      Object.assign(DateRangePicker.Popover, {
        displayName: 'DateRangePicker.Popover',
      });
      Object.assign(DateRangePicker.Root, {
        displayName: 'DateRangePicker.Root',
      });
      Object.assign(DateRangePicker.Separator, {
        displayName: 'DateRangePicker.Separator',
      });
      Object.assign(DateRangePicker.StartInput, {
        displayName: 'DateRangePicker.StartInput',
      });
      Object.assign(DateRangePicker.Trigger, {
        displayName: 'DateRangePicker.Trigger',
      });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Calendar: PickerRangeCalendarPart,
    Description: TextFieldDescription,
    EndInput,
    Error: TextFieldError,
    Group,
    Label: TextFieldLabel,
    Popover: PickerPopoverPart,
    Separator,
    StartInput,
    Trigger,
  },
  title: 'Date and Time/DateRangePicker',
} satisfies Meta<typeof Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const COMPACT_TOLERANCE = 1;

async function expectContained(inner: DOMRect, outer: DOMRect) {
  await expect(inner.left).toBeGreaterThanOrEqual(
    outer.left - COMPACT_TOLERANCE,
  );
  await expect(inner.right).toBeLessThanOrEqual(
    outer.right + COMPACT_TOLERANCE,
  );
}

function getPartGeometry(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const group = canvas.getByRole('group');
  const startInput = group.querySelector('[slot="start"]');
  const endInput = group.querySelector('[slot="end"]');
  const separator = group.querySelector('.lucide-arrow-right')?.parentElement;
  const trigger = canvas.getByRole('button', { name: /Calendar Dates/ });

  if (
    !(startInput instanceof HTMLElement) ||
    !(endInput instanceof HTMLElement) ||
    !(separator instanceof HTMLElement)
  ) {
    throw new Error('Expected the complete date-range field anatomy.');
  }

  return {
    endInput: endInput.getBoundingClientRect(),
    group: group.getBoundingClientRect(),
    separator: separator.getBoundingClientRect(),
    startInput: startInput.getBoundingClientRect(),
    trigger: trigger.getBoundingClientRect(),
  };
}

function Parts() {
  return (
    <>
      <DateRangePicker.Label>Dates</DateRangePicker.Label>
      <DateRangePicker.Group>
        <DateRangePicker.StartInput />
        <DateRangePicker.Separator />
        <DateRangePicker.EndInput />
        <DateRangePicker.Trigger />
      </DateRangePicker.Group>
      <DateRangePicker.Popover>
        <DateRangePicker.Calendar />
      </DateRangePicker.Popover>
    </>
  );
}

function Controlled() {
  const [value, setValue] = useState<DateRangeValue | null>({
    end: '2026-07-17',
    start: '2026-07-13',
  });

  return (
    <DateRangePicker.Root onChange={setValue} value={value}>
      <Parts />
    </DateRangePicker.Root>
  );
}

/**
 * Renders the complete uncontrolled start-to-end field anatomy and verifies
 * both segmented dates, directional separator, and integrated calendar
 * trigger.
 *
 * @summary uncontrolled date-range field anatomy
 */
export const UncontrolledRange: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group');
    const trigger = canvas.getByRole('button', { name: /Calendar Dates/ });

    await expect(group).toHaveClass('w-full', 'min-h-11', 'border');
    await expect(trigger).toHaveClass('border-0');
    await expect(trigger).not.toHaveClass('border-s', 'border-l');
    await expect(trigger.querySelector('svg')).toHaveClass('lucide-calendar');
    await expect(
      canvas.getAllByRole('spinbutton', { name: /Start date/i }),
    ).toHaveLength(3);
    await expect(
      canvas.getAllByRole('spinbutton', { name: /End date/i }),
    ).toHaveLength(3);
  },
  render: () => (
    <DateRangePicker.Root
      defaultValue={{ end: '2026-07-17', start: '2026-07-13' }}
    >
      <DateRangePicker.Label>Dates</DateRangePicker.Label>
      <DateRangePicker.Group>
        <DateRangePicker.StartInput />
        <DateRangePicker.Separator />
        <DateRangePicker.EndInput />
        <DateRangePicker.Trigger />
      </DateRangePicker.Group>
      <DateRangePicker.Popover>
        <DateRangePicker.Calendar />
      </DateRangePicker.Popover>
    </DateRangePicker.Root>
  ),
};

/**
 * Places one range under application control beside an immutable range and
 * verifies read-only styling is applied coherently to the compound field
 * group.
 *
 * @summary controlled and immutable date-range values
 */
export const ControlledAndReadOnly: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const readOnlyTrigger = within(canvasElement).getAllByRole('button', {
      name: /Calendar Dates/,
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
      <DateRangePicker.Root
        readOnly
        value={{ end: '2026-07-17', start: '2026-07-13' }}
      >
        <Parts />
      </DateRangePicker.Root>
    </Stack>
  ),
};

/**
 * Associates separate start and end form names while combining required
 * invalid feedback, July boundaries, and an unavailable date constraint.
 *
 * @summary constrained range with two native form values
 */
export const BoundariesUnavailableForm: Story = {
  args: { children: null },
  render: () => (
    <DateRangePicker.Root
      form="booking"
      endName="periodEnd"
      invalid
      isDateUnavailable={(date) => date === '2026-07-15'}
      maxValue="2026-07-31"
      minValue="2026-07-01"
      required
      startName="periodStart"
    >
      <Parts />
      <DateRangePicker.Description>July only.</DateRangePicker.Description>
      <DateRangePicker.Error>Select an available range.</DateRangePicker.Error>
    </DateRangePicker.Root>
  ),
};

/**
 * Shows a populated disabled range whose segmented start and end values remain
 * legible while every editing and popup interaction is unavailable.
 *
 * @summary disabled populated date-range picker
 */
export const Disabled: Story = {
  args: { children: null },
  render: () => (
    <DateRangePicker.Root
      defaultValue={{ end: '2026-07-17', start: '2026-07-13' }}
      disabled
    >
      <Parts />
    </DateRangePicker.Root>
  ),
};

/**
 * Fits a non-contiguous cross-month range into a narrow host and verifies the
 * start input, separator, end input, and trigger remain contained in order.
 *
 * @summary narrow non-contiguous cross-month range
 */
export const NarrowNonContiguousRange: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = canvas.getByTestId('narrow-range-host');
    const geometry = getPartGeometry(canvasElement);
    const hostGeometry = host.getBoundingClientRect();

    await expectContained(geometry.group, hostGeometry);
    await expectContained(geometry.startInput, geometry.group);
    await expectContained(geometry.separator, geometry.group);
    await expectContained(geometry.endInput, geometry.group);
    await expectContained(geometry.trigger, geometry.group);
    await expect(geometry.startInput.right).toBeLessThanOrEqual(
      geometry.separator.left + COMPACT_TOLERANCE,
    );
    await expect(geometry.separator.right).toBeLessThanOrEqual(
      geometry.endInput.left + COMPACT_TOLERANCE,
    );
    await expect(geometry.endInput.right).toBeLessThanOrEqual(
      geometry.trigger.left + COMPACT_TOLERANCE,
    );
  },
  render: () => (
    <StoryConstraint size="responsive-narrow" testId="narrow-range-host">
      <DateRangePicker.Root
        allowsNonContiguousRanges
        defaultValue={{ end: '2026-08-02', start: '2026-07-28' }}
      >
        <Parts />
      </DateRangePicker.Root>
    </StoryConstraint>
  ),
};

/**
 * Places a populated range in right-to-left direction and verifies the visual
 * separator mirrors while stable start and end value semantics remain
 * unchanged.
 *
 * @summary right-to-left date-range direction
 */
export const RightToLeft: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const icon = within(canvasElement)
      .getByRole('group')
      .querySelector('.lucide-arrow-right');

    await expect(icon).toHaveClass('rtl:rotate-180');
  },
  render: () => (
    <div dir="rtl">
      <DateRangePicker.Root
        defaultValue={{ end: '2026-07-17', start: '2026-07-13' }}
      >
        <Parts />
      </DateRangePicker.Root>
    </div>
  ),
};
