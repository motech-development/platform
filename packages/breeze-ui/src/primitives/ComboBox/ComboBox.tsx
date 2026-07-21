import type {
  ButtonHTMLAttributes,
  ComponentProps,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createContext, createElement, useContext } from 'react';
import {
  Button as AriaButton,
  ComboBox as AriaComboBox,
  type ComboBoxRenderProps,
  Input as AriaInput,
  ListBox as AriaListBox,
  Popover as AriaPopover,
} from 'react-aria-components/ComboBox';
import { Group as AriaGroup } from 'react-aria-components/Group';
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

const root = tv({ base: 'flex min-w-0 flex-col gap-1.5' });
const input = tv({
  base: 'w-full border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-[var(--breeze-ink)] outline-none transition-colors duration-[var(--breeze-duration-fast)] placeholder:text-[var(--breeze-ink-muted)] data-[hovered]:border-[var(--breeze-primary)] data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-[-2px] data-[focus-visible]:outline-[var(--breeze-focus)] disabled:cursor-not-allowed disabled:bg-[var(--breeze-surface-subtle)] disabled:opacity-70 read-only:cursor-default read-only:bg-[var(--breeze-surface-subtle)] aria-invalid:border-[var(--breeze-danger)]',
});
const group = tv({
  base: "relative inline-flex w-full min-w-0 items-stretch bg-[var(--breeze-surface)] outline-none after:pointer-events-none after:absolute after:inset-0 after:z-10 after:border after:border-[var(--breeze-border-strong)] after:transition-colors after:duration-[var(--breeze-duration-fast)] after:content-[''] data-[disabled]:cursor-not-allowed data-[disabled]:bg-[var(--breeze-surface-subtle)] data-[disabled]:opacity-70 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-[-2px] data-[focus-visible]:outline-solid data-[focus-visible]:outline-[var(--breeze-focus)] data-[focus-within]:after:border-[var(--breeze-primary)] data-[hovered]:after:border-[var(--breeze-primary)] data-[invalid]:after:!border-[var(--breeze-danger)] data-[readonly]:bg-[var(--breeze-surface-subtle)] data-[readonly]:opacity-70",
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'min-h-12',
      md: 'min-h-11',
      sm: 'min-h-8',
    },
  },
});
const groupedInput = tv({
  base: 'min-w-0 w-auto flex-1 border-0 bg-transparent disabled:!bg-transparent disabled:!opacity-100 read-only:!bg-transparent read-only:!opacity-100 data-[focus-visible]:!outline-none aria-invalid:!border-0',
});
const button = tv({
  base: 'inline-flex shrink-0 items-center justify-center border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-[var(--breeze-ink-soft)] outline-none transition-colors duration-[var(--breeze-duration-fast)] data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-[-2px] data-[focus-visible]:outline-[var(--breeze-focus)] data-[hovered]:border-[var(--breeze-primary)] data-[hovered]:text-[var(--breeze-primary)] disabled:cursor-not-allowed disabled:bg-[var(--breeze-surface-subtle)] disabled:opacity-70',
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'min-h-12 min-w-12 px-3',
      md: 'min-h-11 min-w-11 px-3',
      sm: 'min-h-8 min-w-8 px-2',
    },
  },
});
const groupedButton = tv({
  base: 'border-0 bg-transparent data-[focus-visible]:!outline-none data-[hovered]:border-0 data-[hovered]:bg-transparent disabled:!bg-transparent disabled:!opacity-100',
});
const popover = tv({
  base: 'min-w-[var(--trigger-width)] border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] shadow-lg',
});
const list = tv({ base: 'max-h-72 overflow-y-auto p-1 outline-none' });
const loading = tv({
  base: 'px-3 py-2 text-sm text-[var(--breeze-ink-muted)]',
});
const optionsError = tv({
  base: 'px-3 py-2 text-sm text-[var(--breeze-danger)]',
});

interface ComboBoxContextValue {
  onCommit?: (value: string) => void;
}

interface ComboBoxCompositionContextValue {
  size: ControlSize;
}

interface ComboBoxStateContextValue {
  isDisabled: boolean;
  isInvalid: boolean;
  isReadOnly: boolean;
}

const ComboBoxContext = createContext<ComboBoxContextValue | null>(null);
const ComboBoxCompositionContext = createContext<
  ComboBoxCompositionContextValue | undefined
>(undefined);
const ComboBoxStateContext = createContext<
  ComboBoxStateContextValue | undefined
>(undefined);
const includeAllOptions = () => true;

