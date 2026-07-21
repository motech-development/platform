import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import {
  gapClasses,
  type LayoutElementProps,
  type ResponsiveSpace,
} from '../../internal/styling/layout';
import { resolveResponsiveClasses } from '../../internal/styling/responsive';
import { useBreezeContext } from '../../provider/BreezeContext';

const stack = tv({
  base: 'flex flex-col',
  defaultVariants: {
    align: 'stretch',
    justify: 'start',
  },
  variants: {
    align: {
      center: 'items-center',
      end: 'items-end',
      start: 'items-start',
      stretch: 'items-stretch',
    },
    justify: {
      between: 'justify-between',
      center: 'justify-center',
      end: 'justify-end',
      start: 'justify-start',
    },
  },
});

/** Props for a vertical layout of related content. */
export interface StackProps extends LayoutElementProps {
  /** Cross-axis alignment. Defaults to `stretch`. */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Responsive space between children. Defaults to `md`. */
  gap?: ResponsiveSpace;
  /** Main-axis distribution. Defaults to `start`. */
  justify?: 'start' | 'center' | 'end' | 'between';
}

/**
 * Arranges children vertically with bounded alignment, distribution, and
 * responsive spacing while preserving authored reading order.
 *
 * @summary vertical layout with responsive bounded spacing
 */
export function Stack({
  align,
  className,
  gap = 'md',
  justify,
  ...props
}: Readonly<StackProps>) {
  useBreezeContext();

  return createElement('div', {
    ...props,
    className: stack({
      align,
      class: [resolveResponsiveClasses(gap, gapClasses), className],
      justify,
    }),
  });
}
