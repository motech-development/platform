import type { ReactNode } from 'react';
import { createElement } from 'react';
import getLayoutAccessibility from '../layout.accessibility';
import type { LayoutElement } from '../layout.types';

const variants = {
  base: {
    container:
      'breeze:mx-auto breeze:inline-size-full breeze:min-inline-size-0',
  },
  compound: {},
  size: {
    page: 'breeze:max-inline-breeze-page',
    prose: 'breeze:max-inline-breeze-prose',
    read: 'breeze:max-inline-breeze-read',
  },
  state: {
    padded:
      'breeze:ps-breeze-4 breeze:pe-breeze-4 breeze:breeze-md:ps-breeze-7 breeze:breeze-md:pe-breeze-7',
  },
  variant: {},
} as const;

export type ContainerWidth = keyof typeof variants.size;

export interface ContainerProps {
  /** Names the content boundary when its visible content does not provide a label. */
  'aria-label'?: string;
  /** Content constrained by the container. */
  children: ReactNode;
  /** Selects the semantic HTML element. Defaults to `div`. */
  element?: LayoutElement;
  /** Adds responsive inline page gutters. Defaults to `true`. */
  padded?: boolean;
  /** Selects the maximum content measure. Defaults to `page`. */
  width?: ContainerWidth;
}

/**
 * Centres content within a named Breeze reading or page measure.
 *
 * @summary A responsive, token-constrained content container.
 */
export function Container({
  'aria-label': ariaLabel,
  children,
  element = 'div',
  padded = true,
  width = 'page',
}: Readonly<ContainerProps>) {
  const { accessibleLabel, role } = getLayoutAccessibility(ariaLabel, element);

  return createElement(
    element,
    {
      'aria-label': accessibleLabel,
      className: [
        variants.base.container,
        variants.size[width],
        padded && variants.state.padded,
      ]
        .filter(Boolean)
        .join(' '),
      role,
    },
    children,
  );
}
