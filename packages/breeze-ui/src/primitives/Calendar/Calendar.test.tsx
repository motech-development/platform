import { getLocalTimeZone, today } from '@internationalized/date';
import { screen, waitFor, within } from '@testing-library/react';
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
expectTypeOf<CalendarProps['loading']>().toEqualTypeOf<boolean | undefined>();

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

  it('preserves its selected date while loading and restores it when ready', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: IsoCalendarDate) => void>();
    const { rerender } = renderBreeze(
      <Calendar
        defaultValue="2026-09-03"
        label="Choose date"
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Friday, 4 September 2026' }),
    );
    expect(onChange).toHaveBeenLastCalledWith('2026-09-04');
    const septemberCalendar = screen.getByRole('application', {
      name: /Choose date, September 2026/,
    });
    const nextMonthButton = septemberCalendar.querySelector<HTMLButtonElement>(
      'button[slot="next"]',
    );

    if (!nextMonthButton) {
      throw new Error('Expected a next-month calendar button.');
    }

    await user.click(nextMonthButton);
    expect(
      screen.getByRole('application', {
        name: /Choose date, October 2026/,
      }),
    ).toBeInTheDocument();

    rerender(
      <BreezeProvider locale="en-GB">
        <Calendar
          defaultValue="2026-09-03"
          label="Choose date"
          loading
          onChange={onChange}
        />
      </BreezeProvider>,
    );

    const loadingCalendar = screen.getByRole('group', {
      name: 'Choose date',
    });
    const loadingTable = loadingCalendar.querySelector('table');

    expect(loadingCalendar).toHaveAttribute('aria-busy', 'true');
    expect(
      screen.getByRole('progressbar', { name: 'Loading' }),
    ).toBeInTheDocument();
    expect(loadingTable?.querySelectorAll('tbody tr')).toHaveLength(6);
    expect(loadingTable?.querySelectorAll('tbody td')).toHaveLength(42);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('application', {
        name: /Choose date, October 2026/,
      }),
    ).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(1);

    rerender(
      <BreezeProvider locale="en-GB">
        <Calendar
          defaultValue="2026-09-03"
          label="Choose date"
          onChange={onChange}
        />
      </BreezeProvider>,
    );

    const octoberCalendar = screen.getByRole('application', {
      name: /Choose date, October 2026/,
    });
    const previousMonthButton =
      octoberCalendar.querySelector<HTMLButtonElement>(
        'button[slot="previous"]',
      );

    expect(octoberCalendar).toBeInTheDocument();
    if (!previousMonthButton) {
      throw new Error('Expected a previous-month calendar button.');
    }

    await user.click(previousMonthButton);
    expect(
      within(
        screen.getByRole('application', {
          name: /Choose date, September 2026/,
        }),
      ).getByRole('button', {
        name: 'Friday, 4 September 2026 selected',
      }),
    ).toBeInTheDocument();
  });

  it('autofocuses its date after an initially loading state clears', async () => {
    const { rerender } = renderBreeze(
      <Calendar
        autoFocus
        defaultValue="2026-09-03"
        label="Choose date"
        loading
      />,
    );

    expect(document.activeElement).toBe(document.body);
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();

    rerender(
      <BreezeProvider locale="en-GB">
        <Calendar autoFocus defaultValue="2026-09-03" label="Choose date" />
      </BreezeProvider>,
    );

    const selectedDate = screen.getByRole('button', {
      name: 'Thursday, 3 September 2026 selected',
    });

    await waitFor(() => expect(selectedDate).toHaveFocus());
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
