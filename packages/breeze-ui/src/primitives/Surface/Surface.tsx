import type { ElementType, HTMLAttributes, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import {
  paddingClasses,
  type ResponsiveSpace,
} from '../../internal/styling/layout';
import { resolveResponsiveClasses } from '../../internal/styling/responsive';
import { useBreezeContext } from '../../provider/BreezeContext';

const surface = tv({
  defaultVariants: {
    border: 'default',
    tone: 'default',
  },
  variants: {
    border: {
      default: 'border border-b-2 border-[var(--breeze-border)]',
      none: 'border-0',
      strong: 'border border-b-2 border-[var(--breeze-border-strong)]',
    },
    tone: {
      canvas: 'bg-[var(--breeze-canvas)] text-[var(--breeze-ink)]',
      default: 'bg-[var(--breeze-surface)] text-[var(--breeze-ink)]',
      inverse: 'bg-[var(--breeze-shell)] text-[var(--breeze-ink-inverse)]',
      subtle: 'bg-[var(--breeze-surface-subtle)] text-[var(--breeze-ink)]',
    },
  },
});

type SurfaceElement = 'article' | 'div' | 'section';

/** Props for a canonical Breeze background and inset container. */
export interface SurfaceProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Constrained semantic element. Defaults to `div`. */
  as?: SurfaceElement;
  /** Border emphasis. Defaults to `default`. */
  border?: 'none' | 'default' | 'strong';
  /** Responsive inset spacing. Defaults to `lg`. */
  padding?: ResponsiveSpace;
  /** Ref to the rendered HTML element. */
  ref?: Ref<HTMLElement>;
  /** Semantic surface colour treatment. Defaults to `default`. */
  tone?: 'default' | 'subtle' | 'canvas' | 'inverse';
}

/**
 * Renders a canonical background, border, and responsive inset treatment with
 * a constrained neutral or semantic section element.
 *
 * @summary canonical inset surface with bounded semantic elements
 */
export function Surface({
  as = 'div',
  border,
  className,
  padding = 'lg',
  ref,
  tone,
  ...props
}: SurfaceProps) {
  useBreezeContext();

  const Element: ElementType = as;
  const forwardedRef = useForwardedRef(ref);

  return createElement(Element, {
    ...props,
    className: surface({
      border,
      class: [resolveResponsiveClasses(padding, paddingClasses), className],
      tone,
    }),
    ref: forwardedRef,
  });
}
