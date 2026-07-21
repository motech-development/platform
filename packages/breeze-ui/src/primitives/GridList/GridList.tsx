import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import {
  GridList as AriaGridList,
  GridListHeader as AriaGridListHeader,
  GridListItem as AriaGridListItem,
  GridListLoadMoreItem as AriaGridListLoadMoreItem,
  GridListSection as AriaGridListSection,
} from 'react-aria-components/GridList';
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

const gridListRoot = tv({
  base: 'grid min-w-0 gap-2 outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)]',
  defaultVariants: {
    layout: 'stack',
    virtualized: false,
  },
  variants: {
    layout: {
      grid: 'grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))]',
      stack: 'grid-cols-1',
    },
    virtualized: {
      false: '',
      true: 'overflow-auto',
    },
  },
});

const gridListItem = tv({
  base: 'flex min-h-11 min-w-0 items-center border border-b-2 border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] px-4 py-3 text-[var(--breeze-ink)] outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)] data-[selected]:border-[var(--breeze-primary)] data-[selected]:bg-[var(--breeze-primary-soft)] forced-colors:data-[selected]:border-[Highlight]',
});

const gridListSection = tv({ base: 'grid gap-2' });

const gridListHeader = tv({
  base: 'font-[family-name:var(--breeze-font-display)] text-base font-bold text-[var(--breeze-ink)]',
});

const gridListLoadMore = tv({
  base: 'flex min-h-11 items-center justify-center px-4 py-3 text-sm text-[var(--breeze-ink-muted)]',
});

interface GridListVirtualizationLayout {
  /** Maximum responsive grid column count. Defaults to the available width. */
  maximumColumns?: number;
  /** Minimum grid item width in pixels. Defaults to `224`. */
  minimumItemWidth?: number;
}

/** Breeze virtualization configuration with optional responsive grid sizing. */
export type GridListVirtualization = CollectionVirtualization &
  GridListVirtualizationLayout;

type GridListRootNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

interface GridListRootSharedProps extends GridListRootNativeProps {
  /** Keys whose items cannot receive focus, selection, or actions. */
  disabledKeys?: Iterable<CollectionKey>;
  /** Content displayed when the collection has no items. */
  emptyContent?: ReactNode;
  /** Arranges items as one stack or a responsive wrapping grid. Defaults to `stack`. */
  layout?: 'stack' | 'grid';
  /** Enables multiple selection. Defaults to `false`. */
  multiple?: boolean;
  /** Primary arrow-key navigation axis. Defaults to `vertical`. */
  orientation?: 'horizontal' | 'vertical';
  /** Ref to the rendered grid element. */
  ref?: Ref<HTMLDivElement>;
  /** Optional fixed- or variable-height windowing configuration. */
  virtualization?: GridListVirtualization;
}

interface ControlledGridListRootProps {
  /** Current selected keys. */
  selection: CollectionSelection;
  /** Called with the next selected keys. */
  onSelectionChange: (selection: CollectionSelection) => void;
  /** Excluded when selection is controlled. */
  defaultSelection?: never;
  /** Controlled mutable state cannot be marked read-only. */
  readOnly?: false;
}

interface ReadOnlyGridListRootProps {
  /** Current immutable selected keys. */
  selection: CollectionSelection;
  /** Marks controlled selection as intentionally immutable. */
  readOnly: true;
  /** Excluded when selection is controlled. */
  defaultSelection?: never;
  /** Excluded because read-only selection cannot change. */
  onSelectionChange?: never;
}

interface UncontrolledGridListRootProps {
  /** Initial selected keys. Defaults to an empty selection. */
  defaultSelection?: CollectionSelection;
  /** Called with the next selected keys. */
  onSelectionChange?: (selection: CollectionSelection) => void;
  /** Uncontrolled state cannot be marked read-only. */
  readOnly?: false;
  /** Excluded when selection is uncontrolled. */
  selection?: never;
}

/** Props for a static or generic, controlled, read-only, or uncontrolled grid list. */
export type GridListRootProps<
  Item extends BreezeCollectionItem = BreezeCollectionItem,
> = GridListRootSharedProps &
  CollectionContentProps<Item> &
  (
    | ControlledGridListRootProps
    | ReadOnlyGridListRootProps
    | UncontrolledGridListRootProps
  );