function renderComboBoxChildren(
  children: ReactNode,
  { isDisabled, isInvalid, isReadOnly }: ComboBoxRenderProps,
): ReactElement {
  return createElement(
    ComboBoxStateContext.Provider,
    {
      value: {
        isDisabled,
        isInvalid,
        isReadOnly,
      },
    },
    children,
  );
}

type Native = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;
interface Shared extends Native {
  /** Compound label, input, trigger, popover, options, and guidance parts. */ children: ReactNode;
  /** Prevents focus, input, and selection. Defaults to `false`. */ disabled?: boolean;
  /** Associates the native form value with an external form. */ form?: string;
  /** Exposes invalid state to the input and validation message. Defaults to `false`. */ invalid?: boolean;
  /** Native form field name for the selected key or free-form text. */ name?: string;
  /** Temporary text shown when the input is empty. */ placeholder?: string;
  /** Marks the combobox as required. Defaults to `false`. */ required?: boolean;
  /** Ref to the rendered field root. */ ref?: Ref<HTMLDivElement>;
}
type SelectionControlled =
  | {
      /** Current selected key, or `null` when no option is selected. */
      selection: CollectionKey | null;
      /** Called when the selected key changes. */
      onSelectionChange: (selection: CollectionKey | null) => void;
      /** Excluded when selection is controlled. */
      defaultSelection?: never;
    }
  | {
      /** Initial selected key. */
      defaultSelection?: CollectionKey;
      /** Called when the selected key changes. */
      onSelectionChange?: (selection: CollectionKey | null) => void;
      /** Excluded when selection is uncontrolled. */
      selection?: never;
    };
type InputControlled =
  | {
      /** Current text displayed in the input. */
      inputValue: string;
      /** Called when the displayed input text changes. */
      onInputChange: (value: string) => void;
      /** Excluded when input text is controlled. */
      defaultInputValue?: never;
    }
  | {
      /** Initial text displayed in the input. */
      defaultInputValue?: string;
      /** Called when the displayed input text changes. */
      onInputChange?: (value: string) => void;
      /** Excluded when input text is uncontrolled. */
      inputValue?: never;
    };
type Mutable = SelectionControlled &
  InputControlled & {
    /** Mutable state cannot be marked read-only. */
    readOnly?: false;
  };
interface SelectionReadOnly {
  /** Current selected key, or `null` when no option is selected. */
  selection: CollectionKey | null;
  /** Current immutable input text. */
  inputValue: string;
  /** Prevents changes to the controlled input and selection. */
  readOnly: true;
  /** Excluded when selection is controlled. */
  defaultSelection?: never;
  /** Excluded when input text is controlled. */
  defaultInputValue?: never;
  /** Excluded because read-only selection cannot change. */
  onSelectionChange?: never;
  /** Excluded because read-only input text cannot change. */
  onInputChange?: never;
}
interface CustomValueReadOnly {
  /** Current immutable free-form input text. */
  inputValue: string;
  /** Current suggestion key, or `null` when no option is selected. */
  selection?: CollectionKey | null;
  /** Prevents changes to the controlled input and selection. */
  readOnly: true;
  /** Excluded when selection is controlled. */
  defaultSelection?: never;
  /** Excluded when input text is controlled. */
  defaultInputValue?: never;
  /** Excluded because read-only selection cannot change. */
  onSelectionChange?: never;
  /** Excluded because read-only input text cannot change. */
  onInputChange?: never;
}
type SelectionOnly = {
  /** Requires the committed value to match an option. This is the default. */
  allowsCustomValue?: false;
  /** Free-form commits are unavailable in selection-only mode. */
  onCommit?: never;
} & (Mutable | SelectionReadOnly);
type CustomValue = {
  /** Allows arbitrary text to be committed without selecting an option. */
  allowsCustomValue: true;
  /** Called with the current text when Enter commits without a highlighted option. */
  onCommit?: (value: string) => void;
} & (Mutable | CustomValueReadOnly);
/** Props for selection-only or free-form ComboBox state. */ export type ComboBoxRootProps =
  Shared & (SelectionOnly | CustomValue);
/** Props for the visible combobox label. */ export type ComboBoxLabelProps =
  TextFieldLabelProps;
/** Props for supporting combobox guidance. */ export type ComboBoxDescriptionProps =
  TextFieldDescriptionProps;
/** Props for a combobox validation message. */ export type ComboBoxErrorProps =
  TextFieldErrorProps;
