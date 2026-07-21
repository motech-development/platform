import type { HTMLAttributes, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type {
  VisualAppearance,
  VisualVariant,
} from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';

const badge = tv({
  base: 'inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-0.5 font-[family-name:var(--breeze-font-display)] text-xs font-bold leading-none',
  compoundVariants: [
    { appearance: 'solid', class: 'text-white', variant: 'primary' },
    {
      appearance: 'solid',
      class: 'bg-[var(--breeze-primary)]',
      variant: 'primary',
    },
    {
      appearance: 'solid',
      class: 'bg-[var(--breeze-danger)] text-white',
      variant: 'danger',
    },
    {
      appearance: 'solid',
      class: 'bg-[var(--breeze-success)] text-white',
      variant: 'success',
    },
    {
      appearance: 'solid',
      class: 'bg-[var(--breeze-warning)] text-white',
      variant: 'warning',
    },
    {
      appearance: 'solid',
      class: 'bg-[var(--breeze-info)] text-white',
      variant: 'info',
    },
    {
      appearance: 'solid',
      class: 'bg-[var(--breeze-shell)] text-white',
      variant: 'dark',
    },
    {
      appearance: 'solid',
      class: 'bg-[var(--breeze-surface)]',
      variant: 'light',
    },
    {
      appearance: 'solid',
      class: 'bg-[var(--breeze-ink-soft)] text-white',
      variant: 'secondary',
    },
    {
      appearance: 'subtle',
      class: 'bg-[var(--breeze-primary-soft)]',
      variant: 'primary',
    },
    {
      appearance: 'subtle',
      class: 'bg-[var(--breeze-danger-soft)]',
      variant: 'danger',
    },
    {
      appearance: 'subtle',
      class: 'bg-[var(--breeze-success-soft)]',
      variant: 'success',
    },
    {
      appearance: 'subtle',
      class: 'bg-[var(--breeze-warning-soft)]',
      variant: 'warning',
    },
    {
      appearance: 'subtle',
      class: 'bg-[var(--breeze-info-soft)]',
      variant: 'info',
    },
    {
      appearance: 'subtle',
      class: 'bg-[var(--breeze-shell-soft)] text-white',
      variant: 'dark',
    },
    {
      appearance: 'subtle',
      class: 'bg-[var(--breeze-surface)]',
      variant: 'light',
    },
    {
      appearance: 'subtle',
      class: 'bg-[var(--breeze-surface-subtle)]',
      variant: 'secondary',
    },
  ],
  defaultVariants: {
    appearance: 'subtle',
    variant: 'secondary',
  },
  variants: {
    appearance: {
      ghost: 'border-transparent bg-transparent',
      outline: 'bg-transparent',
      solid: '',
      subtle: '',
    },
    variant: {
      danger: 'border-[var(--breeze-danger)] text-[var(--breeze-danger)]',
      dark: 'border-[var(--breeze-shell)] text-[var(--breeze-shell)]',
      info: 'border-[var(--breeze-info)] text-[var(--breeze-info)]',
      light: 'border-[var(--breeze-border)] text-[var(--breeze-ink-soft)]',
      primary: 'border-[var(--breeze-primary)] text-[var(--breeze-primary)]',
      secondary:
        'border-[var(--breeze-border-strong)] text-[var(--breeze-ink-soft)]',
      success: 'border-[var(--breeze-success)] text-[var(--breeze-success)]',
      warning: 'border-[var(--breeze-warning)] text-[var(--breeze-warning)]',
    },
  },
});

/** Props for a compact status or classification label. */
export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Visual emphasis treatment. Defaults to `subtle`. */
  appearance?: VisualAppearance;
  /** Ref to the rendered span. */
  ref?: Ref<HTMLSpanElement>;
  /** Semantic colour. Defaults to `secondary`. */
  variant?: VisualVariant;
}

/**
 * Renders a non-interactive status or classification label.
 *
 * @summary non-interactive status or classification label
 */
export function Badge({
  appearance,
  className,
  ref,
  variant,
  ...props
}: BadgeProps) {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement('span', {
    ...props,
    className: badge({
      appearance,
      class: className,
      variant,
    }),
    ref: forwardedRef,
  });
}
