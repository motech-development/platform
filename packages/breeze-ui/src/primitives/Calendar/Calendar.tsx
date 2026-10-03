import type { CalendarDate } from '@internationalized/date';
import { parseDate } from '@internationalized/date';
import {
  createElement,
  type JSX as ReactJSX,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import { joinClassNames } from '../../fields/field.styles';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Icon } from '../Icon/Icon';
import type { IsoCalendarDate } from '../Typography/Typography';

const calendarVariants = {
  base: {
    cell: 'breeze:grid breeze:block-breeze-9 breeze:inline-full breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap breeze:place-items-center breeze:rounded-breeze-ctl breeze:font-breeze-sans breeze:text-breeze-sm breeze:tabular-nums breeze:outline-offset-2 breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand',
    disabledRoot: 'breeze:pointer-events-none breeze:[&>div:last-child]:hidden',
    grid: 'breeze:-m-breeze-px breeze:inline-[calc(100%+2px)] breeze:table-fixed breeze:border-separate breeze:border-spacing-breeze-px breeze:any-pointer-coarse:m-0 breeze:any-pointer-coarse:inline-full breeze:any-pointer-coarse:border-spacing-[0px]',
    header: 'breeze:flex breeze:items-center breeze:gap-[6px]',
    heading:
      'breeze:m-0 breeze:min-inline-0 breeze:grow breeze:font-breeze-sans breeze:text-breeze-sm breeze:font-semibold breeze:text-breeze-ink',
    navButton:
      'breeze:grid breeze:block-breeze-8 breeze:inline-breeze-8 breeze:shrink-0 breeze:place-items-center breeze:rounded-breeze-ctl breeze:border-0 breeze:bg-transparent breeze:p-0 breeze:text-breeze-ink breeze:outline-offset-2 breeze:data-[hovered]:bg-breeze-raised breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:opacity-50 breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap',
    root: 'breeze:flex breeze:flex-col breeze:gap-breeze-2 breeze:outline-none',
    weekday:
      'breeze:p-0 breeze:pbe-[7px] breeze:block-[35px] breeze:text-center breeze:font-breeze-sans breeze:text-breeze-2xs breeze:font-semibold breeze:uppercase breeze:tracking-[0.05em] breeze:text-breeze-ink-3',
  },
  compound: {},
  size: {},
  state: {
    disabledCell: 'breeze:cursor-not-allowed breeze:opacity-50',
    plainCell:
      'breeze:text-breeze-ink breeze:data-[hovered]:bg-breeze-raised breeze:data-[outside-month]:text-breeze-ink-3',
    selectedCell:
      'breeze:bg-breeze-brand breeze:font-semibold breeze:text-breeze-on-brand breeze:forced-colors:data-[selected]:outline-2 breeze:forced-colors:data-[selected]:outline-solid breeze:forced-colors:data-[selected]:outline-offset-2',
    todayCell:
      'breeze:border breeze:border-solid breeze:border-breeze-brand breeze:font-semibold breeze:text-breeze-brand-text',
  },
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

function CalendarContent({ disabled }: Readonly<{ disabled: boolean }>) {
  return (
    <>
      <div className={calendarVariants.base.header}>
        <AriaCalendarHeading className={calendarVariants.base.heading} />
        <AriaButton
          className={calendarVariants.base.navButton}
          isDisabled={disabled}
          slot="previous"
        >
          <Icon name="back" size="sm" />
        </AriaButton>
        <AriaButton
          className={calendarVariants.base.navButton}
          isDisabled={disabled}
          slot="next"
        >
          <Icon name="forward" size="sm" />
        </AriaButton>
      </div>
      <AriaCalendarGrid
        className={calendarVariants.base.grid}
        weekdayStyle="narrow"
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
                  disabled && calendarVariants.state.disabledCell,
                  isSelected && calendarVariants.state.selectedCell,
                  isToday && !isSelected && calendarVariants.state.todayCell,
                  !isToday && !isSelected && calendarVariants.state.plainCell,
                )
              }
              date={date}
              render={(props) =>
                createElement('div', {
                  ...props,
                  'aria-disabled': disabled || props['aria-disabled'],
                  ...(disabled ? { 'data-disabled': true } : {}),
                  tabIndex: disabled ? -1 : props.tabIndex,
                })
              }
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
}: Readonly<CalendarSurfaceProps>): ReactElement {
  const selectedValueKey = value?.toString();
  const previousSelectedValueKey = useRef(selectedValueKey);
  const [focusedValue, setFocusedValue] = useState(value ?? undefined);

  useEffect(() => {
    if (selectedValueKey === previousSelectedValueKey.current) return;

    previousSelectedValueKey.current = selectedValueKey;

    if (value != null) {
      setFocusedValue(value);
    }
  }, [selectedValueKey, value]);

  const currentFocusedValue =
    value != null && selectedValueKey !== previousSelectedValueKey.current
      ? value
      : focusedValue;
  const focusProps =
    value == null
      ? {}
      : {
          focusedValue: currentFocusedValue,
          onFocusChange: setFocusedValue,
        };
  const calendarValue = value === undefined ? {} : { value };
  const calendarDefaultValue =
    defaultValue === undefined ? {} : { defaultValue };
  const calendarOnChange = onChange === undefined ? {} : { onChange };
  const calendarProps = {
    'aria-label': label,
    autoFocus: autoFocus && !disabled,
    className: joinClassNames(
      calendarVariants.base.root,
      disabled && calendarVariants.base.disabledRoot,
    ),
    firstDayOfWeek: 'mon' as const,
    isReadOnly: disabled,
    render: disabled
      ? (props: ReactJSX.IntrinsicElements['div']) =>
          createElement('div', {
            ...props,
            'aria-disabled': true,
            onKeyDownCapture: (event: ReactKeyboardEvent<HTMLDivElement>) => {
              if (event.key === 'Tab' || event.key === 'Escape') return;

              event.preventDefault();
              event.stopPropagation();
            },
          })
      : undefined,
    weeksInMonth: 6,
    ...focusProps,
    ...calendarDefaultValue,
    ...calendarOnChange,
    ...calendarValue,
  };

  return createElement(
    AriaCalendar<CalendarDate>,
    calendarProps,
    <CalendarContent disabled={disabled} />,
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
  useBreezeContext();

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
