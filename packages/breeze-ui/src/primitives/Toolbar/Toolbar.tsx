import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { Toolbar as AriaToolbar } from 'react-aria-components/Toolbar';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const toolbar = tv({
  base: 'flex gap-2',
  defaultVariants: {
    orientation: 'horizontal',
  },
  variants: {
    orientation: {
      horizontal: 'flex-row items-center',
      vertical: 'flex-col items-stretch',
    },
  },
});

/** Props for a keyboard-navigable collection of related controls. */
export interface ToolbarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  /** Related interactive controls. */
  children: ReactNode;
  /** Arrow-key navigation axis. Defaults to `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** Ref to the rendered toolbar. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Groups related controls under toolbar semantics and arrow-key navigation.
 *
 * @summary related controls with orientation-aware arrow navigation
 */
export function Toolbar({
  children,
  className,
  orientation,
  ref,
  ...props
}: Readonly<ToolbarProps>): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement(
    AriaToolbar,
    {
      ...props,
      className: toolbar({
        class: className,
        orientation,
      }),
      orientation,
      ref: forwardedRef,
    },
    children,
  );
}
