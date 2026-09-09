import type { ReactNode } from 'react';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Skeleton } from '../Skeleton/Skeleton';

const variants = {
  base: {
    hidden: 'breeze:sr-only',
  },
  compound: {},
  size: {},
  state: {},
  variant: {},
} as const;

export interface VisuallyHiddenProps {
  children: ReactNode;
  loading?: boolean;
}

/**
 * Hides explanatory content visually while preserving it for assistive technology.
 *
 * @summary Accessible content with no visual footprint.
 */
export function VisuallyHidden({
  children,
  loading = false,
}: Readonly<VisuallyHiddenProps>) {
  const { messages } = useBreezeContext();

  return (
    <span className={variants.base.hidden}>
      {loading ? <Skeleton label={messages.loading} /> : children}
    </span>
  );
}
