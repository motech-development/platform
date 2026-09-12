import type { ReactNode } from 'react';
import { createElement } from 'react';
import getLayoutAccessibility from '../layout.accessibility';
import type { LayoutAlign, LayoutElement, LayoutGap } from '../layout.types';

const variants = {
  base: {
    inline: 'breeze:flex breeze:min-inline-size-0',
  },
  compound: {},
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
  state: {
    wrap: 'breeze:flex-wrap',
  },
  variant: {
    align: {
      center: 'breeze:items-center',
      end: 'breeze:items-end',
      start: 'breeze:items-start',
      stretch: 'breeze:items-stretch',
    },
    justify: {
      between: 'breeze:justify-between',
      center: 'breeze:justify-center',
      end: 'breeze:justify-end',
      start: 'breeze:justify-start',
    },
  },
} as const;

export type InlineJustify = keyof typeof variants.variant.justify;

export interface InlineProps {
  /** Names the row when its visible content does not provide a suitable label. */
  'aria-label'?: string;
  /** Items arranged horizontally. */
  children: ReactNode;
  /** Selects the semantic HTML element. Defaults to `div`. */
  element?: LayoutElement;
  /** Applies space between items from the Breeze spacing scale. Defaults to `3`. */
  gap?: LayoutGap;
  /** Distributes items along the inline axis. Defaults to `start`. */
  justify?: InlineJustify;
  /** Aligns items along the block axis. Defaults to `center`. */
  verticalAlign?: LayoutAlign;
  /** Allows items to wrap onto additional rows. Defaults to `false`. */
  wrap?: boolean;
}

/**
 * Arranges children horizontally on the Breeze spacing scale.
 *
 * @summary A constrained horizontal layout primitive.
 */
export function Inline({
  'aria-label': ariaLabel,
  children,
  element = 'div',
  gap = 3,
  justify = 'start',
  verticalAlign = 'center',
  wrap = false,
}: Readonly<InlineProps>) {
  const { accessibleLabel, role } = getLayoutAccessibility(ariaLabel, element);

  return createElement(
    element,
    {
      'aria-label': accessibleLabel,
      className: [
        variants.base.inline,
        variants.variant.align[verticalAlign],
        variants.variant.justify[justify],
        variants.size[gap],
        wrap && variants.state.wrap,
      ]
        .filter(Boolean)
        .join(' '),
      role,
    },
    children,
  );
}
