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
import { Skeleton } from '../Skeleton/Skeleton';
import { type IsoCalendarDate, Typography } from '../Typography/Typography';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';

const variants = {
  base: {
    // Phones move the badge below the description so the label keeps the full width.
    badge:
      'breeze:flex breeze:max-inline-full breeze:min-inline-0 breeze:shrink-0 breeze:overflow-hidden breeze:whitespace-nowrap breeze:max-breeze-md:order-1 breeze:max-breeze-md:mbs-breeze-1 breeze:max-breeze-md:self-start breeze:[&>span]:max-inline-full breeze:[&>span]:min-inline-0 breeze:[&>span]:overflow-hidden breeze:[&>span>span:first-child]:min-inline-0 breeze:[&>span>span:first-child]:overflow-hidden breeze:[&>span>span:first-child]:text-ellipsis',
    container: 'breeze:min-inline-0 breeze:inline-full',
    content:
      'breeze:flex breeze:min-inline-0 breeze:flex-1 breeze:flex-col breeze:gap-breeze-px',
    // Line heights mirror the prototype's Tailwind text-sm and text-xs defaults.
    description:
      'breeze:truncate breeze:text-breeze-xs breeze:font-normal breeze:leading-[calc(1/0.75)] breeze:text-breeze-ink-3',
    emptyMessage:
      'breeze:box-border breeze:inline-full breeze:min-inline-0 breeze:px-breeze-4 breeze:py-breeze-3 breeze:text-breeze-sm breeze:text-breeze-ink-2',
    grid: 'breeze:inline-full breeze:min-inline-0 breeze:flex breeze:flex-col breeze:gap-0',
    header:
      'breeze:box-border breeze:inline-full breeze:min-inline-0 breeze:flex breeze:items-center breeze:gap-[10px] breeze:border-breeze-line breeze:border-be breeze:bg-breeze-raised breeze:px-breeze-4 breeze:py-breeze-2 breeze:text-breeze-xs breeze:font-semibold breeze:leading-[calc(1/0.75)] breeze:text-breeze-ink-2',
    headerLabel: 'breeze:min-inline-0 breeze:break-words',
    headerSpacer: 'breeze:grow',
    item: 'breeze:box-border breeze:inline-full breeze:min-inline-0 breeze:grid breeze:items-center breeze:gap-breeze-3 breeze:border-breeze-sunken breeze:border-be breeze:px-breeze-4 breeze:py-breeze-2 breeze:text-start breeze:outline-offset-[-2px] breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:opacity-50 breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[hovered]:bg-breeze-raised breeze:data-[pressed]:bg-breeze-raised breeze:any-pointer-coarse:min-block-breeze-tap breeze:max-breeze-md:grid-cols-[minmax(0,1fr)_104px]',
    label: 'breeze:min-inline-0 breeze:truncate',
    leading:
      'breeze:col-start-1 breeze:flex breeze:min-inline-0 breeze:items-center breeze:gap-breeze-3',
    loadMore:
      'breeze:flex breeze:min-inline-0 breeze:items-center breeze:justify-end breeze:gap-[10px] breeze:border-breeze-line breeze:border-bs breeze:px-breeze-4 breeze:py-breeze-3',
    loadingLeading:
      'breeze:flex breeze:min-inline-0 breeze:flex-col breeze:gap-breeze-2',
    loadingMoneyPlaceholder:
      'breeze:flex breeze:justify-end breeze:font-breeze-sans breeze:text-breeze-sm breeze:font-semibold breeze:leading-[calc(1.25/0.875)] breeze:tabular-nums breeze:[&>progress]:[font:inherit]',
    loadingPlaceholder: 'breeze:flex breeze:justify-end',
    loadingRow:
      'breeze:box-border breeze:inline-full breeze:min-inline-0 breeze:grid breeze:grid-cols-[minmax(0,1fr)_120px_104px] breeze:items-center breeze:gap-breeze-3 breeze:border-breeze-sunken breeze:border-be breeze:px-breeze-4 breeze:py-breeze-2 breeze:max-breeze-md:grid-cols-[minmax(0,1fr)_104px]',
    loadingStatus: 'breeze:sr-only',
    // Metadata cells are muted 12px single lines, matching the prototype's category and VAT text.
    metadata:
      'breeze:col-start-2 breeze:min-inline-0 breeze:max-breeze-md:hidden breeze:[&>span]:font-normal breeze:[&>span]:leading-[calc(1/0.75)]',
    metadataAmount:
      'breeze:-col-end-2 breeze:min-inline-0 breeze:max-breeze-md:hidden breeze:[&>span]:text-breeze-xs breeze:[&>span]:font-normal breeze:[&>span]:leading-[calc(1/0.75)]',
    section: 'breeze:flex breeze:min-inline-0 breeze:flex-col',
    skeletonRows: 'breeze:flex breeze:min-inline-0 breeze:flex-col',
    summaryText: 'breeze:min-inline-0 breeze:truncate breeze:text-breeze-ink-3',
    // The total keeps the amount role's weight at the header's 12px size.
    summaryTotal:
      'breeze:shrink-0 breeze:[&>span:last-child]:text-breeze-xs breeze:[&>span:last-child]:leading-[calc(1/0.75)]',
    title:
      'breeze:flex breeze:min-inline-0 breeze:items-center breeze:gap-breeze-2 breeze:text-breeze-sm breeze:font-medium breeze:leading-[calc(1.25/0.875)] breeze:max-breeze-md:contents',
    value:
      'breeze:-col-end-1 breeze:min-inline-0 breeze:break-words breeze:text-end',
  },
  compound: {},
  size: {},
  state: {},
  variant: {
    columns: {
      metadata: 'breeze:grid-cols-[minmax(0,1fr)_120px_104px]',
      metadataAmount: 'breeze:grid-cols-[minmax(0,1fr)_80px_104px]',
      metadataAndAmount: 'breeze:grid-cols-[minmax(0,1fr)_120px_80px_104px]',
      valueOnly: 'breeze:grid-cols-[minmax(0,1fr)_104px]',
    },
    direction: {
      in: 'positive',
      out: 'strong',
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

/** The explicit action that retrieves more rows. */
export interface RowListLoadMoreProps {
  /** Visible and accessible name for the load-more button. */
  label: string;
  /** Keeps the action named and marks it busy during retrieval. */
  loading?: boolean;
  /** Called when the load-more button is activated. */
  onAction: () => void;
}

/** Props for a data-backed, individually actionable row list. */
export interface RowListProps<T> {
  /** Names the grid list for assistive technology. */
  'aria-label': string;
  /** Returns the closed display descriptor for an application value. */
  getItem: (item: T) => RowListItemDescriptor;
  /** Application values displayed as rows. */
  items: T[];
  /** Announces initial or retained-row loading without replacing existing rows. */
  loading?: boolean;
  /** Optional explicit action for retrieving more rows. */
  loadMore?: RowListLoadMoreProps;
  /** Called with the activated row's application item. */
  onAction: (item: T) => void;
}

interface Row<T> {
  descriptor: RowListItemDescriptor;
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
}: Readonly<{ descriptor: RowListItemDescriptor }>) {
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
}: Readonly<{ descriptor: RowListItemDescriptor }>) {
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

function ValueContent({
  descriptor,
}: Readonly<{ descriptor: RowListItemDescriptor }>) {
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

function RowContent({
  descriptor,
}: Readonly<{ descriptor: RowListItemDescriptor }>) {
  return (
    <>
      <div className={variants.base.leading}>
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
            <span className={variants.base.label}>{descriptor.label}</span>
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
        <div className={variants.base.metadataAmount}>
          <MetadataAmountContent descriptor={descriptor} />
        </div>
      )}
      {descriptor.value && (
        <div className={variants.base.value}>
          <ValueContent descriptor={descriptor} />
        </div>
      )}
    </>
  );
}

// Only columns that some row uses are reserved.
function getColumns(
  descriptors: RowListItemDescriptor[],
): keyof typeof variants.variant.columns {
  const hasMetadata = descriptors.some(({ metadata }) => metadata);
  const hasAmount = descriptors.some(({ metadataAmount }) => metadataAmount);

  if (hasMetadata && hasAmount) return 'metadataAndAmount';
  if (hasMetadata) return 'metadata';
  if (hasAmount) return 'metadataAmount';

  return 'valueOnly';
}

function renderRow<T>(
  { descriptor, item }: Row<T>,
  onAction: RowListProps<T>['onAction'],
  columns: keyof typeof variants.variant.columns,
) {
  return (
    <AriaGridListItem
      className={[variants.base.item, variants.variant.columns[columns]].join(
        ' ',
      )}
      id={`row:${descriptor.id}`}
      isDisabled={descriptor.disabled}
      key={`row:${descriptor.id}`}
      onAction={() => onAction(item)}
      textValue={descriptor.label}
    >
      <RowContent descriptor={descriptor} />
    </AriaGridListItem>
  );
}

/**
 * Displays actionable rows with aligned metadata and value regions.
 *
 * @summary A data-backed collection with sections and explicit pagination.
 */
export function RowList<T>({
  'aria-label': ariaLabel,
  getItem,
  items,
  loading = false,
  loadMore,
  onAction,
}: Readonly<RowListProps<T>>) {
  const { getMessageLocale, messages } = useBreezeContext();
  const rows = items.map((item) => ({ descriptor: getItem(item), item }));
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
