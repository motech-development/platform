import type { HTMLAttributes, ReactElement, Ref } from 'react';
import { createElement } from 'react';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Props for locale-aware date and time output. */
export interface FormattedDateTimeProps
  extends Omit<
    HTMLAttributes<HTMLTimeElement>,
    'children' | 'dateTime' | 'style'
  > {
  /** `Intl.DateTimeFormat` options applied using provider locale and time zone. */
  options?: Intl.DateTimeFormatOptions;
  /** Ref to the rendered time element. */
  ref?: Ref<HTMLTimeElement>;
  /** ISO 8601 value with an explicit offset. */
  value: string;
}

/**
 * Formats an ISO date-time while preserving its machine-readable value.
 *
 * @summary locale-aware date-time output with machine-readable semantics
 */
export function FormattedDateTime({
  options,
  ref,
  value,
  ...props
}: Readonly<FormattedDateTimeProps>): ReactElement {
  const { locale, timeZone } = useBreezeContext();
  const forwardedRef = useForwardedRef(ref);
  const resolvedOptions =
    timeZone === undefined
      ? options
      : {
          ...options,
          timeZone,
        };

  return createElement(
    'time',
    {
      ...props,
      dateTime: value,
      ref: forwardedRef,
    },
    new Intl.DateTimeFormat(locale, resolvedOptions).format(new Date(value)),
  );
}
