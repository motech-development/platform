import { getLocalTimeZone, today } from '@internationalized/date';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import type { IsoCalendarDate } from '../Typography/Typography';
import { Calendar, type CalendarProps } from './Calendar';

expectTypeOf<CalendarProps>().not.toHaveProperty('className');
expectTypeOf<CalendarProps>().not.toHaveProperty('style');
expectTypeOf<CalendarProps>().not.toHaveProperty('slot');
expectTypeOf<CalendarProps['onChange']>().toEqualTypeOf<
  ((value: IsoCalendarDate) => void) | undefined
>();

const controlledCalendar = (
  <Calendar label="Choose date" onChange={() => undefined} value="2026-09-03" />
);
const uncontrolledCalendar = (
  <Calendar defaultValue="2026-09-03" label="Choose date" />
);
const mixedCalendar = (
  <Calendar
    defaultValue="2026-09-03"
    label="Choose date"
    onChange={() => undefined}
    // @ts-expect-error Controlled and uncontrolled values are exclusive.
    value="2026-09-04"
  />
);

expectTypeOf(controlledCalendar).toBeObject();
expectTypeOf(uncontrolledCalendar).toBeObject();
expectTypeOf(mixedCalendar).toBeObject();

describe('Calendar', () => {
  it('starts weeks on Monday and always renders six weeks', () => {
    renderBreeze(<Calendar defaultValue="2026-03-15" label="Choose date" />);

    const calendar = screen.getByRole('application', {
      name: /Choose date, March 2026/,
    });
    const grid = within(calendar).getByRole('grid');

    expect(grid.querySelectorAll('tbody tr')).toHaveLength(6);
    expect(
      Array.from(grid.querySelectorAll('thead th')).map(
        (cell) => cell.textContent,
      ),
    ).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    expect(
      within(calendar).getByRole('button', { name: /23 February 2026/ }),
    ).toHaveAttribute('data-outside-month', 'true');
  });

  it('renders six rows for February 2027', () => {
    renderBreeze(<Calendar defaultValue="2027-02-01" label="Choose date" />);

    const calendar = screen.getByRole('application', {
      name: /Choose date, February 2027/,
    });
    const grid = within(calendar).getByRole('grid');

    expect(grid.querySelectorAll('tbody tr')).toHaveLength(6);
    expect(
      within(grid).getByRole('button', { name: /Sunday, 7 March 2027/ }),
    ).toHaveAttribute('data-outside-month', 'true');
  });

  it('follows changed controlled dates but preserves navigation for stable values', async () => {
    const user = userEvent.setup();
    const { rerender } = renderBreeze(
      <Calendar
        label="Choose date"
        onChange={() => undefined}
        value="2026-09-03"
      />,
    );

    const calendar = screen.getByRole('application', {
      name: /Choose date, September 2026/,
    });
    const nextButton = calendar.querySelector<HTMLButtonElement>(
      'button[slot="next"]',
    );
    if (!nextButton) throw new Error('Expected a next-month calendar button.');

    await user.click(nextButton);
    expect(
      screen.getByRole('application', { name: /Choose date, October 2026/ }),
    ).toBeInTheDocument();

    rerender(
      <BreezeProvider locale="en-GB">
        <Calendar
          label="Choose date"
          onChange={() => undefined}
          value="2026-09-03"
        />
      </BreezeProvider>,
    );
    expect(
      screen.getByRole('application', { name: /Choose date, October 2026/ }),
    ).toBeInTheDocument();

    rerender(
      <BreezeProvider locale="en-GB">
        <Calendar
          label="Choose date"
          onChange={() => undefined}
          value="2026-12-03"
        />
      </BreezeProvider>,
    );
    expect(
      screen.getByRole('application', { name: /Choose date, December 2026/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /Thursday, 3 December 2026 selected/,
      }),
    ).toBeInTheDocument();
  });

  it('lets selection take precedence over today and reports ISO dates', async () => {
    const user = userEvent.setup();
    const currentDate = today(getLocalTimeZone());
    const selectedDate = currentDate.toString() as IsoCalendarDate;
    const nextDate =
      currentDate.day > 1
        ? currentDate.subtract({ days: 1 })
        : currentDate.add({ days: 1 });
    const formatDate = (date: typeof currentDate) =>
      new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        timeZone: 'UTC',
        weekday: 'long',
        year: 'numeric',
      }).format(date.toDate('UTC'));
    const onChange = vi.fn<(value: IsoCalendarDate) => void>();

    renderBreeze(
      <Calendar label="Choose date" onChange={onChange} value={selectedDate} />,
    );

    const todayCell = screen.getByRole('button', {
      name: new RegExp(`${formatDate(currentDate)} selected$`),
    });

    expect(todayCell).toHaveAttribute('data-selected', 'true');
    expect(todayCell).toHaveAttribute('data-today', 'true');
    expect(todayCell).toHaveClass('breeze:bg-breeze-brand');
    expect(todayCell).not.toHaveClass('breeze:outline-breeze-brand');

    await user.click(
      screen.getByRole('button', { name: formatDate(nextDate) }),
    );

    expect(onChange).toHaveBeenLastCalledWith(nextDate.toString());
  });

  it('provides coarse-pointer targets for the calendar controls and dates', () => {
    renderBreeze(<Calendar defaultValue="2026-09-03" label="Choose date" />);

    expect(screen.getByRole('button', { name: 'Previous' })).toHaveClass(
      'breeze:any-pointer-coarse:min-block-breeze-tap',
      'breeze:any-pointer-coarse:min-inline-breeze-tap',
    );
    expect(
      screen.getByRole('button', {
        name: /^Thursday, 3 September 2026 selected$/,
      }),
    ).toHaveClass(
      'breeze:any-pointer-coarse:min-block-breeze-tap',
      'breeze:any-pointer-coarse:min-inline-breeze-tap',
    );
  });

  it('does not throw when an ISO-typed date cannot be parsed', () => {
    const value = '2026-9-3' as IsoCalendarDate;

    expect(() =>
      renderBreeze(
        <Calendar
          label="Choose date"
          onChange={() => undefined}
          value={value}
        />,
      ),
    ).not.toThrow();
  });

  it('does not throw when an ISO-typed default date cannot be parsed', () => {
    const defaultValue = '2026-9-3' as IsoCalendarDate;

    expect(() =>
      renderBreeze(
        <Calendar defaultValue={defaultValue} label="Choose date" />,
      ),
    ).not.toThrow();
  });
});
