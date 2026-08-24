import type {
  ComponentProps,
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
  TdHTMLAttributes,
} from 'react';
import {
  Children,
  cloneElement,
  createContext,
  createElement,
  Fragment,
  isValidElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Cell as AriaCell,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableFooter as AriaTableFooter,
  TableHeader as AriaTableHeader,
  TableLoadMoreItem as AriaTableLoadMoreItem,
} from 'react-aria-components/Table';
import { tv } from 'tailwind-variants';
import { ArrowRightIcon } from '../../icons';
import encodeCollectionKey, {
  encodeCollectionKeys,
} from '../../internal/collections/collectionKey';
import useCollectionEmptyContent from '../../internal/collections/useCollectionEmptyContent';
import useLoadMoreHandler from '../../internal/collections/useLoadMoreHandler';
import VirtualizedCollection, {
  collectionViewportStyle,
} from '../../internal/collections/VirtualizedCollection';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import isBreezeSmallViewport from '../../internal/styling/breakpoints';
import type {
  BreezeCollectionItem,
  CollectionContentProps,
  CollectionKey,
  CollectionSelection,
  CollectionVirtualization,
} from '../../internal/types/collection';
import { useBreezeContext } from '../../provider/BreezeContext';

const responsiveTableLayout =
  '[&>tbody>tr]:relative [&>tbody>tr]:flex [&>tbody>tr]:flex-col [&>tbody>tr]:items-start [&>tbody>tr]:gap-2 [&>tbody>tr]:px-4 [&>tbody>tr]:py-4 [&>tfoot>tr]:relative [&>tfoot>tr]:flex [&>tfoot>tr]:flex-col [&>tfoot>tr]:items-start [&>tfoot>tr]:gap-2 [&>tfoot>tr]:px-4 [&>tfoot>tr]:py-4 [&>tbody>tr>td]:block [&>tbody>tr>td]:max-w-full [&>tbody>tr>td]:border-0 [&>tbody>tr>td]:p-0 [&>tfoot>tr>td]:block [&>tfoot>tr>td]:max-w-full [&>tfoot>tr>td]:border-0 [&>tfoot>tr>td]:p-0 sm:[&>thead>tr>th]:px-6 sm:[&>thead>tr>th]:py-3 sm:[&>thead>tr>th]:align-middle sm:[&>tbody>tr]:table-row sm:[&>tbody>tr]:border-0 sm:[&>tbody>tr]:p-0 sm:[&>tfoot>tr]:table-row sm:[&>tfoot>tr]:border-0 sm:[&>tfoot>tr]:p-0 sm:[&>tbody>tr>td]:table-cell sm:[&>tbody>tr>td]:border-b sm:[&>tbody>tr>td]:border-[var(--breeze-border)] sm:[&>tbody>tr>td]:px-6 sm:[&>tbody>tr>td]:py-3 sm:[&>tbody>tr>td]:align-middle sm:[&>tfoot>tr>td]:table-cell sm:[&>tfoot>tr>td]:border-b sm:[&>tfoot>tr>td]:border-[var(--breeze-border)] sm:[&>tfoot>tr>td]:px-6 sm:[&>tfoot>tr>td]:py-3 sm:[&>tfoot>tr>td]:align-middle';

const responsiveGridTableLayout = `${responsiveTableLayout} sm:!block sm:[&>thead]:!block sm:[&>tbody]:!block sm:[&>tfoot]:!block sm:[&>thead>tr]:!grid sm:[&>thead>tr]:w-full sm:[&>thead>tr]:items-center sm:[&>thead>tr]:gap-x-4 sm:[&>thead>tr]:px-6 sm:[&>thead>tr]:py-3 sm:[&>tbody>tr]:!grid sm:[&>tbody>tr]:w-full sm:[&>tbody>tr]:items-center sm:[&>tbody>tr]:gap-x-4 sm:[&>tbody>tr]:border-b sm:[&>tbody>tr]:border-[var(--breeze-border)] sm:[&>tbody>tr]:px-6 sm:[&>tbody>tr]:py-3 sm:[&>tfoot>tr]:!grid sm:[&>tfoot>tr]:w-full sm:[&>tfoot>tr]:items-center sm:[&>tfoot>tr]:gap-x-4 sm:[&>tfoot>tr]:px-6 sm:[&>tfoot>tr]:py-3 sm:[&>thead>tr>th]:!flex sm:[&>thead>tr>th]:!h-auto sm:[&>thead>tr>th]:items-center sm:[&>thead>tr>th]:!border-0 sm:[&>thead>tr>th]:!p-0 sm:[&>tbody>tr>td]:!flex sm:[&>tbody>tr>td]:!h-auto sm:[&>tbody>tr>td]:items-center sm:[&>tbody>tr>td]:!border-0 sm:[&>tbody>tr>td]:!p-0 sm:[&>tbody>tr>td:last-child]:justify-end sm:[&>tfoot>tr>td]:!flex sm:[&>tfoot>tr>td]:!h-auto sm:[&>tfoot>tr>td]:items-center sm:[&>tfoot>tr>td]:!border-0 sm:[&>tfoot>tr>td]:!p-0`;

const responsiveGridColumns =
  'sm:[&>thead>tr]:grid-cols-[var(--breeze-table-columns)] sm:[&>tbody>tr]:grid-cols-[var(--breeze-table-columns)] sm:[&>tfoot>tr]:grid-cols-[var(--breeze-table-columns)]';

const responsiveGridColumnDefaults: Record<
  TableDesktopColumns,
  readonly string[]
> = {
  equal: [],
  mediaDetailsAction: [
    '2.25rem',
    'minmax(0, 1.3fr)',
    'minmax(0, 0.8fr)',
    'minmax(0, 1.2fr)',
    '1.25rem',
  ],
};

