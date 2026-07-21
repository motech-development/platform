import type { CalendarDate } from '@internationalized/date';
import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement, useContext } from 'react';
import {
  DatePicker as AriaDatePicker,
  DatePickerStateContext,
} from 'react-aria-components/DatePicker';
import { tv } from 'tailwind-variants';
import { CalendarIcon } from '../../icons';
import {
  formatDateValue,
  parseDateValue,
} from '../../internal/date/conversion';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import formControlValue from '../../internal/styling/formControls';
import { useBreezeContext } from '../../provider/BreezeContext';
import { DateInputPart, type DateInputPartProps } from '../date/DateInput';
import {
  PickerCalendarPart,
  type PickerCalendarPartProps,
  PickerGroupPart,
  type PickerGroupPartProps,
  PickerPopoverPart,
  type PickerPopoverPartProps,
  PickerTriggerPart,
  type PickerTriggerPartProps,
} from '../date/PickerParts';
import {
  TextField,
  type TextFieldDescriptionProps,
  type TextFieldErrorProps,
  type TextFieldLabelProps,
} from '../TextField/TextField';

const rootStyle = tv({ base: 'flex w-full min-w-0 flex-col gap-1.5' });
const groupStyle = tv({ base: 'w-full' });
const hiddenInputStyle = tv({ base: 'hidden' });
const triggerStyle = tv({
  base: 'w-full justify-between border-l bg-[var(--breeze-surface)] text-start text-[var(--breeze-ink)] outline-none transition-colors duration-[var(--breeze-duration-fast)] data-[disabled]:cursor-not-allowed data-[disabled]:bg-[var(--breeze-surface-subtle)] data-[disabled]:opacity-70 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-[-2px] data-[focus-visible]:outline-[var(--breeze-focus)] data-[hovered]:!border-[var(--breeze-primary)]',
});
interface Shared
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange' | 'style'
  > {
  /** Label, hidden state input, long-date trigger, calendar popup, and guidance. */ children: ReactNode;
  /** Prevents focus and selection. */ disabled?: boolean;
  /** External native form id. */ form?: string;
  /** Exposes invalid state. */ invalid?: boolean;
  /** Returns whether a stable date is unavailable. */ isDateUnavailable?: (
    date: string,
  ) => boolean;
  /** Latest selectable date. */ maxValue?: string;
  /** Earliest selectable date. */ minValue?: string;
  /** Native form field name. */ name?: string;
  /** Marks the picker as required. */ required?: boolean;
  /** Ref to the rendered picker root. */ ref?: Ref<HTMLDivElement>;
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
      /** Mutable controlled pickers cannot be read-only. */ readOnly?: false;
    }
  | {
      /** Current immutable date, or `null` when empty. */ value: string | null;
      /** Prevents date changes. */ readOnly: true;
      /** Excluded when controlled. */ defaultValue?: never;
      /** Excluded because read-only pickers cannot change. */ onChange?: never;
    }
  | {
      /** Initial uncontrolled date, or `null` when empty. */ defaultValue?:
        | string
        | null;
      /** Called with the next stable date or `null`. */ onChange?: (
        value: string | null,
      ) => void;
      /** Uncontrolled pickers cannot be read-only. */ readOnly?: false;
      /** Excluded when uncontrolled. */ value?: never;
    };
/** Props for controlled, uncontrolled, or read-only stable date picker state. */
export type DatePickerRootProps = Shared & State;
/** Props for the visible label. */
export type DatePickerLabelProps = TextFieldLabelProps;
/** Props for the hidden date-state input. */
export type DatePickerInputProps = DateInputPartProps;
/** Props for the full-width calendar trigger group. */
export type DatePickerGroupProps = PickerGroupPartProps;
/** Props for the visible long-date calendar trigger. */
export type DatePickerTriggerProps = PickerTriggerPartProps;
/** Props for the calendar popover, positioned at `bottom end` by default. */
export type DatePickerPopoverProps = PickerPopoverPartProps;
/** Props for the picker calendar. */
export type DatePickerCalendarProps = PickerCalendarPartProps;
/** Props for supporting guidance. */
export type DatePickerDescriptionProps = TextFieldDescriptionProps;
/** Props for validation feedback. */
export type DatePickerErrorProps = TextFieldErrorProps;

