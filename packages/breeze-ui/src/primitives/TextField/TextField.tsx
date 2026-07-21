import type {
  ComponentProps,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { FieldError as AriaFieldError } from 'react-aria-components/FieldError';
import { Input as AriaInput } from 'react-aria-components/Input';
import { Label as AriaLabel } from 'react-aria-components/Label';
import { Text as AriaText } from 'react-aria-components/Text';
import { TextField as AriaTextField } from 'react-aria-components/TextField';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import formControlValue from '../../internal/styling/formControls';
import type { ControlSize } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';

const textFieldRoot = tv({
  base: 'flex min-w-0 flex-col gap-1.5',
});

const textFieldInput = tv({
  base: 'w-full border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-[var(--breeze-ink)] outline-none transition-colors duration-[var(--breeze-duration-fast)] placeholder:text-[var(--breeze-ink-muted)] data-[hovered]:border-[var(--breeze-primary)] data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-[-2px] data-[focus-visible]:outline-[var(--breeze-focus)] disabled:cursor-not-allowed disabled:bg-[var(--breeze-surface-subtle)] disabled:opacity-70 read-only:cursor-default read-only:bg-[var(--breeze-surface-subtle)] aria-invalid:border-[var(--breeze-danger)]',
});

const label = tv({
  base: 'font-[family-name:var(--breeze-font-display)] text-base font-bold text-[var(--breeze-ink)]',
});

const description = tv({
  base: 'text-sm text-[var(--breeze-ink-soft)]',
});

const error = tv({
  base: 'text-sm font-medium text-[var(--breeze-danger)]',
});

type TextFieldRootNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

interface TextFieldRootSharedProps extends TextFieldRootNativeProps {
  /** Compound label, input, description, and error parts. */
  children: ReactNode;
  /** Prevents editing and focus. Defaults to `false`. */
  disabled?: boolean;
  /** Exposes invalid state to assistive technology and error styling. Defaults to `false`. */
  invalid?: boolean;
  /** Marks the field as required for native validation and assistive technology. Defaults to `false`. */
  required?: boolean;
  /** Ref to the rendered field container. */
  ref?: Ref<HTMLDivElement>;
}

interface ControlledTextFieldRootProps {
  /** Current text value. */
  value: string;
  /** Called with the next text value. */
  onChange: (value: string) => void;
  defaultValue?: never;
  readOnly?: false;
}

interface ReadOnlyTextFieldRootProps {
  /** Current immutable text value. */
  value: string;
  /** Marks a controlled value as intentionally immutable. */
  readOnly: true;
  defaultValue?: never;
  onChange?: never;
}

interface UncontrolledTextFieldRootProps {
  /** Initial text value. Defaults to an empty string. */
  defaultValue?: string;
  /** Called with the next text value. */
  onChange?: (value: string) => void;
  readOnly?: false;
  value?: never;
}

/** Props for controlled, read-only, or uncontrolled text field state. */
export type TextFieldRootProps = TextFieldRootSharedProps &
  (
    | ControlledTextFieldRootProps
    | ReadOnlyTextFieldRootProps
    | UncontrolledTextFieldRootProps
  );

/** Props for the visible text field label. */
export interface TextFieldLabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'style'> {
  /** Label content that persistently names the input. */
  children: ReactNode;
  /** Ref to the rendered label. */
  ref?: Ref<HTMLLabelElement>;
}

/** Props for the native text input part. */
export interface TextFieldInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'children'
    | 'className'
    | 'defaultValue'
    | 'disabled'
    | 'onChange'
    | 'readOnly'
    | 'required'
    | 'size'
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
  /** Native text-entry purpose. Defaults to `text`. */
  type?: 'email' | 'password' | 'tel' | 'text' | 'url';
}

/** Props for supporting text associated with the input. */
export interface TextFieldDescriptionProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Supporting guidance for the input. */
  children: ReactNode;
  /** Ref to the rendered description. */
  ref?: Ref<HTMLElement>;
}

/** Props for an accessible validation message. */
export interface TextFieldErrorProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Validation message shown while the root is invalid. */
  children: ReactNode;
  /** Ref to the rendered error message. */
  ref?: Ref<HTMLElement>;
}

/** Coordinates accessible text field state and compound anatomy. */
export function Root({
  children,
  className,
  defaultValue,
  disabled = false,
  invalid = false,
  onChange,
  readOnly = false,
  ref,
  required = false,
  value,
  ...props
}: Readonly<TextFieldRootProps>): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement(
    AriaTextField,
    {
      ...props,
      className: textFieldRoot({ class: className }),
      defaultValue,
      isDisabled: disabled,
      isInvalid: invalid,
      isReadOnly: readOnly,
      isRequired: required,
      onChange,
      ref: forwardedRef,
      value,
    } as ComponentProps<typeof AriaTextField>,
    children,
  );
}

/** Renders the persistent accessible label for a TextField. */
export function Label({
  className,
  ref,
  ...props
}: Readonly<TextFieldLabelProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaLabel, {
    ...props,
    className: label({ class: className }),
    ref: forwardedRef,
  });
}

/** Renders the editable native input for a TextField. */
export function Input({
  className,
  ref,
  size,
  type = 'text',
  ...props
}: Readonly<TextFieldInputProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaInput, {
    ...props,
    className: formControlValue({
      class: textFieldInput({ class: className }),
      size,
    }),
    ref: forwardedRef,
    type,
  });
}

/** Renders supporting guidance and associates it with a TextField input. */
export function Description({
  className,
  ref,
  ...props
}: Readonly<TextFieldDescriptionProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaText, {
    ...props,
    className: description({ class: className }),
    ref: forwardedRef,
    slot: 'description',
  });
}

/** Renders an associated validation message while a TextField is invalid. */
function ErrorMessage({
  className,
  ref,
  ...props
}: Readonly<TextFieldErrorProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaFieldError, {
    ...props,
    className: error({ class: className }),
    ref: forwardedRef,
  });
}

export { ErrorMessage as Error };

/**
 * Accessible compound single-line text-entry primitive.
 *
 * @summary labelled single-line text entry with validation anatomy
 */
export const TextField = {
  /** Supporting guidance associated with the input. */
  Description,
  /** Validation message associated with an invalid input. */
  Error: ErrorMessage,
  /** Editable native input. */
  Input,
  /** Persistent accessible label. */
  Label,
  /** State and accessibility root. */
  Root,
};
