import type { CalendarDate } from '@internationalized/date';
import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import {
  createElement,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DateRangePicker as AriaDateRangePicker } from 'react-aria-components/DateRangePicker';
import { tv } from 'tailwind-variants';
import { ArrowRightIcon } from '../../icons';
import {
  formatDateRangeValue,
  type InternalDateRange,
  parseDateRangeValue,
  parseDateValue,
} from '../../internal/date/conversion';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { DateRangeValue } from '../../internal/types/date';
import { useBreezeContext } from '../../provider/BreezeContext';
import {
  PickerFieldGroupPart,
  type PickerFieldGroupPartProps,
  PickerFieldInputPart,
  type PickerFieldInputPartProps,
  pickerFieldRootStyle,
  PickerFieldTriggerPart,
  type PickerFieldTriggerPartProps,
} from '../date/PickerFieldParts';
import {
  type PickerCalendarPartProps,
  PickerPopoverPart,
  type PickerPopoverPartProps,
  PickerRangeCalendarPart,
} from '../date/PickerParts';
import {
  TextField,
  type TextFieldDescriptionProps,
  type TextFieldErrorProps,
  type TextFieldLabelProps,
} from '../TextField/TextField';

const separatorStyle = tv({
  base: 'inline-flex min-h-11 shrink-0 items-center justify-center px-0.5 text-[var(--breeze-ink-muted)] sm:px-1',
});

interface Shared
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange' | 'style'
  > {
  /** Label, start/end inputs, trigger, range calendar, and guidance. */
  children: ReactNode;
  /** Allows ranges containing unavailable dates. */
  allowsNonContiguousRanges?: boolean;
  /** Prevents focus and editing. */
  disabled?: boolean;
  /** External native form id. */
  form?: string;
  /** Exposes invalid state. */
  invalid?: boolean;
  /** Returns whether a stable date is unavailable for an optional anchor. */
  isDateUnavailable?: (date: string, anchorDate: string | null) => boolean;
  /** Latest selectable date. */
  maxValue?: string;
  /** Earliest selectable date. */
  minValue?: string;
  /** Marks the range as required. */
  required?: boolean;
  /** Ref to the rendered picker root. */
  ref?: Ref<HTMLDivElement>;
}
type FormNames =
  | {
      /** Native form field name for the inclusive range end. */
      endName: string;
      /** Native form field name for the inclusive range start. */
      startName: string;
    }
  | {
      /** End name is unavailable without a start name. */
      endName?: never;
      /** Start name is unavailable without an end name. */
      startName?: never;
    };
type State =
  | {
      /** Current controlled range, or `null` when empty. */
      value: DateRangeValue | null;
      /** Called with the next stable range or `null`. */
      onChange: (value: DateRangeValue | null) => void;
      /** Excluded when controlled. */
      defaultValue?: never;
      /** Mutable controlled pickers cannot be read-only. */
      readOnly?: false;
    }
  | {
      /** Current immutable range, or `null` when empty. */
      value: DateRangeValue | null;
      /** Prevents range changes. */
      readOnly: true;
      /** Excluded when controlled. */
      defaultValue?: never;
      /** Excluded because read-only pickers cannot change. */
      onChange?: never;
    }
  | {
      /** Initial uncontrolled range, or `null` when empty. */
      defaultValue?: DateRangeValue | null;
      /** Called with the next stable range or `null`. */
      onChange?: (value: DateRangeValue | null) => void;
      /** Uncontrolled pickers cannot be read-only. */
      readOnly?: false;
      /** Excluded when uncontrolled. */
      value?: never;
    };
/** Props for controlled, uncontrolled, or read-only stable range state. */
export type DateRangePickerRootProps = Shared & FormNames & State;
/** Props for the visible label. */
export type DateRangePickerLabelProps = TextFieldLabelProps;
/** Props shared by the start and end segmented inputs. */
export type DateRangePickerInputProps = PickerFieldInputPartProps;
/** Props for the coherent start-input, separator, end-input, and trigger group. */
export type DateRangePickerGroupProps = PickerFieldGroupPartProps;
/** Props for the visual range separator. */
export interface DateRangePickerSeparatorProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'style'> {
  /** Ref to the rendered visual separator. */
  ref?: Ref<HTMLSpanElement>;
}
/** Props for the calendar trigger. */
export type DateRangePickerTriggerProps = PickerFieldTriggerPartProps;
/** Props for the range-calendar popover. */
export type DateRangePickerPopoverProps = PickerPopoverPartProps;
/** Props for the range calendar. */
export type DateRangePickerCalendarProps = PickerCalendarPartProps;
/** Props for supporting guidance. */
export type DateRangePickerDescriptionProps = TextFieldDescriptionProps;
/** Props for validation feedback. */
export type DateRangePickerErrorProps = TextFieldErrorProps;

export function Group({
  ...props
}: Readonly<DateRangePickerGroupProps>): ReactElement {
  return createElement(PickerFieldGroupPart, props);
}

export function StartInput({
  className,
  ...props
}: Readonly<DateRangePickerInputProps>): ReactElement {
  return createElement(PickerFieldInputPart, {
    ...props,
    className,
    slot: 'start',
  });
}

