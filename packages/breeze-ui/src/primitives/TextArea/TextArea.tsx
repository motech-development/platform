import type { ReactElement, Ref, TextareaHTMLAttributes } from 'react';
import { createElement } from 'react';
import { TextArea as AriaTextArea } from 'react-aria-components/TextField';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { ControlSize } from '../../internal/styling/visual';
import {
  TextField,
  type TextFieldDescriptionProps,
  type TextFieldErrorProps,
  type TextFieldLabelProps,
  type TextFieldRootProps,
} from '../TextField/TextField';

const textAreaControl = tv({
  base: 'block w-full resize-y border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-[var(--breeze-ink)] transition-colors duration-[var(--breeze-duration-fast)] placeholder:text-[var(--breeze-ink-muted)] disabled:cursor-not-allowed disabled:bg-[var(--breeze-surface-subtle)] disabled:opacity-70 aria-invalid:border-[var(--breeze-danger)]',
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'min-h-32 px-4 py-3 text-base',
      md: 'min-h-24 px-3 py-2 text-sm',
      sm: 'min-h-20 px-2.5 py-1.5 text-xs',
    },
  },
});

/** Props for controlled, read-only, or uncontrolled multiline field state. */
export type TextAreaRootProps = TextFieldRootProps;

/** Props for the visible multiline field label. */
export type TextAreaLabelProps = TextFieldLabelProps;

/** Props for supporting text associated with the multiline control. */
export type TextAreaDescriptionProps = TextFieldDescriptionProps;

/** Props for an accessible multiline validation message. */
export type TextAreaErrorProps = TextFieldErrorProps;

/** Props for the native multiline control part. */
export interface TextAreaControlProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    | 'children'
    | 'className'
    | 'defaultValue'
    | 'disabled'
    | 'onChange'
    | 'readOnly'
    | 'required'
    | 'style'
    | 'value'
  > {
  /** Placement and composition classes. */
  className?: string;
  /** Ref to the rendered textarea. */
  ref?: Ref<HTMLTextAreaElement>;
  /** Canonical control size. Defaults to `md`. */
  size?: ControlSize;
}

/** Renders the editable native multiline control for a TextArea. */
export function Control({
  className,
  ref,
  size,
  ...props
}: TextAreaControlProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaTextArea, {
    ...props,
    className: textAreaControl({ class: className, size }),
    ref: forwardedRef,
  });
}

/**
 * Accessible compound multiline text-entry primitive.
 *
 * @summary labelled multiline text entry with validation anatomy
 */
export const TextArea = {
  /** Editable native multiline control. */
  Control,
  /** Supporting guidance associated with the control. */
  Description: TextField.Description,
  /** Validation message associated with an invalid control. */
  Error: TextField.Error,
  /** Persistent accessible label. */
  Label: TextField.Label,
  /** State and accessibility root. */
  Root: TextField.Root,
};
