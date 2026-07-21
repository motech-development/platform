import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import {
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
} from 'react-aria-components/DateField';
import type { DateSegment as InternalDateSegment } from 'react-stately/useDateFieldState';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';

const inputStyle = tv({
  base: 'flex min-h-10 items-center gap-0.5 border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] px-3 text-sm data-[focus-within]:outline-2 data-[focus-within]:outline-[var(--breeze-focus)] data-[invalid]:border-[var(--breeze-danger)]',
});
const segmentStyle = tv({
  base: 'rounded-sm px-0.5 outline-none data-[focused]:bg-[var(--breeze-primary)] data-[focused]:text-white data-[placeholder]:text-[var(--breeze-ink-muted)]',
});
const timeZoneStyle = tv({
  base: 'cursor-default select-none px-0.5 text-[var(--breeze-ink)]',
});

/** Props for a Breeze-owned segmented date or time input. */
export interface DateInputPartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  /** Ref to the rendered segment group. */
  ref?: Ref<HTMLDivElement>;
}

function renderSegment(segment: InternalDateSegment): ReactElement {
  if (segment.type === 'timeZoneName') {
    return createElement(
      'span',
      {
        className: timeZoneStyle(),
        'data-breeze-time-zone': '',
        'data-type': segment.type,
      },
      segment.text,
    );
  }

  return createElement(AriaDateSegment, {
    className: segmentStyle(),
    segment,
  });
}

/** Renders React Aria segments without exposing their internal value objects. */
export function DateInputPart({
  className,
  ref,
  ...props
}: DateInputPartProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(
    AriaDateInput,
    {
      ...props,
      className: inputStyle({ class: className }),
      ref: forwardedRef,
    } as ComponentProps<typeof AriaDateInput>,
    renderSegment as unknown as ReactNode,
  );
}
