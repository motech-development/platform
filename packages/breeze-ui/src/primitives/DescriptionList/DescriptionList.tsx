import type { HTMLAttributes, ReactElement, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const descriptionListRoot = tv({
  base: 'm-0 grid gap-0 border-y border-[var(--breeze-border)]',
});

const descriptionListItem = tv({
  base: 'grid min-w-0 gap-1 border-b border-[var(--breeze-border)] py-3 last:border-b-0 sm:grid-cols-[minmax(8rem,1fr)_minmax(0,2fr)] sm:gap-6',
});

const descriptionListTerm = tv({
  base: 'm-0 font-[family-name:var(--breeze-font-display)] font-bold text-[var(--breeze-ink)]',
});

const descriptionListDescription = tv({
  base: 'm-0 min-w-0 text-[var(--breeze-ink)]',
});

/** Props for the native description-list container. */
export interface DescriptionListRootProps
  extends Omit<HTMLAttributes<HTMLDListElement>, 'style'> {
  /** Ref to the rendered description list. */
  ref?: Ref<HTMLDListElement>;
}

/** Props for one visually grouped term-description pair. */
export interface DescriptionListItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Ref to the rendered pair container. */
  ref?: Ref<HTMLDivElement>;
}

/** Props for a native description-list term. */
export interface DescriptionListTermProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Ref to the rendered term element. */
  ref?: Ref<HTMLElement>;
}

/** Props for the description associated with a term. */
export interface DescriptionListDescriptionProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Ref to the rendered description element. */
  ref?: Ref<HTMLElement>;
}

/** Renders a native description list that becomes two columns when space permits. */
export function Root({
  className,
  ref,
  ...props
}: DescriptionListRootProps): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement('dl', {
    ...props,
    className: descriptionListRoot({ class: className }),
    ref: forwardedRef,
  });
}

/** Visually groups one or more native terms with their descriptions. */
export function Item({
  className,
  ref,
  ...props
}: DescriptionListItemProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('div', {
    ...props,
    className: descriptionListItem({ class: className }),
    ref: forwardedRef,
  });
}

/** Renders a native description-list term. */
export function Term({
  className,
  ref,
  ...props
}: DescriptionListTermProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('dt', {
    ...props,
    className: descriptionListTerm({ class: className }),
    ref: forwardedRef,
  });
}

/** Renders the native description associated with a preceding term. */
export function Description({
  className,
  ref,
  ...props
}: DescriptionListDescriptionProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('dd', {
    ...props,
    className: descriptionListDescription({ class: className }),
    ref: forwardedRef,
  });
}

/**
 * Semantic compound primitive for term-description metadata.
 *
 * @summary responsive native term-description metadata
 */
export const DescriptionList = {
  /** Description associated with a term. */
  Description,
  /** Visual grouping for a term-description pair. */
  Item,
  /** Native description-list container. */
  Root,
  /** Native description-list term. */
  Term,
};
