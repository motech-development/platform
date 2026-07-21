import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { ResponsiveValue } from '../../internal/styling/responsive';
import { resolveResponsiveClasses } from '../../internal/styling/responsive';
import { useBreezeContext } from '../../provider/BreezeContext';

const orientationClasses = {
  base: {
    horizontal: 'flex-row',
    vertical: 'flex-col items-stretch',
    verticalReverse: 'flex-col-reverse items-stretch',
  },
  lg: {
    horizontal: 'lg:flex-row',
    vertical: 'lg:flex-col lg:items-stretch',
    verticalReverse: 'lg:flex-col-reverse lg:items-stretch',
  },
  md: {
    horizontal: 'md:flex-row',
    vertical: 'md:flex-col md:items-stretch',
    verticalReverse: 'md:flex-col-reverse md:items-stretch',
  },
  sm: {
    horizontal: 'sm:flex-row',
    vertical: 'sm:flex-col sm:items-stretch',
    verticalReverse: 'sm:flex-col-reverse sm:items-stretch',
  },
} as const;

const buttonGroup = tv({
  base: 'flex flex-wrap gap-3',
  defaultVariants: { align: 'start' },
  variants: {
    align: {
      center: 'justify-center',
      end: 'justify-end',
      spaceBetween: 'justify-between',
      start: 'justify-start',
    },
  },
});

/** Props for a related set of application actions. */
export interface ButtonGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Horizontal alignment. Defaults to `start`. */
  align?: 'start' | 'center' | 'end' | 'spaceBetween';
  /** Related Button, LinkButton, or IconButton children. */
  children: ReactNode;
  /** Responsive action-flow direction. Defaults to `horizontal`. */
  orientation?: ResponsiveValue<'horizontal' | 'vertical' | 'verticalReverse'>;
  /** Ref to the rendered group. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Arranges semantically related actions with responsive flow.
 *
 * @summary responsive visual grouping for related application actions
 */
export function ButtonGroup({
  align,
  className,
  orientation = 'horizontal',
  ref,
  ...props
}: Readonly<ButtonGroupProps>): ReactElement {
  useBreezeContext();

  return createElement('div', {
    ...props,
    className: buttonGroup({
      align,
      class: [
        resolveResponsiveClasses(orientation, orientationClasses),
        className,
      ],
    }),
    ref: useForwardedRef(ref),
    role: props.role ?? 'group',
  });
}
