import type {
  ButtonHTMLAttributes,
  ComponentProps,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import { Group as AriaGroup } from 'react-aria-components/Group';
import { Input as AriaInput } from 'react-aria-components/Input';
import { NumberField as AriaNumberField } from 'react-aria-components/NumberField';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import formControlValue from '../../internal/styling/formControls';
import type { ControlSize } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';
import {
  TextField,
  type TextFieldDescriptionProps,
  type TextFieldErrorProps,
  type TextFieldLabelProps,
} from '../TextField/TextField';

const numberFieldRoot = tv({
  base: 'flex min-w-0 flex-col gap-1.5',
});

const numberFieldGroup = tv({
  base: "breeze-number-field-group group/number-field-control relative inline-flex min-w-0 items-stretch bg-[var(--breeze-surface)] outline-none after:pointer-events-none after:absolute after:inset-0 after:z-10 after:border after:border-[var(--breeze-border-strong)] after:transition-colors after:duration-[var(--breeze-duration-fast)] after:content-[''] data-[disabled]:cursor-not-allowed data-[disabled]:bg-[var(--breeze-surface-subtle)] data-[disabled]:opacity-70 data-[hovered]:after:border-[var(--breeze-primary)] data-[invalid]:after:!border-[var(--breeze-danger)]",
});

const numberFieldInput = tv({
  base: 'min-w-0 flex-1 border-0 bg-transparent text-left text-[var(--breeze-ink)] outline-none group-has-[button]/number-field-control:text-center disabled:cursor-not-allowed read-only:cursor-default',
});

const stepButton = tv({
  base: 'inline-flex shrink-0 items-center justify-center border-0 bg-transparent font-bold text-[var(--breeze-ink)] outline-none transition-colors duration-[var(--breeze-duration-fast)] data-[hovered]:text-[var(--breeze-primary)] disabled:cursor-not-allowed disabled:opacity-55 group-data-[disabled]/number-field-control:opacity-100',
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'size-12 text-base',
      md: 'size-11 text-base',
      sm: 'size-8 text-xs',
    },
  },
});

type NumberFieldRootNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

interface NumberFieldRootSharedProps extends NumberFieldRootNativeProps {
  /** Compound label, group, input, stepper, description, and error parts. */
  children: ReactNode;
  /** Prevents editing, stepping, and focus. Defaults to `false`. */
  disabled?: boolean;
  /** Locale-aware number formatting options. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Exposes invalid state to assistive technology and error styling. Defaults to `false`. */
  invalid?: boolean;
  /** Largest permitted value. */
  max?: number;
  /** Smallest permitted value. */
  min?: number;
  /** Marks the field as required for native validation and assistive technology. Defaults to `false`. */
  required?: boolean;
  /** Ref to the rendered field container. */
  ref?: Ref<HTMLDivElement>;
  /** Amount applied by stepper buttons and arrow keys. Defaults to `1`. */
  step?: number;
}

interface ControlledNumberFieldRootProps {
  /** Current number, or `null` for an empty input. */
  value: number | null;
  /** Called with the next number, or `null` when the input becomes empty. */
  onChange: (value: number | null) => void;
  defaultValue?: never;
  readOnly?: false;
}

interface ReadOnlyNumberFieldRootProps {
  /** Current immutable number, or `null` for an empty input. */
  value: number | null;
  /** Marks a controlled value as intentionally immutable. */
  readOnly: true;
  defaultValue?: never;
  onChange?: never;
}

interface UncontrolledNumberFieldRootProps {
  /** Initial number, or `null` for an empty input. */
  defaultValue?: number | null;
  /** Called with the next number, or `null` when the input becomes empty. */
  onChange?: (value: number | null) => void;
  readOnly?: false;
  value?: never;
}

/** Props for controlled, read-only, or uncontrolled numeric field state. */
export type NumberFieldRootProps = NumberFieldRootSharedProps &
  (
    | ControlledNumberFieldRootProps
    | ReadOnlyNumberFieldRootProps
    | UncontrolledNumberFieldRootProps
  );

/** Props for the visible numeric field label. */
export type NumberFieldLabelProps = TextFieldLabelProps;

/** Props for the numeric input and stepper layout group. */
export interface NumberFieldGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Numeric input and stepper buttons. */
  children: ReactNode;
  /** Ref to the rendered group. */
  ref?: Ref<HTMLDivElement>;
}

/** Props for the native locale-aware numeric input part. */
export interface NumberFieldInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'children'
    | 'className'
    | 'defaultValue'
    | 'disabled'
    | 'max'
    | 'min'
    | 'onChange'
    | 'readOnly'
    | 'required'
    | 'size'
    | 'step'
    | 'style'
    | 'type'
    | 'value'
  > {
  /** Placement and composition classes. */
  className?: string;
  /** Ref to the rendered input. */
  ref?: Ref<HTMLInputElement>;
  /** Canonical control size. Defaults to `md`. */
  size?: ControlSize;
}

