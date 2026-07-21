import type { CalendarDate } from '@internationalized/date';
import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { DateField as AriaDateField } from 'react-aria-components/DateField';
import { tv } from 'tailwind-variants';
import {
  formatDateValue,
  parseDateValue,
} from '../../internal/date/conversion';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';
import { DateInputPart, type DateInputPartProps } from '../date/DateInput';
import {
  TextField,
  type TextFieldDescriptionProps,
  type TextFieldErrorProps,
  type TextFieldLabelProps,
} from '../TextField/TextField';

const rootStyle = tv({ base: 'flex min-w-0 flex-col gap-1.5' });

type NativeRootProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

interface SharedDateFieldRootProps extends NativeRootProps {
  /** Compound label, segmented input, description, and error parts. */
  children: ReactNode;
  /** Prevents focus and date editing. Defaults to `false`. */
  disabled?: boolean;
  /** Associates the hidden native date input with an external form. */
  form?: string;
  /** Hidden native date input ref used for form integration. */
  inputRef?: Ref<HTMLInputElement>;
  /** Exposes invalid state to the segmented input. Defaults to `false`. */
  invalid?: boolean;
  /** Returns whether a stable date string is unavailable. */
  isDateUnavailable?: (date: string) => boolean;
  /** Latest selectable `YYYY-MM-DD` date. */
  maxValue?: string;
  /** Earliest selectable `YYYY-MM-DD` date. */
  minValue?: string;
  /** Native form field name for the stable date string. */
  name?: string;
  /** Marks the date as required. Defaults to `false`. */
  required?: boolean;
  /** Ref to the rendered date-field root. */
  ref?: Ref<HTMLDivElement>;
}

type DateFieldState =
  | {
      /** Current controlled date, or `null` when empty. */
      value: string | null;
      /** Called with the next stable date string or `null`. */
      onChange: (value: string | null) => void;
      /** Excluded when the date is controlled. */
      defaultValue?: never;
      /** Mutable controlled state cannot be marked read-only. */
      readOnly?: false;
    }
  | {
      /** Current immutable date, or `null` when empty. */
      value: string | null;
      /** Prevents changes to the controlled date. */
      readOnly: true;
      /** Excluded when the date is controlled. */
      defaultValue?: never;
      /** Excluded because read-only dates cannot change. */
      onChange?: never;
    }
  | {
      /** Initial uncontrolled date, or `null` when empty. */
      defaultValue?: string | null;
      /** Called with the next stable date string or `null`. */
      onChange?: (value: string | null) => void;
      /** Uncontrolled state cannot be marked read-only. */
      readOnly?: false;
      /** Excluded when the date is uncontrolled. */
      value?: never;
    };

/** Props for controlled, uncontrolled, or read-only stable date state. */
export type DateFieldRootProps = SharedDateFieldRootProps & DateFieldState;
/** Props for the visible date-field label. */
export type DateFieldLabelProps = TextFieldLabelProps;
/** Props for the segmented date input. */
export type DateFieldInputProps = DateInputPartProps;
/** Props for supporting date-field guidance. */
export type DateFieldDescriptionProps = TextFieldDescriptionProps;
/** Props for a date-field validation message. */
export type DateFieldErrorProps = TextFieldErrorProps;

/** Coordinates stable date strings with locale-aware editable segments. */
export function Root({
  children,
  className,
  defaultValue,
  disabled = false,
  form,
  inputRef,
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
}: Readonly<DateFieldRootProps>): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);
  const forwardedInputRef = useForwardedRef(inputRef);

  return createElement(AriaDateField, {
    ...props,
    children,
    className: rootStyle({ class: className }),
    defaultValue: parseDateValue(defaultValue ?? null) ?? undefined,
    form,
    granularity: 'day',
    inputRef: forwardedInputRef,
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
    ref: forwardedRef,
    value: value === undefined ? undefined : parseDateValue(value),
  } as unknown as ComponentProps<typeof AriaDateField>);
}

/**
 * Accessible compound date field with stable string values.
 *
 * @summary locale-aware segmented entry for one stable date
 */
export const DateField = {
  /** Supporting guidance associated with the date field. */
  Description: TextField.Description,
  /** Validation feedback associated with the date field. */
  Error: TextField.Error,
  /** Locale-aware editable date segments. */
  Input: DateInputPart,
  /** Visible label associated with the segmented input. */
  Label: TextField.Label,
  /** Stable date state, constraints, validation, and form root. */
  Root,
};
