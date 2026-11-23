import {
  GridList as AriaGridList,
  GridListHeader as AriaGridListHeader,
  GridListItem as AriaGridListItem,
  GridListSection as AriaGridListSection,
} from 'react-aria-components/GridList';
import type { ItemDescriptor } from '../../collections/item.types';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { IconTile } from '../IconTile/IconTile';
import { Link } from '../Link/Link';
import { Skeleton } from '../Skeleton/Skeleton';
import { type IsoCalendarDate, Typography } from '../Typography/Typography';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';

const variants = {
  base: {
    action:
      'breeze:-col-end-1 breeze:flex breeze:min-inline-0 breeze:justify-end',
    // Phones move the badge below the description so the label keeps the full width.
    badge:
      'breeze:flex breeze:max-inline-full breeze:min-inline-0 breeze:shrink-0 breeze:overflow-hidden breeze:whitespace-nowrap breeze:max-breeze-md:order-1 breeze:max-breeze-md:mbs-breeze-1 breeze:max-breeze-md:self-start breeze:[&>span]:max-inline-full breeze:[&>span]:min-inline-0 breeze:[&>span]:overflow-hidden breeze:[&>span>span:first-child]:min-inline-0 breeze:[&>span>span:first-child]:overflow-hidden breeze:[&>span>span:first-child]:text-ellipsis',
    container: 'breeze:min-inline-0 breeze:inline-full',
    content:
      'breeze:flex breeze:min-inline-0 breeze:flex-1 breeze:flex-col breeze:gap-breeze-px',
    description:
      'breeze:truncate breeze:text-breeze-xs breeze:font-normal breeze:text-breeze-ink-3',
    emptyMessage:
      'breeze:box-border breeze:inline-full breeze:min-inline-0 breeze:px-breeze-4 breeze:py-breeze-3 breeze:text-breeze-sm breeze:text-breeze-ink-2',
    grid: 'breeze:inline-full breeze:min-inline-0 breeze:flex breeze:flex-col breeze:gap-0',
    header:
      'breeze:box-border breeze:inline-full breeze:min-inline-0 breeze:flex breeze:items-center breeze:gap-[10px] breeze:border-breeze-line breeze:border-be breeze:bg-breeze-raised breeze:px-breeze-4 breeze:py-breeze-2 breeze:text-breeze-xs breeze:font-semibold breeze:text-breeze-ink-2',
    headerLabel: 'breeze:min-inline-0 breeze:break-words',
    headerSpacer: 'breeze:grow',
    headingEnd: 'breeze:text-end',
    headingLabel: 'breeze:col-start-1 breeze:min-inline-0',
    headings:
      'breeze:box-border breeze:inline-full breeze:min-inline-0 breeze:grid breeze:items-center breeze:gap-breeze-3 breeze:border-breeze-line breeze:border-be breeze:px-breeze-4 breeze:py-breeze-3 breeze:font-breeze-sans breeze:text-breeze-2xs breeze:font-semibold breeze:uppercase breeze:tracking-breeze-wide breeze:text-breeze-ink-3',
    item: 'breeze:box-border breeze:inline-full breeze:min-inline-0 breeze:grid breeze:items-center breeze:gap-breeze-3 breeze:border-breeze-sunken breeze:border-be breeze:px-breeze-4 breeze:py-breeze-2 breeze:text-start breeze:outline-offset-[-2px] breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:opacity-50 breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[hovered]:bg-breeze-raised breeze:data-[pressed]:bg-breeze-raised breeze:any-pointer-coarse:min-block-breeze-tap',
    label: 'breeze:min-inline-0 breeze:truncate',
    leading:
      'breeze:col-start-1 breeze:flex breeze:min-inline-0 breeze:items-center breeze:gap-breeze-3',
    loadMore:
      'breeze:flex breeze:min-inline-0 breeze:items-center breeze:justify-end breeze:gap-[10px] breeze:border-breeze-line breeze:border-bs breeze:px-breeze-4 breeze:py-breeze-3',
    loadingLeading:
      'breeze:flex breeze:min-inline-0 breeze:flex-col breeze:gap-breeze-2',
    loadingMoneyPlaceholder:
      'breeze:flex breeze:justify-end breeze:font-breeze-sans breeze:text-breeze-sm breeze:font-semibold breeze:tabular-nums breeze:[&>progress]:[font:inherit]',
    loadingPlaceholder: 'breeze:flex breeze:justify-end',
    loadingRow:
      'breeze:box-border breeze:inline-full breeze:min-inline-0 breeze:grid breeze:grid-cols-[minmax(0,1fr)_120px_104px] breeze:items-center breeze:gap-breeze-3 breeze:border-breeze-sunken breeze:border-be breeze:px-breeze-4 breeze:py-breeze-2 breeze:max-breeze-md:grid-cols-[minmax(0,1fr)_104px]',
    loadingStatus: 'breeze:sr-only',
    // Metadata cells are muted 12px single lines, matching the prototype's category and VAT text.
    metadata:
      'breeze:col-start-2 breeze:min-inline-0 breeze:max-breeze-md:hidden breeze:[&>span]:font-normal',
    metadataAmount:
      'breeze:min-inline-0 breeze:max-breeze-md:hidden breeze:[&>span]:text-breeze-xs breeze:[&>span]:font-normal',
    section: 'breeze:flex breeze:min-inline-0 breeze:flex-col',
    skeletonRows: 'breeze:flex breeze:min-inline-0 breeze:flex-col',
    // A static row's label wraps, so a message such as a notification is never cut off.
    staticLabel: 'breeze:min-inline-0 breeze:break-words',
    summaryText: 'breeze:min-inline-0 breeze:truncate breeze:text-breeze-ink-3',
    // The total keeps the amount role's weight at the header's 12px size.
    summaryTotal: 'breeze:shrink-0 breeze:[&>span:last-child]:text-breeze-xs',
    title:
      'breeze:flex breeze:min-inline-0 breeze:items-center breeze:gap-breeze-2 breeze:text-breeze-sm breeze:font-medium breeze:max-breeze-md:contents',
    unreadDot:
      'breeze:mbs-[5px] breeze:block-breeze-2 breeze:inline-breeze-2 breeze:shrink-0 breeze:self-start breeze:rounded-breeze-full',
    unreadStatus: 'breeze:sr-only',
    value:
      'breeze:-col-end-1 breeze:min-inline-0 breeze:break-words breeze:text-end',
  },
  compound: {},
  size: {},
  state: {
    unread: 'breeze:font-semibold',
  },
  variant: {
    // Phones hide the metadata columns, so they keep only the leading and any value or action column.
    columns: {
      actioned: {
        leading: 'breeze:grid-cols-[minmax(0,1fr)_120px]',
        metadata:
          'breeze:grid-cols-[minmax(0,1fr)_120px_120px] breeze:max-breeze-md:grid-cols-[minmax(0,1fr)_120px]',
        metadataAmount:
          'breeze:grid-cols-[minmax(0,1fr)_80px_120px] breeze:max-breeze-md:grid-cols-[minmax(0,1fr)_120px]',
        metadataAndAmount:
          'breeze:grid-cols-[minmax(0,1fr)_120px_80px_120px] breeze:max-breeze-md:grid-cols-[minmax(0,1fr)_120px]',
      },
      unvalued: {
        leading: 'breeze:grid-cols-[minmax(0,1fr)]',
        metadata:
          'breeze:grid-cols-[minmax(0,1fr)_120px] breeze:max-breeze-md:grid-cols-[minmax(0,1fr)]',
        metadataAmount:
          'breeze:grid-cols-[minmax(0,1fr)_80px] breeze:max-breeze-md:grid-cols-[minmax(0,1fr)]',
        metadataAndAmount:
          'breeze:grid-cols-[minmax(0,1fr)_120px_80px] breeze:max-breeze-md:grid-cols-[minmax(0,1fr)]',
      },
      valued: {
        leading: 'breeze:grid-cols-[minmax(0,1fr)_104px]',
        metadata:
          'breeze:grid-cols-[minmax(0,1fr)_120px_104px] breeze:max-breeze-md:grid-cols-[minmax(0,1fr)_104px]',
        metadataAmount:
          'breeze:grid-cols-[minmax(0,1fr)_80px_104px] breeze:max-breeze-md:grid-cols-[minmax(0,1fr)_104px]',
        metadataAndAmount:
          'breeze:grid-cols-[minmax(0,1fr)_120px_80px_104px] breeze:max-breeze-md:grid-cols-[minmax(0,1fr)_104px]',
      },
    },
    direction: {
      in: 'positive',
      out: 'strong',
    },
    metadataAmountColumn: {
      actioned: 'breeze:-col-end-2',
      unvalued: 'breeze:-col-end-1',
      valued: 'breeze:-col-end-2',
    },
    readState: {
      read: 'breeze:bg-transparent',
      unread: 'breeze:bg-breeze-brand',
    },
  },
} as const;

