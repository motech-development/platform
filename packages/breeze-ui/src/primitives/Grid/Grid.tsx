import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import {
  gapClasses,
  type LayoutElementProps,
  type ResponsiveSpace,
} from '../../internal/styling/layout';
import {
  resolveResponsiveClasses,
  type ResponsiveValue,
} from '../../internal/styling/responsive';
import { useBreezeContext } from '../../provider/BreezeContext';

type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;

const columnClasses = {
  base: {
    1: 'grid-cols-1',
    12: 'grid-cols-12',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
  },
  lg: {
    1: 'lg:grid-cols-1',
    12: 'lg:grid-cols-12',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    6: 'lg:grid-cols-6',
  },
  md: {
    1: 'md:grid-cols-1',
    12: 'md:grid-cols-12',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    6: 'md:grid-cols-6',
  },
  sm: {
    1: 'sm:grid-cols-1',
    12: 'sm:grid-cols-12',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    6: 'sm:grid-cols-6',
  },
} as const;

const grid = tv({
  base: 'grid',
  defaultVariants: {
    align: 'stretch',
    template: 'equal',
  },
  variants: {
    align: {
      center: 'items-center',
      end: 'items-end',
      start: 'items-start',
      stretch: 'items-stretch',
    },
    template: {
      equal: '',
      'field-control-action':
        'grid-cols-[minmax(0,1fr)_auto_auto] [&>:last-child]:size-11',
    },
  },
});

/** Canonical unequal-track arrangements for reusable form rows. */
export type GridTemplate = 'field-control-action';

/** Props for a bounded responsive column layout. */
export interface GridProps extends LayoutElementProps {
  /** Alignment of children within their grid cells. Defaults to `stretch`. */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Responsive column count. Defaults to one column. */
  columns?: ResponsiveValue<GridColumns>;
  /** Responsive row and column gap. Defaults to `lg`. */
  gap?: ResponsiveSpace;
  /** Canonical unequal tracks. Excludes equal `columns` while active. */
  template?: GridTemplate;
}

/**
 * Arranges related content in bounded responsive columns while preserving the
 * authored source order across every breakpoint.
 *
 * @summary bounded responsive columns with stable source order
 */
export function Grid({
  align,
  className,
  columns = 1,
  gap = 'lg',
  template,
  ...props
}: GridProps) {
  useBreezeContext();

  return createElement('div', {
    ...props,
    className: grid({
      align,
      class: [
        template === undefined
          ? resolveResponsiveClasses(columns, columnClasses)
          : undefined,
        resolveResponsiveClasses(gap, gapClasses),
        className,
      ],
      template: template ?? 'equal',
    }),
  });
}