const tableRoot = tv({
  base: 'group/table block w-full border-separate border-spacing-0 text-start text-[var(--breeze-ink)] outline-none sm:table [&>tbody:last-of-type>tr:last-child]:border-b-0 sm:[&>tbody:last-of-type>tr:last-child>td]:border-b-0 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)]',
  compoundVariants: [
    {
      class: responsiveGridColumns,
      desktopColumns: 'equal',
      layout: 'responsiveGrid',
    },
    {
      class: responsiveGridColumns,
      desktopColumns: 'mediaDetailsAction',
      layout: 'responsiveGrid',
    },
  ],
  defaultVariants: {
    boundary: 'none',
    desktopColumns: 'equal',
    layout: 'responsive',
    virtualized: false,
  },
  variants: {
    boundary: {
      none: '',
      strong:
        'min-w-0 border-b-2 border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)]',
    },
    desktopColumns: {
      equal: '',
      mediaDetailsAction: '',
    },
    layout: {
      grid: '!grid grid-cols-[var(--breeze-table-compact-columns)] sm:grid-cols-[var(--breeze-table-columns)] [&>thead]:col-span-full [&>thead]:grid-cols-subgrid sm:[&>thead]:grid [&>tbody]:col-span-full [&>tbody]:grid [&>tbody]:grid-cols-subgrid [&>tfoot]:col-span-full [&>tfoot]:grid [&>tfoot]:grid-cols-subgrid sm:[&>thead>tr]:col-span-full sm:[&>thead>tr]:grid sm:[&>thead>tr]:min-h-11 sm:[&>thead>tr]:grid-cols-subgrid sm:[&>thead>tr]:items-center sm:[&>thead>tr]:px-6 [&>tbody>tr]:col-span-full [&>tbody>tr]:grid [&>tbody>tr]:min-h-11 [&>tbody>tr]:grid-cols-subgrid [&>tbody>tr]:items-center [&>tbody>tr]:px-4 sm:[&>tbody>tr]:px-6 [&>tfoot>tr]:col-span-full [&>tfoot>tr]:grid [&>tfoot>tr]:min-h-11 [&>tfoot>tr]:grid-cols-subgrid [&>tfoot>tr]:items-center [&>tfoot>tr]:px-4 sm:[&>tfoot>tr]:px-6 sm:[&>thead>tr>th]:block sm:[&>thead>tr>th]:!p-0 [&>tbody>tr>td]:block [&>tbody>tr>td]:!p-0 [&>tfoot>tr>td]:block [&>tfoot>tr>td]:!p-0 sm:[&>thead>tr]:border-b sm:[&>thead>tr]:border-[var(--breeze-border)] sm:[&>thead>tr>th]:border-0 [&>tbody>tr]:border-b [&>tbody>tr]:border-[var(--breeze-border)] [&>tbody>tr>td]:border-0 [&>tfoot>tr>td]:border-0 sm:[&>tbody>tr>td]:!border-0 sm:[&>tfoot>tr>td]:!border-0',
      responsive: responsiveTableLayout,
      responsiveGrid: responsiveGridTableLayout,
    },
    virtualized: {
      false: '',
      true: 'overflow-auto sm:block',
    },
  },
});

const tableHeader = tv({
  base: 'hidden bg-[var(--breeze-surface-subtle)] text-[var(--breeze-ink-muted)] sm:table-header-group',
});

const tableColumn = tv({
  base: 'border-b border-[var(--breeze-border)] px-4 py-3 text-start font-[family-name:var(--breeze-font-display)] text-base font-bold outline-none data-[focus-visible]:outline-2 data-[focus-visible]:-outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)] data-[allows-sorting]:cursor-pointer forced-colors:border-[CanvasText]',
  defaultVariants: {
    align: 'start',
  },
  variants: {
    align: {
      center: 'text-center sm:justify-center',
      end: 'text-end sm:justify-end',
      start: 'text-start sm:justify-start',
    },
  },
});

const tableBody = tv({
  base: 'block sm:table-row-group',
});

const tableFooter = tv({
  base: 'block bg-[var(--breeze-surface-subtle)] sm:table-footer-group',
});

const tableLoadMore = tv({
  base: 'flex min-h-11 items-center justify-center px-4 py-3 text-sm text-[var(--breeze-ink-muted)]',
});

const tableRow = tv({
  base: 'grid min-w-0 border-b border-[var(--breeze-border)] bg-[var(--breeze-surface)] py-2 outline-none sm:table-row sm:border-0 sm:py-0 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)] data-[selected]:bg-[var(--breeze-primary-soft)] forced-colors:data-[selected]:border-[Highlight]',
  compoundVariants: [
    {
      actionable: true,
      class: 'data-[hovered]:bg-[var(--breeze-table-row-hover)]',
      presentation: 'data',
      tone: 'default',
    },
    {
      actionable: true,
      class: 'data-[hovered]:bg-[var(--breeze-table-row-muted-hover)]',
      presentation: 'data',
      tone: 'muted',
    },
  ],
  defaultVariants: {
    presentation: 'data',
    tone: 'default',
  },
  variants: {
    actionable: {
      false: '',
      true: 'cursor-pointer',
    },
    presentation: {
      data: '',
      section:
        'min-h-11 items-center bg-[var(--breeze-table-section)] px-4 py-2 sm:bg-[var(--breeze-table-section)] sm:px-6 [&>td]:!h-auto [&>td]:!border-0 [&>td]:!p-0 [&>td]:before:!hidden',
    },
    tone: {
      default: '',
      muted: 'bg-[var(--breeze-table-row-muted)] text-[var(--breeze-neutral)]',
    },
  },
});

const tableCell = tv({
  base: 'grid min-w-0 grid-cols-[minmax(5rem,auto)_minmax(0,1fr)] gap-4 border-b border-[var(--breeze-border)] px-4 py-2 text-start [overflow-wrap:anywhere] last:border-b-0 before:me-1 before:hidden before:font-[family-name:var(--breeze-font-display)] before:text-base before:leading-[1.4] before:font-bold before:text-[var(--breeze-ink-muted)] data-[label]:before:inline-block data-[label]:before:content-[attr(data-label)] max-sm:data-[breeze-compact-hidden]:!hidden sm:table-cell sm:border-b sm:border-[var(--breeze-border)] sm:px-4 sm:py-3 sm:last:border-b sm:data-[label]:before:hidden [&>*]:min-w-0',
  defaultVariants: {
    align: 'start',
  },
  variants: {
    align: {
      center: 'sm:text-center sm:justify-center',
      end: 'sm:text-end sm:justify-end',
      start: 'sm:text-start sm:justify-start',
    },
    presentation: {
      data: '',
      disclosure:
        'absolute end-4 top-6 h-4 w-4 text-[var(--breeze-ink-muted)] sm:static sm:h-auto sm:w-5 sm:self-stretch sm:text-end [&>*]:ms-auto [&>svg]:size-4',
    },
    spanning: {
      true: '[grid-column:var(--breeze-table-compact-column-span)] sm:[grid-column:var(--breeze-table-column-span)]',
    },
  },
});

/** Consumer-owned table sort descriptor. */
export interface TableSort {
  /** Stable key of the sorted column. */
  column: CollectionKey;
  /** Current sort direction. */
  direction: 'ascending' | 'descending';
}