export type RowListMetadata =
  | { format: 'date'; value: IsoCalendarDate }
  | { format: 'text'; value: string };

/** A currency amount formatted with the provider locale. */
export interface RowListCurrencyValue {
  currency: string;
  format: 'currency';
  /** Controls the sign: `auto` signs negatives, `always` positives too; zero never. Defaults to `auto`. */
  sign?: 'always' | 'auto' | 'never';
  /** Colours the amount; use `positive` for money in. Defaults to `default`. */
  tone?: 'default' | 'positive';
  value: number;
}

export type RowListValue =
  | RowListCurrencyValue
  | { format: 'text'; value: string };

/** Trailing section header content: a labelled currency total or muted text. */
export type RowListSectionSummary =
  | (RowListCurrencyValue & {
      /** Visually hidden text read before the total, such as "Confirmed daily total". */
      label: string;
    })
  | { format: 'text'; value: string };

/** A stable named group rendered as a structural row in the list. */
export interface RowListSectionDescriptor {
  id: string;
  label: string;
  /** Optional trailing content at the end of the section header. */
  summary?: RowListSectionSummary;
}

/** The closed content contract for a row and its aligned regions. */
export interface RowListItemDescriptor extends ItemDescriptor {
  /** Colours the icon tile for money in or out; neutral when omitted. */
  direction?: 'in' | 'out';
  /** Shows quiet placeholders for supplied metadata and value regions. */
  loading?: boolean;
  /** Optional middle region, formatted as text or a locale-aware calendar date. */
  metadata?: RowListMetadata;
  /** Optional muted currency figure, such as VAT, between the metadata and value regions. */
  metadataAmount?: Omit<RowListCurrencyValue, 'tone'>;
  /** Groups this row under a structural section header. */
  section?: RowListSectionDescriptor;
  /** Optional trailing region, formatted as text or locale-aware currency. */
  value?: RowListValue;
}

