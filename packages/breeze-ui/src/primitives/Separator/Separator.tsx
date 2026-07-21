import type { ElementType, HTMLAttributes, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const separator = tv({
  base: 'm-0 shrink-0 border-0 bg-current',
  defaultVariants: {
    orientation: 'horizontal',
    tone: 'default',
  },
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full min-h-4 w-px self-stretch',
    },
    tone: {
      default: 'text-[var(--breeze-border)]',
      strong: 'text-[var(--breeze-border-strong)]',
    },
  },
});

type SeparatorNativeProps = Omit<
  HTMLAttributes<HTMLElement>,
  'aria-orientation' | 'children' | 'role' | 'style'
>;

/** Props for a visual or semantic divider between related regions. */
export interface SeparatorProps extends SeparatorNativeProps {
  /** Hides the divider from assistive technology. Defaults to `false`. */
  decorative?: boolean;
  /** Divider axis. Defaults to `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** Ref to the rendered HTML element. */
  ref?: Ref<HTMLElement>;
  /** Visual border emphasis. Defaults to `default`. */
  tone?: 'default' | 'strong';
}

/**
 * Separates related regions and exposes separator semantics unless marked as
 * decorative.
 *
 * @summary semantic or decorative horizontal and vertical divider
 */
export function Separator({
  className,
  decorative = false,
  orientation = 'horizontal',
  ref,
  tone,
  ...props
}: Readonly<SeparatorProps>) {
  useBreezeContext();

  const Element: ElementType = orientation === 'horizontal' ? 'hr' : 'div';
  const forwardedRef = useForwardedRef(ref);

  return createElement(Element, {
    ...props,
    'aria-hidden': decorative || undefined,
    'aria-orientation':
      !decorative && orientation === 'vertical' ? 'vertical' : undefined,
    className: separator({
      class: className,
      orientation,
      tone,
    }),
    ref: forwardedRef,
    role: decorative ? 'presentation' : 'separator',
  });
}