/** Supported structural table presentation modes. */
export type TableLayout = 'responsive' | 'responsiveGrid' | 'grid';

/** Optional visual treatment for the table's lower edge. */
export type TableBoundary = 'none' | 'strong';

/** Supported desktop column arrangements for responsive grid tables. */
export type TableDesktopColumns = 'equal' | 'mediaDetailsAction';

/** CSS width or grid-track size for one table column. Numeric values are pixels. */
export type TableColumnWidth = NonNullable<CSSProperties['width']>;

/** Domain-neutral emphasis applied to one data row. */
export type TableRowTone = 'default' | 'muted';

/** Structural presentation for records and grouped section rows. */
export type TableRowPresentation = 'data' | 'section';

type TableRootNativeProps = Omit<
  HTMLAttributes<HTMLTableElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

type CompactHiddenColumns =
  | CollectionKey
  | readonly CollectionKey[]
  | ReadonlySet<CollectionKey>;

interface TableRootSharedProps extends TableRootNativeProps {
  /** Optional visual treatment for the table's lower edge. Defaults to `none`. */
  boundary?: TableBoundary;
  /** Ordered header, body, and optional footer sections. */
  children: ReactNode;
  /** One key or reusable key collection omitted below the Breeze small breakpoint. */
  compactHiddenColumns?: CompactHiddenColumns;
  /** Keys whose rows cannot receive focus, selection, or actions. */
  disabledKeys?: Iterable<CollectionKey>;
  /** Typed desktop column arrangement for `responsiveGrid` layout. Defaults to `equal`. */
  desktopColumns?: TableDesktopColumns;
  /** Responsive native table, responsive desktop grid, or persistent CSS grid rows. Defaults to `responsive`. */
  layout?: TableLayout;
  /** Enables multiple row selection. Defaults to `false`. */
  multiple?: boolean;
  /** Ref to the rendered table or virtualized grid element. */
  ref?: Ref<HTMLElement>;
  /** Optional fixed- or variable-height row windowing configuration. */
  virtualization?: CollectionVirtualization;
}

interface ControlledTableSelectionProps {
  /** Current selected row keys. */
  selection: CollectionSelection;
  /** Called with the next selected row keys. */
  onSelectionChange: (selection: CollectionSelection) => void;
  /** Excluded when selection is controlled. */
  defaultSelection?: never;
  /** Controlled mutable state cannot be marked read-only. */
  readOnly?: false;
}

interface ReadOnlyTableSelectionProps {
  /** Current immutable selected row keys. */
  selection: CollectionSelection;
  /** Marks controlled row selection and sorting as intentionally immutable. */
  readOnly: true;
  /** Excluded when selection is controlled. */
  defaultSelection?: never;
  /** Excluded because read-only selection cannot change. */
  onSelectionChange?: never;
}

interface UncontrolledTableSelectionProps {
  /** Initial selected row keys. Defaults to an empty selection. */
  defaultSelection?: CollectionSelection;
  /** Called with the next selected row keys. */
  onSelectionChange?: (selection: CollectionSelection) => void;
  /** Uncontrolled state cannot be marked read-only. */
  readOnly?: false;
  /** Excluded when selection is uncontrolled. */
  selection?: never;
}

interface ControlledTableSortProps {
  /** Current consumer-owned sort descriptor. */
  sort: TableSort;
  /** Called when a sortable heading requests a new descriptor. */
  onSortChange: (sort: TableSort) => void;
  /** Excluded when sorting is controlled. */
  defaultSort?: never;
}

interface UncontrolledTableSortProps {
  /** Initial sort descriptor. */
  defaultSort?: TableSort;
  /** Called when the internally retained descriptor changes. */
  onSortChange?: (sort: TableSort) => void;
  /** Excluded when sorting is uncontrolled. */
  sort?: never;
}

/** Props for a controlled, read-only, or uncontrolled interactive table. */
export type TableRootProps = TableRootSharedProps &
  (
    | ControlledTableSelectionProps
    | ReadOnlyTableSelectionProps
    | UncontrolledTableSelectionProps
  ) &
  (ControlledTableSortProps | UncontrolledTableSortProps);

/** Props for static or generic table columns. */
export type TableHeaderProps<
  Column extends BreezeCollectionItem = BreezeCollectionItem,
> = Omit<HTMLAttributes<HTMLTableSectionElement>, 'children' | 'style'> &
  CollectionContentProps<Column> & {
    /** Stable key for this measurable ordered header section. */
    id?: CollectionKey;
    /** Ref to the rendered table header. */
    ref?: Ref<HTMLTableSectionElement>;
  };

/** Props for one accessible table column heading. */
export interface TableColumnProps
  extends Omit<HTMLAttributes<HTMLTableCellElement>, 'align' | 'id' | 'style'> {
  /** Heading alignment. Defaults to `start`. */
  align?: 'start' | 'center' | 'end';
  /** Visible accessible column heading. */
  children: ReactNode;
  /** Derives a compact record label from this heading. Defaults to `true`. */
  compactLabel?: boolean;
  /** Stable string or number column key. */
  id: CollectionKey;
  /** Marks this heading as the row label announced during cell navigation. Defaults to `false`. */
  rowHeader?: boolean;
  /** Allows this heading to request sort changes. Defaults to `false`. */
  sortable?: boolean;
  /** Ref to the rendered column heading. */
  ref?: Ref<HTMLTableCellElement>;
  /** Plain-text accessible and compact label used when the visible heading is not a string. */
  textValue?: string;
  /** CSS width or grid-track size. Numeric values are pixels; omitted columns share remaining responsive-grid space. */
  width?: TableColumnWidth;
}

/** Props for a static or generic ordered table body section. */
export type TableBodyProps<
  Item extends BreezeCollectionItem = BreezeCollectionItem,
> = Omit<HTMLAttributes<HTMLTableSectionElement>, 'children' | 'style'> &
  CollectionContentProps<Item> & {
    /** Content displayed when this body has no rows. */
    emptyContent?: ReactNode;
    /** Stable key for this measurable ordered body section. */
    id?: CollectionKey;
    /** Ref to the rendered table body. */
    ref?: Ref<HTMLTableSectionElement>;
  };

/** Props for a static or generic ordered table footer section. */
export type TableFooterProps<
  Item extends BreezeCollectionItem = BreezeCollectionItem,
