import type { ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import type { NativeLinkProps } from '../../internal/types/native';
import { Link, type LinkProps } from '../Link/Link';

const skipLink = tv({
  base: 'fixed start-4 top-4 z-50 -translate-y-24 bg-[var(--breeze-primary)] px-4 py-3 font-semibold text-white outline-none transition-transform focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--breeze-focus)] motion-reduce:transition-none',
});

/** Props for the keyboard-first link that bypasses repeated page chrome. */
export interface SkipLinkProps extends NativeLinkProps {
  /** Accessible link content. */
  children: ReactNode;
  /** Placement and composition classes. */
  className?: string;
  /** Ref to the rendered anchor. */
  ref?: Ref<HTMLAnchorElement>;
  /** Id of the focusable main content target, without a leading hash. */
  targetId: string;
}

/**
 * Reveals a native fragment link on focus so keyboard users can bypass
 * repeated content.
 *
 * @summary focus-revealed bypass link to a main-content target
 */
export function SkipLink({
  children,
  className,
  ref,
  targetId,
  ...props
}: SkipLinkProps): ReactElement {
  return createElement(
    Link,
    {
      ...props,
      className: skipLink({ class: className }),
      href: `#${targetId}`,
      ref,
    } as LinkProps,
    children,
  );
}