/** A static row's trailing action: a button, or a link that navigates or downloads. */
export type RowListRowAction =
  | {
      download?: never;
      href?: never;
      label: string;
      /** Called when the button is activated. */
      onAction: () => void;
    }
  | {
      /** Downloads the destination instead of navigating when the browser allows it. */
      download?: boolean | string;
      href: string;
      label: string;
      onAction?: never;
    };

/** The content contract for a row that is not itself an action. */
export interface RowListStaticItemDescriptor
  extends Omit<RowListItemDescriptor, 'disabled' | 'value'> {
  /** Optional trailing action, in place of a value. */
  action?: RowListRowAction;
  /** Unavailable: a static row cannot be disabled. */
  disabled?: never;
  /** Shows a read or unread marker; omit for rows without a read state. */
  unread?: boolean;
  /** Unavailable: a static row ends with its action instead. */
  value?: never;
}

type RowDescriptor = RowListItemDescriptor &
  Pick<RowListStaticItemDescriptor, 'action' | 'unread'>;

/** Visible column headings, each aligned to the row region it names. */
export interface RowListHeadings {
  /** Heads the action column when a row uses it. */
  action?: string;
  /** Heads the leading label column. */
  label: string;
  /** Heads the metadata column when a row uses it. */
  metadata?: string;
  /** Heads the muted currency column when a row uses it. */
  metadataAmount?: string;
  /** Heads the value column when a row uses it. */
  value?: string;
}

/** The explicit action that retrieves more rows. */
export interface RowListLoadMoreProps {
  /** Visible and accessible name for the load-more button. */
  label: string;
  /** Keeps the action named and marks it busy during retrieval. */
  loading?: boolean;
  /** Called when the load-more button is activated. */
  onAction: () => void;
}

interface RowListCommonProps<T> {
  /** Names the grid list for assistive technology. */
  'aria-label': string;
  /** Optional column headings shown above the rows. */
  headings?: RowListHeadings;
  /** Application values displayed as rows. */
  items: T[];
  /** Announces initial or retained-row loading without replacing existing rows. */
  loading?: boolean;
  /** Optional explicit action for retrieving more rows. */
  loadMore?: RowListLoadMoreProps;
}

interface ActionRowListProps<T> extends RowListCommonProps<T> {
  /** Returns the closed display descriptor for an application value. */
  getItem: (item: T) => RowListItemDescriptor;
  /** Called with the activated row's application item. */
  onAction: (item: T) => void;
}