> = Omit<HTMLAttributes<HTMLTableSectionElement>, 'children' | 'style'> &
  CollectionContentProps<Item> & {
    /** Stable key for this measurable ordered footer section. */
    id?: CollectionKey;
    /** Ref to the rendered table footer. */
    ref?: Ref<HTMLTableSectionElement>;
  };

/** Props for one keyed table row. */
export interface TableRowProps
  extends Omit<
    HTMLAttributes<HTMLTableRowElement>,
    'id' | 'onClick' | 'onClickCapture' | 'style'
  > {
  /** Ordered cells matching every visible table heading exactly once and in the same order, including after conditional column changes. */
  children: ReactNode;
  /** Prevents focus, selection, and actions for this row. Defaults to `false`. */
  disabled?: boolean;
  /** Stable string or number row key. */
  id: CollectionKey;
  /** Called with this row key when its action is invoked. */
  onAction?: (key: CollectionKey) => void;
  /** Record or grouped section geometry. Defaults to `data`. */
  presentation?: TableRowPresentation;
  /** Ref to the rendered row. */
  ref?: Ref<HTMLTableRowElement>;
  /** Plain-text row representation used for typeahead and accessibility. */
  textValue: string;
  /** Domain-neutral visual emphasis. Defaults to `default`. */
  tone?: TableRowTone;
}

/** Props for one table data cell. */
export interface TableCellProps
  extends Omit<
    TdHTMLAttributes<HTMLTableCellElement>,
    'align' | 'id' | 'style'
  > {
  /** Cell alignment at table widths. Defaults to `start`. */
  align?: 'start' | 'center' | 'end';
  /** Visible cell content. */
  children: ReactNode;
  /** Stable key of the corresponding column heading. */
  column: CollectionKey;
  /** Canonical content geometry. `disclosure` positions one bare arrow for an actionable row. Defaults to `data`. */
  presentation?: 'data' | 'disclosure';
  /** Ref to the rendered data cell. */
  ref?: Ref<HTMLTableCellElement>;
  /** Plain-text cell value used for accessibility when content is not text. */
  textValue?: string;
}

/** Props for the canonical action indicator of an actionable row. */
export interface TableDisclosureProps
  extends Omit<TableCellProps, 'children' | 'presentation' | 'textValue'> {
  /** Position over a standard compact row or remain in an explicit grid track. Defaults to `overlay`. */
  position?: 'flow' | 'overlay';
}

/** Props for a table loading row and load-more sentinel. */
export interface TableLoadMoreProps
  extends Omit<HTMLAttributes<HTMLTableRowElement>, 'style'> {
  /** Visible loading-row content. */
  children: ReactNode;
  /** Shows the loading row and suppresses duplicate requests. Defaults to `false`. */
  loading?: boolean;
  /** Called once when more consumer-owned rows should be requested. */
  onLoadMore: () => void | Promise<void>;
  /** Trigger distance as a proportion of the scroll viewport. Defaults to `1`. */
  offset?: number;
  /** Ref to the rendered native or virtualized loading row. */
  ref?: Ref<HTMLTableRowElement | HTMLDivElement>;
}

function normaliseSelection(
  selection: 'all' | Set<CollectionKey>,
): CollectionSelection {
  return selection === 'all' ? 'all' : [...selection];
}

/** Mirrors the HTML table-cell span range for derived CSS Grid geometry. */
function normaliseColumnSpan(colSpan: number | undefined): number | undefined {
  if (colSpan === undefined) {
    return undefined;
  }

  if (!Number.isInteger(colSpan)) {
    return 1;
  }

  return Math.min(Math.max(colSpan, 1), 1000);
}

function serializeColumnWidth(
  width: TableColumnWidth | undefined,
): string | undefined {
  return typeof width === 'number' ? `${width}px` : width;
}

function renderTableColumn({
  align = 'start',
  children,
  className,
  compactLabel = true,
  id,
  ref,
  rowHeader = false,
  sortable = false,
  textValue,
  width,
  ...props
}: TableColumnProps): ReactElement {
  const serializedWidth = serializeColumnWidth(width);
  const inferredCompactLabel =
    typeof children === 'string' ? children.trim() : undefined;
  const compactLabelText = compactLabel
    ? textValue ?? inferredCompactLabel
    : undefined;

  return createElement(AriaColumn, {
    ...props,
    allowsSorting: sortable,
    children,
    className: tableColumn({
      align,
      class: className,
    }),
    'data-breeze-column': String(id),
    'data-breeze-column-key': encodeCollectionKey(id),
    'data-breeze-column-width': serializedWidth,
    'data-breeze-compact-label': String(compactLabel),
    'data-breeze-compact-label-text': compactLabelText,
    id,
    isRowHeader: rowHeader,
    ref,
    style: serializedWidth === undefined ? undefined : { width },
    textValue,
  } as unknown as ComponentProps<typeof AriaColumn>);
}

/** Renders one accessible heading that can optionally request sorting. */
export function Column(props: Readonly<TableColumnProps>): ReactElement {
  return renderTableColumn(props);
}

function normaliseColumnElement(element: ReactNode): ReactNode {
  if (isValidElement<TableColumnProps>(element) && element.type === Column) {
    return renderTableColumn(element.props);
  }

  return element;
}

/** Renders static or generic accessible column headings. */
export function Header<Column extends BreezeCollectionItem>({
  children,
  className,
  id,
  items,
  ref,
  ...props
}: Readonly<TableHeaderProps<Column>>): ReactElement {
  const forwardedRef = useForwardedRef(ref);
  const renderedChildren =
    typeof children === 'function'
      ? (column: Column) => normaliseColumnElement(children(column))
      : Children.map(children, normaliseColumnElement);

  return createElement(AriaTableHeader, {
    ...props,
    children: renderedChildren,
    className: tableHeader({ class: className }),
    columns: items,
    'data-section-key': id,
    dependencies: [children],
    ref: forwardedRef,
  } as unknown as ComponentProps<typeof AriaTableHeader>);
}

function resolveSelectionMode(
  enabled: boolean,
  multiple: boolean,
): 'multiple' | 'none' | 'single' {
  if (!enabled) {
    return 'none';
  }

  return multiple ? 'multiple' : 'single';
}

interface ResponsiveColumnMetadata {
  compactHidden: boolean;
  label: string | undefined;
  track: string;
}

interface TableCellSpanStyle extends CSSProperties {
  '--breeze-table-column-span': string;
  '--breeze-table-compact-column-span': string;
}