/** Props for one interactive grid-list row. */
export interface GridListItemProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'id' | 'onClick' | 'onClickCapture' | 'style'
  > {
  /** Visible row content, including any independently focusable controls. */
  children: ReactNode;
  /** Prevents focus, selection, and actions for this row. Defaults to `false`. */
  disabled?: boolean;
  /** Stable string or number row key. */
  id: CollectionKey;
  /** Called with this row key when its action is invoked. */
  onAction?: (key: CollectionKey) => void;
  /** Ref to the rendered row. */
  ref?: Ref<HTMLDivElement>;
  /** Plain-text representation used for typeahead and accessibility. */
  textValue: string;
}

/** Props for one static grid-list section. */
export interface GridListSectionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'style'> {
  /** Section header followed by keyed grid-list items. */
  children: ReactNode;
  /** Stable string or number section key. */
  id: CollectionKey;
  /** Ref to the rendered section. */
  ref?: Ref<HTMLDivElement>;
}

/** Props for a visible grid-list section heading. */
export interface GridListHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Ref to the rendered section heading. */
  ref?: Ref<HTMLDivElement>;
}

/** Props for a grid-list loading row and load-more sentinel. */
export interface GridListLoadMoreProps
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

/** Coordinates grid semantics, focus, typeahead, row actions, and selection. */
export function Root<Item extends BreezeCollectionItem>({
  children,
  className,
  defaultSelection,
  disabledKeys,
  emptyContent,
  items,
  layout = 'stack',
  multiple = false,
  onSelectionChange,
  orientation = 'vertical',
  readOnly = false,
  ref,
  selection,
  virtualization,
  ...props
}: GridListRootProps<Item>): ReactElement {
  const { direction } = useBreezeContext();

  const forwardedRef = useForwardedRef(ref);
  const resolvedEmptyContent = useCollectionEmptyContent(emptyContent);

  const gridList = createElement(AriaGridList, {
    ...props,
    'aria-readonly': readOnly || undefined,
    children,
    className: gridListRoot({
      class: className,
      layout,
      virtualized: virtualization !== undefined,
    }),
    'data-virtualized': virtualization === undefined ? undefined : 'true',
    defaultSelectedKeys: defaultSelection,
    disabledKeys,
    items,
    layout,
    onSelectionChange: (nextSelection: 'all' | Set<CollectionKey>) =>
      onSelectionChange?.(normaliseSelection(nextSelection)),
    orientation,
    ref: forwardedRef,
    renderEmptyState: () => resolvedEmptyContent,
    selectedKeys: selection,
    selectionMode: multiple ? 'multiple' : 'single',
    style: collectionViewportStyle(virtualization),
  } as unknown as ComponentProps<typeof AriaGridList>);

  return virtualization === undefined
    ? gridList
    : createElement(
        VirtualizedCollection,
        {
          configuration: virtualization,
          direction,
          kind: layout === 'grid' ? 'grid' : 'list',
          maximumColumns: virtualization.maximumColumns,
          minimumItemWidth: virtualization.minimumItemWidth,
          orientation,
        },
        gridList,
      );
}

/** Renders one keyed interactive row within a grid list. */
export function Item({
  className,
  disabled = false,
  id,
  onAction,
  ref,
  textValue,
  ...props
}: GridListItemProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaGridListItem, {
    ...props,
    className: gridListItem({ class: className }),
    id,
    isDisabled: disabled,
    onAction: onAction === undefined ? undefined : () => onAction(id),
    ref: forwardedRef,
    textValue,
  });
}

/** Groups related grid-list rows under a stable collection key. */
export function Section({
  className,
  ref,
  ...props
}: GridListSectionProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaGridListSection, {
    ...props,
    className: gridListSection({ class: className }),
    ref: forwardedRef,
  });
}

/** Renders the visible heading for a grid-list section. */
export function Header({
  className,
  ref,
  ...props
}: GridListHeaderProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaGridListHeader, {
    ...props,
    className: gridListHeader({ class: className }),
    ref: forwardedRef,
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
}: GridListLoadMoreProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);
  const handleLoadMore = useLoadMoreHandler({ loading, onLoadMore });

  return createElement(AriaGridListLoadMoreItem, {
    ...props,
    className: gridListLoadMore({ class: className }),
    isLoading: loading,
    onLoadMore: handleLoadMore,
    ref: forwardedRef,
    scrollOffset: offset,
  });
}

/**
 * Presents selectable interactive rows that may contain embedded controls,
 * static sections, responsive grids, or application-configured virtualization.
 *
 * @summary accessible selectable rows with embedded controls
 */
export const GridList = {
  /** Visible section heading. */
  Header,
  /** One keyed interactive row. */
  Item,
  /** Loading row and deduplicated load-more sentinel. */
  LoadMore,
  /** Grid semantics, focus, actions, and selection root. */
  Root,
  /** Stable grouping for related rows. */
  Section,
};