/** Props for the single-surface combobox input and trigger group. */
export interface ComboBoxGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Editable input and popup trigger. */
  children: ReactNode;
  /** Ref to the rendered group. */
  ref?: Ref<HTMLDivElement>;
  /** Canonical size applied to every grouped control part. Defaults to `md`. */
  size?: ControlSize;
}
/** Editable combobox input props. */ export interface ComboBoxInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'defaultValue'
    | 'disabled'
    | 'onChange'
    | 'readOnly'
    | 'required'
    | 'size'
    | 'style'
    | 'value'
  > {
  /** Ref to the rendered native text input. */ ref?: Ref<HTMLInputElement>;
  /** Standalone input size. A containing Group takes precedence. Defaults to `md`. */
  size?: ControlSize;
}
/** Popup trigger props. */ export interface ComboBoxTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'style'> {
  /** Optional trigger content. Defaults to the Breeze down chevron. */ children?: ReactNode;
  /** Ref to the popup trigger button. */ ref?: Ref<HTMLButtonElement>;
  /** Standalone trigger size. A containing Group takes precedence. Defaults to `md`. */
  size?: ControlSize;
}
/** Popover props. */ export interface ComboBoxPopoverProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Option-list content. */ children: ReactNode;
  /** Ref to the positioned popover element. */ ref?: Ref<HTMLElement>;
}
/** Static or typed generic option-list props. */ export type ComboBoxListBoxProps<
  Item extends BreezeCollectionItem = BreezeCollectionItem,
> = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> &
  CollectionContentProps<Item> & {
    /** Content announced and displayed when filtering leaves no matching options. */ emptyContent?: ReactNode;
    /** Ref to the rendered listbox. */ ref?: Ref<HTMLDivElement>;
  };
/** Props for one keyed combobox option. */ export type ComboBoxItemProps =
  ListBoxItemProps;
/** Props for application-owned asynchronous option loading presentation. */
export interface ComboBoxLoadingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Loading message announced politely while options are pending. */
  children: ReactNode;
  /** Ref to the rendered loading status. */
  ref?: Ref<HTMLDivElement>;
}
/** Props for application-owned option loading failure presentation. */
export interface ComboBoxOptionsErrorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Failure message announced assertively when options cannot load. */
  children: ReactNode;
  /** Ref to the rendered option failure alert. */
  ref?: Ref<HTMLDivElement>;
}
/** Coordinates selection-only or free-form input, options, and form state. */
export function Root({
  allowsCustomValue = false,
  children,
  className,
  defaultInputValue,
  defaultSelection,
  disabled = false,
  form,
  inputValue,
  invalid = false,
  name,
  onCommit,
  onInputChange,
  onSelectionChange,
  placeholder,
  readOnly = false,
  ref,
  required = false,
  selection,
  ...props
}: Readonly<ComboBoxRootProps>): ReactElement {
  useBreezeContext();
  const forwardedRef = useForwardedRef(ref);
  const commit =
    allowsCustomValue && !disabled && !readOnly ? onCommit : undefined;

  return createElement(
    ComboBoxContext.Provider,
    { value: { onCommit: commit } },
    createElement(AriaComboBox, {
      ...props,
      allowsCustomValue,
      allowsEmptyCollection: true,
      children: renderComboBoxChildren.bind(null, children),
      className: root({ class: className }),
      defaultFilter: allowsCustomValue ? includeAllOptions : undefined,
      defaultInputValue,
      defaultSelectedKey: defaultSelection,
      form,
      inputValue,
      isDisabled: disabled,
      isInvalid: invalid,
      isReadOnly: readOnly,
      isRequired: required,
      name,
      onInputChange,
      onSelectionChange,
      placeholder,
      ref: forwardedRef,
      selectedKey: selection,
    } as unknown as ComponentProps<typeof AriaComboBox>),
  );
}
/** Groups the editable input and popup trigger as one visual control. */
export function Group({
  className,
  ref,
  role = 'presentation',
  size = 'md',
  ...props
}: Readonly<ComboBoxGroupProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);
  const rootState = useContext(ComboBoxStateContext);

  return createElement(
    ComboBoxCompositionContext.Provider,
    { value: { size } },
    createElement(AriaGroup, {
      ...props,
      className: group({ class: className, size }),
      'data-breeze-combobox-group': '',
      'data-size': size,
      isDisabled: rootState?.isDisabled,
      isInvalid: rootState?.isInvalid,
      isReadOnly: rootState?.isReadOnly,
      ref: forwardedRef,
      role,
    } as ComponentProps<typeof AriaGroup>),
  );
}
/** Renders the editable option filter or free-form input. */ export function Input({
  className,
  onKeyDownCapture,
  ref,
  size,
  ...props
}: Readonly<ComboBoxInputProps>): ReactElement {
  const context = useContext(ComboBoxContext);
  const composition = useContext(ComboBoxCompositionContext);
  const r = useForwardedRef(ref);
  const handleKeyDownCapture = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDownCapture?.(event);

    const activeOptionId = event.currentTarget.getAttribute(
      'aria-activedescendant',
    );

    if (
      !event.defaultPrevented &&
      event.key === 'Enter' &&
      activeOptionId === null
    ) {
      context?.onCommit?.(event.currentTarget.value);
    }
  };

  return createElement(AriaInput, {
    ...props,
    className: formControlValue({
      class: input({
        class: composition ? groupedInput({ class: className }) : className,
      }),
      size: composition?.size ?? size,
    }),
    onKeyDownCapture: handleKeyDownCapture,
    ref: r,
  });
}
/** Opens the option popup. */ export function Trigger({
  children,
  className,
  ref,
  size,
  ...props
}: Readonly<ComboBoxTriggerProps>): ReactElement {
  const composition = useContext(ComboBoxCompositionContext);
  const r = useForwardedRef(ref);

  return createElement(
    AriaButton,
    {
      ...props,
      className: button({
        class: composition ? groupedButton({ class: className }) : className,
        size: composition?.size ?? size,
      }),
      ref: r,
    } as ComponentProps<typeof AriaButton>,
    children ?? (
      <ChevronDownIcon className="size-4" data-breeze-combobox-indicator="" />
    ),
  );
}
/** Positions options. */ export function Popover({
  className,
  ref,
  ...props
}: Readonly<ComboBoxPopoverProps>): ReactElement {
  const r = useForwardedRef(ref);
  return createElement(AriaPopover, {
    ...props,
    className: popover({ class: className }),
    ref: r,
  } as ComponentProps<typeof AriaPopover>);
}
/** Renders static or generic options. */ export function ListBox<
  Item extends BreezeCollectionItem,
