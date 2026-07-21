import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import type { LayoutElementProps } from '../../internal/styling/layout';
import { useBreezeContext } from '../../provider/BreezeContext';

const center = tv({
  base: 'grid place-items-center',
  defaultVariants: {
    minHeight: 'none',
  },
  variants: {
    minHeight: {
      none: '',
      screen: 'min-h-screen',
    },
  },
});

/** Props for a layout that centres one composition in both axes. */
export interface CenterProps extends LayoutElementProps {
  /** Minimum block size. Defaults to `none`; `screen` fills the viewport. */
  minHeight?: 'none' | 'screen';
}

/**
 * Centres content horizontally and vertically without imposing presentation.
 *
 * @summary two-axis layout centring with optional viewport height
 */
export function Center({ className, minHeight, ...props }: CenterProps) {
  useBreezeContext();

  return createElement('div', {
    ...props,
    className: center({
      class: className,
      minHeight,
    }),
  });
}
