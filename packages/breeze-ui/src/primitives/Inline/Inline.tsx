import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import {
  gapClasses,
  type LayoutElementProps,
  type ResponsiveSpace,
} from '../../internal/styling/layout';
import { resolveResponsiveClasses } from '../../internal/styling/responsive';
import { useBreezeContext } from '../../provider/BreezeContext';

const inline = tv({
  base: 'flex flex-row',
  defaultVariants: {
    align: 'center',
    justify: 'start',
    wrap: true,
  },
  variants: {
    align: {
      baseline: 'items-baseline',
      center: 'items-center',
      end: 'items-end',
      start: 'items-start',
      stretch: 'items-stretch',
    },
    justify: {
      around: 'justify-around',
      between: 'justify-between',
      center: 'justify-center',
      end: 'justify-end',
      evenly: 'justify-evenly',
      start: 'justify-start',
    },
    wrap: {
      false: 'flex-nowrap',
      true: 'flex-wrap',
    },
  },
});

/** Props for a horizontal layout of related content. */
export interface InlineProps extends LayoutElementProps {
  /** Cross-axis alignment. Defaults to `center`. */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Responsive space between children. Defaults to `md`. */
  gap?: ResponsiveSpace;
  /** Main-axis distribution. Defaults to `start`. */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Whether children may flow onto additional rows. Defaults to `true`. */
  wrap?: boolean;
}

/**
 * Arranges related content along the inline axis with bounded alignment,
 * distribution, responsive spacing, and wrapping controls.
 *
 * @summary horizontal layout with responsive spacing and wrapping
 */
export function Inline({
  align,
  className,
  gap = 'md',
  justify,
  wrap,
  ...props
}: InlineProps) {
  useBreezeContext();

  return createElement('div', {
    ...props,
    className: inline({
      align,
      class: [resolveResponsiveClasses(gap, gapClasses), className],
      justify,
      wrap,
    }),
  });
}
