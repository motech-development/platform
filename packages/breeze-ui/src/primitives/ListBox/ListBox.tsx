import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement, useCallback, useLayoutEffect, useRef } from 'react';
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxLoadMoreItem as AriaListBoxLoadMoreItem,
} from 'react-aria-components/ListBox';
import { tv } from 'tailwind-variants';
import useCollectionEmptyContent from '../../internal/collections/useCollectionEmptyContent';
import useLoadMoreHandler from '../../internal/collections/useLoadMoreHandler';
import VirtualizedCollection, {
  collectionViewportStyle,
} from '../../internal/collections/VirtualizedCollection';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type {
  BreezeCollectionItem,
  CollectionContentProps,
  CollectionKey,
  CollectionSelection,
  CollectionVirtualization,
} from '../../internal/types/collection';
import { useBreezeContext } from '../../provider/BreezeContext';

const listBoxRoot = tv({
  base: 'flex min-w-48 flex-col gap-1 border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] p-1 outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)] aria-invalid:border-[var(--breeze-danger)]',
  defaultVariants: {
    orientation: 'vertical',
    virtualized: false,
  },
  variants: {
    orientation: {
      horizontal: 'flex-row overflow-x-auto',
      vertical: 'max-h-72 overflow-y-auto',
    },
    virtualized: {
      false: '',
      true: 'max-h-none overflow-auto',
    },
  },
});

const listBoxItem = tv({
  base: 'flex min-h-10 cursor-default items-center px-3 py-2 text-sm text-[var(--breeze-ink)] outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[focused]:bg-[var(--breeze-primary-soft)] data-[selected]:bg-[var(--breeze-primary)] data-[selected]:text-white',
});

const listBoxLoadMore = tv({
  base: 'flex min-h-11 items-center justify-center px-3 py-2 text-sm text-[var(--breeze-ink-muted)]',
});

type ListBoxRootNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

interface ListBoxRootSharedProps extends ListBoxRootNativeProps {
  /** Keys whose items cannot receive focus, selection, or actions. */
  disabledKeys?: Iterable<CollectionKey>;
  /** Content displayed when the collection has no items. */
  emptyContent?: ReactNode;
  /** Exposes invalid state to assistive technology and error styling. Defaults to `false`. */
  invalid?: boolean;
  /** Enables multiple selection. Defaults to `false`. */
  multiple?: boolean;
  /** Primary item layout and arrow-key navigation axis. Defaults to `vertical`. */
  orientation?: 'horizontal' | 'vertical';
  /** Marks the listbox as requiring a selection. Defaults to `false`. */
  required?: boolean;
  /** Ref to the rendered listbox. */
  ref?: Ref<HTMLDivElement>;
  /** Optional fixed- or variable-height windowing configuration. */
  virtualization?: CollectionVirtualization;
}

interface ControlledListBoxRootProps {
  /** Current selected keys. */
  selection: CollectionSelection;
  /** Called with the next selected keys. */
  onSelectionChange: (selection: CollectionSelection) => void;
  /** Excluded when selection is controlled. */
  defaultSelection?: never;
  /** Controlled mutable state cannot be marked read-only. */
  readOnly?: false;
}

interface ReadOnlyListBoxRootProps {
  /** Current immutable selected keys. */
  selection: CollectionSelection;
  /** Marks a controlled selection as intentionally immutable. */
  readOnly: true;
  /** Excluded when selection is controlled. */
  defaultSelection?: never;
  /** Excluded because read-only selection cannot change. */
  onSelectionChange?: never;
}

interface UncontrolledListBoxRootProps {
  /** Initial selected keys. Defaults to an empty selection. */
  defaultSelection?: CollectionSelection;
  /** Called with the next selected keys. */
  onSelectionChange?: (selection: CollectionSelection) => void;
  /** Uncontrolled state cannot be marked read-only. */
  readOnly?: false;
  /** Excluded when selection is uncontrolled. */
  selection?: never;
}

/** Props for a static or generic, controlled, read-only, or uncontrolled listbox. */
export type ListBoxRootProps<
  Item extends BreezeCollectionItem = BreezeCollectionItem,
> = ListBoxRootSharedProps &
  CollectionContentProps<Item> &
  (
    | ControlledListBoxRootProps
    | ReadOnlyListBoxRootProps
    | UncontrolledListBoxRootProps
  );