export function Group({
  className,
  ...props
}: DatePickerGroupProps): ReactElement {
  return createElement(PickerGroupPart, {
    ...props,
    className: groupStyle({ class: className }),
  });
}

export function Input({
  className,
  ...props
}: DatePickerInputProps): ReactElement {
  return createElement(DateInputPart, {
    ...props,
    'aria-hidden': true,
    className: hiddenInputStyle({ class: className }),
    hidden: true,
    inert: true,
  });
}

export function Trigger({
  children,
  className,
  ...props
}: DatePickerTriggerProps): ReactElement {
  const state = useContext(DatePickerStateContext);
  const { locale, messages, timeZone } = useBreezeContext();
  const resolvedTimeZone = timeZone ?? 'UTC';
  const dateValue = state?.value ?? null;
  const displayValue =
    dateValue === null
      ? null
      : new Intl.DateTimeFormat(locale, {
          day: 'numeric',
          month: 'long',
          timeZone: resolvedTimeZone,
          year: 'numeric',
        }).format(dateValue.toDate(resolvedTimeZone));
  const defaultChildren = [
    createElement(
      'span',
      { key: 'value' },
      displayValue ?? messages.selectDate,
    ),
    createElement(CalendarIcon, {
      className: 'ms-3 text-[var(--breeze-primary)]',
      key: 'icon',
      size: '1.25rem',
    }),
  ];

  return createElement(
    PickerTriggerPart,
    {
      ...props,
      className: formControlValue({
        class: triggerStyle({ class: className }),
      }),
    },
    children === undefined ? defaultChildren : children,
  );
}

export function Popover({
  placement = 'bottom end',
  ...props
}: DatePickerPopoverProps): ReactElement {
  return createElement(PickerPopoverPart, {
    ...props,
    placement,
  });
}

/** Coordinates date entry with an optional calendar popover. */
export function Root({
  children,
  className,
  defaultValue,
  disabled = false,
  form,
  invalid = false,
  isDateUnavailable,
  maxValue,
  minValue,
  name,
  onChange,
  readOnly = false,
  ref,
  required = false,
  value,
  ...props
}: DatePickerRootProps): ReactElement {
  useBreezeContext();
  return createElement(AriaDatePicker, {
    ...props,
    children,
    className: rootStyle({ class: className }),
    defaultValue: parseDateValue(defaultValue ?? null) ?? undefined,
    form,
    granularity: 'day',
    isDateUnavailable: isDateUnavailable
      ? (date: CalendarDate) => isDateUnavailable(date.toString())
      : undefined,
    isDisabled: disabled,
    isInvalid: invalid,
    isReadOnly: readOnly,
    isRequired: required,
    maxValue: parseDateValue(maxValue ?? null) ?? undefined,
    minValue: parseDateValue(minValue ?? null) ?? undefined,
    name,
    onChange: readOnly
      ? undefined
      : (date: CalendarDate | null) => onChange?.(formatDateValue(date)),
    ref: useForwardedRef(ref),
    value: value === undefined ? undefined : parseDateValue(value),
  } as unknown as ComponentProps<typeof AriaDatePicker>);
}
/**
 * Accessible full-width calendar-selection control with stable date strings.
 *
 * @summary long-date control with a locale-aware calendar popup
 */
export const DatePicker = {
  /** Locale-aware calendar. */ Calendar: PickerCalendarPart,
  /** Supporting guidance. */ Description: TextField.Description,
  /** Validation feedback. */ Error: TextField.Error,
  /** Hidden date-state input and trigger group. */ Group,
  /** Hidden date-state input. */ Input,
  /** Visible field label. */ Label: TextField.Label,
  /** Positioned calendar popup. */ Popover,
  /** Stable date state and constraints. */ Root,
  /** Visible long-date calendar popup trigger. */ Trigger,
};