export function EndInput({
  className,
  ...props
}: Readonly<DateRangePickerInputProps>): ReactElement {
  return createElement(PickerFieldInputPart, {
    ...props,
    className,
    slot: 'end',
  });
}

export function Separator({
  className,
  ref,
  ...props
}: Readonly<DateRangePickerSeparatorProps>): ReactElement {
  return createElement(
    'span',
    {
      ...props,
      'aria-hidden': true,
      className: separatorStyle({ class: className }),
      ref: useForwardedRef(ref),
    },
    createElement(ArrowRightIcon, {
      className: 'rtl:rotate-180',
      size: '1rem',
    }),
  );
}

export function Trigger({
  ...props
}: Readonly<DateRangePickerTriggerProps>): ReactElement {
  return createElement(PickerFieldTriggerPart, props);
}

/** Coordinates start and end date entry with a range-calendar popover. */
export function Root({
  allowsNonContiguousRanges = false,
  children,
  className,
  defaultValue,
  disabled = false,
  endName,
  form,
  invalid = false,
  isDateUnavailable,
  maxValue,
  minValue,
  onChange,
  readOnly = false,
  ref,
  required = false,
  startName,
  value,
  ...props
}: Readonly<DateRangePickerRootProps>): ReactElement {
  useBreezeContext();

  const controlled = value !== undefined;
  const defaultEnd = defaultValue?.end ?? null;
  const defaultStart = defaultValue?.start ?? null;
  const [uncontrolledValue, setUncontrolledValue] =
    useState<DateRangeValue | null>(defaultValue ?? null);
  const liveValue = controlled ? value : uncontrolledValue;
  const rootElement = useRef<HTMLDivElement | null>(null);
  const forwardedRef = useForwardedRef(ref);
  const assignRoot = useCallback(
    (element: HTMLDivElement | null) => {
      rootElement.current = element;
      forwardedRef(element);
    },
    [forwardedRef],
  );

  useEffect(() => {
    if (controlled) {
      return undefined;
    }

    const element = rootElement.current;
    const formElement = form
      ? element?.ownerDocument.getElementById(form)
      : element?.closest('form');

    const FormElement = element?.ownerDocument.defaultView?.HTMLFormElement;

    if (FormElement === undefined || !(formElement instanceof FormElement)) {
      return undefined;
    }

    const resetValue =
      defaultEnd === null || defaultStart === null
        ? null
        : { end: defaultEnd, start: defaultStart };
    const handleReset = () => setUncontrolledValue(resetValue);

    formElement.addEventListener('reset', handleReset);

    return () => formElement.removeEventListener('reset', handleReset);
  }, [controlled, defaultEnd, defaultStart, form]);

  const handleChange = (range: InternalDateRange | null) => {
    const nextValue = formatDateRangeValue(range);

    if (!controlled) {
      setUncontrolledValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const rangeInputs =
    startName === undefined
      ? null
      : [
          createElement('input', {
            'aria-hidden': true,
            'data-breeze-range-input': 'start',
            disabled,
            form,
            key: 'start-input',
            name: startName,
            readOnly: true,
            type: 'hidden',
            value: liveValue?.start ?? '',
          }),
          createElement('input', {
            'aria-hidden': true,
            'data-breeze-range-input': 'end',
            disabled,
            form,
            key: 'end-input',
            name: endName,
            readOnly: true,
            type: 'hidden',
            value: liveValue?.end ?? '',
          }),
        ];

  return createElement(AriaDateRangePicker, {
    ...props,
    allowsNonContiguousRanges,
    children: createElement(Fragment, null, children, rangeInputs),
    className: pickerFieldRootStyle({ class: className }),
    form,
    isDateUnavailable: isDateUnavailable
      ? (date: CalendarDate, anchor: CalendarDate | null) =>
          isDateUnavailable(date.toString(), anchor?.toString() ?? null)
      : undefined,
    isDisabled: disabled,
    isInvalid: invalid,
    isReadOnly: readOnly,
    isRequired: required,
    maxValue: parseDateValue(maxValue ?? null) ?? undefined,
    minValue: parseDateValue(minValue ?? null) ?? undefined,
    onChange: readOnly ? undefined : handleChange,
    ref: assignRoot,
    value: parseDateRangeValue(liveValue),
  } as unknown as ComponentProps<typeof AriaDateRangePicker>);
}

/**
 * Accessible compound date-range picker with stable string values.
 *
 * @summary segmented start and end dates with a range-calendar popup
 */
export const DateRangePicker = {
  /** Range calendar. */ Calendar: PickerRangeCalendarPart,
  /** Supporting guidance. */ Description: TextField.Description,
  /** End-date segmented input. */ EndInput,
  /** Validation feedback. */ Error: TextField.Error,
  /** Coherent start-input, separator, end-input, and trigger control. */ Group,
  /** Visible field label. */ Label: TextField.Label,
  /** Positioned range-calendar popup. */ Popover: PickerPopoverPart,
  /** Stable range state and constraints. */ Root,
  /** Visual direction between the start and end inputs. */ Separator,
  /** Start-date segmented input. */ StartInput,
  /** Range-calendar popup trigger. */ Trigger,
};
