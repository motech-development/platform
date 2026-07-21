import type {
  ButtonHTMLAttributes,
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createContext, createElement, useContext } from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import { Group as AriaGroup } from 'react-aria-components/Group';
import {
  SearchField as AriaSearchField,
  type SearchFieldRenderProps,
} from 'react-aria-components/SearchField';
import { tv } from 'tailwind-variants';
import { CloseIcon } from '../../icons';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { ControlSize } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';
import {
  TextField,
  type TextFieldDescriptionProps,
  type TextFieldErrorProps,
  type TextFieldInputProps,
  type TextFieldLabelProps,
  type TextFieldRootProps,
} from '../TextField/TextField';

const searchFieldRoot = tv({
  base: 'flex min-w-0 flex-col gap-1.5',
});

const searchFieldGroup = tv({
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

const searchInput = tv({
  base: '[&::-webkit-search-cancel-button]:hidden',
});

const groupedInput = tv({
  base: 'min-w-0 w-auto flex-1 border-0 bg-transparent disabled:!bg-transparent disabled:!opacity-100 read-only:!bg-transparent read-only:!opacity-100 data-[focus-visible]:!outline-none',
});

const clearButton = tv({
  base: 'inline-flex shrink-0 items-center justify-center border-0 bg-transparent text-[var(--breeze-ink-soft)] outline-none transition-colors duration-[var(--breeze-duration-fast)] data-[focus-visible]:outline-none data-[hovered]:text-[var(--breeze-primary)] disabled:cursor-not-allowed disabled:opacity-55',
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

interface SearchFieldCompositionContextValue {
  size: ControlSize;
}

interface SearchFieldStateContextValue {
  isDisabled: boolean;
  isEmpty: boolean;
  isReadOnly: boolean;
}

const SearchFieldCompositionContext = createContext<
  SearchFieldCompositionContextValue | undefined
>(undefined);
const SearchFieldStateContext = createContext<
  SearchFieldStateContextValue | undefined
>(undefined);

function renderSearchFieldChildren(
  children: ReactNode,
  { isDisabled, isEmpty, isReadOnly }: SearchFieldRenderProps,
): ReactElement {
  return createElement(
    SearchFieldStateContext.Provider,
    {
      value: {
        isDisabled,
        isEmpty,
        isReadOnly,
      },
    },
    children,
  );
}

interface SearchFieldRootCallbacks {
  /** Called after the query is cleared with the clear button or Escape key. */
  onClear?: () => void;
  /** Called with the current query when the user submits the search. */
  onSubmit?: (value: string) => void;
}

/** Props for controlled, read-only, or uncontrolled search field state. */
export type SearchFieldRootProps = TextFieldRootProps &
  SearchFieldRootCallbacks;

/** Props for the visible search field label. */
export type SearchFieldLabelProps = TextFieldLabelProps;

/** Props for the single-surface search input and clear-action group. */
export interface SearchFieldGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Search input and optional clear action. */
  children: ReactNode;
  /** Ref to the rendered group. */
  ref?: Ref<HTMLDivElement>;
  /** Canonical size applied to every grouped control part. Defaults to `md`. */
  size?: ControlSize;
}

/** Props for the native search input part. */
export type SearchFieldInputProps = Omit<TextFieldInputProps, 'type'>;

/** Props for supporting text associated with the search input. */
export type SearchFieldDescriptionProps = TextFieldDescriptionProps;

/** Props for an accessible search validation message. */
export type SearchFieldErrorProps = TextFieldErrorProps;

/** Props for the search clear action. */
export interface SearchFieldClearButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'onClick' | 'onClickCapture' | 'style' | 'type'
  > {
  /** Accessible action name. Defaults to the provider's `clear` message. */
  'aria-label'?: string;
  /** Optional clear-action content. Defaults to the Breeze close icon. */
  children?: ReactNode;
  /** Ref to the rendered clear button. */
  ref?: Ref<HTMLButtonElement>;
  /** Standalone action size. A containing Group takes precedence. Defaults to `md`. */
  size?: ControlSize;
}

/** Coordinates accessible query state, submission, clearing, and compound anatomy. */
export function Root({
  children,
  className,
  defaultValue,
  disabled = false,
  invalid = false,
  onChange,
  onClear,
  onSubmit,
  readOnly = false,
  ref,
  required = false,
  value,
  ...props
}: SearchFieldRootProps): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaSearchField, {
    ...props,
    children: renderSearchFieldChildren.bind(null, children),
    className: searchFieldRoot({ class: className }),
    defaultValue,
    isDisabled: disabled,
    isInvalid: invalid,
    isReadOnly: readOnly,
    isRequired: required,
    onChange,
    onClear,
    onSubmit,
    ref: forwardedRef,
    value,
  } as ComponentProps<typeof AriaSearchField>);
}

/** Groups the SearchField input and clear action as one visual control. */
export function Group({
  className,
  ref,
  role = 'presentation',
  size = 'md',
  ...props
}: SearchFieldGroupProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);
  const rootState = useContext(SearchFieldStateContext);

  return createElement(
    SearchFieldCompositionContext.Provider,
    { value: { size } },
    createElement(AriaGroup, {
      ...props,
      className: searchFieldGroup({ class: className, size }),
      'data-breeze-search-field-group': '',
      'data-size': size,
      isReadOnly: rootState?.isReadOnly,
      ref: forwardedRef,
      role,
    } as ComponentProps<typeof AriaGroup>),
  );
}

/** Renders the native search input for a SearchField. */
export function Input({
  className,
  size,
  ...props
}: SearchFieldInputProps): ReactElement {
  const composition = useContext(SearchFieldCompositionContext);

  return createElement(TextField.Input, {
    ...props,
    className: searchInput({
      class: composition ? groupedInput({ class: className }) : className,
    }),
    size: composition?.size ?? size,
    type: 'search',
  } as unknown as TextFieldInputProps);
}

/** Clears the current SearchField value with pointer or keyboard activation. */
export function ClearButton({
  'aria-label': ariaLabel,
  children,
  className,
  ref,
  size,
  ...props
}: SearchFieldClearButtonProps): ReactElement | null {
  const { messages } = useBreezeContext();
  const forwardedRef = useForwardedRef(ref);
  const composition = useContext(SearchFieldCompositionContext);
  const rootState = useContext(SearchFieldStateContext);

  if (rootState?.isDisabled || rootState?.isEmpty || rootState?.isReadOnly) {
    return null;
  }

  return createElement(
    AriaButton,
    {
      ...props,
      'aria-label': ariaLabel ?? messages.clear,
      className: clearButton({
        class: className,
        size: composition?.size ?? size,
      }),
      'data-breeze-search-field-clear': '',
      ref: forwardedRef,
      type: 'button',
    } as ComponentProps<typeof AriaButton>,
    <span aria-hidden="true">{children ?? <CloseIcon />}</span>,
  );
}

/**
 * Accessible compound search-query primitive.
 *
 * @summary labelled search entry with submission and clearing
 */
export const SearchField = {
  /** Query clear action. */
  ClearButton,
  /** Supporting guidance associated with the search input. */
  Description: TextField.Description,
  /** Validation message associated with an invalid search input. */
  Error: TextField.Error,
  /** Single-surface input and clear-action composition. */
  Group,
  /** Native search input. */
  Input,
  /** Persistent accessible label. */
  Label: TextField.Label,
  /** State, submission, and accessibility root. */
  Root,
};
