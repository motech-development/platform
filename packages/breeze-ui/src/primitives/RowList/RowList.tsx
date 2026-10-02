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

const variants = {
  base: {
    badge:
      'breeze:flex breeze:max-inline-full breeze:min-inline-0 breeze:shrink-0 breeze:overflow-hidden breeze:whitespace-nowrap breeze:[&>span]:max-inline-full breeze:[&>span]:min-inline-0 breeze:[&>span]:overflow-hidden breeze:[&>span>span:first-child]:min-inline-0 breeze:[&>span>span:first-child]:overflow-hidden breeze:[&>span>span:first-child]:text-ellipsis',
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
    item: 'breeze:box-border breeze:inline-full breeze:min-inline-0 breeze:grid breeze:grid-cols-[minmax(0,1fr)_120px_104px] breeze:items-center breeze:gap-breeze-3 breeze:border-breeze-sunken breeze:border-be breeze:px-breeze-4 breeze:py-breeze-2 breeze:text-start breeze:outline-offset-[-2px] breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:opacity-50 breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[hovered]:bg-breeze-raised breeze:data-[pressed]:bg-breeze-raised breeze:any-pointer-coarse:min-block-breeze-tap breeze:max-breeze-md:grid-cols-1 breeze:max-breeze-md:gap-breeze-1',
    label: 'breeze:min-inline-0 breeze:truncate',
    leading:
      'breeze:col-start-1 breeze:flex breeze:min-inline-0 breeze:items-center breeze:gap-breeze-3',
    loadMore:
      'breeze:flex breeze:min-inline-0 breeze:items-center breeze:justify-end breeze:gap-[10px] breeze:border-breeze-line breeze:border-bs breeze:px-breeze-4 breeze:py-breeze-3',
    loadingLeading:
      'breeze:flex breeze:min-inline-0 breeze:flex-col breeze:gap-breeze-2',
    loadingMoneyPlaceholder:
      'breeze:flex breeze:justify-end breeze:font-breeze-sans breeze:text-breeze-4xl breeze:font-semibold breeze:leading-breeze-tight breeze:tracking-breeze-tightest breeze:tabular-nums breeze:[&>progress]:[font:inherit]',
    loadingPlaceholder:
      'breeze:flex breeze:justify-end breeze:max-breeze-md:justify-start',
    loadingRow:
      'breeze:box-border breeze:inline-full breeze:min-inline-0 breeze:grid breeze:grid-cols-[minmax(0,1fr)_120px_104px] breeze:items-center breeze:gap-breeze-3 breeze:border-breeze-sunken breeze:border-be breeze:px-breeze-4 breeze:py-breeze-2 breeze:max-breeze-md:grid-cols-1 breeze:max-breeze-md:gap-breeze-1',
    loadingStatus: 'breeze:sr-only',
    metadata:
      'breeze:col-start-2 breeze:min-inline-0 breeze:break-words breeze:text-end breeze:max-breeze-md:col-start-1 breeze:max-breeze-md:text-start',
    section: 'breeze:flex breeze:min-inline-0 breeze:flex-col',
    skeletonRows: 'breeze:flex breeze:min-inline-0 breeze:flex-col',
    title:
      'breeze:flex breeze:min-inline-0 breeze:items-center breeze:gap-breeze-2 breeze:text-breeze-sm breeze:font-medium breeze:leading-[calc(1.25/0.875)] breeze:max-breeze-md:flex-wrap',
    value:
      'breeze:col-start-3 breeze:min-inline-0 breeze:break-words breeze:text-end breeze:max-breeze-md:col-start-1 breeze:max-breeze-md:text-start',
  },
  compound: {},
  size: {},
  state: {},
  variant: {},
} as const;

export type RowListMetadata =
  | { format: 'date'; value: IsoCalendarDate }
  | { format: 'text'; value: string };

export type RowListValue =
  | { currency: string; format: 'currency'; value: number }
  | { format: 'text'; value: string };

/** A stable named group rendered as a structural row in the list. */
export interface RowListSectionDescriptor {
  id: string;
  label: string;
}

/** The closed content contract for a row and its aligned regions. */
export interface RowListItemDescriptor extends ItemDescriptor {
  /** Shows quiet placeholders for supplied metadata and value regions. */
  loading?: boolean;
  /** Optional middle region, formatted as text or a locale-aware calendar date. */
  metadata?: RowListMetadata;
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
            <div className={variants.base.loadingPlaceholder}>
              <Skeleton blockSize="1lh" inlineSize="min(100%, 7em)" />
            </div>
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
  if (descriptor.loading) {
    return (
      <div className={variants.base.loadingPlaceholder}>
        <LoadingPlaceholder />
      </div>
    );
  }

  if (metadata.format === 'date') {
    return (
      <Typography
        element="span"
        format="date"
        dateStyle="medium"
        tone="secondary"
        value={metadata.value}
        variant="caption"
      />
    );
  }

  return (
    <Typography element="span" tone="secondary" variant="caption">
      {metadata.value}
    </Typography>
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
        tone="secondary"
        value={value.value}
        variant="money"
      />
    );
  }

  return (
    <Typography element="span" tone="secondary" variant="body">
      {value.value}
    </Typography>
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
            tone="neutral"
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
      {descriptor.value && (
        <div className={variants.base.value}>
          <ValueContent descriptor={descriptor} />
        </div>
      )}
    </>
  );
}

function renderRow<T>(
  { descriptor, item }: Row<T>,
  onAction: RowListProps<T>['onAction'],
) {
  return (
    <AriaGridListItem
      className={variants.base.item}
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
  const entries = groupRows(
    items.map((item) => ({ descriptor: getItem(item), item })),
  );
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
            return renderRow(entry.row, onAction);
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
              </AriaGridListHeader>
              {entry.group.rows.map((row) => renderRow(row, onAction))}
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