interface StaticRowListProps<T> extends RowListCommonProps<T> {
  /** Returns the closed display descriptor for an application value. */
  getItem: (item: T) => RowListStaticItemDescriptor;
  /** Omit to make the rows static, each with an optional trailing action. */
  onAction?: never;
}

/** Props for a row list whose rows are each an action, or static rows with their own actions. */
export type RowListProps<T> = ActionRowListProps<T> | StaticRowListProps<T>;

interface Row<T> {
  descriptor: RowDescriptor;
  item: T;
}

interface RowGroup<T> {
  id: string;
  label: string;
  rows: Row<T>[];
  summary?: RowListSectionSummary;
}

type ListEntry<T> =
  | { kind: 'row'; row: Row<T> }
  | { group: RowGroup<T>; kind: 'section' };

function groupRows<T>(rows: Row<T>[]): ListEntry<T>[] {
  const entries: ListEntry<T>[] = [];
  const sections = new Map<string, RowGroup<T>>();

  rows.forEach((row) => {
    const { section } = row.descriptor;

    if (!section) {
      entries.push({ kind: 'row', row });
      return;
    }

    const group = sections.get(section.id);

    if (group) {
      group.rows.push(row);
    } else {
      const newGroup = {
        id: section.id,
        label: section.label,
        rows: [row],
        summary: section.summary,
      };
      sections.set(newGroup.id, newGroup);
      entries.push({ group: newGroup, kind: 'section' });
    }
  });

  return entries;
}

function LoadingPlaceholder() {
  return <Skeleton blockSize="1lh" inlineSize="min(100%, 8em)" />;
}

const initialLoadingRows = ['first', 'second', 'third'] as const;

