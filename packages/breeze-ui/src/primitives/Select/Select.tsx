import type {
  ButtonHTMLAttributes,
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import {
  Button as AriaButton,
  ListBox as AriaListBox,
  Popover as AriaPopover,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
} from 'react-aria-components/Select';
import { tv } from 'tailwind-variants';
import { ChevronDownIcon } from '../../icons';
import useCollectionEmptyContent from '../../internal/collections/useCollectionEmptyContent';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import formControlValue from '../../internal/styling/formControls';
import type { ControlSize } from '../../internal/styling/visual';
import type {
  BreezeCollectionItem,
  CollectionContentProps,
  CollectionKey,
} from '../../internal/types/collection';
import { useBreezeContext } from '../../provider/BreezeContext';
import {
  ListBox as BreezeListBox,
  type ListBoxItemProps,
} from '../ListBox/ListBox';
import {
  TextField,
  type TextFieldDescriptionProps,
  type TextFieldErrorProps,
  type TextFieldLabelProps,
} from '../TextField/TextField';

const rootStyle = tv({ base: 'group/select flex min-w-0 flex-col gap-1.5' });
const triggerStyle = tv({
  base: 'inline-flex w-full items-center border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-left text-[var(--breeze-ink)] outline-none transition-colors duration-[var(--breeze-duration-fast)] data-[hovered]:border-[var(--breeze-primary)] data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-[-2px] data-[focus-visible]:outline-[var(--breeze-focus)] data-[disabled]:cursor-not-allowed data-[disabled]:bg-[var(--breeze-surface-subtle)] data-[disabled]:opacity-70 group-data-[invalid]/select:border-[var(--breeze-danger)]',
});
const popoverStyle = tv({
  base: 'min-w-[var(--trigger-width)] border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] shadow-lg',
});
const listStyle = tv({ base: 'max-h-72 overflow-y-auto p-1 outline-none' });

type NativeRoot = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;
interface SharedRoot extends NativeRoot {
  /** Compound label, trigger, popover, listbox, description, and error parts. */ children: ReactNode;
  /** Prevents focus and selection. Defaults to `false`. */ disabled?: boolean;
  /** Associates the native form value with an external form. */ form?: string;
  /** Exposes invalid state. Defaults to `false`. */ invalid?: boolean;
  /** Native form field name. */ name?: string;
  /** Placeholder shown before selection. */ placeholder?: string;
  /** Marks the select as required. Defaults to `false`. */ required?: boolean;
  /** Ref to the rendered field root. */ ref?: Ref<HTMLDivElement>;
}
interface Controlled {
  /** Current selected key, or `null` when no option is selected. */
  value: CollectionKey | null;
  /** Called when the selected key changes. */
  onChange: (value: CollectionKey | null) => void;
  /** Excluded when value is controlled. */
  defaultValue?: never;
  /** Controlled mutable state cannot be marked read-only. */
  readOnly?: false;
}
interface ReadOnly {
  /** Current immutable selected key, or `null` when no option is selected. */
  value: CollectionKey | null;
  /** Prevents interaction with the controlled value. */
  readOnly: true;
  /** Excluded when value is controlled. */
  defaultValue?: never;
  /** Excluded because read-only values cannot change. */
  onChange?: never;
}
interface Uncontrolled {
  /** Initial selected key. */
  defaultValue?: CollectionKey;
  /** Called when the selected key changes. */
  onChange?: (value: CollectionKey | null) => void;
  /** Uncontrolled state cannot be marked read-only. */
  readOnly?: false;
  /** Excluded when value is uncontrolled. */
  value?: never;
}
/** Props for controlled, read-only, or uncontrolled single-value select state. */
export type SelectRootProps = SharedRoot &
  (Controlled | ReadOnly | Uncontrolled);
/** Props for the visible select label. */ export type SelectLabelProps =
  TextFieldLabelProps;
/** Props for select supporting text. */ export type SelectDescriptionProps =
  TextFieldDescriptionProps;
/** Props for a select validation message. */ export type SelectErrorProps =
  TextFieldErrorProps;
/** Props for the native select trigger button. */
export interface SelectTriggerProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onClick' | 'onClickCapture' | 'style'
  > {
  /** Trigger content. */ children: ReactNode;
  /** Ref to the trigger. */ ref?: Ref<HTMLButtonElement>;
  /** Canonical control size. Defaults to `md`. */ size?: ControlSize;
}
/** Props for the displayed selected value. */
export interface SelectValueProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Optional custom value content. */ children?: ReactNode;
  /** Ref to the value element. */ ref?: Ref<HTMLSpanElement>;
}
/** Props for the select popover. */
export interface SelectPopoverProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Select listbox content. */ children: ReactNode;
  /** Ref to the popover. */ ref?: Ref<HTMLElement>;
}
/** Props for static or generic select options. */
export type SelectListBoxProps<
  Item extends BreezeCollectionItem = BreezeCollectionItem,
> = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> &
  CollectionContentProps<Item> & {
    /** Empty-state content. */ emptyContent?: ReactNode;
    /** Ref to the listbox. */ ref?: Ref<HTMLDivElement>;
  };
/** Props for one keyed select option. */ export type SelectItemProps =
  ListBoxItemProps;

/** Coordinates select state, validation, and native form participation. */
export function Root({
  children,
  className,
  defaultValue,
  disabled = false,
  form,
  invalid = false,
  name,
  onChange,
  placeholder,
  readOnly = false,
  ref,
  required = false,
  value,
  ...props
}: SelectRootProps): ReactElement {
  useBreezeContext();
  const forwardedRef = useForwardedRef(ref);
  return createElement(AriaSelect, {
    ...props,
    allowsEmptyCollection: true,
    children,
    className: rootStyle({ class: className }),
    defaultSelectedKey: defaultValue,
    form,
    isDisabled: disabled || readOnly,
    isInvalid: invalid,
    isRequired: required,
    name,
    onSelectionChange: onChange,
    placeholder,
    ref: forwardedRef,
    selectedKey: value,
  } as unknown as ComponentProps<typeof AriaSelect>);
}
/** Renders the select trigger button. */
export function Trigger({
  children,
  className,
  ref,
  size,
  ...props
}: SelectTriggerProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(
    AriaButton,
    {
      ...props,
      className: formControlValue({
        class: triggerStyle({ class: className }),
        size,
      }),
      ref: forwardedRef,
    } as ComponentProps<typeof AriaButton>,
    <>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <ChevronDownIcon
        className="ms-3 size-4 text-[var(--breeze-ink-muted)]"
        data-breeze-select-indicator
      />
    </>,
  );
}
/** Renders selected option text or the placeholder. */
export function Value({
  className,
  ref,
  ...props
}: SelectValueProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);
  return createElement(AriaSelectValue, {
    ...props,
    className,
    ref: forwardedRef,
  });
}
/** Positions the select listbox relative to its trigger. */
export function Popover({
  className,
  ref,
  ...props
}: SelectPopoverProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);
  return createElement(AriaPopover, {
    ...props,
    className: popoverStyle({ class: className }),
    ref: forwardedRef,
  } as ComponentProps<typeof AriaPopover>);
}
/** Renders static or typed generic select options. */
export function ListBox<Item extends BreezeCollectionItem>({
  children,
  className,
  emptyContent,
  items,
  ref,
  ...props
}: SelectListBoxProps<Item>): ReactElement {
  const forwardedRef = useForwardedRef(ref);
  const resolvedEmptyContent = useCollectionEmptyContent(emptyContent);

  return createElement(AriaListBox, {
    ...props,
    children,
    className: listStyle({ class: className }),
    items,
    ref: forwardedRef,
    renderEmptyState: () => resolvedEmptyContent,
  } as unknown as ComponentProps<typeof AriaListBox>);
}

/**
 * Accessible compound native-form select primitive.
 *
 * @summary compact single selection from a keyed option collection
 */
export const Select = {
  /** Supporting guidance associated with the select. */
  Description: TextField.Description,
  /** Validation feedback associated with the select. */
  Error: TextField.Error,
  /** One keyed option within `Select.ListBox`. */
  Item: BreezeListBox.Item,
  /** Visible label associated with the select trigger. */
  Label: TextField.Label,
  /** Static or typed generic option collection. */
  ListBox,
  /** Popup positioned relative to the trigger. */
  Popover,
  /** State, validation, and native-form coordination root. */
  Root,
  /** Button that opens and closes the option popup. */
  Trigger,
  /** Selected option text or placeholder content. */
  Value,
};