/** Props shared by numeric increment and decrement actions. */
export interface NumberFieldStepButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onClick' | 'onClickCapture' | 'style' | 'type'
  > {
  /** Accessible action name describing the step direction. */
  'aria-label': string;
  /** Visible stepper content. */
  children: ReactNode;
  /** Ref to the rendered stepper button. */
  ref?: Ref<HTMLButtonElement>;
  /** Canonical square control size. Defaults to `md`. */
  size?: ControlSize;
}

/** Props for supporting text associated with the numeric input. */
export type NumberFieldDescriptionProps = TextFieldDescriptionProps;

/** Props for an accessible numeric validation message. */
export type NumberFieldErrorProps = TextFieldErrorProps;

/** Coordinates locale-aware numeric state, constraints, and compound anatomy. */
export function Root({
  children,
  className,
  defaultValue,
  disabled = false,
  formatOptions,
  invalid = false,
  max,
  min,
  onChange,
  readOnly = false,
  ref,
  required = false,
  step,
  value,
  ...props
}: NumberFieldRootProps): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);
  const normaliseValue = (nextValue: number) =>
    onChange?.(Number.isNaN(nextValue) ? null : nextValue);

  return createElement(
    AriaNumberField,
    {
      ...props,
      className: numberFieldRoot({ class: className }),
      defaultValue: defaultValue === null ? Number.NaN : defaultValue,
      formatOptions,
      isDisabled: disabled,
      isInvalid: invalid,
      isReadOnly: readOnly,
      isRequired: required,
      maxValue: max,
      minValue: min,
      onChange: normaliseValue,
      ref: forwardedRef,
      step,
      value: value === null ? Number.NaN : value,
    } as ComponentProps<typeof AriaNumberField>,
    children,
  );
}

/** Groups the NumberField input and stepper buttons as one interactive control. */
export function Group({
  className,
  ref,
  ...props
}: NumberFieldGroupProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaGroup, {
    ...props,
    className: numberFieldGroup({ class: className }),
    'data-breeze-number-field-group': '',
    ref: forwardedRef,
  } as ComponentProps<typeof AriaGroup>);
}

/** Renders the editable locale-aware spinbutton for a NumberField. */
export function Input({
  className,
  ref,
  size,
  ...props
}: NumberFieldInputProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaInput, {
    ...props,
    className: formControlValue({
      class: numberFieldInput({ class: className }),
      size,
    }),
    ref: forwardedRef,
  });
}

interface NumberFieldStepButtonInternalProps
  extends Omit<NumberFieldStepButtonProps, 'children'> {
  children?: ReactNode;
  slot: 'decrement' | 'increment';
}

function NumberFieldStepButton({
  className,
  ref,
  size,
  slot,
  ...props
}: NumberFieldStepButtonInternalProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaButton, {
    ...props,
    className: stepButton({ class: className, size }),
    ref: forwardedRef,
    slot,
    type: 'button',
  } as ComponentProps<typeof AriaButton>);
}

/** Decreases the NumberField value by its configured step. */
export function DecrementButton({
  'aria-label': ariaLabel,
  children,
  ref,
  size,
  ...props
}: NumberFieldStepButtonProps): ReactElement {
  return createElement(
    NumberFieldStepButton,
    {
      ...props,
      'aria-label': ariaLabel,
      ref,
      size,
      slot: 'decrement',
    },
    children,
  );
}

/** Increases the NumberField value by its configured step. */
export function IncrementButton({
  'aria-label': ariaLabel,
  children,
  ref,
  size,
  ...props
}: NumberFieldStepButtonProps): ReactElement {
  return createElement(
    NumberFieldStepButton,
    {
      ...props,
      'aria-label': ariaLabel,
      ref,
      size,
      slot: 'increment',
    },
    children,
  );
}

/**
 * Accessible compound locale-aware numeric-entry primitive.
 *
 * @summary locale-aware numeric entry with optional stepper controls
 */
export const NumberField = {
  /** Decrement action. */
  DecrementButton,
  /** Supporting guidance associated with the numeric input. */
  Description: TextField.Description,
  /** Validation message associated with an invalid numeric input. */
  Error: TextField.Error,
  /** Numeric input and stepper layout group. */
  Group,
  /** Increment action. */
  IncrementButton,
  /** Locale-aware native spinbutton. */
  Input,
  /** Persistent accessible label. */
  Label: TextField.Label,
  /** State, constraints, and accessibility root. */
  Root,
};
