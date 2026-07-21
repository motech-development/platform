import type { Time } from '@internationalized/date';
import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { TimeField as AriaTimeField } from 'react-aria-components/TimeField';
import { tv } from 'tailwind-variants';
import {
  formatTimeValue,
  parseTimeValue,
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
interface SharedProps extends NativeRootProps {
  /** Compound label, segmented input, description, and error parts. */ children: ReactNode;
  /** Prevents focus and time editing. Defaults to `false`. */ disabled?: boolean;
  /** Associates the hidden native time input with an external form. */ form?: string;
  /** Hidden native time input ref used for form integration. */ inputRef?: Ref<HTMLInputElement>;
  /** Exposes invalid state. Defaults to `false`. */ invalid?: boolean;
  /** Latest selectable `HH:mm` or `HH:mm:ss` time. */ maxValue?: string;
  /** Earliest selectable `HH:mm` or `HH:mm:ss` time. */ minValue?: string;
  /** Native form field name for the stable time string. */ name?: string;
  /** Marks the time as required. Defaults to `false`. */ required?: boolean;
  /** Ref to the rendered time-field root. */ ref?: Ref<HTMLDivElement>;
}
type State =
  | {
      /** Current controlled time, or `null` when empty. */ value:
        | string
        | null;
      /** Called with the next stable time string or `null`. */ onChange: (
        value: string | null,
      ) => void;
      /** Excluded when controlled. */ defaultValue?: never;
      /** Mutable state cannot be read-only. */ readOnly?: false;
    }
  | {
      /** Current immutable time, or `null` when empty. */ value: string | null;
      /** Prevents changes to the controlled time. */ readOnly: true;
      /** Excluded when controlled. */ defaultValue?: never;
      /** Excluded because read-only times cannot change. */ onChange?: never;
    }
  | {
      /** Initial uncontrolled time, or `null` when empty. */ defaultValue?:
        | string
        | null;
      /** Called with the next stable time string or `null`. */ onChange?: (
        value: string | null,
      ) => void;
      /** Uncontrolled state cannot be read-only. */ readOnly?: false;
      /** Excluded when uncontrolled. */ value?: never;
    };
/** Props for controlled, uncontrolled, or read-only stable time state. */
export type TimeFieldRootProps = SharedProps & State;
/** Props for the visible time-field label. */
export type TimeFieldLabelProps = TextFieldLabelProps;
/** Props for the segmented time input. */
export type TimeFieldInputProps = DateInputPartProps;
/** Props for supporting time-field guidance. */
export type TimeFieldDescriptionProps = TextFieldDescriptionProps;
/** Props for a time-field validation message. */
export type TimeFieldErrorProps = TextFieldErrorProps;

/** Coordinates stable time strings with locale-aware editable segments. */
export function Root({
  children,
  className,
  defaultValue,
  disabled = false,
  form,
  inputRef,
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
}: TimeFieldRootProps): ReactElement {
  useBreezeContext();
  const forwardedRef = useForwardedRef(ref);
  const forwardedInputRef = useForwardedRef(inputRef);
  const hasSeconds = [value, defaultValue, minValue, maxValue].some(
    (candidate) => candidate?.split(':').length === 3,
  );

  return createElement(AriaTimeField, {
    ...props,
    children,
    className: rootStyle({ class: className }),
    defaultValue: parseTimeValue(defaultValue ?? null) ?? undefined,
    form,
    granularity: hasSeconds ? 'second' : 'minute',
    inputRef: forwardedInputRef,
    isDisabled: disabled,
    isInvalid: invalid,
    isReadOnly: readOnly,
    isRequired: required,
    maxValue: parseTimeValue(maxValue ?? null) ?? undefined,
    minValue: parseTimeValue(minValue ?? null) ?? undefined,
    name,
    onChange: readOnly
      ? undefined
      : (time: Time | null) => onChange?.(formatTimeValue(time)),
    ref: forwardedRef,
    value: value === undefined ? undefined : parseTimeValue(value),
  } as unknown as ComponentProps<typeof AriaTimeField>);
}
/**
 * Accessible compound time field with stable string values.
 *
 * @summary locale-aware segmented entry for one stable time value
 */
export const TimeField = {
  /** Supporting guidance associated with the time field. */ Description:
    TextField.Description,
  /** Validation feedback associated with the time field. */ Error:
    TextField.Error,
  /** Locale-aware editable time segments. */ Input: DateInputPart,
  /** Visible label associated with the segmented input. */ Label:
    TextField.Label,
  /** Stable time state, constraints, validation, and form root. */ Root,
};
