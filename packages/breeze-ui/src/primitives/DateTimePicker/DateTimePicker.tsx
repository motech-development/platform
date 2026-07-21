import type { ZonedDateTime } from '@internationalized/date';
import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createContext, createElement, useContext } from 'react';
import {
  DatePicker as AriaDatePicker,
  DatePickerStateContext,
} from 'react-aria-components/DatePicker';
import { TimeField as AriaTimeField } from 'react-aria-components/TimeField';
import type { TimeValue } from 'react-stately/useTimeFieldState';
import { tv } from 'tailwind-variants';
import {
  formatDateTimeValue,
  parseDateTimeValue,
} from '../../internal/date/conversion';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';
import { DateInputPart } from '../date/DateInput';
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
  PickerCalendarPart,
  type PickerCalendarPartProps,
  PickerPopoverPart,
  type PickerPopoverPartProps,
} from '../date/PickerParts';
import {
  TextField,
  type TextFieldDescriptionProps,
  type TextFieldErrorProps,
  type TextFieldLabelProps,
} from '../TextField/TextField';

const calendarSurfaceStyle = tv({
  base: 'flex w-full flex-col gap-3',
});
const timeFieldStyle = tv({
  base: 'flex min-w-0 flex-col gap-1.5 border-t border-[var(--breeze-border)] pt-3',
});
const timeInputStyle = tv({
  base: 'min-h-11 w-full text-base font-normal leading-[1.4]',
});

interface DateTimePickerConfiguration {
  disabled: boolean;
  readOnly: boolean;
}

const DateTimePickerConfigurationContext =
  createContext<DateTimePickerConfiguration | null>(null);

interface Shared
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange' | 'style'
  > {
  /** Label, segmented input, trigger, calendar popup, and guidance. */
  children: ReactNode;
  /** Prevents focus and editing. */
  disabled?: boolean;
  /** External native form id. */
  form?: string;
  /** Exposes invalid state. */
  invalid?: boolean;
  /** Latest selectable explicit-offset ISO instant. */
  maxValue?: string;
  /** Earliest selectable explicit-offset ISO instant. */
  minValue?: string;
  /** Native form field name. */
  name?: string;
  /** Marks the picker as required. */
  required?: boolean;
  /** Ref to the rendered picker root. */
  ref?: Ref<HTMLDivElement>;
}
type State =
  | {
      /** Current controlled explicit-offset instant. */
      value: string | null;
      /** Called with the next explicit-offset instant. */
      onChange: (value: string | null) => void;
      /** Excluded when controlled. */
      defaultValue?: never;
      /** Mutable controlled pickers cannot be read-only. */
      readOnly?: false;
    }
  | {
      /** Current immutable explicit-offset instant. */
      value: string | null;
      /** Prevents changes. */
      readOnly: true;
      /** Excluded when controlled. */
      defaultValue?: never;
      /** Excluded because read-only pickers cannot change. */
      onChange?: never;
    }
  | {
      /** Initial uncontrolled explicit-offset instant. */
      defaultValue?: string | null;
      /** Called with the next explicit-offset instant. */
      onChange?: (value: string | null) => void;
      /** Uncontrolled state cannot be read-only. */
      readOnly?: false;
      /** Excluded when uncontrolled. */
      value?: never;
    };
/** Props for stable explicit-offset date-time picker state. */
export type DateTimePickerRootProps = Shared & State;
/** Props for the visible label. */
export type DateTimePickerLabelProps = TextFieldLabelProps;
/** Props for the segmented input. */
export type DateTimePickerInputProps = PickerFieldInputPartProps;
/** Props for the coherent segmented-input and trigger group. */
export type DateTimePickerGroupProps = PickerFieldGroupPartProps;
/** Props for the calendar trigger. */
export type DateTimePickerTriggerProps = PickerFieldTriggerPartProps;
/** Props for the calendar popover. */
export type DateTimePickerPopoverProps = PickerPopoverPartProps;
/** Props for the complete date-and-time calendar surface. */
export type DateTimePickerCalendarProps = PickerCalendarPartProps;
/** Props for supporting guidance. */
export type DateTimePickerDescriptionProps = TextFieldDescriptionProps;
/** Props for validation feedback. */
export type DateTimePickerErrorProps = TextFieldErrorProps;

