import type { ReactNode } from 'react';
import { createElement } from 'react';
import type { LayoutAlign, LayoutElement, LayoutGap } from '../layout.types';

const variants = {
  base: {
    stack: 'breeze:flex breeze:min-inline-size-0 breeze:flex-col',
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
  state: {},
  variant: {
    center: 'breeze:items-center',
    end: 'breeze:items-end',
    start: 'breeze:items-start',
    stretch: 'breeze:items-stretch',
  },
} as const;

export interface StackProps {
  /** Names the stack when its visible content does not provide a suitable label. */
  'aria-label'?: string;
  /** Items arranged vertically. */
  children: ReactNode;
  /** Selects the semantic HTML element. Defaults to `div`. */
  element?: LayoutElement;
  /** Applies space between items from the Breeze spacing scale. Defaults to `3`. */
  gap?: LayoutGap;
  /** Aligns items along the inline axis. Defaults to `stretch`. */
  horizontalAlign?: LayoutAlign;
}

/**
 * Arranges children vertically on the Breeze spacing scale.
 *
 * @summary A constrained vertical layout primitive.
 */
export function Stack({
  'aria-label': ariaLabel,
  children,
  element = 'div',
  gap = 3,
  horizontalAlign = 'stretch',
}: Readonly<StackProps>) {
  const accessibleLabel = ariaLabel?.trim() || undefined;

  return createElement(
    element,
    {
      'aria-label': accessibleLabel,
      className: [
        variants.base.stack,
        variants.variant[horizontalAlign],
        variants.size[gap],
      ].join(' '),
      role:
        accessibleLabel !== undefined && element === 'div'
          ? 'group'
          : undefined,
    },
    children,
  );
}
