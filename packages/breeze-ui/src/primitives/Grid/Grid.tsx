import type { ReactNode } from 'react';
import { createElement } from 'react';
import getLayoutAccessibility from '../../layout/layout.accessibility';
import type { LayoutElement, LayoutGap } from '../../layout/layout.types';
import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    grid: 'breeze:grid breeze:min-inline-0',
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
      // A growing main column beside a 300px aside, matching the Overview page.
      // Items keep their own height so a short aside does not stretch.
      mainAside: {
        lg: 'breeze:grid-cols-[minmax(0,1fr)_300px] breeze:items-start breeze:max-breeze-lg:grid-cols-1',
        md: 'breeze:grid-cols-[minmax(0,1fr)_300px] breeze:items-start breeze:max-breeze-md:grid-cols-1',
        none: 'breeze:grid-cols-[minmax(0,1fr)_300px] breeze:items-start',
        sm: 'breeze:grid-cols-[minmax(0,1fr)_300px] breeze:items-start breeze:max-breeze-sm:grid-cols-1',
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

export type GridColumns = 1 | 2 | 3 | 'mainAside';
export type GridCollapseBelow = 'lg' | 'md' | 'none' | 'sm';

export interface GridProps {
  /** Names the grid when its visible content does not provide a suitable label. */
  'aria-label'?: string;
  /** Items arranged in the grid. */
  children: ReactNode;
  /** Breakpoint below which multiple columns collapse to one. Defaults to `md`. */
  collapseBelow?: GridCollapseBelow;
  /**
   * Number of equal-width columns, or `mainAside` for a growing main column
   * beside a fixed-width aside. Defaults to `2`.
   */
  columns?: GridColumns;
  /** Selects the semantic HTML element. Defaults to `div`. */
  element?: LayoutElement;
  /** Applies space between items from the Breeze spacing scale. Defaults to `4`. */
  gap?: LayoutGap;
}

/**
 * Arranges children in equal columns, or a main column beside an aside, and can
 * collapse to one column at a Breeze breakpoint.
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
}: Readonly<GridProps>) {
  useBreezeContext();

  const { accessibleLabel, role } = getLayoutAccessibility(ariaLabel, element);

  return createElement(
    element,
    {
      'aria-label': accessibleLabel,
      className: [
        variants.base.grid,
        variants.compound.columns[columns][collapseBelow],
        variants.size[gap],
      ].join(' '),
      role,
    },
    children,
  );
}
