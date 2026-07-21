import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { ControlSize, VisualVariant } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';

const iconTile = tv({
  base: 'inline-flex shrink-0 items-center justify-center font-[family-name:var(--breeze-font-display)] font-bold forced-colors:border forced-colors:border-[CanvasText]',
  defaultVariants: {
    bordered: true,
    shape: 'square',
    size: 'md',
    variant: 'primary',
  },
  variants: {
    bordered: {
      false: 'border-0',
      true: 'border',
    },
    shape: {
      circle: 'rounded-full',
      square: 'rounded-none',
    },
    size: {
      lg: 'size-14 text-2xl',
      md: 'size-10 text-xl',
      sm: 'size-9 text-base',
    },
    variant: {
      danger:
        'border-[var(--breeze-danger)] bg-[var(--breeze-danger-soft)] text-[var(--breeze-danger)]',
      dark: 'border-[var(--breeze-shell)] bg-[var(--breeze-shell)] text-white',
      info: 'border-[var(--breeze-info)] bg-[var(--breeze-info-soft)] text-[var(--breeze-info)]',
      light:
        'border-[var(--breeze-border)] bg-[var(--breeze-surface)] text-[var(--breeze-ink)]',
      neutral:
        'border-[var(--breeze-neutral)] bg-[var(--breeze-neutral-soft)] text-[var(--breeze-neutral)]',
      primary:
        'border-[var(--breeze-primary)] bg-[var(--breeze-primary-soft)] text-[var(--breeze-primary)]',
      secondary:
        'border-[var(--breeze-border-strong)] bg-[var(--breeze-surface-subtle)] text-[var(--breeze-ink-soft)]',
      success:
        'border-[var(--breeze-success)] bg-[var(--breeze-success-soft)] text-[var(--breeze-success)]',
      warning:
        'border-[var(--breeze-warning)] bg-[var(--breeze-warning-soft)] text-[var(--breeze-warning)]',
    },
  },
});

/** Semantic colours supported by a presentation tile. */
export type IconTileVariant = VisualVariant | 'neutral';

/** Props for a semantic visual-marker tile. */
export interface IconTileProps
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    'aria-hidden' | 'children' | 'style'
  > {
  /** Adds the semantic variant border. Defaults to `true`. */
  bordered?: boolean;
  /** The visual marker content rendered inside the tile. */
  children: ReactNode;
  /** Hides marker content from assistive technology. Defaults to `true`. */
  decorative?: boolean;
  /** Ref to the rendered span. */
  ref?: Ref<HTMLSpanElement>;
  /** Square or circular marker geometry. Defaults to `square`. */
  shape?: 'circle' | 'square';
  /** Canonical tile size. Defaults to `md`. */
  size?: ControlSize;
  /** Semantic colour. Defaults to `primary`. */
  variant?: IconTileVariant;
}

/**
 * Presents decorative or meaningful marker content with canonical geometry,
 * sizing, and constrained semantic colour emphasis.
 *
 * @summary semantic presentation tile for icons and short markers
 */
export function IconTile({
  bordered = true,
  children,
  className,
  decorative = true,
  ref,
  shape = 'square',
  size = 'md',
  variant = 'primary',
  ...props
}: Readonly<IconTileProps>) {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement(
    'span',
    {
      ...props,
      'aria-hidden': decorative ? true : undefined,
      className: iconTile({
        bordered,
        class: className,
        shape,
        size,
        variant,
      }),
      'data-bordered': bordered,
      'data-size': size,
      'data-variant': variant,
      ref: forwardedRef,
    },
    children,
  );
}
