import type { HTMLAttributes, ReactElement, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const cardRoot = tv({
  base: 'min-w-0 border border-b-2 border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-[var(--breeze-ink)]',
});

const cardHeader = tv({
  base: 'grid gap-1 border-b border-[var(--breeze-border)] px-5 py-4',
});

const cardTitle = tv({
  base: 'm-0 font-[family-name:var(--breeze-font-display)] text-xl font-bold leading-tight',
});

const cardDescription = tv({
  base: 'm-0 text-sm text-[var(--breeze-ink-muted)]',
});

const cardBody = tv({ base: 'min-w-0 px-5 py-4' });

const cardFooter = tv({
  base: 'flex min-h-11 flex-wrap items-center gap-3 border-t border-[var(--breeze-border)] px-5 py-3',
});

/** Props for the semantic card container. */
export interface CardRootProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Ref to the rendered article element. */
  ref?: Ref<HTMLElement>;
}

/** Props for the card heading region. */
export interface CardHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Ref to the rendered header element. */
  ref?: Ref<HTMLElement>;
}

/** Props for the card title. */
export interface CardTitleProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'style'> {
  /** Ref to the rendered level-three heading. */
  ref?: Ref<HTMLHeadingElement>;
}

/** Props for supporting card title context. */
export interface CardDescriptionProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, 'style'> {
  /** Ref to the rendered paragraph element. */
  ref?: Ref<HTMLParagraphElement>;
}

/** Props for the card's primary content region. */
export interface CardBodyProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Ref to the rendered body element. */
  ref?: Ref<HTMLDivElement>;
}

/** Props for the card's supporting action or metadata region. */
export interface CardFooterProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Ref to the rendered footer element. */
  ref?: Ref<HTMLElement>;
}

/** Renders the semantic article that contains one domain-neutral summary. */
export function Root({
  className,
  ref,
  ...props
}: CardRootProps): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement('article', {
    ...props,
    className: cardRoot({ class: className }),
    ref: forwardedRef,
  });
}

/** Groups a card title and its optional description or controls. */
export function Header({
  className,
  ref,
  ...props
}: CardHeaderProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('header', {
    ...props,
    className: cardHeader({ class: className }),
    ref: forwardedRef,
  });
}

/** Renders the canonical level-three card heading. */
export function Title({
  className,
  ref,
  ...props
}: CardTitleProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('h3', {
    ...props,
    className: cardTitle({ class: className }),
    ref: forwardedRef,
  });
}

/** Renders supporting context directly associated with a card title. */
export function Description({
  className,
  ref,
  ...props
}: CardDescriptionProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('p', {
    ...props,
    className: cardDescription({ class: className }),
    ref: forwardedRef,
  });
}

/** Renders the primary card content region. */
export function Body({
  className,
  ref,
  ...props
}: CardBodyProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('div', {
    ...props,
    className: cardBody({ class: className }),
    ref: forwardedRef,
  });
}

/** Renders a supporting action or metadata footer. */
export function Footer({
  className,
  ref,
  ...props
}: CardFooterProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('footer', {
    ...props,
    className: cardFooter({ class: className }),
    ref: forwardedRef,
  });
}

/**
 * Groups one related content summary in a domain-neutral compound surface.
 *
 * @summary compound surface for one related content summary
 */
export const Card = {
  /** Primary content region. */
  Body,
  /** Supporting title context. */
  Description,
  /** Supporting action or metadata region. */
  Footer,
  /** Title and description region. */
  Header,
  /** Semantic article container. */
  Root,
  /** Canonical level-three card heading. */
  Title,
};