/** Props for one selectable listbox option. */
export interface ListBoxItemProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'id' | 'onClick' | 'onClickCapture' | 'style'
  > {
  /** Visible option content. */
  children: ReactNode;
  /** Prevents focus, selection, and actions for this option. Defaults to `false`. */
  disabled?: boolean;
  /** Stable string or number option key. */
  id: CollectionKey;
  /** Called with this option key when its action is invoked. */
  onAction?: (key: CollectionKey) => void;
  /** Ref to the rendered option. */
  ref?: Ref<HTMLDivElement>;
  /** Plain-text representation used for typeahead and accessibility. */
  textValue: string;
}

/** Props for a listbox loading row and load-more sentinel. */
export interface ListBoxLoadMoreProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Visible loading-row content. */
  children: ReactNode;
  /** Shows the loading row and suppresses duplicate requests. Defaults to `false`. */
  loading?: boolean;
  /** Called once when more consumer-owned items should be requested. */
  onLoadMore: () => void | Promise<void>;
  /** Trigger distance as a proportion of the scroll viewport. Defaults to `1`. */
  offset?: number;
  /** Ref to the rendered loading row. */
  ref?: Ref<HTMLDivElement>;
}

function normaliseSelection(
  selection: 'all' | Set<CollectionKey>,
): CollectionSelection {
  return selection === 'all' ? 'all' : [...selection];
}

/** Coordinates collection rendering, focus, typeahead, and semantic selection. */
export function Root<Item extends BreezeCollectionItem>({
  children,
  className,
  defaultSelection,
  disabledKeys,
  emptyContent,
  invalid = false,
  items,
  multiple = false,
  onSelectionChange,
  orientation = 'vertical',
  readOnly = false,
  ref,
  required = false,
  selection,
  virtualization,
  ...props
}: Readonly<ListBoxRootProps<Item>>): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);
  const resolvedEmptyContent = useCollectionEmptyContent(emptyContent);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const stableRef = useCallback(
    (element: HTMLDivElement | null) => {
      elementRef.current = element;
      forwardedRef(element);
    },
    [forwardedRef],
  );

  useLayoutEffect(() => {
    const element = elementRef.current;

    if (element === null) {
      return;
    }

    if (invalid) {
      element.setAttribute('aria-invalid', 'true');
    } else {
      element.removeAttribute('aria-invalid');
    }

    if (required) {
      element.setAttribute('aria-required', 'true');
    } else {
      element.removeAttribute('aria-required');
    }
  }, [invalid, required]);

  const listBox = createElement(AriaListBox, {
    ...props,
    'aria-readonly': readOnly || undefined,
    children,
    className: listBoxRoot({
      class: className,
      orientation,
      virtualized: virtualization !== undefined,
    }),
    'data-virtualized': virtualization === undefined ? undefined : 'true',
    defaultSelectedKeys: defaultSelection,
    disabledKeys,
    items,
    onSelectionChange: (nextSelection: 'all' | Set<CollectionKey>) =>
      onSelectionChange?.(normaliseSelection(nextSelection)),
    orientation,
    ref: stableRef,
    renderEmptyState: () => resolvedEmptyContent,
    selectedKeys: selection,
    selectionMode: multiple ? 'multiple' : 'single',
    style: collectionViewportStyle(virtualization),
  } as unknown as ComponentProps<typeof AriaListBox>);

  return virtualization === undefined
    ? listBox
    : createElement(
        VirtualizedCollection,
        {
          configuration: virtualization,
          kind: 'list',
          orientation,
        },
        listBox,
      );
}

/** Renders one keyed option within a Breeze collection. */
export function Item({
  className,
  disabled = false,
  id,
  onAction,
  ref,
  textValue,
  ...props
}: Readonly<ListBoxItemProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaListBoxItem, {
    ...props,
    className: listBoxItem({ class: className }),
    id,
    isDisabled: disabled,
    onAction: onAction === undefined ? undefined : () => onAction(id),
    ref: forwardedRef,
    textValue,
  });
}

/** Renders a loading row and deduplicated intersection sentinel. */
export function LoadMore({
  className,
  loading = false,
  offset = 1,
  onLoadMore,
  ref,
  ...props
}: Readonly<ListBoxLoadMoreProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);
  const handleLoadMore = useLoadMoreHandler({ loading, onLoadMore });

  return createElement(AriaListBoxLoadMoreItem, {
    ...props,
    className: listBoxLoadMore({ class: className }),
    isLoading: loading,
    onLoadMore: handleLoadMore,
    ref: forwardedRef,
    scrollOffset: offset,
  });
}

/**
 * Accessible compound collection primitive for selectable options.
 *
 * @summary visible selectable options with optional collection virtualization
 */
export const ListBox = {
  /** One keyed selectable option. */
  Item,
  /** Loading row and deduplicated load-more sentinel. */
  LoadMore,
  /** Collection rendering, focus, typeahead, and selection root. */
  Root,
};