function useDateTimePickerConfiguration(): DateTimePickerConfiguration {
  const configuration = useContext(DateTimePickerConfigurationContext);

  if (configuration === null) {
    throw new Error(
      'DateTimePicker parts must be rendered within DateTimePicker.Root.',
    );
  }

  return configuration;
}

export function Calendar({
  className,
  ref,
  ...props
}: DateTimePickerCalendarProps): ReactElement {
  const state = useContext(DatePickerStateContext);
  const { disabled, readOnly } = useDateTimePickerConfiguration();
  const { messages } = useBreezeContext();
  const forwardedRef = useForwardedRef(ref);

  if (state === null) {
    throw new Error(
      'DateTimePicker.Calendar must be rendered within DateTimePicker.Root.',
    );
  }

  const handleTimeChange = (time: TimeValue | null) => {
    if (time !== null) {
      state.setTimeValue(time);
    }
  };

  return createElement(
    'div',
    {
      ...props,
      className: calendarSurfaceStyle({ class: className }),
      'data-breeze-date-time-calendar': '',
      ref: forwardedRef,
    },
    createElement(PickerCalendarPart),
    createElement(
      AriaTimeField,
      {
        className: timeFieldStyle(),
        granularity: 'minute',
        isDisabled: disabled,
        isInvalid: state.isInvalid,
        isReadOnly: readOnly,
        onChange: disabled || readOnly ? undefined : handleTimeChange,
        value: state.timeValue,
      } as ComponentProps<typeof AriaTimeField>,
      createElement(TextField.Label, null, messages.selectTime),
      createElement(DateInputPart, {
        className: timeInputStyle(),
      }),
    ),
  );
}

export function Popover({
  'aria-label': ariaLabel,
  placement = 'bottom end',
  ...props
}: DateTimePickerPopoverProps): ReactElement {
  const { messages } = useBreezeContext();

  return createElement(PickerPopoverPart, {
    ...props,
    'aria-label': ariaLabel ?? messages.selectDateTime,
    placement,
  });
}

/** Coordinates explicit-offset instants with provider-zone display and behavior. */
export function Root({
  children,
  className,
  defaultValue,
  disabled = false,
  form,
  invalid = false,
  maxValue,
  minValue,
  name,
  onChange,
  readOnly = false,
  ref,
  required = false,
  value,
  ...props
}: DateTimePickerRootProps): ReactElement {
  const { timeZone = 'UTC' } = useBreezeContext();
  const configuration = { disabled, readOnly };

  return createElement(AriaDatePicker, {
    ...props,
    children: createElement(
      DateTimePickerConfigurationContext,
      { value: configuration },
      children,
    ),
    className: pickerFieldRootStyle({ class: className }),
    defaultValue:
      parseDateTimeValue(defaultValue ?? null, timeZone) ?? undefined,
    form,
    granularity: 'minute',
    isDisabled: disabled,
    isInvalid: invalid,
    isReadOnly: readOnly,
    isRequired: required,
    maxValue: parseDateTimeValue(maxValue ?? null, timeZone) ?? undefined,
    minValue: parseDateTimeValue(minValue ?? null, timeZone) ?? undefined,
    name,
    onChange: readOnly
      ? undefined
      : (date: ZonedDateTime | null) => onChange?.(formatDateTimeValue(date)),
    ref: useForwardedRef(ref),
    value:
      value === undefined ? undefined : parseDateTimeValue(value, timeZone),
  } as unknown as ComponentProps<typeof AriaDatePicker>);
}

/**
 * Accessible compound date-time picker with stable explicit-offset values.
 *
 * @summary locale-aware instant selection with explicit-offset values
 */
export const DateTimePicker = {
  /** Complete provider-zone date and segmented-time selection surface. */
  Calendar,
  /** Supporting guidance. */ Description: TextField.Description,
  /** Validation feedback. */ Error: TextField.Error,
  /** Coherent segmented-input and trigger control. */ Group:
    PickerFieldGroupPart,
  /** Borderless locale-aware date and time segments. */ Input:
    PickerFieldInputPart,
  /** Visible field label. */ Label: TextField.Label,
  /** Positioned complete date-and-time popup. */ Popover,
  /** Stable instant state and constraints. */ Root,
  /** Integrated calendar popup trigger. */ Trigger: PickerFieldTriggerPart,
};
