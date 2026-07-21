import type {
  ComponentProps,
  HTMLAttributes,
  LabelHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
} from 'react';
import { createElement, useRef } from 'react';
import {
  CheckboxButton as AriaCheckboxButton,
  CheckboxField as AriaCheckboxField,
} from 'react-aria-components/Checkbox';
import { tv } from 'tailwind-variants';
import { CheckIcon } from '../../icons';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { ControlSize } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';
import {
  TextField,
  type TextFieldDescriptionProps,
  type TextFieldErrorProps,
} from '../TextField/TextField';

const checkboxRoot = tv({
  base: 'flex min-w-0 flex-col gap-1',
});

const checkboxControl = tv({
  base: 'group inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 font-[family-name:var(--breeze-font-display)] text-sm font-bold text-[var(--breeze-ink)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-55',
});

const checkboxIndicator = tv({
  base: 'inline-flex shrink-0 items-center justify-center border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-white transition-colors duration-[var(--breeze-duration-fast)] group-data-[indeterminate]:border-[var(--breeze-primary)] group-data-[indeterminate]:bg-[var(--breeze-primary)] group-data-[selected]:border-[var(--breeze-primary)] group-data-[selected]:bg-[var(--breeze-primary)] [&>svg]:opacity-0 group-data-[indeterminate]:[&>svg]:opacity-100 group-data-[selected]:[&>svg]:opacity-100',
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'size-6 text-base',
      md: 'size-5 text-sm',
      sm: 'size-4 text-xs',
    },
  },
});

type CheckboxRootNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

interface CheckboxRootSharedProps extends CheckboxRootNativeProps {
  /** Compound control, description, and error parts. */
  children: ReactNode;
  /** Prevents focus and selection changes. Defaults to `false`. */
  disabled?: boolean;
  /** Associates the hidden native checkbox with an external form. */
  form?: string;
  /** Renders a mixed-state checkbox. Defaults to `false`. */
  indeterminate?: boolean;
  /** Exposes invalid state to assistive technology and error styling. Defaults to `false`. */
  invalid?: boolean;
  /** Native form field name. */
  name?: string;
  /** Marks the checkbox as required. Defaults to `false`. */
  required?: boolean;
  /** Ref to the rendered field container. */
  ref?: Ref<HTMLDivElement>;
  /** Ref to the hidden native checkbox used for focus and form integration. */
  inputRef?: RefObject<HTMLInputElement | null>;
  /** Native submitted value when selected. Defaults to `on`. */
  value?: string;
}

interface ControlledCheckboxRootProps {
  /** Current selected state. */
  selected: boolean;
  /** Called with the next selected state. */
  onChange: (selected: boolean) => void;
  defaultSelected?: never;
  readOnly?: false;
}

interface ReadOnlyCheckboxRootProps {
  /** Current immutable selected state. */
  selected: boolean;
  /** Marks a controlled selection as intentionally immutable. */
  readOnly: true;
  defaultSelected?: never;
  onChange?: never;
}

interface UncontrolledCheckboxRootProps {
  /** Initial selected state. Defaults to `false`. */
  defaultSelected?: boolean;
  /** Called with the next selected state. */
  onChange?: (selected: boolean) => void;
  readOnly?: false;
  selected?: never;
}

/** Props for controlled, read-only, or uncontrolled checkbox state. */
export type CheckboxRootProps = CheckboxRootSharedProps &
  (
    | ControlledCheckboxRootProps
    | ReadOnlyCheckboxRootProps
    | UncontrolledCheckboxRootProps
  );

/** Props for the clickable checkbox control and native label. */
export interface CheckboxControlProps
  extends Omit<
    LabelHTMLAttributes<HTMLLabelElement>,
    'onClick' | 'onClickCapture' | 'style'
  > {
  /** Indicator and persistent label content. */
  children: ReactNode;
  /** Ref to the rendered native label. */
  ref?: Ref<HTMLLabelElement>;
}

/** Props for the visual checkbox indicator. */
export interface CheckboxIndicatorProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'style'> {
  /** Ref to the rendered indicator. */
  ref?: Ref<HTMLSpanElement>;
  /** Canonical indicator size. Defaults to `md`. */
  size?: ControlSize;
}

/** Props for the visible checkbox label text. */
export interface CheckboxLabelProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Persistent text naming the checkbox. */
  children: ReactNode;
  /** Ref to the rendered label text. */
  ref?: Ref<HTMLSpanElement>;
}

/** Props for supporting text associated with the checkbox. */
export type CheckboxDescriptionProps = TextFieldDescriptionProps;

/** Props for an accessible checkbox validation message. */
export type CheckboxErrorProps = TextFieldErrorProps;

/** Coordinates accessible checkbox state, validation, and native form participation. */
export function Root({
  children,
  className,
  defaultSelected,
  disabled = false,
  form,
  indeterminate = false,
  inputRef,
  invalid = false,
  name,
  onChange,
  readOnly = false,
  ref,
  required = false,
  selected,
  value,
  ...props
}: Readonly<CheckboxRootProps>): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);
  const fallbackInputRef = useRef<HTMLInputElement>(null);

  return createElement(
    AriaCheckboxField,
    {
      ...props,
      className: checkboxRoot({ class: className }),
      defaultSelected,
      form,
      inputRef: inputRef ?? fallbackInputRef,
      isDisabled: disabled,
      isIndeterminate: indeterminate,
      isInvalid: invalid,
      isReadOnly: readOnly,
      isRequired: required,
      isSelected: selected,
      name,
      onChange,
      ref: forwardedRef,
      value,
    } as ComponentProps<typeof AriaCheckboxField>,
    children,
  );
}

/** Renders the pointer, touch, and keyboard checkbox target. */
export function Control({
  className,
  ref,
  ...props
}: Readonly<CheckboxControlProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaCheckboxButton, {
    ...props,
    className: checkboxControl({ class: className }),
    ref: forwardedRef,
  } as ComponentProps<typeof AriaCheckboxButton>);
}

/** Renders the selected or indeterminate visual checkbox mark. */
export function Indicator({
  className,
  ref,
  size,
  ...props
}: Readonly<CheckboxIndicatorProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(
    'span',
    {
      ...props,
      'aria-hidden': true,
      className: checkboxIndicator({ class: className, size }),
      ref: forwardedRef,
    },
    <CheckIcon />,
  );
}

/** Renders persistent visible label text within Checkbox.Control. */
export function Label({
  ref,
  ...props
}: Readonly<CheckboxLabelProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('span', {
    ...props,
    ref: forwardedRef,
  });
}

/**
 * Coordinates accessible Boolean selection with native form participation.
 *
 * @summary Boolean selection with native form participation
 */
export const Checkbox = {
  /** Pointer, touch, and keyboard selection target. */
  Control,
  /** Supporting guidance associated with the checkbox. */
  Description: TextField.Description,
  /** Validation message associated with an invalid checkbox. */
  Error: TextField.Error,
  /** Visual selected or indeterminate mark. */
  Indicator,
  /** Persistent visible label text. */
  Label,
  /** State, validation, and native form root. */
  Root,
};
