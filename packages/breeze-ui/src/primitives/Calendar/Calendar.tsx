import type { CalendarDate } from '@internationalized/date';
import { parseDate } from '@internationalized/date';
import {
  createElement,
  type FocusEvent as ReactFocusEvent,
  type JSX as ReactJSX,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useLayoutEffect,
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
import { useBreezeContext } from '../../provider/BreezeContext';
import { joinClassNames } from '../Field/field.styles';
import { Icon } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import type { IsoCalendarDate } from '../Typography/Typography';

const calendarVariants = {
  base: {
    cell: 'breeze:grid breeze:min-block-breeze-9 breeze:min-inline-breeze-9 breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap breeze:place-items-center breeze:rounded-breeze-full breeze:font-breeze-sans breeze:text-breeze-sm breeze:text-breeze-ink breeze:outline-offset-2 breeze:data-[focused]:bg-breeze-sunken breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[hovered]:bg-breeze-sunken breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:opacity-50 breeze:data-[outside-month]:text-breeze-ink-3',
    disabledRoot: 'breeze:pointer-events-none breeze:[&>div:last-child]:hidden',
    grid: 'breeze:w-full breeze:table-fixed breeze:border-separate breeze:border-spacing-1 breeze:any-pointer-coarse:border-spacing-0',
    header:
      'breeze:mb-breeze-2 breeze:flex breeze:min-block-breeze-tap breeze:items-center breeze:justify-between',
    heading:
      'breeze:m-0 breeze:font-breeze-sans breeze:text-breeze-sm breeze:font-semibold breeze:text-breeze-ink',
    loadingGrid:
      'breeze:flex breeze:w-full breeze:flex-col breeze:gap-breeze-1 breeze:any-pointer-coarse:gap-0',
    loadingWeek:
      'breeze:grid breeze:w-full breeze:grid-cols-7 breeze:gap-breeze-1 breeze:any-pointer-coarse:gap-0',
    loadingWeekday: 'breeze:grid breeze:place-items-center',
    navButton:
      'breeze:grid breeze:block-size-breeze-8 breeze:inline-size-breeze-8 breeze:place-items-center breeze:rounded-breeze-full breeze:border-0 breeze:bg-transparent breeze:text-breeze-ink-2 breeze:outline-offset-2 breeze:hover:bg-breeze-sunken breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:opacity-50 breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap',
    root: 'breeze:flex breeze:flex-col breeze:gap-breeze-2 breeze:outline-none',
    selectedCell:
      'breeze:bg-breeze-brand breeze:text-breeze-on-brand breeze:data-[focused]:data-[selected]:bg-breeze-brand breeze:data-[selected]:data-[hovered]:bg-breeze-brand breeze:data-[outside-month]:data-[selected]:text-breeze-on-brand',
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
  /** Replaces the calendar with a shape-preserving loading presentation. */
  loading?: boolean;
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

const loadingWeeks = Array.from({ length: 6 }, (_, week) => week);
const loadingWeekdays = Array.from({ length: 7 }, (_, day) => day);

function CalendarLoading({ label }: Readonly<{ label: string }>) {
  const { messages } = useBreezeContext();

  return (
    <section
      aria-busy="true"
      aria-label={label}
      className={calendarVariants.base.root}
    >
      <div className={calendarVariants.base.header}>
        <span aria-hidden="true" className={calendarVariants.base.navButton}>
          <Skeleton blockSize="1.25rem" inlineSize="1.25rem" shape="circle" />
        </span>
        <span className={calendarVariants.base.heading}>
          <Skeleton
            blockSize="1lh"
            inlineSize="8em"
            label={messages.loading}
            shape="rectangle"
          />
        </span>
        <span aria-hidden="true" className={calendarVariants.base.navButton}>
          <Skeleton blockSize="1.25rem" inlineSize="1.25rem" shape="circle" />
        </span>
      </div>
      <div aria-hidden="true" className={calendarVariants.base.loadingGrid}>
        <div className={calendarVariants.base.loadingWeek}>
          {loadingWeekdays.map((weekday) => (
            <div
              className={joinClassNames(
                calendarVariants.base.weekday,
                calendarVariants.base.loadingWeekday,
              )}
              key={weekday}
            >
              <Skeleton blockSize="1lh" inlineSize="1.5em" shape="rectangle" />
            </div>
          ))}
        </div>
        {loadingWeeks.map((week) => (
          <div className={calendarVariants.base.loadingWeek} key={week}>
            {loadingWeekdays.map((weekday) => (
              <div className={calendarVariants.base.cell} key={weekday}>
                <Skeleton
                  blockSize="1.5rem"
                  inlineSize="1.5rem"
                  shape="circle"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

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
        <AriaButton
          className={calendarVariants.base.navButton}
          isDisabled={disabled}
          slot="previous"
        >
          <Icon name="back" size="sm" />
        </AriaButton>
        <AriaCalendarHeading className={calendarVariants.base.heading} />
        <AriaButton
          className={calendarVariants.base.navButton}
          isDisabled={disabled}
          slot="next"
        >
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
}: Readonly<CalendarSurfaceProps>) {
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
              if (event.key === 'Tab') return;

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
  loading = false,
  onChange,
  value,
}: Readonly<CalendarProps>) {
  const [hasCalendarSurface, setHasCalendarSurface] = useState(!loading);
  const calendarSurfaceWrapper = useRef<HTMLDivElement>(null);
  const focusToRestore = useRef<HTMLElement | null>(null);
  const focusMovedDuringLoading = useRef(false);
  const selectedValue =
    value === undefined ? undefined : parseCalendarDate(value);
  const initialValue =
    defaultValue === undefined ? undefined : parseCalendarDate(defaultValue);
  const showLoading = loading || !hasCalendarSurface;

  useEffect(() => {
    if (!loading) {
      setHasCalendarSurface(true);
    }
  }, [loading]);

  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      if (!calendarSurfaceWrapper.current?.contains(event.target as Node)) {
        focusMovedDuringLoading.current = true;
      }
    };

    if (showLoading) document.addEventListener('focusin', handleFocusIn);

    return () => {
      if (showLoading) document.removeEventListener('focusin', handleFocusIn);
    };
  }, [showLoading]);

  useLayoutEffect(() => {
    if (showLoading) return;

    const target = focusToRestore.current;
    focusToRestore.current = null;

    if (
      target &&
      !disabled &&
      !focusMovedDuringLoading.current &&
      target.isConnected &&
      document.activeElement === document.body
    ) {
      target.focus();
    }

    focusMovedDuringLoading.current = false;
  }, [disabled, showLoading]);

  const handleBlurCapture = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!showLoading || !(event.target instanceof HTMLElement)) return;

    focusToRestore.current = event.target;
    focusMovedDuringLoading.current =
      event.relatedTarget instanceof Node &&
      !calendarSurfaceWrapper.current?.contains(event.relatedTarget);
  };

  const handleChange = (date: CalendarDate | null) => {
    if (date) {
      onChange?.(date.toString() as IsoCalendarDate);
    }
  };

  return (
    <>
      {showLoading && <CalendarLoading label={label} />}
      {hasCalendarSurface && (
        <div
          aria-hidden={showLoading || undefined}
          className={showLoading ? 'breeze:hidden' : 'breeze:contents'}
          hidden={showLoading || undefined}
          inert={showLoading || undefined}
          onBlurCapture={handleBlurCapture}
          ref={calendarSurfaceWrapper}
        >
          <CalendarSurface
            autoFocus={autoFocus && !showLoading}
            defaultValue={initialValue}
            disabled={disabled || showLoading}
            label={label}
            onChange={handleChange}
            value={selectedValue}
          />
        </div>
      )}
    </>
  );
}
