import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement, useId } from 'react';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Props for a visibly titled navigation group. */
export interface NavigationSectionProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'style' | 'title'> {
  /** Navigation destinations, commonly NavigationList.Item elements. */
  children: ReactNode;
  /** Ref to the rendered navigation landmark. */
  ref?: Ref<HTMLElement>;
  /** Persistent visible navigation-group title. */
  title: ReactNode;
}

/**
 * Groups related destinations under one visible navigation heading.
 *
 * @summary labelled navigation landmark for related destinations
 */
export function NavigationSection({
  children,
  className,
  ref,
  title,
  ...props
}: Readonly<NavigationSectionProps>): ReactElement {
  useBreezeContext();

  const titleId = useId();

  return createElement(
    'nav',
    {
      ...props,
      'aria-labelledby': titleId,
      className: `grid gap-2 ${className ?? ''}`,
      ref: useForwardedRef(ref),
    },
    <>
      <h2
        className="m-0 px-3 font-[family-name:var(--breeze-font-display)] text-base font-bold"
        id={titleId}
      >
        {title}
      </h2>
      {children}
    </>,
  );
}
