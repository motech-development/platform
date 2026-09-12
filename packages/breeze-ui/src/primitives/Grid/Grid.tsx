import type { ReactNode } from 'react';
import { createElement } from 'react';
import { useBreezeContext } from '../../provider/BreezeContext';
import type { LayoutElement, LayoutGap } from '../layout.types';
import { Skeleton } from '../Skeleton/Skeleton';

const variants = {
  base: {
    grid: 'breeze:grid breeze:min-inline-size-0',
  },
  compound: {
    columns: {
      1: {
        lg: 'breeze:grid-cols-1',
        md: 'breeze:grid-cols-1',
        none: 'breeze:grid-cols-1',
        sm: 'breeze:grid-cols-1',
      },
      2: {
        lg: 'breeze:grid-cols-2 breeze:max-breeze-lg:grid-cols-1',
        md: 'breeze:grid-cols-2 breeze:max-breeze-md:grid-cols-1',
        none: 'breeze:grid-cols-2',
        sm: 'breeze:grid-cols-2 breeze:max-breeze-sm:grid-cols-1',
      },
      3: {
        lg: 'breeze:grid-cols-3 breeze:max-breeze-lg:grid-cols-1',
        md: 'breeze:grid-cols-3 breeze:max-breeze-md:grid-cols-1',
        none: 'breeze:grid-cols-3',
        sm: 'breeze:grid-cols-3 breeze:max-breeze-sm:grid-cols-1',
      },
    },
  },
  size: {
    0: 'breeze:gap-0',
    1: 'breeze:gap-breeze-1',
    2: 'breeze:gap-breeze-2',
    3: 'breeze:gap-breeze-3',
    4: 'breeze:gap-breeze-4',
    5: 'breeze:gap-breeze-5',
    6: 'breeze:gap-breeze-6',
    7: 'breeze:gap-breeze-7',
    8: 'breeze:gap-breeze-8',
  },
  state: {},
  variant: {},
} as const;

export type GridColumns = 1 | 2 | 3;
export type GridCollapseBelow = 'lg' | 'md' | 'none' | 'sm';

export interface GridProps {
  'aria-label'?: string;
  children: ReactNode;
  collapseBelow?: GridCollapseBelow;
  columns?: GridColumns;
  element?: LayoutElement;
  gap?: LayoutGap;
  loading?: boolean;
}

/**
 * Arranges children in equal columns and can collapse at a Breeze breakpoint.
 *
 * @summary A constrained responsive grid primitive.
 */
export function Grid({
  'aria-label': ariaLabel,
  children,
  collapseBelow = 'md',
  columns = 2,
  element = 'div',
  gap = 4,
  loading = false,
}: Readonly<GridProps>) {
  const { messages } = useBreezeContext();
  const accessibleLabel = ariaLabel?.trim() || undefined;
  const content = loading
    ? Array.from({ length: columns }, (_, index) => (
        <Skeleton
          blockSize={96}
          inlineSize="100%"
          key={index}
          label={index === 0 ? messages.loading : undefined}
          shape="rectangle"
        />
      ))
    : children;

  return createElement(
    element,
    {
      'aria-busy': loading || undefined,
      'aria-label': accessibleLabel,
      className: [
        variants.base.grid,
        variants.compound.columns[columns][collapseBelow],
        variants.size[gap],
      ].join(' '),
      role:
        accessibleLabel !== undefined && element === 'div'
          ? 'group'
          : undefined,
    },
    content,
  );
}