const emptyCompactHiddenColumns: readonly CollectionKey[] = [];
const emptyCompactHiddenColumnKeys: ReadonlySet<string> = new Set();
const emptyTableColumnKeys: readonly string[] = [];
const materializedTableHeaderItems = new WeakMap<
  object,
  readonly BreezeCollectionItem[]
>();
const compactHiddenColumnsContext = createContext<ReadonlySet<string>>(
  emptyCompactHiddenColumnKeys,
);
const tableColumnKeysContext =
  createContext<readonly string[]>(emptyTableColumnKeys);

function staticTableColumnKeys(children: ReactNode): string[] {
  const keys: string[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === Column) {
      keys.push(encodeCollectionKey((child.props as TableColumnProps).id));
    } else if (child.type === Fragment) {
      keys.push(
        ...staticTableColumnKeys(
          (child.props as { children?: ReactNode }).children,
        ),
      );
    }
  });

  return keys;
}

function materializeTableHeaderItems(
  items: Iterable<BreezeCollectionItem>,
): readonly BreezeCollectionItem[] {
  if (Array.isArray(items)) {
    return items as readonly BreezeCollectionItem[];
  }

  const iterator = items[Symbol.iterator]();

  if (!Object.is(iterator, items[Symbol.iterator]())) {
    return Array.from(items);
  }

  const cacheKey = items as object;
  const cachedItems = materializedTableHeaderItems.get(cacheKey);

  if (cachedItems !== undefined) {
    return cachedItems;
  }

  const materializedItems = Array.from(items);

  materializedTableHeaderItems.set(cacheKey, materializedItems);

  return materializedItems;
}

function normaliseTableHeaderItems(children: ReactNode): ReactNode {
  let changed = false;
  const normalisedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child;
    }

    if (child.type === Header) {
      const header = child as ReactElement<TableHeaderProps>;
      const { items } = header.props;

      if (items === undefined) {
        return child;
      }

      const materializedItems = materializeTableHeaderItems(items);

      if (Object.is(materializedItems, items)) {
        return child;
      }

      changed = true;

      return cloneElement(header, { items: materializedItems });
    }

    if (child.type === Fragment) {
      const fragment = child as ReactElement<{ children?: ReactNode }>;
      const normalisedFragmentChildren = normaliseTableHeaderItems(
        fragment.props.children,
      );

      if (Object.is(normalisedFragmentChildren, fragment.props.children)) {
        return child;
      }

      changed = true;

      return cloneElement(fragment, {
        children: normalisedFragmentChildren,
      });
    }

    return child;
  });

  return changed ? normalisedChildren : children;
}

function tableHeaderColumnKeys(
  header: ReactElement<TableHeaderProps>,
): string[] {
  const { children, items } = header.props;

  if (items === undefined) {
    return staticTableColumnKeys(children);
  }

  return Array.from(items, ({ id }) => encodeCollectionKey(id));
}

function authoredTableColumnKeys(children: ReactNode): string[] {
  let keys: string[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === Header) {
      keys = tableHeaderColumnKeys(child as ReactElement<TableHeaderProps>);
    } else if (child.type === Fragment) {
      const nestedKeys = authoredTableColumnKeys(
        (child.props as { children?: ReactNode }).children,
      );

      if (nestedKeys.length > 0) {
        keys = nestedKeys;
      }
    }
  });

  return keys;
}

function readResponsiveColumnMetadata(
  root: HTMLElement | null,
  desktopColumns: TableDesktopColumns = 'equal',
  compactHiddenColumns: ReadonlySet<string> = emptyCompactHiddenColumnKeys,
): Map<string, ResponsiveColumnMetadata> {
  if (root === null) {
    return new Map();
  }

  return new Map(
    [...root.querySelectorAll<HTMLElement>('[data-breeze-column]')]
      .filter((heading) =>
        heading.closest('[data-breeze-table]')?.isSameNode(root),
      )
      .flatMap((heading, index): [string, ResponsiveColumnMetadata][] => {
        const column = heading.dataset.breezeColumnKey;

        if (column === undefined) {
          return [];
        }

        const compactLabel =
          heading.dataset.breezeCompactLabel === 'false'
            ? undefined
            : heading.dataset.breezeCompactLabelText;

        return [
          [
            column,
            {
              compactHidden: compactHiddenColumns.has(column),
              label:
                compactLabel === undefined || compactLabel.length === 0
                  ? undefined
                  : `${compactLabel}:`,
              track:
                heading.dataset.breezeColumnWidth ??
                responsiveGridColumnDefaults[desktopColumns][index] ??
                'minmax(0, 1fr)',
            },
          ],
        ];
      }),
  );
}

interface CompactSpanMetadata {
  compactHidden: boolean | undefined;
  span: number;
}

function compactSpanMetadata(
  columnKey: string,
  colSpan: number,
  orderedColumns: readonly string[],
  isCompactHidden: (key: string) => boolean,
): CompactSpanMetadata {
  const firstColumnIndex = orderedColumns.indexOf(columnKey);

  if (firstColumnIndex < 0) {
    return { compactHidden: undefined, span: colSpan };
  }

  const visibleColumns = orderedColumns
    .slice(firstColumnIndex, firstColumnIndex + colSpan)
    .filter((key) => !isCompactHidden(key)).length;

  return {
    compactHidden: visibleColumns === 0,
    span: Math.max(visibleColumns, 1),
  };
}

function syncResponsiveCells(
  root: HTMLElement | null,
  columns = readResponsiveColumnMetadata(root),
): void {
  if (root === null) {
    return;
  }

  const orderedColumns = [...columns.keys()];
  const isCompactHidden = (key: string) =>
    columns.get(key)?.compactHidden ?? false;

  root
    .querySelectorAll<HTMLTableCellElement>('[data-breeze-cell-column]')
    .forEach((cell) => {
      if (!cell.closest('[data-breeze-table]')?.isSameNode(root)) {
        return;
      }

      const { dataset } = cell;
      const columnKey = dataset.breezeCellColumnKey ?? '';
      const column = columns.get(columnKey);
      const label = column?.label;
      const spanMetadata =
        cell.colSpan > 1
          ? compactSpanMetadata(
              columnKey,
              cell.colSpan,
              orderedColumns,
              isCompactHidden,
            )
          : null;
      const compactHidden =
        spanMetadata === null
          ? column?.compactHidden
          : spanMetadata.compactHidden;

      if (compactHidden === true) {
        dataset.breezeCompactHidden = '';
      } else if (compactHidden === false) {
        delete dataset.breezeCompactHidden;
      }

      if (label !== undefined && label.length > 0) {
        dataset.label = label;
      } else {
        delete dataset.label;
      }

      if (spanMetadata !== null) {
        cell.style.setProperty(
          '--breeze-table-compact-column-span',
          `span ${spanMetadata.span} / span ${spanMetadata.span}`,
        );
      }
    });
}

