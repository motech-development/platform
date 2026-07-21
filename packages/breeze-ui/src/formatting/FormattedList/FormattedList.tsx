import type { HTMLAttributes, ReactElement, Ref } from 'react';
import { createElement } from 'react';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Props for locale-aware list output. */
export interface FormattedListProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'style'> {
  /** `Intl.ListFormat` options. */
  options?: Intl.ListFormatOptions;
  /** Ref to the rendered span. */
  ref?: Ref<HTMLSpanElement>;
  /** Ordered text values to join. */
  values: readonly string[];
}

/**
 * Joins an ordered text list using the provider locale.
 *
 * @summary locale-aware inline conjunction or disjunction text
 */
export function FormattedList({
  options,
  ref,
  values,
  ...props
}: Readonly<FormattedListProps>): ReactElement {
  const { locale } = useBreezeContext();
  const forwardedRef = useForwardedRef(ref);

  return createElement(
    'span',
    {
      ...props,
      ref: forwardedRef,
    },
    new Intl.ListFormat(locale, options).format(values),
  );
}
