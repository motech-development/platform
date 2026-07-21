import type { CalendarDate } from '@internationalized/date';
import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { Calendar as AriaCalendar } from 'react-aria-components/Calendar';
import { tv } from 'tailwind-variants';
import {
  formatDateValue,
  parseDateValue,
} from '../../internal/date/conversion';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
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
  /** Calendar navigation, heading, grid, and guidance. */ children: ReactNode;
  /** Prevents focus and selection. */ disabled?: boolean;
  /** Exposes invalid selection state. */ invalid?: boolean;
  /** Returns whether a stable date is unavailable. */ isDateUnavailable?: (
    date: string,
  ) => boolean;
  /** Latest selectable date. */ maxValue?: string;
  /** Earliest selectable date. */ minValue?: string;
  /** Ref to the rendered calendar root. */ ref?: Ref<HTMLDivElement>;
  /** Number of visible months. Defaults to `1`. */ visibleMonths?: number;
}
type State =
  | {
      /** Current controlled date, or `null` when empty. */ value:
        | string
        | null;
      /** Called with the next stable date or `null`. */ onChange: (
        value: string | null,
      ) => void;
      /** Excluded when controlled. */ defaultValue?: never;
      /** Mutable controlled calendars cannot be read-only. */ readOnly?: false;
    }
  | {
      /** Current immutable date, or `null` when empty. */ value: string | null;
      /** Prevents selection changes. */ readOnly: true;
      /** Excluded when controlled. */ defaultValue?: never;
      /** Excluded because read-only calendars cannot change. */ onChange?: never;
    }
  | {
      /** Initial uncontrolled date, or `null` when empty. */ defaultValue?:
        | string
        | null;
      /** Called with the next stable date or `null`. */ onChange?: (
        value: string | null,
      ) => void;
      /** Uncontrolled calendars cannot be read-only. */ readOnly?: false;
      /** Excluded when uncontrolled. */ value?: never;
    };
/** Props for stable single-date calendar selection. */
export type CalendarRootProps = SharedProps & State;
/** Props for the navigation header. */
export type CalendarHeaderProps = CalendarHeaderPartProps;
/** Props for previous and next buttons. */
export type CalendarButtonProps = CalendarButtonPartProps;
/** Props for the locale-formatted heading. */
export type CalendarHeadingProps = CalendarHeadingPartProps;
/** Props for the calendar grid. */
export type CalendarGridProps = CalendarGridPartProps;

/** Coordinates a single-date calendar with locale-aware navigation. */
export function Root({
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
}: CalendarRootProps): ReactElement {
  useBreezeContext();
  return createElement(AriaCalendar, {
    ...props,
    children,
    className: rootStyle({ class: className }),
    defaultValue: parseDateValue(defaultValue ?? null) ?? undefined,
    isDateUnavailable: isDateUnavailable
      ? (date: CalendarDate) => isDateUnavailable(date.toString())
      : undefined,
    isDisabled: disabled,
    isInvalid: invalid,
    isReadOnly: readOnly,
    maxValue: parseDateValue(maxValue ?? null) ?? undefined,
    minValue: parseDateValue(minValue ?? null) ?? undefined,
    onChange: readOnly
      ? undefined
      : (date: CalendarDate | null) => onChange?.(formatDateValue(date)),
    ref: useForwardedRef(ref),
    value: value === undefined ? undefined : parseDateValue(value),
    visibleDuration: { months: visibleMonths },
  } as unknown as ComponentProps<typeof AriaCalendar>);
}
/**
 * Selects one stable ISO date from an accessible locale-aware calendar.
 *
 * @summary locale-aware selection of one ISO date
 */
export const Calendar = {
  /** Locale-aware weekday and day grid. */
  Grid: CalendarGridPart,
  /** Navigation header container. */
  Header: CalendarHeaderPart,
  /** Visible month heading. */
  Heading: CalendarHeadingPart,
  /** Next-page navigation. */
  NextButton: CalendarNextButtonPart,
  /** Previous-page navigation. */
  PreviousButton: CalendarPreviousButtonPart,
  /** Stable date state and constraints. */
  Root,
};
