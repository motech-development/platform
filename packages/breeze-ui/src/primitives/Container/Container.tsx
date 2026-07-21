import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import {
  type LayoutElementProps,
  paddingClasses,
  type ResponsiveSpace,
} from '../../internal/styling/layout';
import { resolveResponsiveClasses } from '../../internal/styling/responsive';
import { useBreezeContext } from '../../provider/BreezeContext';

const container = tv({
  base: 'mx-auto w-full max-w-screen-2xl',
});

const defaultPadding: ResponsiveSpace = {
  base: 'md',
  lg: 'page',
  md: 'xxl',
  sm: 'xl',
};

/** Props for the bounded Breeze application workspace. */
export interface ContainerProps extends LayoutElementProps {
  /** Responsive inline and block gutter. Defaults from `md` at base to `page` at `lg`. */
  padding?: ResponsiveSpace;
}

/**
 * Centers content in a full-width workspace with responsive
 * page gutters.
 *
 * @summary bounded application workspace with responsive page gutters
 */
export function Container({
  className,
  padding = defaultPadding,
  ...props
}: Readonly<ContainerProps>) {
  useBreezeContext();

  return createElement('div', {
    ...props,
    className: container({
      class: [resolveResponsiveClasses(padding, paddingClasses), className],
    }),
  });
}
