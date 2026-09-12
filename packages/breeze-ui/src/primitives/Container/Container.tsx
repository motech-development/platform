import type { ReactNode } from 'react';
import { createElement } from 'react';
import { useBreezeContext } from '../../provider/BreezeContext';
import type { LayoutElement } from '../layout.types';
import { Skeleton } from '../Skeleton/Skeleton';

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
  'aria-label'?: string;
  children: ReactNode;
  element?: LayoutElement;
  loading?: boolean;
  padded?: boolean;
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
  loading = false,
  padded = true,
  width = 'page',
}: Readonly<ContainerProps>) {
  const { messages } = useBreezeContext();
  const accessibleLabel = ariaLabel?.trim() || undefined;

  return createElement(
    element,
    {
      'aria-busy': loading || undefined,
      'aria-label': accessibleLabel,
      className: [
        variants.base.container,
        variants.size[width],
        padded && variants.state.padded,
      ]
        .filter(Boolean)
        .join(' '),
      role:
        accessibleLabel !== undefined && element === 'div'
          ? 'group'
          : undefined,
    },
    loading ? (
      <Skeleton
        blockSize={96}
        inlineSize="100%"
        label={messages.loading}
        shape="rectangle"
      />
    ) : (
      children
    ),
  );
}
