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
  RadioButton as AriaRadioButton,
  RadioField as AriaRadioField,
  RadioGroup as AriaRadioGroup,
} from 'react-aria-components/RadioGroup';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { formControlValueTypography } from '../../internal/styling/formControls';
import type { ControlSize } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';
import {
  TextField,
  type TextFieldDescriptionProps,
  type TextFieldErrorProps,
  type TextFieldLabelProps,
} from '../TextField/TextField';

const radioGroupRoot = tv({
  base: 'flex min-w-0 gap-2',
  defaultVariants: {
    orientation: 'vertical',
  },
  variants: {
    orientation: {
      horizontal:
        'flex-row flex-wrap items-start gap-x-5 [&>[data-breeze-radio-group-description]]:basis-full [&>[data-breeze-radio-group-error]]:basis-full [&>[data-breeze-radio-group-label]]:basis-full',
      vertical: 'flex-col items-start',
    },
  },
});

const radioItem = tv({
  base: 'flex min-w-0 flex-col gap-1',
});

const radioControl = tv({
  base: `${formControlValueTypography} group inline-flex w-fit cursor-pointer items-center gap-2 rounded-sm text-base leading-[1.4] text-[var(--breeze-ink)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-55 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)]`,
});

const radioIndicator = tv({
  base: 'inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] transition-colors duration-[var(--breeze-duration-fast)] after:rounded-full after:bg-[var(--breeze-primary)] after:opacity-0 group-data-[selected]:border-[var(--breeze-primary)] group-data-[selected]:after:opacity-100',
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'size-6 after:size-3',
      md: 'size-5 after:size-2',
      sm: 'size-4 after:size-2',
    },
  },
});

type RadioGroupRootNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

interface RadioGroupRootSharedProps extends RadioGroupRootNativeProps {
  /** Compound label, radio items, description, and error parts. */
  children: ReactNode;
  /** Prevents focus and selection changes for every option. Defaults to `false`. */
  disabled?: boolean;
  /** Exposes invalid group state to assistive technology and error styling. Defaults to `false`. */
  invalid?: boolean;
  /** Native form field name shared by every radio option. */
  name?: string;
  /** Option layout and arrow-key navigation axis. Defaults to `vertical`. */
  orientation?: 'horizontal' | 'vertical';
  /** Marks the radio group as requiring a selection. Defaults to `false`. */
  required?: boolean;
  /** Ref to the rendered radio group. */
  ref?: Ref<HTMLDivElement>;
}

interface ControlledRadioGroupRootProps {
  /** Current selected option, or `null` when no option is selected. */
  selection: string | null;
  /** Called with the next selected option value. */
  onSelectionChange: (selection: string) => void;
  defaultSelection?: never;
  readOnly?: false;
}

interface ReadOnlyRadioGroupRootProps {
  /** Current immutable option, or `null` when no option is selected. */
  selection: string | null;
  /** Marks a controlled selection as intentionally immutable. */
  readOnly: true;
  defaultSelection?: never;
  onSelectionChange?: never;
}

interface UncontrolledRadioGroupRootProps {
  /** Initial selected option. Defaults to no selection. */
  defaultSelection?: string;
  /** Called with the next selected option value. */
  onSelectionChange?: (selection: string) => void;
  readOnly?: false;
  selection?: never;
}

/** Props for controlled, read-only, or uncontrolled radio-group selection. */
export type RadioGroupRootProps = RadioGroupRootSharedProps &
  (
    | ControlledRadioGroupRootProps
    | ReadOnlyRadioGroupRootProps
    | UncontrolledRadioGroupRootProps
  );

/** Props for the visible radio-group label. */
export type RadioGroupLabelProps = TextFieldLabelProps;

/** Props for supporting text associated with the radio group. */
export type RadioGroupDescriptionProps = TextFieldDescriptionProps;

/** Props for an accessible radio-group validation message. */
export type RadioGroupErrorProps = TextFieldErrorProps;

/** Props for one radio option and its optional description. */
export interface RadioGroupItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  /** Compound control and optional item description. */
  children: ReactNode;
  /** Prevents selection of this option. Defaults to `false`. */
  disabled?: boolean;
  /** Ref to the hidden native radio input. */
  inputRef?: RefObject<HTMLInputElement | null>;
  /** Ref to the rendered option field. */
  ref?: Ref<HTMLDivElement>;
  /** Stable native form value for this option. */
  value: string;
}

/** Props for the clickable radio option and native label. */
export interface RadioGroupControlProps
  extends Omit<
    LabelHTMLAttributes<HTMLLabelElement>,
    'onClick' | 'onClickCapture' | 'style'
  > {
  /** Indicator and persistent option label. */
  children: ReactNode;
  /** Ref to the rendered native label. */
  ref?: Ref<HTMLLabelElement>;
}

