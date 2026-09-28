import {
  GridList as AriaGridList,
  GridListHeader as AriaGridListHeader,
  GridListItem as AriaGridListItem,
  GridListSection as AriaGridListSection,
} from 'react-aria-components/GridList';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import type { ItemDescriptor } from '../Collection/item.types';
import { Icon } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import { type IsoCalendarDate, Typography } from '../Typography/Typography';

const variants = {
  base: {
    badge:
      'breeze:block breeze:inline-size-full breeze:max-inline-size-full breeze:min-inline-size-0 breeze:overflow-hidden breeze:text-ellipsis breeze:whitespace-nowrap',
    container: 'breeze:min-inline-size-0 breeze:inline-size-full',
    content:
      'breeze:flex breeze:min-inline-size-0 breeze:flex-1 breeze:flex-col',
    description:
      'breeze:break-words breeze:text-breeze-xs breeze:font-normal breeze:leading-breeze-snug breeze:text-breeze-ink-3',
    emptyMessage:
      'breeze:box-border breeze:inline-size-full breeze:min-inline-size-0 breeze:px-breeze-3 breeze:py-breeze-3 breeze:text-breeze-sm breeze:text-breeze-ink-2',
    grid: 'breeze:inline-size-full breeze:min-inline-size-0 breeze:flex breeze:flex-col breeze:gap-0',
    header:
      'breeze:box-border breeze:inline-size-full breeze:min-inline-size-0 breeze:grid breeze:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] breeze:items-center breeze:gap-breeze-4 breeze:border-breeze-line breeze:border-be breeze:px-breeze-3 breeze:py-breeze-2 breeze:text-breeze-xs breeze:font-medium breeze:text-breeze-ink-2 breeze:max-breeze-md:grid-cols-1 breeze:max-breeze-md:gap-breeze-1',
    headerLabel:
      'breeze:col-start-1 breeze:min-inline-size-0 breeze:break-words',
    icon: 'breeze:block-size-breeze-4 breeze:inline-size-breeze-4 breeze:shrink-0',
    item: 'breeze:box-border breeze:inline-size-full breeze:min-inline-size-0 breeze:grid breeze:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] breeze:items-center breeze:gap-breeze-4 breeze:border-breeze-line breeze:border-be breeze:px-breeze-3 breeze:py-breeze-3 breeze:text-start breeze:outline-offset-[-2px] breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:opacity-50 breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[hovered]:bg-breeze-sunken breeze:data-[pressed]:bg-breeze-sunken breeze:any-pointer-coarse:min-block-breeze-tap breeze:max-breeze-md:grid-cols-1 breeze:max-breeze-md:gap-breeze-1',
    label: 'breeze:min-inline-size-0 breeze:break-words breeze:font-medium',
    leading:
      'breeze:col-start-1 breeze:flex breeze:min-inline-size-0 breeze:flex-col breeze:items-start breeze:gap-breeze-2',
    loadMore:
      'breeze:flex breeze:min-inline-size-0 breeze:justify-center breeze:py-breeze-3',
    loadingLeading:
      'breeze:flex breeze:min-inline-size-0 breeze:flex-col breeze:gap-breeze-2',
    loadingMoneyPlaceholder: 'breeze:flex breeze:justify-end',
    loadingPlaceholder:
      'breeze:flex breeze:justify-end breeze:max-breeze-md:justify-start',
    loadingRow:
      'breeze:box-border breeze:inline-size-full breeze:min-inline-size-0 breeze:grid breeze:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] breeze:items-center breeze:gap-breeze-4 breeze:border-breeze-line breeze:border-be breeze:px-breeze-3 breeze:py-breeze-3 breeze:max-breeze-md:grid-cols-1 breeze:max-breeze-md:gap-breeze-1',
    loadingStatus: 'breeze:sr-only',
    metadata:
      'breeze:col-start-2 breeze:min-inline-size-0 breeze:break-words breeze:text-end breeze:max-breeze-md:col-start-1 breeze:max-breeze-md:text-start',
    primary:
      'breeze:flex breeze:inline-size-full breeze:min-inline-size-0 breeze:items-start breeze:gap-breeze-2',
    section: 'breeze:flex breeze:min-inline-size-0 breeze:flex-col',
    skeletonRows: 'breeze:flex breeze:min-inline-size-0 breeze:flex-col',
    value:
      'breeze:col-start-3 breeze:min-inline-size-0 breeze:break-words breeze:text-end breeze:max-breeze-md:col-start-1 breeze:max-breeze-md:text-start',
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
  /** Shows quiet placeholders for unavailable metadata and value regions. */
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
  /** Called with the activated row's descriptor. */
  onAction: (descriptor: RowListItemDescriptor) => void;
}

interface RowGroup {
  id: string;
  items: RowListItemDescriptor[];
  label: string;
}

type ListEntry =
  | { kind: 'row'; descriptor: RowListItemDescriptor }
  | { group: RowGroup; kind: 'section' };

function groupRows(descriptors: RowListItemDescriptor[]): ListEntry[] {
  const entries: ListEntry[] = [];
  const sections = new Map<string, RowGroup>();

  descriptors.forEach((descriptor) => {
    if (!descriptor.section) {
      entries.push({ descriptor, kind: 'row' });
      return;
    }

    const group = sections.get(descriptor.section.id);

    if (group) {
      group.items.push(descriptor);
    } else {
      const newGroup = {
        id: descriptor.section.id,
        items: [descriptor],
        label: descriptor.section.label,
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
        <LoadingPlaceholder />
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
        <div className={variants.base.primary}>
          {descriptor.icon && (
            <span aria-hidden="true" className={variants.base.icon}>
              <Icon name={descriptor.icon} size="sm" />
            </span>
          )}
          <span className={variants.base.content}>
            <span className={variants.base.label}>{descriptor.label}</span>
            {descriptor.description && (
              <span className={variants.base.description}>
                {descriptor.description}
              </span>
            )}
          </span>
        </div>
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

function renderRow(
  descriptor: RowListItemDescriptor,
  onAction: RowListProps<unknown>['onAction'],
) {
  return (
    <AriaGridListItem
      className={variants.base.item}
      id={`row:${descriptor.id}`}
      isDisabled={descriptor.disabled}
      key={`row:${descriptor.id}`}
      onAction={() => onAction(descriptor)}
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
  const descriptors = items.map(getItem);
  const entries = groupRows(descriptors);
  const loadMoreLoading = loadMore?.loading ?? false;

  return (
    <div className={variants.base.container}>
      <AriaGridList
        aria-busy={loading || undefined}
        aria-label={ariaLabel}
        className={variants.base.grid}
        renderEmptyState={() =>
          loading ? (
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
            return renderRow(entry.descriptor, onAction);
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
              {entry.group.items.map((descriptor) =>
                renderRow(descriptor, onAction),
              )}
            </AriaGridListSection>
          );
        })}
      </AriaGridList>
      <output
        aria-live="polite"
        className={variants.base.loadingStatus}
        lang={getMessageLocale('loading')}
      >
        {loading || loadMoreLoading ? messages.loading : ''}
      </output>
      {loadMore && (
        <div className={variants.base.loadMore}>
          <Button
            loading={loadMoreLoading}
            onAction={loadMore.onAction}
            variant="quiet"
          >
            {loadMore.label}
          </Button>
        </div>
      )}
    </div>
  );
}