function serializeResponsiveGridTracks(
  columns: Map<string, ResponsiveColumnMetadata>,
  compact = false,
): string | undefined {
  if (columns.size === 0) {
    return undefined;
  }

  return [...columns.values()]
    .filter(({ compactHidden }) => !compact || !compactHidden)
    .map(({ track }) => track)
    .join(' ');
}

interface ResponsiveGridTracks {
  compact: string | undefined;
  full: string | undefined;
}

function syncResponsiveTableMetadata(
  root: HTMLElement | null,
  desktopColumns: TableDesktopColumns,
  compactHiddenColumns: ReadonlySet<string>,
): ResponsiveGridTracks {
  const columns = readResponsiveColumnMetadata(
    root,
    desktopColumns,
    compactHiddenColumns,
  );

  syncResponsiveCells(root, columns);

  return {
    compact: serializeResponsiveGridTracks(columns, true),
    full: serializeResponsiveGridTracks(columns),
  };
}

const compactHorizontalNavigationKeys = new Set([
  'ArrowLeft',
  'ArrowRight',
  'End',
  'Home',
]);

type BrowserWindow = Window & typeof globalThis;

function isOwnedTableElement(element: HTMLElement, root: HTMLElement): boolean {
  return element.closest('[data-breeze-table]')?.isSameNode(root) ?? false;
}

function closestTableCell(element: Element | null): HTMLElement | null {
  return element?.closest<HTMLElement>('[data-breeze-cell-column]') ?? null;
}

function navigationCell(
  event: KeyboardEvent,
  root: HTMLElement,
  view: BrowserWindow,
): HTMLElement | null {
  const eventElement =
    event.target instanceof view.Element ? event.target : null;
  const activeElement =
    root.ownerDocument.activeElement instanceof view.Element
      ? root.ownerDocument.activeElement
      : null;
  const targetCell = closestTableCell(eventElement);
  const currentCell = targetCell ?? closestTableCell(activeElement);
  const origin = targetCell === null ? activeElement : eventElement;

  return currentCell !== null &&
    origin === currentCell &&
    isOwnedTableElement(currentCell, root)
    ? currentCell
    : null;
}

function rowTableCells(
  cell: HTMLElement,
  root: HTMLElement,
  view: BrowserWindow,
): HTMLElement[] {
  const row = cell.closest<HTMLElement>('[role="row"]');

  if (row === null) {
    return [];
  }

  return [
    ...row.querySelectorAll<HTMLElement>('[data-breeze-cell-column]'),
  ].filter(
    (candidate) =>
      candidate instanceof view.HTMLElement &&
      candidate.closest('[role="row"]')?.isSameNode(row) === true &&
      isOwnedTableElement(candidate, root),
  );
}

function ownedTableCells(root: HTMLElement): HTMLElement[] {
  return [
    ...root.querySelectorAll<HTMLElement>('[data-breeze-cell-column]'),
  ].filter((cell) => isOwnedTableElement(cell, root));
}

function isCompactHiddenCell(cell: HTMLElement | undefined): boolean {
  return cell?.dataset.breezeCompactHidden !== undefined;
}

type TableCellSelector = (
  cells: readonly HTMLElement[],
) => HTMLElement | undefined;

function firstTableCell(
  cells: readonly HTMLElement[],
): HTMLElement | undefined {
  return cells[0];
}

function lastTableCell(cells: readonly HTMLElement[]): HTMLElement | undefined {
  return cells.at(-1);
}

function firstVisibleTableCell(
  cells: readonly HTMLElement[],
): HTMLElement | undefined {
  return cells.find((cell) => !isCompactHiddenCell(cell));
}

function lastVisibleTableCell(
  cells: readonly HTMLElement[],
): HTMLElement | undefined {
  return cells.findLast((cell) => !isCompactHiddenCell(cell));
}

const tableCellSelectorsByBoundary = {
  End: {
    boundary: lastTableCell,
    visibleBoundary: lastVisibleTableCell,
  },
  Home: {
    boundary: firstTableCell,
    visibleBoundary: firstVisibleTableCell,
  },
};

function focusVirtualizedBoundary(
  root: HTMLElement,
  view: BrowserWindow,
  selectVisibleBoundary: TableCellSelector,
): void {
  view.requestAnimationFrame(() => {
    selectVisibleBoundary(ownedTableCells(root))?.focus();
  });
}

function handleCompactBoundaryNavigation(
  event: KeyboardEvent,
  root: HTMLElement,
  view: BrowserWindow,
  rowCells: HTMLElement[],
  virtualized: boolean,
  selectors: Readonly<{
    boundary: TableCellSelector;
    visibleBoundary: TableCellSelector;
  }>,
): void {
  const globally = event.ctrlKey || event.metaKey;

  if (globally && virtualized) {
    focusVirtualizedBoundary(root, view, selectors.visibleBoundary);
    return;
  }

  const candidateCells = globally ? ownedTableCells(root) : rowCells;

  if (!isCompactHiddenCell(selectors.boundary(candidateCells))) {
    return;
  }

  const nextCell = selectors.visibleBoundary(candidateCells);

  if (nextCell !== undefined) {
    event.preventDefault();
    view.queueMicrotask(() => nextCell.focus());
  }
}

function handleCompactArrowNavigation(
  event: KeyboardEvent,
  root: HTMLElement,
  view: BrowserWindow,
  currentCell: HTMLElement,
  cells: HTMLElement[],
): void {
  const forwardsKey =
    view.getComputedStyle(root).direction === 'rtl'
      ? 'ArrowLeft'
      : 'ArrowRight';
  const increment = event.key === forwardsKey ? 1 : -1;
  const currentIndex = cells.indexOf(currentCell);

  if (!isCompactHiddenCell(cells[currentIndex + increment])) {
    return;
  }

  const followingCells =
    increment > 0
      ? cells.slice(currentIndex + 1)
      : cells.slice(0, currentIndex).reverse();
  const nextCell = followingCells.find((cell) => !isCompactHiddenCell(cell));

  event.preventDefault();
  view.queueMicrotask(() => nextCell?.focus());
}

