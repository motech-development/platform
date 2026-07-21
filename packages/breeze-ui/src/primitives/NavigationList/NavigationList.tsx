import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { CollectionKey } from '../../internal/types/collection';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Link } from '../Link/Link';

const navigationList = tv({
  base: 'flex gap-1',
  defaultVariants: { orientation: 'vertical' },
  variants: {
    orientation: {
      horizontal: 'flex-row flex-wrap items-center',
      vertical: 'flex-col items-stretch',
    },
  },
});
const navigationItem = tv({
  base: 'block min-h-10 px-3 py-2 no-underline data-[current]:bg-[var(--breeze-primary-soft)] data-[current]:font-semibold',
});

/** Props for a semantic application navigation list. */
export interface NavigationListRootProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Navigation items. */
  children: ReactNode;
  /** Layout direction. Defaults to `vertical`. */
  orientation?: 'horizontal' | 'vertical';
  /** Ref to the rendered navigation landmark. */
  ref?: Ref<HTMLElement>;
}

/** Props for one navigation destination. */
export interface NavigationListItemProps
  extends Omit<
    HTMLAttributes<HTMLLIElement>,
    'id' | 'onClick' | 'onClickCapture' | 'style'
  > {
  /** Visible destination label. */
  children: ReactNode;
  /** Marks this destination as the current page. Defaults to `false`. */
  current?: boolean;
  /** Prevents navigation and action. Defaults to `false`. */
  disabled?: boolean;
  /** Destination URL. */
  href: string;
  /** Stable string or number destination key. */
  id: CollectionKey;
  /** Called with this destination key after activation. */
  onAction?: (key: CollectionKey) => void;
  /** Ref to the rendered list item. */
  ref?: Ref<HTMLLIElement>;
}

/** Renders a navigation landmark with horizontal or vertical list layout. */
export function Root({
  children,
  className,
  orientation = 'vertical',
  ref,
  ...props
}: Readonly<NavigationListRootProps>): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement(
    'nav',
    {
      ...props,
      ref: forwardedRef,
    },
    <ul className={navigationList({ class: className, orientation })}>
      {children}
    </ul>,
  );
}

/** Renders one router-neutral navigation destination. */
export function Item({
  children,
  className,
  current = false,
  disabled = false,
  href,
  id,
  onAction,
  ref,
  ...props
}: Readonly<NavigationListItemProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(
    'li',
    {
      ...props,
      ref: forwardedRef,
    },
    <Link
      aria-current={current ? 'page' : undefined}
      className={navigationItem({ class: className })}
      data-current={current || undefined}
      disabled={disabled}
      href={href}
      onAction={disabled ? undefined : () => onAction?.(id)}
    >
      {children}
    </Link>,
  );
}

/**
 * Semantic compound navigation-list primitive.
 *
 * @summary labelled persistent navigation with current destination state
 */
export const NavigationList = {
  /** One keyed destination. */
  Item,
  /** Navigation landmark and list root. */
  Root,
};
