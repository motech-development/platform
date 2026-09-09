import type { ReactNode } from 'react';
import { createElement } from 'react';
import { useBreezeContext } from '../../provider/BreezeContext';
import type { LayoutAlign, LayoutElement, LayoutGap } from '../layout.types';
import { Skeleton } from '../Skeleton/Skeleton';

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
  'aria-label'?: string;
  children: ReactNode;
  element?: LayoutElement;
  gap?: LayoutGap;
  horizontalAlign?: LayoutAlign;
  loading?: boolean;
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
  loading = false,
}: Readonly<StackProps>) {
  const { messages } = useBreezeContext();

  return createElement(
    element,
    {
      'aria-busy': loading || undefined,
      'aria-label': ariaLabel,
      className: [
        variants.base.stack,
        variants.variant[horizontalAlign],
        variants.size[gap],
      ].join(' '),
    },
    loading ? <Skeleton label={messages.loading} /> : children,
  );
}
