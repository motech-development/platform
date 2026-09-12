import type { ReactNode } from 'react';
import { createElement } from 'react';
import { useBreezeContext } from '../../provider/BreezeContext';
import type { LayoutAlign, LayoutElement, LayoutGap } from '../layout.types';
import { Skeleton } from '../Skeleton/Skeleton';

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
  'aria-label'?: string;
  children: ReactNode;
  element?: LayoutElement;
  gap?: LayoutGap;
  justify?: InlineJustify;
  loading?: boolean;
  verticalAlign?: LayoutAlign;
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
  loading = false,
  verticalAlign = 'center',
  wrap = false,
}: Readonly<InlineProps>) {
  const { messages } = useBreezeContext();
  const accessibleLabel = ariaLabel?.trim() || undefined;

  return createElement(
    element,
    {
      'aria-busy': loading || undefined,
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
      role:
        accessibleLabel !== undefined && element === 'div'
          ? 'group'
          : undefined,
    },
    loading ? (
      <Skeleton blockSize={28} inlineSize={96} label={messages.loading} />
    ) : (
      children
    ),
  );
}