function InitialLoadingState() {
  return (
    <div className={variants.base.skeletonRows}>
      {initialLoadingRows.map((row) => (
        <div className={variants.base.loadingRow} key={row}>
          <div className={variants.base.loadingLeading}>
            <Skeleton blockSize="1lh" inlineSize="min(100%, 9em)" />
            <Skeleton blockSize="1lh" inlineSize="min(100%, 14em)" />
          </div>
          <div className={variants.base.metadata}>
            <Skeleton blockSize="1lh" inlineSize="min(100%, 7em)" />
          </div>
          <div className={variants.base.value}>
            <div className={variants.base.loadingPlaceholder}>
              <Skeleton blockSize="1lh" inlineSize="min(100%, 5em)" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MetadataContent({
  descriptor,
}: Readonly<{ descriptor: RowDescriptor }>) {
  const { metadata } = descriptor;

  if (!metadata) return null;
  if (descriptor.loading) return <LoadingPlaceholder />;

  if (metadata.format === 'date') {
    return (
      <Typography
        element="span"
        format="date"
        dateStyle="medium"
        tone="muted"
        truncate
        value={metadata.value}
        variant="caption"
      />
    );
  }

  return (
    <Typography element="span" tone="muted" truncate variant="caption">
      {metadata.value}
    </Typography>
  );
}

function MetadataAmountContent({
  descriptor,
}: Readonly<{ descriptor: RowDescriptor }>) {
  const { metadataAmount } = descriptor;

  if (!metadataAmount) return null;
  if (descriptor.loading) {
    return (
      <div className={variants.base.loadingPlaceholder}>
        <LoadingPlaceholder />
      </div>
    );
  }

  return (
    <Typography
      element="span"
      format="currency"
      currency={metadataAmount.currency}
      sign={metadataAmount.sign}
      tone="muted"
      truncate
      value={metadataAmount.value}
      variant="amount"
    />
  );
}

function ValueContent({ descriptor }: Readonly<{ descriptor: RowDescriptor }>) {
  const { value } = descriptor;

  if (!value) return null;
  if (descriptor.loading) {
    const placeholderClass =
      value.format === 'currency'
        ? variants.base.loadingMoneyPlaceholder
        : variants.base.loadingPlaceholder;

    return (
      <div className={placeholderClass}>
        {value.format === 'currency' ? (
          <Skeleton blockSize="1lh" inlineSize="min(100%, 4em)" />
        ) : (
          <LoadingPlaceholder />
        )}
      </div>
    );
  }

  if (value.format === 'currency') {
    return (
      <Typography
        element="span"
        format="currency"
        currency={value.currency}
        sign={value.sign}
        tone={value.tone}
        value={value.value}
        variant="amount"
      />
    );
  }

  return (
    <Typography element="span" tone="secondary" variant="body">
      {value.value}
    </Typography>
  );
}

function SectionSummary({
  summary,
}: Readonly<{ summary: RowListSectionSummary }>) {
  if (summary.format === 'text') {
    return <span className={variants.base.summaryText}>{summary.value}</span>;
  }

  return (
    <span className={variants.base.summaryTotal}>
      <VisuallyHidden>{summary.label}</VisuallyHidden>
      <Typography
        element="span"
        format="currency"
        currency={summary.currency}
        sign={summary.sign}
        tone={summary.tone}
        value={summary.value}
        variant="amount"
      />
    </span>
  );
}

type ColumnLayout = keyof typeof variants.variant.columns;

function RowAction({ action }: Readonly<{ action: RowListRowAction }>) {
  if (action.href !== undefined) {
    return (
      <Link
        download={action.download}
        href={action.href}
        size="sm"
        variant="secondary"
      >
        {action.label}
      </Link>
    );
  }

  return (
    <Button onAction={action.onAction} size="sm" variant="secondary">
      {action.label}
    </Button>
  );
}

function RowContent({
  actionable,
  descriptor,
  layout,
}: Readonly<{
  actionable: boolean;
  descriptor: RowDescriptor;
  layout: ColumnLayout;
}>) {
  const { getMessageLocale, messages } = useBreezeContext();

  return (
    <>
      <div className={variants.base.leading}>
        {descriptor.unread !== undefined && (
          <span
            aria-hidden="true"
            className={[
              variants.base.unreadDot,
              variants.variant.readState[descriptor.unread ? 'unread' : 'read'],
            ].join(' ')}
          />
        )}
        {descriptor.icon && (
          <IconTile
            name={descriptor.icon}
            shape="circle"
            size="sm"
            tone={
              descriptor.direction
                ? variants.variant.direction[descriptor.direction]
                : 'neutral'
            }
          />
        )}
        <span className={variants.base.content}>
          <span className={variants.base.title}>
            <span
              className={[
                actionable ? variants.base.label : variants.base.staticLabel,
                descriptor.unread && variants.state.unread,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {descriptor.unread && (
                <span
                  className={variants.base.unreadStatus}
                  lang={getMessageLocale('rowListUnread')}
                >
                  {`${messages.rowListUnread} `}
                </span>
              )}
              {descriptor.label}
            </span>
            {descriptor.badge && (
              <span className={variants.base.badge}>
                <Badge
                  aria-label={descriptor.badge['aria-label']}
                  variant={descriptor.badge.variant}
                >
                  {descriptor.badge.children}
                </Badge>
              </span>
            )}
          </span>
          {descriptor.description && (
            <span className={variants.base.description}>
              {descriptor.description}
            </span>
          )}
        </span>
      </div>
      {descriptor.metadata && (
        <div className={variants.base.metadata}>
          <MetadataContent descriptor={descriptor} />
        </div>
      )}
      {descriptor.metadataAmount && (
        <div
          className={[
            variants.base.metadataAmount,
            variants.variant.metadataAmountColumn[layout],
          ].join(' ')}
        >
          <MetadataAmountContent descriptor={descriptor} />
        </div>
      )}
      {descriptor.value && (
        <div className={variants.base.value}>
          <ValueContent descriptor={descriptor} />
        </div>
      )}
      {descriptor.action && (
        <div className={variants.base.action}>
          <RowAction action={descriptor.action} />
        </div>
      )}
    </>
  );
}

interface Columns {
  layout: ColumnLayout;
  regions: keyof (typeof variants.variant.columns)[ColumnLayout];
}

function getColumnLayout(descriptors: RowDescriptor[]): ColumnLayout {
  if (descriptors.some(({ value }) => value)) return 'valued';
  if (descriptors.some(({ action }) => action)) return 'actioned';

  return 'unvalued';
}

// Only columns that some row uses are reserved.
function getColumns(descriptors: RowDescriptor[]): Columns {
  const hasMetadata = descriptors.some(({ metadata }) => metadata);
  const hasAmount = descriptors.some(({ metadataAmount }) => metadataAmount);
  const layout = getColumnLayout(descriptors);

  if (hasMetadata && hasAmount) return { layout, regions: 'metadataAndAmount' };
  if (hasMetadata) return { layout, regions: 'metadata' };
  if (hasAmount) return { layout, regions: 'metadataAmount' };

  return { layout, regions: 'leading' };
}

function ColumnHeadings({
  columns: { layout, regions },
  headings,
}: Readonly<{ columns: Columns; headings: RowListHeadings }>) {
  return (
    <div
      className={[
        variants.base.headings,
        variants.variant.columns[layout][regions],
      ].join(' ')}
    >
      <span className={variants.base.headingLabel}>{headings.label}</span>
      {(regions === 'metadata' || regions === 'metadataAndAmount') && (
        <span className={variants.base.metadata}>{headings.metadata}</span>
      )}
      {(regions === 'metadataAmount' || regions === 'metadataAndAmount') && (
        <span
          className={[
            variants.base.metadataAmount,
            variants.variant.metadataAmountColumn[layout],
            variants.base.headingEnd,
          ].join(' ')}
        >
          {headings.metadataAmount}
        </span>
      )}
      {layout !== 'unvalued' && (
        <span className={variants.base.value}>
          {layout === 'valued' ? headings.value : headings.action}
        </span>
      )}
    </div>
  );
}

function renderRow<T>(
  { descriptor, item }: Row<T>,
  onAction: RowListProps<T>['onAction'],
  { layout, regions }: Columns,
) {
  return (
    <AriaGridListItem
      className={[
        variants.base.item,
        variants.variant.columns[layout][regions],
      ].join(' ')}
      id={`row:${descriptor.id}`}
      isDisabled={descriptor.disabled}
      key={`row:${descriptor.id}`}
      onAction={onAction && (() => onAction(item))}
      textValue={descriptor.label}
    >
      <RowContent
        actionable={onAction !== undefined}
        descriptor={descriptor}
        layout={layout}
      />
    </AriaGridListItem>
  );
}

/**
 * Displays actionable or static rows with aligned metadata, value and action regions.
 *
 * @summary A data-backed collection with sections and explicit pagination.
 */
export function RowList<T>({
  'aria-label': ariaLabel,
  getItem,
  headings,
  items,
  loading = false,
  loadMore,
  onAction,
}: Readonly<RowListProps<T>>) {
  const { getMessageLocale, messages } = useBreezeContext();
  const rows: Row<T>[] = items.map((item) => ({
    descriptor: getItem(item),
    item,
  }));
  const entries = groupRows(rows);
  const columns = getColumns(rows.map(({ descriptor }) => descriptor));
  const loadMoreLoading = loadMore?.loading ?? false;
  const isLoading = loading || loadMoreLoading;
  let statusMessage = '';

  if (isLoading) {
    statusMessage = messages.loading;
  } else if (items.length === 0) {
    statusMessage = messages.noItemsToDisplay;
  }

  return (
    <div className={variants.base.container}>
      {headings && rows.length > 0 && (
        <ColumnHeadings columns={columns} headings={headings} />
      )}
      <AriaGridList
        aria-busy={loading || undefined}
        aria-label={ariaLabel}
        className={variants.base.grid}
        renderEmptyState={() =>
          isLoading ? (
            <InitialLoadingState />
          ) : (
            <div
              className={variants.base.emptyMessage}
              lang={getMessageLocale('noItemsToDisplay')}
            >
              {messages.noItemsToDisplay}
            </div>
          )
        }
        selectionMode="none"
      >
        {entries.map((entry) => {
          if (entry.kind === 'row') {
            return renderRow(entry.row, onAction, columns);
          }

          return (
            <AriaGridListSection
              className={variants.base.section}
              id={`section:${entry.group.id}`}
              key={`section:${entry.group.id}`}
            >
              <AriaGridListHeader className={variants.base.header}>
                <span className={variants.base.headerLabel}>
                  {entry.group.label}
                </span>
                {entry.group.summary && (
                  <>
                    <span className={variants.base.headerSpacer} />
                    <SectionSummary summary={entry.group.summary} />
                  </>
                )}
              </AriaGridListHeader>
              {entry.group.rows.map((row) => renderRow(row, onAction, columns))}
            </AriaGridListSection>
          );
        })}
      </AriaGridList>
      <output
        aria-live="polite"
        className={variants.base.loadingStatus}
        lang={getMessageLocale(isLoading ? 'loading' : 'noItemsToDisplay')}
      >
        {statusMessage}
      </output>
      {loadMore && (
        <div className={variants.base.loadMore}>
          <Button
            loading={loadMoreLoading}
            onAction={loadMore.onAction}
            size="sm"
            variant="secondary"
          >
            {loadMore.label}
          </Button>
        </div>
      )}
    </div>
  );
}
