import type { HTMLAttributes, ReactElement, Ref } from 'react';
import { createElement } from 'react';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Units accepted by locale-aware relative-time output. */
export type RelativeTimeUnit = Intl.RelativeTimeFormatUnit;

/** Props for locale-aware relative-time output. */
export interface RelativeTimeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'style'> {
  /** `Intl.RelativeTimeFormat` options. */
  options?: Intl.RelativeTimeFormatOptions;
  /** Ref to the rendered span. */
  ref?: Ref<HTMLSpanElement>;
  /** Unit applied to the relative value. */
  unit: RelativeTimeUnit;
  /** Signed distance from the reference time. */
  value: number;
}

/**
 * Formats an application-calculated relative duration in the provider locale.
 *
 * @summary locale-aware relative duration from an application-owned value
 */
export function RelativeTime({
  options,
  ref,
  unit,
  value,
  ...props
}: Readonly<RelativeTimeProps>): ReactElement {
  const { locale } = useBreezeContext();
  const forwardedRef = useForwardedRef(ref);

  return createElement(
    'span',
    {
      ...props,
      ref: forwardedRef,
    },
    new Intl.RelativeTimeFormat(locale, options).format(value, unit),
  );
}
