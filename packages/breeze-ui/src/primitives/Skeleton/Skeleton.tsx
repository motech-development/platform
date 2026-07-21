import type { ComponentPropsWithoutRef, ReactElement, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const skeleton = tv({
  base: 'animate-pulse motion-reduce:animate-none forced-colors:border forced-colors:border-[CanvasText]',
  defaultVariants: {
    shape: 'text',
    tone: 'default',
  },
  variants: {
    shape: {
      circle: 'size-12 rounded-full',
      rectangle: 'min-h-16',
      text: 'h-3.5 w-full',
    },
    tone: {
      danger: 'bg-[var(--breeze-skeleton-danger)]',
      default: 'bg-[var(--breeze-skeleton)]',
      inverse: 'bg-[var(--breeze-skeleton-inverse)]',
    },
  },
});

/** Visual shapes supported by a loading skeleton. */
export type SkeletonShape = 'circle' | 'rectangle' | 'text';
/** Semantic surface tones supported by loading placeholders. */
export type SkeletonTone = 'default' | 'inverse' | 'danger';
/** Elements supported by a loading skeleton. */
export type SkeletonElement = 'div' | 'span';

type SkeletonElementNode<Element extends SkeletonElement> =
  Element extends 'span' ? HTMLSpanElement : HTMLDivElement;

/** Props for a non-announcing visual loading placeholder. */
export type SkeletonProps<Element extends SkeletonElement = 'div'> = Omit<
  ComponentPropsWithoutRef<Element>,
  'children' | 'role' | 'style'
> & {
  /** Render as a `span` when the placeholder must sit inside text content. */
  as?: Element;
  /** Ref to the rendered placeholder element. */
  ref?: Ref<SkeletonElementNode<Element>>;
  /** Placeholder geometry. Defaults to `text`. */
  shape?: SkeletonShape;
  /** Surface-aware placeholder colour. Defaults to `default`. */
  tone?: SkeletonTone;
};

/**
 * Reserves loading layout without adding content to the accessibility tree.
 *
 * @summary non-announcing loading placeholder with canonical shapes
 */
export function Skeleton<Element extends SkeletonElement = 'div'>({
  as,
  className,
  ref,
  shape = 'text',
  tone = 'default',
  ...props
}: Readonly<SkeletonProps<Element>>): ReactElement {
  useBreezeContext();

  const skeletonProps = {
    ...props,
    'aria-hidden': 'true',
    className: skeleton({ class: className, shape, tone }),
    'data-shape': shape,
    'data-tone': tone,
    ref: useForwardedRef(ref),
  };

  return createElement(as ?? 'div', skeletonProps);
}
