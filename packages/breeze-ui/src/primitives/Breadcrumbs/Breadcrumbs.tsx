import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
} from 'react-aria-components/Breadcrumbs';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { CollectionKey } from '../../internal/types/collection';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Link } from '../Link/Link';

const breadcrumbsRoot = tv({
  base: 'flex min-w-0 flex-wrap items-center gap-2',
});
const breadcrumbItem = tv({
  base: 'flex min-w-0 items-center gap-2 text-sm text-[var(--breeze-ink-muted)] after:content-["/"] last:text-[var(--breeze-ink)] last:after:hidden',
});

/** Props for the ordered breadcrumb trail. */
export interface BreadcrumbsRootProps
  extends Omit<HTMLAttributes<HTMLOListElement>, 'style'> {
  /** Ordered hierarchy ending with the current location. */
  children: ReactNode;
  /** Disables every navigable crumb. Defaults to `false`. */
  disabled?: boolean;
  /** Ref to the rendered ordered list. */
  ref?: Ref<HTMLOListElement>;
}

/** Props for one location in a breadcrumb hierarchy. */
export interface BreadcrumbsItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, 'id' | 'style'> {
  /** Visible location label. */
  children: ReactNode;
  /** Prevents navigation for this crumb. Defaults to `false`. */
  disabled?: boolean;
  /** Destination URL. Omit for the current location. */
  href?: string;
  /** Stable string or number crumb key. */
  id: CollectionKey;
  /** Ref to the rendered list item. */
  ref?: Ref<HTMLLIElement>;
}

/** Renders the semantic ordered trail and supplies current-item semantics. */
export function Root({
  className,
  disabled = false,
  ref,
  ...props
}: Readonly<BreadcrumbsRootProps>): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaBreadcrumbs, {
    ...props,
    className: breadcrumbsRoot({ class: className }),
    isDisabled: disabled,
    ref: forwardedRef,
  });
}

/** Renders one navigable or current breadcrumb. */
export function Item({
  children,
  className,
  disabled = false,
  href,
  id,
  ref,
  ...props
}: Readonly<BreadcrumbsItemProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(
    AriaBreadcrumb,
    {
      ...props,
      className: breadcrumbItem({ class: className }),
      id,
      ref: forwardedRef,
    },
    href === undefined ? (
      <span aria-current="page">{children}</span>
    ) : (
      <Link disabled={disabled} href={href} variant="muted">
        {children}
      </Link>
    ),
  );
}

/**
 * Renders an ordered navigation hierarchy with current-location semantics.
 *
 * @summary ordered hierarchy navigation with current-location semantics
 */
export const Breadcrumbs = {
  /** One keyed location in the hierarchy. */
  Item,
  /** Ordered breadcrumb trail root. */
  Root,
};
