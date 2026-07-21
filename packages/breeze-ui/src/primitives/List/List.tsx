import type { HTMLAttributes, ReactElement, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const listRoot = tv({
  base: 'm-0 grid gap-2 ps-6 text-[var(--breeze-ink)] marker:text-[var(--breeze-ink-muted)]',
  defaultVariants: {
    ordered: false,
  },
  variants: {
    ordered: {
      false: 'list-disc',
      true: 'list-decimal',
    },
  },
});

const listItem = tv({ base: 'min-w-0 ps-1' });

/** Props for a native ordered or unordered content list. */
export interface ListRootProps
  extends Omit<HTMLAttributes<HTMLOListElement | HTMLUListElement>, 'style'> {
  /** Renders an ordered list when true and an unordered list otherwise. Defaults to `false`. */
  ordered?: boolean;
  /** Ref to the rendered ordered or unordered list element. */
  ref?: Ref<HTMLOListElement | HTMLUListElement>;
}

/** Props for one semantic content-list item. */
export interface ListItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, 'style'> {
  /** Ref to the rendered list item. */
  ref?: Ref<HTMLLIElement>;
}

/** Renders a native ordered or unordered list without interactive collection behaviour. */
export function Root({
  className,
  ordered = false,
  ref,
  ...props
}: Readonly<ListRootProps>): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement(ordered ? 'ol' : 'ul', {
    ...props,
    className: listRoot({ class: className, ordered }),
    ref: forwardedRef,
  });
}

/** Renders one native list item. */
export function Item({
  className,
  ref,
  ...props
}: Readonly<ListItemProps>): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('li', {
    ...props,
    className: listItem({ class: className }),
    ref: forwardedRef,
  });
}

/**
 * Semantic ordered or unordered content list with no selection behaviour.
 *
 * @summary native ordered and unordered lists for structured content
 */
export const List = {
  /** One native list item. */
  Item,
  /** Ordered or unordered native list container. */
  Root,
};
