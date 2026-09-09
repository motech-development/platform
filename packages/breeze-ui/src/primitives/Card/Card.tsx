import type { ReactNode } from 'react';
import { createElement } from 'react';
import { useBreezeContext } from '../../provider/BreezeContext';
import type { LayoutGap } from '../layout.types';
import { Skeleton } from '../Skeleton/Skeleton';

const variants = {
  base: {
    card: 'breeze:min-inline-size-0 breeze:rounded-breeze-panel breeze:border breeze:border-solid breeze:border-breeze-line breeze:shadow-breeze-panel',
  },
  compound: {},
  size: {
    0: 'breeze:p-0',
    1: 'breeze:p-breeze-1',
    2: 'breeze:p-breeze-2',
    3: 'breeze:p-breeze-3',
    4: 'breeze:p-breeze-4',
    5: 'breeze:p-breeze-5',
    6: 'breeze:p-breeze-6',
    7: 'breeze:p-breeze-7',
    8: 'breeze:p-breeze-8',
  },
  state: {
    clipped: 'breeze:overflow-hidden',
  },
  variant: {
    raised: 'breeze:bg-breeze-raised',
    surface: 'breeze:bg-breeze-surface',
  },
} as const;

export type CardVariant = keyof typeof variants.variant;
export type CardElement = 'article' | 'aside' | 'div' | 'section';

export interface CardProps {
  'aria-label'?: string;
  children: ReactNode;
  clipped?: boolean;
  element?: CardElement;
  loading?: boolean;
  padding?: LayoutGap;
  variant?: CardVariant;
}

/**
 * Decorates related content as a bordered Breeze panel.
 *
 * @summary A closed surface or raised content card.
 */
export function Card({
  'aria-label': ariaLabel,
  children,
  clipped = true,
  element = 'div',
  loading = false,
  padding = 4,
  variant = 'surface',
}: Readonly<CardProps>) {
  const { messages } = useBreezeContext();

  return createElement(
    element,
    {
      'aria-busy': loading || undefined,
      'aria-label': ariaLabel,
      className: [
        variants.base.card,
        variants.variant[variant],
        variants.size[padding],
        clipped && variants.state.clipped,
      ]
        .filter(Boolean)
        .join(' '),
    },
    loading ? (
      <Skeleton blockSize={64} label={messages.loading} shape="rectangle" />
    ) : (
      children
    ),
  );
}
