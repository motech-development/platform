import type { HTMLAttributes, ReactElement, Ref } from 'react';
import { createElement } from 'react';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Props for locale-aware numeric output. */
export interface FormattedNumberProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'style'> {
  /** `Intl.NumberFormat` options applied using the provider locale. */
  options?: Intl.NumberFormatOptions;
  /** Ref to the rendered span. */
  ref?: Ref<HTMLSpanElement>;
  /** Numeric value to format. */
  value: bigint | number;
}

/**
 * Formats a domain-neutral number using the Breeze provider locale.
 *
 * @summary locale-aware domain-neutral numeric output
 */
export function FormattedNumber({
  options,
  ref,
  value,
  ...props
}: Readonly<FormattedNumberProps>): ReactElement {
  const { locale } = useBreezeContext();
  const forwardedRef = useForwardedRef(ref);

  return createElement(
    'span',
    {
      ...props,
      ref: forwardedRef,
    },
    new Intl.NumberFormat(locale, options).format(value),
  );
}