/** Props for the visual radio selection indicator. */
export interface RadioGroupIndicatorProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'style'> {
  /** Ref to the rendered indicator. */
  ref?: Ref<HTMLSpanElement>;
  /** Canonical indicator size. Defaults to `md`. */
  size?: ControlSize;
}

/** Props for persistent visible radio-option label text. */
export interface RadioGroupItemLabelProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Text naming the radio option. */
  children: ReactNode;
  /** Ref to the rendered option label text. */
  ref?: Ref<HTMLSpanElement>;
}

/** Props for supporting text associated with one radio option. */
export type RadioGroupItemDescriptionProps = TextFieldDescriptionProps;

/** Coordinates exclusive selection, validation, orientation, and native form naming. */
export function Root({
  children,
  className,
  defaultSelection,
  disabled = false,
  invalid = false,
  name,
  onSelectionChange,
  orientation = 'vertical',
  readOnly = false,
  ref,
  required = false,
  selection,
  ...props
}: RadioGroupRootProps): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement(
    AriaRadioGroup,
    {
      ...props,
      className: radioGroupRoot({ class: className, orientation }),
      defaultValue: defaultSelection,
      isDisabled: disabled,
      isInvalid: invalid,
      isReadOnly: readOnly,
      isRequired: required,
      name,
      onChange: onSelectionChange,
      orientation,
      ref: forwardedRef,
      value: selection,
    } as ComponentProps<typeof AriaRadioGroup>,
    children,
  );
}

/** Renders one radio option field with native form value and optional guidance. */
export function Item({
  children,
  className,
  disabled = false,
  inputRef,
  ref,
  value,
  ...props
}: RadioGroupItemProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);
  const fallbackInputRef = useRef<HTMLInputElement>(null);

  return createElement(
    AriaRadioField,
    {
      ...props,
      className: radioItem({ class: className }),
      inputRef: inputRef ?? fallbackInputRef,
      isDisabled: disabled,
      ref: forwardedRef,
      value,
    } as ComponentProps<typeof AriaRadioField>,
    children,
  );
}

/** Renders the persistent accessible label owned by the radio group. */
export function Label({
  className,
  ref,
  ...props
}: RadioGroupLabelProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(TextField.Label, {
    ...props,
    className: `leading-[1.4] ${className ?? ''}`,
    'data-breeze-radio-group-label': true,
    ref: forwardedRef,
  } as RadioGroupLabelProps & {
    'data-breeze-radio-group-label': true;
  });
}

/** Renders supporting guidance on its own radio-group row. */
export function Description(props: RadioGroupDescriptionProps): ReactElement {
  return createElement(TextField.Description, {
    ...props,
    'data-breeze-radio-group-description': true,
  } as RadioGroupDescriptionProps & {
    'data-breeze-radio-group-description': true;
  });
}

/** Renders associated validation feedback on its own radio-group row. */
function ErrorMessage(props: RadioGroupErrorProps): ReactElement {
  return createElement(TextField.Error, {
    ...props,
    'data-breeze-radio-group-error': true,
  } as RadioGroupErrorProps & {
    'data-breeze-radio-group-error': true;
  });
}

export { ErrorMessage as Error };

/** Renders the pointer, touch, and keyboard target for one radio option. */
export function Control({
  className,
  ref,
  ...props
}: RadioGroupControlProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaRadioButton, {
    ...props,
    className: radioControl({ class: className }),
    ref: forwardedRef,
  } as ComponentProps<typeof AriaRadioButton>);
}

/** Renders the visual selected state for one radio option. */
export function Indicator({
  className,
  ref,
  size,
  ...props
}: RadioGroupIndicatorProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('span', {
    ...props,
    'aria-hidden': true,
    className: radioIndicator({ class: className, size }),
    ref: forwardedRef,
  });
}

/** Renders persistent visible label text within RadioGroup.Control. */
export function ItemLabel({
  ref,
  ...props
}: RadioGroupItemLabelProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('span', {
    ...props,
    ref: forwardedRef,
  });
}

/**
 * Accessible compound exclusive-selection primitive.
 *
 * @summary labelled exclusive selection with native radio semantics
 */
export const RadioGroup = {
  /** Pointer, touch, and keyboard selection target for one option. */
  Control,
  /** Supporting guidance associated with the group. */
  Description,
  /** Validation message associated with an invalid group. */
  Error: ErrorMessage,
  /** Visual selected-state indicator. */
  Indicator,
  /** One radio option field. */
  Item,
  /** Supporting guidance associated with one option. */
  ItemDescription: TextField.Description,
  /** Persistent visible option label text. */
  ItemLabel,
  /** Persistent accessible group label. */
  Label,
  /** Selection, validation, orientation, and native form root. */
  Root,
};
