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
  SwitchButton as AriaSwitchButton,
  SwitchField as AriaSwitchField,
} from 'react-aria-components/Switch';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { ControlSize } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';
import {
  TextField,
  type TextFieldDescriptionProps,
  type TextFieldErrorProps,
} from '../TextField/TextField';

const switchRoot = tv({
  base: 'flex min-w-0 flex-col gap-1',
});

const switchControl = tv({
  base: 'group inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 font-[family-name:var(--breeze-font-display)] text-sm font-bold text-[var(--breeze-ink)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-55',
});

const switchTrack = tv({
  base: 'inline-flex shrink-0 items-center border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface-subtle)] p-0.5 transition-colors duration-[var(--breeze-duration-fast)] group-data-[selected]:border-[var(--breeze-primary)] group-data-[selected]:bg-[var(--breeze-primary)]',
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'h-7 w-12',
      md: 'h-6 w-10',
      sm: 'h-5 w-8',
    },
  },
});

const switchThumb = tv({
  base: 'block translate-x-0 bg-[var(--breeze-ink-muted)] transition-[transform,background-color] duration-[var(--breeze-duration-fast)] group-data-[selected]:bg-white',
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'size-5 group-data-[selected]:translate-x-5',
      md: 'size-4 group-data-[selected]:translate-x-4',
      sm: 'size-3 group-data-[selected]:translate-x-3',
    },
  },
});

type SwitchRootNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

interface SwitchRootSharedProps extends SwitchRootNativeProps {
  /** Compound control, description, and error parts. */
  children: ReactNode;
  /** Prevents focus and state changes. Defaults to `false`. */
  disabled?: boolean;
  /** Associates the hidden native checkbox with an external form. */
  form?: string;
  /** Ref to the hidden native checkbox used for focus and form integration. */
  inputRef?: RefObject<HTMLInputElement | null>;
  /** Exposes invalid state to assistive technology and error styling. Defaults to `false`. */
  invalid?: boolean;
  /** Native form field name. */
  name?: string;
  /** Marks the switch as required. Defaults to `false`. */
  required?: boolean;
  /** Ref to the rendered field container. */
  ref?: Ref<HTMLDivElement>;
  /** Native submitted value when selected. Defaults to `on`. */
  value?: string;
}

interface ControlledSwitchRootProps {
  /** Current selected state. */
  selected: boolean;
  /** Called with the next selected state. */
  onChange: (selected: boolean) => void;
  defaultSelected?: never;
  readOnly?: false;
}

interface ReadOnlySwitchRootProps {
  /** Current immutable selected state. */
  selected: boolean;
  /** Marks a controlled state as intentionally immutable. */
  readOnly: true;
  defaultSelected?: never;
  onChange?: never;
}

interface UncontrolledSwitchRootProps {
  /** Initial selected state. Defaults to `false`. */
  defaultSelected?: boolean;
  /** Called with the next selected state. */
  onChange?: (selected: boolean) => void;
  readOnly?: false;
  selected?: never;
}

/** Props for controlled, read-only, or uncontrolled switch state. */
export type SwitchRootProps = SwitchRootSharedProps &
  (
    | ControlledSwitchRootProps
    | ReadOnlySwitchRootProps
    | UncontrolledSwitchRootProps
  );

/** Props for the clickable switch control and native label. */
export interface SwitchControlProps
  extends Omit<
    LabelHTMLAttributes<HTMLLabelElement>,
    'onClick' | 'onClickCapture' | 'style'
  > {
  /** Track, thumb, and persistent label content. */
  children: ReactNode;
  /** Ref to the rendered native label. */
  ref?: Ref<HTMLLabelElement>;
}

/** Props for the visual switch track. */
export interface SwitchTrackProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Switch thumb. */
  children: ReactNode;
  /** Ref to the rendered track. */
  ref?: Ref<HTMLSpanElement>;
  /** Canonical track size. Defaults to `md`. */
  size?: ControlSize;
}

/** Props for the visual switch thumb. */
export interface SwitchThumbProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'style'> {
  /** Ref to the rendered thumb. */
  ref?: Ref<HTMLSpanElement>;
  /** Canonical thumb size. Defaults to `md`. */
  size?: ControlSize;
}

/** Props for persistent visible switch label text. */
export interface SwitchLabelProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Text naming the switch. */
  children: ReactNode;
  /** Ref to the rendered label text. */
  ref?: Ref<HTMLSpanElement>;
}

/** Props for supporting text associated with the switch. */
export type SwitchDescriptionProps = TextFieldDescriptionProps;

/** Props for an accessible switch validation message. */
export type SwitchErrorProps = TextFieldErrorProps;

/** Coordinates accessible switch state, validation, and native form participation. */
export function Root({
  children,
  className,
  defaultSelected,
  disabled = false,
  form,
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
}: SwitchRootProps): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);
  const fallbackInputRef = useRef<HTMLInputElement>(null);

  return createElement(
    AriaSwitchField,
    {
      ...props,
      className: switchRoot({ class: className }),
      defaultSelected,
      form,
      inputRef: inputRef ?? fallbackInputRef,
      isDisabled: disabled,
      isInvalid: invalid,
      isReadOnly: readOnly,
      isRequired: required,
      isSelected: selected,
      name,
      onChange,
      ref: forwardedRef,
      value,
    } as ComponentProps<typeof AriaSwitchField>,
    children,
  );
}

/** Renders the pointer, touch, and keyboard switch target. */
export function Control({
  className,
  ref,
  ...props
}: SwitchControlProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaSwitchButton, {
    ...props,
    className: switchControl({ class: className }),
    ref: forwardedRef,
  } as ComponentProps<typeof AriaSwitchButton>);
}

/** Renders the visual switch track. */
export function Track({
  className,
  ref,
  size,
  ...props
}: SwitchTrackProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('span', {
    ...props,
    'aria-hidden': true,
    className: switchTrack({ class: className, size }),
    ref: forwardedRef,
  });
}

/** Renders the visual switch thumb within Switch.Track. */
export function Thumb({
  className,
  ref,
  size,
  ...props
}: SwitchThumbProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('span', {
    ...props,
    'aria-hidden': true,
    className: switchThumb({ class: className, size }),
    ref: forwardedRef,
  });
}

/** Renders persistent visible label text within Switch.Control. */
export function Label({ ref, ...props }: SwitchLabelProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('span', {
    ...props,
    ref: forwardedRef,
  });
}

/**
 * Coordinates a visible label, native switch semantics, Boolean state,
 * validation guidance, and checkbox form participation.
 *
 * @summary accessible compound Boolean setting control
 */
export const Switch = {
  /** Pointer, touch, and keyboard state-change target. */
  Control,
  /** Supporting guidance associated with the switch. */
  Description: TextField.Description,
  /** Validation message associated with an invalid switch. */
  Error: TextField.Error,
  /** Persistent visible label text. */
  Label,
  /** State, validation, and native form root. */
  Root,
  /** Visual switch thumb. */
  Thumb,
  /** Visual switch track. */
  Track,
};