function handleCompactHorizontalNavigation(
  event: KeyboardEvent,
  root: HTMLElement,
  virtualized: boolean,
): void {
  if (!compactHorizontalNavigationKeys.has(event.key)) {
    return;
  }

  const view = root.ownerDocument.defaultView;

  if (view === null || !isBreezeSmallViewport(view)) {
    return;
  }

  const currentCell = navigationCell(event, root, view);

  if (currentCell === null) {
    return;
  }

  const cells = rowTableCells(currentCell, root, view);

  if (event.key === 'Home' || event.key === 'End') {
    handleCompactBoundaryNavigation(
      event,
      root,
      view,
      cells,
      virtualized,
      tableCellSelectorsByBoundary[event.key],
    );
    return;
  }

  handleCompactArrowNavigation(event, root, view, currentCell, cells);
}

/** Coordinates semantic table navigation, row state, sorting, and responsive labels. */
export function Root({
  boundary = 'none',
  children,
  className,
  compactHiddenColumns = emptyCompactHiddenColumns,
  defaultSelection,
  defaultSort,
  desktopColumns = 'equal',
  disabledKeys,
  layout = 'responsive',
  multiple = false,
  onSelectionChange,
  onSortChange,
  readOnly = false,
  ref,
  selection,
  sort,
  virtualization,
  ...props
}: Readonly<TableRootProps>): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);
  const rootRef = useRef<HTMLElement | null>(null);
  const [internalSort, setInternalSort] = useState(defaultSort);
  const [gridTemplateColumns, setGridTemplateColumns] =
    useState<ResponsiveGridTracks>({ compact: undefined, full: undefined });
  const compactHiddenColumnKeys = useMemo(
    () => encodeCollectionKeys(compactHiddenColumns),
    [compactHiddenColumns],
  );
  const tableChildren = useMemo(
    () => normaliseTableHeaderItems(children),
    [children],
  );
  const tableColumnKeys = useMemo(
    () => authoredTableColumnKeys(tableChildren),
    [tableChildren],
  );
  const selectionEnabled =
    defaultSelection !== undefined ||
    multiple ||
    onSelectionChange !== undefined ||
    selection !== undefined;
  const resolvedSort = sort ?? internalSort;
  const compactNavigationListener = useCallback(
    (event: KeyboardEvent) => {
      const root = rootRef.current;

      if (root !== null) {
        handleCompactHorizontalNavigation(
          event,
          root,
          virtualization !== undefined,
        );
      }
    },
    [virtualization],
  );
  const tableRef = useCallback(
    (element: HTMLElement | null) => {
      rootRef.current?.removeEventListener(
        'keydown',
        compactNavigationListener,
        true,
      );
      rootRef.current = element;
      element?.addEventListener('keydown', compactNavigationListener, true);
      forwardedRef(element);
    },
    [compactNavigationListener, forwardedRef],
  );

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (root === null) {
      return () => undefined;
    }

    const syncTable = () => {
      const nextGridTemplateColumns = syncResponsiveTableMetadata(
        root,
        desktopColumns,
        compactHiddenColumnKeys,
      );

      setGridTemplateColumns((currentGridTemplateColumns) =>
        currentGridTemplateColumns.compact ===
          nextGridTemplateColumns.compact &&
        currentGridTemplateColumns.full === nextGridTemplateColumns.full
          ? currentGridTemplateColumns
          : nextGridTemplateColumns,
      );
    };

    syncTable();

    const observer = new MutationObserver(syncTable);

    observer.observe(root, {
      attributeFilter: [
        'colspan',
        'data-breeze-cell-column-key',
        'data-breeze-column-width',
        'data-breeze-compact-label',
        'data-breeze-compact-label-text',
      ],
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [tableChildren, compactHiddenColumnKeys, desktopColumns]);

  const viewportStyle = collectionViewportStyle(virtualization);
  const tableStyle =
    gridTemplateColumns.full === undefined && viewportStyle === undefined
      ? undefined
      : ({
          ...viewportStyle,
          '--breeze-table-columns': gridTemplateColumns.full,
          '--breeze-table-compact-columns': gridTemplateColumns.compact,
        } as CSSProperties);

  const table = createElement(AriaTable, {
    ...props,
    'aria-readonly': readOnly || undefined,
    children: tableChildren,
    className: tableRoot({
      boundary,
      class: className,
      desktopColumns,
      layout,
      virtualized: virtualization !== undefined,
    }),
    'data-boundary': boundary,
    'data-breeze-table': '',
    'data-layout': layout,
    'data-virtualized': virtualization === undefined ? undefined : 'true',
    defaultSelectedKeys: defaultSelection,
    disabledKeys,
    onSelectionChange: (nextSelection: 'all' | Set<CollectionKey>) =>
      onSelectionChange?.(normaliseSelection(nextSelection)),
    onSortChange: readOnly
      ? undefined
      : (nextSort: {
          column: CollectionKey;
          direction: TableSort['direction'];
        }) => {
          const semanticSort = {
            column: nextSort.column,
            direction: nextSort.direction,
          };

          if (sort === undefined) {
            setInternalSort(semanticSort);
          }

          onSortChange?.(semanticSort);
        },
    ref: tableRef,
    selectedKeys: selection,
    selectionMode: resolveSelectionMode(selectionEnabled, multiple),
    sortDescriptor:
      resolvedSort === undefined
        ? undefined
        : {
            column: resolvedSort.column,
            direction: resolvedSort.direction,
          },
    style: tableStyle,
  } as unknown as ComponentProps<typeof AriaTable>);

  const renderedTable =
    virtualization === undefined
      ? table
      : createElement(
          VirtualizedCollection,
          {
            compactHiddenColumns: compactHiddenColumnKeys,
            configuration: virtualization,
            kind: 'table',
          },
          table,
        );

  return createElement(
    compactHiddenColumnsContext.Provider,
    { value: compactHiddenColumnKeys },
    createElement(
      tableColumnKeysContext.Provider,
      { value: tableColumnKeys },
      renderedTable,
    ),
  );
}

/** Renders a stable ordered table body with static or generic rows. */
export function Body<Item extends BreezeCollectionItem>({
  children,
  className,
  emptyContent,
  id,
  items,
  ref,
  ...props
}: Readonly<TableBodyProps<Item>>): ReactElement {
  const forwardedRef = useForwardedRef(ref);
  const resolvedEmptyContent = useCollectionEmptyContent(emptyContent);

  return createElement(AriaTableBody, {
    ...props,
    children,
    className: tableBody({ class: className }),
    'data-section-key': id,
    dependencies: [children],
    items,
    ref: forwardedRef,
    renderEmptyState: () => resolvedEmptyContent,
  } as unknown as ComponentProps<typeof AriaTableBody>);
}

