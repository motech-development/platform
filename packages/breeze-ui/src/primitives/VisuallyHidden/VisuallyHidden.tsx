import type { ReactNode } from 'react';

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
  /** Content hidden visually but retained for assistive technology. */
  children: ReactNode;
}

/**
 * Hides explanatory content visually while preserving it for assistive technology.
 *
 * @summary Accessible content with no visual footprint.
 */
export function VisuallyHidden({ children }: Readonly<VisuallyHiddenProps>) {
  return <span className={variants.base.hidden}>{children}</span>;
}
