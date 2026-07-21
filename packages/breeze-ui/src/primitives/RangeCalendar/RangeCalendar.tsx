import type { CalendarDate } from '@internationalized/date';
import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { RangeCalendar as AriaRangeCalendar } from 'react-aria-components/RangeCalendar';
import { tv } from 'tailwind-variants';
import {
  formatDateRangeValue,
  parseDateRangeValue,
  parseDateValue,
} from '../../internal/date/conversion';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { DateRangeValue } from '../../internal/types/date';
import { useBreezeContext } from '../../provider/BreezeContext';
import {
  type CalendarButtonPartProps,
  CalendarGridPart,
  type CalendarGridPartProps,
  CalendarHeaderPart,
  type CalendarHeaderPartProps,
  CalendarHeadingPart,
  type CalendarHeadingPartProps,
  CalendarNextButtonPart,
  CalendarPreviousButtonPart,
} from '../date/CalendarParts';

const rootStyle = tv({
  base: 'inline-flex w-full flex-col gap-3',
});
interface SharedProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange' | 'style'
  > {
  /** Calendar navigation, heading, range grid, and guidance. */ children: ReactNode;
  /** Allows ranges containing unavailable dates. */ allowsNonContiguousRanges?: boolean;
  /** Prevents focus and selection. */ disabled?: boolean;
  /** Exposes invalid selection state. */ invalid?: boolean;
  /** Returns whether a stable date is unavailable. */ isDateUnavailable?: (
    date: string,
    anchorDate: string | null,
  ) => boolean;
  /** Latest selectable date. */ maxValue?: string;
  /** Earliest selectable date. */ minValue?: string;
  /** Ref to the rendered range-calendar root. */ ref?: Ref<HTMLDivElement>;
  /** Number of visible months. Defaults to `1`. */ visibleMonths?: number;
}
type State =
  | {
      /** Current controlled range, or `null` when empty. */ value: DateRangeValue | null;
      /** Called with the next stable range or `null`. */ onChange: (
        value: DateRangeValue | null,
      ) => void;
      /** Excluded when controlled. */ defaultValue?: never;
      /** Mutable controlled calendars cannot be read-only. */ readOnly?: false;
    }
  | {
      /** Current immutable range, or `null` when empty. */ value: DateRangeValue | null;
      /** Prevents range changes. */ readOnly: true;
      /** Excluded when controlled. */ defaultValue?: never;
      /** Excluded because read-only calendars cannot change. */ onChange?: never;
    }
  | {
      /** Initial uncontrolled range, or `null` when empty. */ defaultValue?: DateRangeValue | null;
      /** Called with the next stable range or `null`. */ onChange?: (
        value: DateRangeValue | null,
      ) => void;
      /** Uncontrolled calendars cannot be read-only. */ readOnly?: false;
      /** Excluded when uncontrolled. */ value?: never;
    };
/** Props for stable date-range calendar selection. */
export type RangeCalendarRootProps = SharedProps & State;
/** Props for the navigation header. */
export type RangeCalendarHeaderProps = CalendarHeaderPartProps;
/** Props for previous and next buttons. */
export type RangeCalendarButtonProps = CalendarButtonPartProps;
/** Props for the locale-formatted heading. */
export type RangeCalendarHeadingProps = CalendarHeadingPartProps;
/** Props for the range calendar grid. */
export type RangeCalendarGridProps = CalendarGridPartProps;

/** Coordinates locale-aware selection of a start and end date. */
export function Root({
  allowsNonContiguousRanges = false,
  children,
  className,
  defaultValue,
  disabled = false,
  invalid = false,
  isDateUnavailable,
  maxValue,
  minValue,
  onChange,
  readOnly = false,
  ref,
  value,
  visibleMonths = 1,
  ...props
}: Readonly<RangeCalendarRootProps>): ReactElement {
  useBreezeContext();
  return createElement(AriaRangeCalendar, {
    ...props,
    allowsNonContiguousRanges,
    children,
    className: rootStyle({ class: className }),
    defaultValue: parseDateRangeValue(defaultValue ?? null) ?? undefined,
    isDateUnavailable: isDateUnavailable
      ? (date: CalendarDate, anchor: CalendarDate | null) =>
          isDateUnavailable(date.toString(), anchor?.toString() ?? null)
      : undefined,
    isDisabled: disabled,
    isInvalid: invalid,
    isReadOnly: readOnly,
    maxValue: parseDateValue(maxValue ?? null) ?? undefined,
    minValue: parseDateValue(minValue ?? null) ?? undefined,
    onChange: readOnly
      ? undefined
      : (range: { start: CalendarDate; end: CalendarDate }) =>
          onChange?.(formatDateRangeValue(range)),
    ref: useForwardedRef(ref),
    value: value === undefined ? undefined : parseDateRangeValue(value),
    visibleDuration: { months: visibleMonths },
  } as unknown as ComponentProps<typeof AriaRangeCalendar>);
}
/**
 * Accessible locale-aware date-range calendar.
 *
 * @summary inclusive ISO date-range selection from calendar grids
 */
export const RangeCalendar = {
  /** Locale-aware weekday and range grid. */ Grid: CalendarGridPart,
  /** Navigation header container. */ Header: CalendarHeaderPart,
  /** Visible month heading. */ Heading: CalendarHeadingPart,
  /** Next-page navigation. */ NextButton: CalendarNextButtonPart,
  /** Previous-page navigation. */ PreviousButton: CalendarPreviousButtonPart,
  /** Stable range state and constraints. */ Root,
};
