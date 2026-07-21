import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { DateRangeValue } from '../../internal/types/date';
import {
  CalendarGridPart,
  CalendarHeaderPart,
  CalendarHeadingPart,
  CalendarNextButtonPart,
  CalendarPreviousButtonPart,
} from '../date/CalendarParts';
import { Inline } from '../Inline/Inline';
import { RangeCalendar, Root } from './RangeCalendar';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(RangeCalendar.Grid, {
        displayName: 'RangeCalendar.Grid',
      });
      Object.assign(RangeCalendar.Header, {
        displayName: 'RangeCalendar.Header',
      });
      Object.assign(RangeCalendar.Heading, {
        displayName: 'RangeCalendar.Heading',
      });
      Object.assign(RangeCalendar.NextButton, {
        displayName: 'RangeCalendar.NextButton',
      });
      Object.assign(RangeCalendar.PreviousButton, {
        displayName: 'RangeCalendar.PreviousButton',
      });
      Object.assign(RangeCalendar.Root, {
        displayName: 'RangeCalendar.Root',
      });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Grid: CalendarGridPart,
    Header: CalendarHeaderPart,
    Heading: CalendarHeadingPart,
    NextButton: CalendarNextButtonPart,
    PreviousButton: CalendarPreviousButtonPart,
  },
  title: 'Date and Time/RangeCalendar',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;
function Parts() {
  return (
    <>
      <RangeCalendar.Header>
        <RangeCalendar.PreviousButton />
        <RangeCalendar.Heading />
        <RangeCalendar.NextButton />
      </RangeCalendar.Header>
      <RangeCalendar.Grid />
    </>
  );
}
function Controlled() {
  const [value, setValue] = useState<DateRangeValue | null>({
    end: '2026-07-17',
    start: '2026-07-13',
  });

  return (
    <RangeCalendar.Root onChange={setValue} value={value}>
      <Parts />
    </RangeCalendar.Root>
  );
}
/**
 * Starts from an uncontrolled inclusive range and verifies selecting new start
 * and end dates reports stable ISO strings to the application callback.
 *
 * @summary uncontrolled inclusive date-range selection
 */
export const UncontrolledRange: Story = {
  args: { children: null, onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', {
        name: /^(?:Today, )?Monday,? 20 July 2026$/i,
      }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: /^Wednesday,? 22 July 2026$/i }),
    );
    await expect(args.onChange).toHaveBeenLastCalledWith({
      end: '2026-07-22',
      start: '2026-07-20',
    });
  },
  render: ({ onChange }) => (
    <RangeCalendar.Root
      defaultValue={{ end: '2026-07-17', start: '2026-07-13' }}
      onChange={onChange}
    >
      <RangeCalendar.Header>
        <RangeCalendar.PreviousButton />
        <RangeCalendar.Heading />
        <RangeCalendar.NextButton />
      </RangeCalendar.Header>
      <RangeCalendar.Grid />
    </RangeCalendar.Root>
  ),
};
/**
 * Compares an application-controlled calendar with an immutable read-only
 * calendar that displays the same stable selected range.
 *
 * @summary controlled and read-only date ranges side by side
 */
export const ControlledAndReadOnly: Story = {
  args: { children: null },
  render: () => (
    <Inline align="stretch" gap="xl" wrap={false}>
      <Controlled />
      <RangeCalendar.Root
        readOnly
        value={{ end: '2026-07-17', start: '2026-07-13' }}
      >
        <Parts />
      </RangeCalendar.Root>
    </Inline>
  ),
};
/**
 * Presents minimum and maximum boundaries, one unavailable date, and explicit
 * invalid state around an existing range selection.
 *
 * @summary bounded invalid range with an unavailable date
 */
export const BoundariesUnavailableInvalid: Story = {
  args: { children: null },
  render: () => (
    <RangeCalendar.Root
      defaultValue={{ end: '2026-07-17', start: '2026-07-13' }}
      invalid
      isDateUnavailable={(date) => date === '2026-07-15'}
      maxValue="2026-07-31"
      minValue="2026-07-01"
    >
      <Parts />
    </RangeCalendar.Root>
  ),
};
/**
 * Displays two adjacent months and allows a selected range to span unavailable
 * dates, documenting the explicit non-contiguous selection mode.
 *
 * @summary two-month non-contiguous range selection
 */
export const MultipleMonthsNonContiguous: Story = {
  args: { children: null },
  render: () => (
    <RangeCalendar.Root
      allowsNonContiguousRanges
      defaultValue={{ end: '2026-08-02', start: '2026-07-28' }}
      visibleMonths={2}
    >
      <Parts />
    </RangeCalendar.Root>
  ),
};
