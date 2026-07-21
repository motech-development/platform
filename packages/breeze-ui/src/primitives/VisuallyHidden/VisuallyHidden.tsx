import type { HTMLAttributes, Ref } from 'react';
import { createElement } from 'react';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Props for content exposed to assistive technology but hidden visually. */
export interface VisuallyHiddenProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Ref to the rendered span. */
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Preserves accessible content while removing it from visual layout.
 *
 * @summary visually concealed span that remains available to assistive technology
 */
export function VisuallyHidden({
  className,
  ref,
  ...props
}: VisuallyHiddenProps) {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement('span', {
    ...props,
    className: [
      'absolute size-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]',
      className,
    ]
      .filter(Boolean)
      .join(' '),
    ref: forwardedRef,
  });
}
