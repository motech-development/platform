import type { HTMLAttributes, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const logo = tv({
  base: 'inline-flex items-center',
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'text-2xl',
      md: 'text-xl',
      sm: 'text-base',
    },
  },
});

/** Props for the canonical Motech Development mark. */
export interface LogoProps
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    | 'aria-hidden'
    | 'aria-label'
    | 'aria-labelledby'
    | 'children'
    | 'color'
    | 'style'
  > {
  /** Ref to the rendered span. */
  ref?: Ref<HTMLSpanElement>;
  /** Canonical logo size. Defaults to `md`. */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Renders the canonical Motech Development mark without application-owned text.
 *
 * @summary canonical accessible Motech Development brand mark
 */
export function Logo({ className, ref, size, ...props }: Readonly<LogoProps>) {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement(
    'span',
    {
      ...props,
      'aria-label': 'Motech Development',
      className: logo({
        class: className,
        size,
      }),
      ref: forwardedRef,
      role: 'img',
    },
    <svg
      aria-hidden="true"
      className="h-[1.2em] w-[1.04em]"
      viewBox="0 0 345.21 398.61"
    >
      <polygon
        fill="var(--breeze-brand-mark)"
        points="172.6 199.31 57.53 132.87 57.53 332.18 0 298.96 0 99.65 172.6 0 345.21 99.65 345.21 298.96 287.67 332.18 287.67 132.87 172.6 199.31"
      />
      <polygon
        fill="var(--breeze-brand-mark)"
        points="115.07 365.39 115.07 232.53 172.6 265.74 230.14 232.53 230.14 365.39 172.6 398.61 115.07 365.39"
      />
    </svg>,
  );
}
