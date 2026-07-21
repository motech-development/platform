import type { HTMLAttributes, ReactElement, Ref } from 'react';
import { createElement } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '../../icons';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { Button } from '../../primitives/Button/Button';
import { IconButton } from '../../primitives/IconButton/IconButton';
import { useBreezeContext } from '../../provider/BreezeContext';

type PaginationEntry = 'ellipsis' | number;

function createEntries(
  currentPage: number,
  pageCount: number,
): PaginationEntry[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const candidates = new Set([
    1,
    pageCount,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);
  const pages = [...candidates]
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((first, second) => first - second);

  return pages.flatMap((page, index) => {
    const previous = pages[index - 1];

    if (previous === undefined) {
      return [page];
    }

    if (page - previous === 2) {
      return [previous + 1, page];
    }

    return page - previous > 2 ? ['ellipsis' as const, page] : [page];
  });
}

/** Props for page-based application-owned navigation. */
export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onChange' | 'style'> {
  /** Accessible name for the pagination landmark. */
  'aria-label': string;
  /** Current one-based page. */
  currentPage: number;
  /** Prevents all page changes. Defaults to `false`. */
  disabled?: boolean;
  /** Called with the requested one-based page. */
  onChange: (page: number) => void;
  /** Total number of pages. */
  pageCount: number;
  /** Ref to the rendered navigation landmark. */
  ref?: Ref<HTMLElement>;
}

/**
 * Navigates application-owned paginated data without owning fetching or cursors.
 *
 * @summary one-based navigation across a known page range
 */
export function Pagination({
  currentPage,
  disabled = false,
  onChange,
  pageCount,
  ref,
  ...props
}: Readonly<PaginationProps>): ReactElement {
  const { direction, messages } = useBreezeContext();

  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new RangeError('pageCount must be a positive integer.');
  }

  if (
    !Number.isInteger(currentPage) ||
    currentPage < 1 ||
    currentPage > pageCount
  ) {
    throw new RangeError('currentPage must be within the page range.');
  }

  const entries = createEntries(currentPage, pageCount);
  const PreviousIcon = direction === 'rtl' ? ArrowRightIcon : ArrowLeftIcon;
  const NextIcon = direction === 'rtl' ? ArrowLeftIcon : ArrowRightIcon;
  const renderEntry = (entry: PaginationEntry, index: number) => {
    if (entry === 'ellipsis') {
      const nextPage = entries[index + 1];

      return (
        <span
          aria-hidden="true"
          className="px-1"
          key={`ellipsis-before-${nextPage}`}
        >
          …
        </span>
      );
    }

    if (entry === currentPage) {
      return (
        <span
          aria-current="page"
          aria-label={`${messages.page} ${entry}`}
          className="grid min-h-10 min-w-10 place-items-center bg-[var(--breeze-primary)] px-3 font-[family-name:var(--breeze-font-display)] font-bold text-white"
          key={entry}
        >
          {entry}
        </span>
      );
    }

    return (
      <Button
        aria-label={`${messages.page} ${entry}`}
        appearance="ghost"
        disabled={disabled}
        key={entry}
        onAction={() => onChange(entry)}
        variant="secondary"
      >
        {entry}
      </Button>
    );
  };

  return createElement(
    'nav',
    {
      ...props,
      className: `flex flex-wrap items-center gap-2 ${props.className ?? ''}`,
      ref: useForwardedRef(ref),
    },
    <>
      <IconButton
        aria-label={messages.previousPage}
        disabled={disabled || currentPage <= 1}
        onAction={() => onChange(currentPage - 1)}
      >
        <PreviousIcon />
      </IconButton>
      {entries.map((entry, index) => renderEntry(entry, index))}
      <IconButton
        aria-label={messages.nextPage}
        disabled={disabled || currentPage >= pageCount}
        onAction={() => onChange(currentPage + 1)}
      >
        <NextIcon />
      </IconButton>
    </>,
  );
}
