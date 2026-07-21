import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import {
  CalendarGridPart,
  CalendarHeaderPart,
  CalendarHeadingPart,
  CalendarNextButtonPart,
  CalendarPreviousButtonPart,
} from '../date/CalendarParts';
import { Inline } from '../Inline/Inline';
import { Calendar, Root } from './Calendar';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Calendar.Grid, { displayName: 'Calendar.Grid' });
      Object.assign(Calendar.Header, { displayName: 'Calendar.Header' });
      Object.assign(Calendar.Heading, { displayName: 'Calendar.Heading' });
      Object.assign(Calendar.NextButton, {
        displayName: 'Calendar.NextButton',
      });
      Object.assign(Calendar.PreviousButton, {
        displayName: 'Calendar.PreviousButton',
      });
      Object.assign(Calendar.Root, { displayName: 'Calendar.Root' });

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
  title: 'Date and Time/Calendar',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;
function Parts() {
  return (
    <>
      <Calendar.Header>
        <Calendar.PreviousButton />
        <Calendar.Heading />
        <Calendar.NextButton />
      </Calendar.Header>
      <Calendar.Grid />
    </>
  );
}
function Controlled() {
  const [value, setValue] = useState<string | null>('2026-07-13');

  return (
    <Calendar.Root onChange={setValue} value={value}>
      <Parts />
    </Calendar.Root>
  );
}
async function expectContentVerticallyCentred(element: HTMLElement) {
  const textNode = [...element.childNodes].find(
    (node) => node.textContent?.trim() === element.textContent?.trim(),
  );

  if (textNode === undefined) {
    throw new Error('Expected calendar cell text content.');
  }

  const range = element.ownerDocument.createRange();

  range.selectNodeContents(textNode);

  const elementBounds = element.getBoundingClientRect();
  const contentBounds = range.getBoundingClientRect();
  const topInset = contentBounds.top - elementBounds.top;
  const bottomInset = elementBounds.bottom - contentBounds.bottom;

  await expect(elementBounds.height).toBeGreaterThanOrEqual(44);
  await expect(Math.abs(topInset - bottomInset)).toBeLessThanOrEqual(2);
}
/**
 * Uses an uncontrolled ISO date and verifies full-width seven-column geometry
 * plus ArrowRight and Enter selection, making this the baseline keyboard
 * calendar example.
 *
 * @summary Uncontrolled keyboard selection in a single-month grid.
 */
export const KeyboardSelection: Story = {
  args: { children: null },
  decorators: [
    (Story) => (
      <StoryConstraint size="bounded-calendar" testId="calendar-host">
        <Story />
      </StoryConstraint>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const calendar = canvas.getByRole('application');
    const grid = canvas.getByRole('grid');
    const host = canvas.getByTestId('calendar-host');
    const selected = canvas.getByRole('button', {
      name: /13.*July.*2026/i,
    });

    await expect(calendar.getBoundingClientRect().width).toBeCloseTo(
      host.getBoundingClientRect().width,
      0,
    );
    await expect(grid.getBoundingClientRect().width).toBeCloseTo(
      calendar.getBoundingClientRect().width,
      0,
    );
    await expect(selected.getBoundingClientRect().width).toBeCloseTo(
      grid.getBoundingClientRect().width / 7,
      0,
    );
    await expectContentVerticallyCentred(selected);
    selected.focus();
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect(
      canvas.getByRole('button', { name: /14.*July.*2026/i }),
    ).toHaveAttribute('data-selected');
  },
  render: () => (
    <Calendar.Root defaultValue="2026-07-13">
      <Calendar.Header>
        <Calendar.PreviousButton />
        <Calendar.Heading />
        <Calendar.NextButton />
      </Calendar.Header>
      <Calendar.Grid />
    </Calendar.Root>
  ),
};
/**
 * Places a stateful controlled calendar beside an immutable read-only calendar
 * to distinguish application-owned selection from inspectable selection that
 * cannot change.
 *
 * @summary Controlled and immutable read-only date selection.
 */
export const ControlledAndReadOnly: Story = {
  args: { children: null },
  render: () => (
    <Inline align="stretch" gap="xl" wrap={false}>
      <Controlled />
      <Calendar.Root readOnly value="2026-07-13">
        <Parts />
      </Calendar.Root>
    </Inline>
  ),
};
/**
 * Combines July date boundaries, an unavailable day callback, and invalid
 * state to show how applications constrain selection while keeping values as
 * stable YYYY-MM-DD strings.
 *
 * @summary Bounded invalid calendar with one unavailable date.
 */
export const BoundariesUnavailableInvalid: Story = {
  args: { children: null },
  render: () => (
    <Calendar.Root
      defaultValue="2026-07-13"
      invalid
      isDateUnavailable={(date) => date === '2026-07-14'}
      maxValue="2026-07-31"
      minValue="2026-07-01"
    >
      <Parts />
    </Calendar.Root>
  ),
};
/**
 * Sets `visibleMonths={2}` around a year boundary so consumers can inspect the
 * supported multi-month layout and date continuity without introducing a
 * separate range-selection contract.
 *
 * @summary Two visible months across a year boundary.
 */
export const MultipleMonthsExtreme: Story = {
  args: { children: null },
  render: () => (
    <Calendar.Root defaultValue="2026-12-31" visibleMonths={2}>
      <Parts />
    </Calendar.Root>
  ),
};

/**
 * Constrains the calendar to a 16rem host and verifies the root, header, grid,
 * and seven weekday columns share the available width without changing
 * selection semantics.
 *
 * @summary Single-month grid fitted to a narrow container.
 */
export const NarrowResponsiveGrid: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = canvas.getByTestId('narrow-calendar-host');
    const calendar = canvas.getByRole('application');
    const grid = canvas.getByRole('grid');
    const header = calendar.querySelector<HTMLElement>(':scope > div[class]');
    const weekdayCells = Array.from(grid.querySelectorAll<HTMLElement>('th'));

    if (header === null) {
      throw new Error('Expected the calendar navigation header.');
    }

    const hostWidth = host.getBoundingClientRect().width;
    const calendarWidth = calendar.getBoundingClientRect().width;
    const gridWidth = grid.getBoundingClientRect().width;
    const headerWidth = header.getBoundingClientRect().width;
    const weekdayWidths = weekdayCells.map(
      (cell) => cell.getBoundingClientRect().width,
    );

    await expect(calendarWidth).toBeCloseTo(hostWidth, 0);
    await expect(gridWidth).toBeCloseTo(hostWidth, 0);
    await expect(headerWidth).toBeCloseTo(hostWidth, 0);
    await expect(weekdayCells).toHaveLength(7);
    await Promise.all(
      weekdayWidths.map((width) => expect(width).toBeCloseTo(gridWidth / 7, 0)),
    );
  },
  render: () => (
    <StoryConstraint size="narrow-control" testId="narrow-calendar-host">
      <Calendar.Root defaultValue="2026-07-13">
        <Parts />
      </Calendar.Root>
    </StoryConstraint>
  ),
};