/** Renders a stable ordered table footer with static or generic rows. */
export function Footer<Item extends BreezeCollectionItem>({
  children,
  className,
  id,
  items,
  ref,
  ...props
}: Readonly<TableFooterProps<Item>>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaTableFooter, {
    ...props,
    children,
    className: tableFooter({ class: className }),
    'data-section-key': id,
    dependencies: [children],
    items,
    ref: forwardedRef,
  } as unknown as ComponentProps<typeof AriaTableFooter>);
}

/** Renders one keyed row whose cells follow heading order. */
export function Row({
  'aria-describedby': describedBy,
  className,
  disabled = false,
  id,
  onAction,
  presentation = 'data',
  ref,
  textValue,
  tone = 'default',
  ...props
}: Readonly<TableRowProps>): ReactElement {
  const suppliedRef = useForwardedRef(ref);
  const forwardedRef = useCallback(
    (element: HTMLTableRowElement | null) => {
      suppliedRef(element);
      if (!element) {
        return;
      }

      if (describedBy) {
        element.setAttribute('aria-describedby', describedBy);
      } else {
        element.removeAttribute('aria-describedby');
      }
    },
    [describedBy, suppliedRef],
  );

  return createElement(AriaRow, {
    ...props,
    className: tableRow({
      actionable: onAction !== undefined,
      class: className,
      presentation,
      tone,
    }),
    'data-presentation': presentation,
    'data-tone': tone,
    id,
    isDisabled: disabled,
    onAction: onAction === undefined ? undefined : () => onAction(id),
    ref: forwardedRef,
    textValue,
  } as unknown as ComponentProps<typeof AriaRow>);
}

/** Renders one data cell and derives its compact label from the matching heading. */
export function Cell({
  align = 'start',
  className,
  column,
  colSpan,
  presentation = 'data',
  ref,
  textValue,
  ...props
}: Readonly<TableCellProps>): ReactElement {
  const compactHiddenColumns = useContext(compactHiddenColumnsContext);
  const tableColumnKeys = useContext(tableColumnKeysContext);
  const forwardedRef = useForwardedRef(ref);
  const normalisedColSpan = normaliseColumnSpan(colSpan);
  const spanningColumnCount =
    normalisedColSpan !== undefined && normalisedColSpan > 1
      ? normalisedColSpan
      : undefined;
  const compactHidden = compactHiddenColumns.has(encodeCollectionKey(column));
  const compactSpan =
    spanningColumnCount === undefined
      ? null
      : compactSpanMetadata(
          encodeCollectionKey(column),
          spanningColumnCount,
          tableColumnKeys,
          (key) => compactHiddenColumns.has(key),
        );
  const spanStyle: TableCellSpanStyle | undefined =
    spanningColumnCount === undefined
      ? undefined
      : (() => {
          const span = `span ${spanningColumnCount} / span ${spanningColumnCount}`;
          const compactSpanValue =
            compactSpan === null
              ? span
              : `span ${compactSpan.span} / span ${compactSpan.span}`;

          return {
            '--breeze-table-column-span': span,
            '--breeze-table-compact-column-span': compactSpanValue,
          };
        })();
  const cellRef = useCallback(
    (element: HTMLTableCellElement | null) => {
      forwardedRef(element);
      const root = element?.closest<HTMLElement>('[data-breeze-table]') ?? null;

      syncResponsiveCells(
        root,
        readResponsiveColumnMetadata(root, undefined, compactHiddenColumns),
      );
    },
    [compactHiddenColumns, forwardedRef],
  );
  const isCompactHidden =
    (compactSpan === null ? compactHidden : compactSpan.compactHidden) === true;

  return createElement(AriaCell, {
    ...props,
    className: tableCell({
      align,
      class: className,
      presentation,
      spanning: spanningColumnCount !== undefined,
    }),
    colSpan: normalisedColSpan,
    'data-breeze-cell-column': String(column),
    'data-breeze-cell-column-key': encodeCollectionKey(column),
    'data-breeze-compact-hidden': isCompactHidden ? '' : undefined,
    ref: cellRef,
    style: spanStyle,
    textValue,
  } as unknown as ComponentProps<typeof AriaCell>);
}

/** Renders the canonical bare arrow for an actionable row. */
export function Disclosure({
  position = 'overlay',
  ...props
}: Readonly<TableDisclosureProps>): ReactElement {
  const cellProps: TableCellProps = {
    ...props,
    children: <ArrowRightIcon className="!block" size={16} />,
    presentation: position === 'overlay' ? 'disclosure' : 'data',
  };

  return createElement(Cell, cellProps);
}

/** Renders a loading row and deduplicated intersection sentinel. */
export function LoadMore({
  className,
  loading = false,
  offset = 1,
  onLoadMore,
  ref,
  ...props
}: Readonly<TableLoadMoreProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);
  const handleLoadMore = useLoadMoreHandler({ loading, onLoadMore });
  const loadingRowRef = useRef<HTMLTableRowElement | HTMLDivElement | null>(
    null,
  );
  const semanticRef = useCallback(
    (element: HTMLTableRowElement | HTMLDivElement | null) => {
      loadingRowRef.current = element;
      element?.removeAttribute('aria-level');
      forwardedRef(element);
    },
    [forwardedRef],
  );

  useLayoutEffect(() => {
    loadingRowRef.current?.removeAttribute('aria-level');
  });

  return createElement(AriaTableLoadMoreItem, {
    ...props,
    className: tableLoadMore({ class: className }),
    isLoading: loading,
    onLoadMore: handleLoadMore,
    ref: semanticRef,
    scrollOffset: offset,
  });
}

/**
 * Coordinates ordered static or generic table sections, responsive record
 * labels, row interaction, consumer-owned sorting, and optional virtualization.
 *
 * @summary responsive compound data table with optional virtualization
 */
export const Table = {
  /** Ordered static or generic row section. */
  Body,
  /** One cell associated with a stable heading key. */
  Cell,
  /** One sortable or static accessible column heading. */
  Column,
  /** Canonical bare action indicator for an actionable row. */
  Disclosure,
  /** Ordered static or generic footer section. */
  Footer,
  /** Ordered static or generic heading section. */
  Header,
  /** Loading row and deduplicated load-more sentinel. */
  LoadMore,
  /** Interactive semantic table root. */
  Root,
  /** One keyed selectable or actionable row. */
  Row,
};
