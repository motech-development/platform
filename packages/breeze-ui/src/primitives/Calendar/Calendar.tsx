import type { CalendarDate } from '@internationalized/date';
import { parseDate } from '@internationalized/date';
import { createElement } from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import {
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  CalendarHeading as AriaCalendarHeading,
} from 'react-aria-components/Calendar';
import { joinClassNames } from '../Field/field.styles';
import { Icon } from '../Icon/Icon';
import type { IsoCalendarDate } from '../Typography/Typography';

const calendarVariants = {
  base: {
    cell: 'breeze:grid breeze:min-block-breeze-9 breeze:min-inline-breeze-9 breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap breeze:place-items-center breeze:rounded-breeze-full breeze:font-breeze-sans breeze:text-breeze-sm breeze:text-breeze-ink breeze:outline-offset-2 breeze:data-[focused]:bg-breeze-sunken breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[hovered]:bg-breeze-sunken breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:opacity-50 breeze:data-[outside-month]:text-breeze-ink-3',
    grid: 'breeze:w-full breeze:table-fixed breeze:border-separate breeze:border-spacing-1 breeze:any-pointer-coarse:border-spacing-0',
    header:
      'breeze:mb-breeze-2 breeze:flex breeze:min-block-breeze-tap breeze:items-center breeze:justify-between',
    heading:
      'breeze:m-0 breeze:font-breeze-sans breeze:text-breeze-sm breeze:font-semibold breeze:text-breeze-ink',
    navButton:
      'breeze:grid breeze:block-size-breeze-8 breeze:inline-size-breeze-8 breeze:place-items-center breeze:rounded-breeze-full breeze:border-0 breeze:bg-transparent breeze:text-breeze-ink-2 breeze:outline-offset-2 breeze:hover:bg-breeze-sunken breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap',
    root: 'breeze:flex breeze:flex-col breeze:gap-breeze-2 breeze:outline-none',
    selectedCell:
      'breeze:bg-breeze-brand breeze:text-breeze-on-brand breeze:data-[outside-month]:data-[selected]:text-breeze-on-brand breeze:data-[hovered]:bg-breeze-brand',
    todayCell:
      'breeze:outline-2 breeze:outline-solid breeze:outline-breeze-brand',
    weekday:
      'breeze:pb-breeze-1 breeze:text-center breeze:font-breeze-sans breeze:text-breeze-xs breeze:font-medium breeze:text-breeze-ink-3',
  },
  compound: {},
  size: {},
  state: {},
  variant: {},
} as const;

interface CalendarCommonProps {
  /** Focuses the current date when the calendar mounts. */
  autoFocus?: boolean;
  /** Prevents date changes. Defaults to `false`. */
  disabled?: boolean;
  /** Accessible name for the calendar grid. */
  label: string;
}

interface ControlledCalendarProps {
  /** Current selected ISO calendar date. */
  value: IsoCalendarDate;
  /** Reports the selected ISO calendar date without exposing a DOM event. */
  onChange: (value: IsoCalendarDate) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  defaultValue?: never;
}

interface UncontrolledCalendarProps {
  /** Initial selected ISO calendar date. */
  defaultValue?: IsoCalendarDate;
  /** Reports the selected ISO calendar date without exposing a DOM event. */
  onChange?: (value: IsoCalendarDate) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  value?: never;
}

/** Props for a controlled or uncontrolled single-date calendar. */
export type CalendarProps = CalendarCommonProps &
  (ControlledCalendarProps | UncontrolledCalendarProps);

export function parseCalendarDate(value: IsoCalendarDate): CalendarDate | null {
  try {
    return parseDate(value);
  } catch {
    return null;
  }
}

interface CalendarSurfaceProps {
  autoFocus?: boolean;
  disabled: boolean;
  label: string;
  value?: CalendarDate | null;
  defaultValue?: CalendarDate | null;
  onChange?: (value: CalendarDate | null) => void;
}

function CalendarContent() {
  return (
    <>
      <div className={calendarVariants.base.header}>
        <AriaButton className={calendarVariants.base.navButton} slot="previous">
          <Icon name="back" size="sm" />
        </AriaButton>
        <AriaCalendarHeading className={calendarVariants.base.heading} />
        <AriaButton className={calendarVariants.base.navButton} slot="next">
          <Icon name="next" size="sm" />
        </AriaButton>
      </div>
      <AriaCalendarGrid
        className={calendarVariants.base.grid}
        weekdayStyle="short"
      >
        <AriaCalendarGridHeader>
          {(day) => (
            <AriaCalendarHeaderCell className={calendarVariants.base.weekday}>
              {day}
            </AriaCalendarHeaderCell>
          )}
        </AriaCalendarGridHeader>
        <AriaCalendarGridBody>
          {(date) => (
            <AriaCalendarCell
              className={({ isSelected, isToday }) =>
                joinClassNames(
                  calendarVariants.base.cell,
                  isSelected && calendarVariants.base.selectedCell,
                  isToday && !isSelected && calendarVariants.base.todayCell,
                )
              }
              date={date}
            />
          )}
        </AriaCalendarGridBody>
      </AriaCalendarGrid>
    </>
  );
}

export function CalendarSurface({
  autoFocus,
  defaultValue,
  disabled,
  label,
  onChange,
  value,
}: Readonly<CalendarSurfaceProps>) {
  const calendarValue = value === undefined ? {} : { value };
  const calendarDefaultValue =
    defaultValue === undefined ? {} : { defaultValue };
  const calendarOnChange = onChange === undefined ? {} : { onChange };
  const calendarProps = {
    'aria-label': label,
    autoFocus,
    className: calendarVariants.base.root,
    firstDayOfWeek: 'mon' as const,
    isDisabled: disabled,
    weeksInMonth: 6,
    ...calendarDefaultValue,
    ...calendarOnChange,
    ...calendarValue,
  };

  return createElement(
    AriaCalendar<CalendarDate>,
    calendarProps,
    <CalendarContent />,
  );
}

/**
 * Renders an accessible six-week, Monday-first calendar with ISO date values.
 *
 * @summary Single-date calendar selection with semantic ISO values.
 */
export function Calendar({
  autoFocus = false,
  defaultValue,
  disabled = false,
  label,
  onChange,
  value,
}: Readonly<CalendarProps>) {
  const selectedValue =
    value === undefined ? undefined : parseCalendarDate(value);
  const initialValue =
    defaultValue === undefined ? undefined : parseCalendarDate(defaultValue);

  const handleChange = (date: CalendarDate | null) => {
    if (date) {
      onChange?.(date.toString() as IsoCalendarDate);
    }
  };

  return (
    <CalendarSurface
      autoFocus={autoFocus}
      defaultValue={initialValue}
      disabled={disabled}
      label={label}
      onChange={handleChange}
      value={selectedValue}
    />
  );
}