>({
  children,
  className,
  emptyContent,
  items,
  ref,
  ...props
}: Readonly<ComboBoxListBoxProps<Item>>): ReactElement {
  const r = useForwardedRef(ref);
  const resolvedEmptyContent = useCollectionEmptyContent(emptyContent);

  return createElement(AriaListBox, {
    ...props,
    children,
    className: list({ class: className }),
    items,
    ref: r,
    renderEmptyState: () =>
      resolvedEmptyContent === null
        ? null
        : createElement(
            'div',
            { 'aria-live': 'polite', role: 'status' },
            resolvedEmptyContent,
          ),
  } as unknown as ComponentProps<typeof AriaListBox>);
}
/** Announces application-owned option loading without orchestrating data. */
export function Loading({
  className,
  ref,
  ...props
}: Readonly<ComboBoxLoadingProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('div', {
    ...props,
    'aria-live': 'polite',
    className: loading({ class: className }),
    ref: forwardedRef,
    role: 'status',
  });
}
/** Announces an application-owned option loading failure. */
export function OptionsError({
  className,
  ref,
  ...props
}: Readonly<ComboBoxOptionsErrorProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('div', {
    ...props,
    'aria-live': 'assertive',
    className: optionsError({ class: className }),
    ref: forwardedRef,
    role: 'alert',
  });
}
/**
 * Accessible selection-only or free-form combobox primitive.
 *
 * @summary editable keyed option selection with explicit free-form mode
 */
export const ComboBox = {
  /** Supporting guidance associated with the combobox. */ Description:
    TextField.Description,
  /** Validation feedback associated with the combobox. */ Error:
    TextField.Error,
  /** Single-surface editable input and popup trigger group. */ Group,
  /** Editable input that filters and displays the selected option. */ Input,
  /** One keyed option within `ComboBox.ListBox`. */ Item: BreezeListBox.Item,
  /** Visible label associated with the combobox input. */ Label:
    TextField.Label,
  /** Static or typed generic option collection. */ ListBox,
  /** Polite application-owned asynchronous option loading status. */ Loading,
  /** Assertive application-owned option loading failure alert. */ OptionsError,
  /** Popup positioned relative to the input and trigger. */ Popover,
  /** Input, selection, validation, and native-form coordination root. */ Root,
  /** Button that opens and closes the option popup. */ Trigger,
};
