import type { CalendarDate } from '@internationalized/date';
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
  TableHTMLAttributes,
} from 'react';
import { createElement } from 'react';
import {
  Button as AriaButton,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  CalendarHeading as AriaCalendarHeading,
} from 'react-aria-components/Calendar';
import { tv } from 'tailwind-variants';
import { ArrowLeftIcon, ArrowRightIcon } from '../../icons';
import useForwardedRef from '../../internal/hooks/useForwardedRef';

const headerStyle = tv({
  base: 'grid h-11 w-full grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center bg-[var(--breeze-shell-soft)] text-white',
});
const buttonStyle = tv({
  base: 'grid size-11 place-items-center justify-self-center border-0 bg-transparent p-0 text-white outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-[-2px] data-[focus-visible]:outline-[var(--breeze-focus)] data-[hovered]:bg-white/10',
});
const headingStyle = tv({
  base: 'text-center font-[family-name:var(--breeze-font-display)] text-base font-bold',
});
const gridStyle = tv({
  base: "w-full table-fixed border-separate border-spacing-0 [&_tbody]:before:table-row [&_tbody]:before:h-1 [&_tbody]:before:content-[''] [&_th]:h-9 [&_th]:text-center [&_th]:font-[family-name:var(--breeze-font-display)] [&_th]:text-base [&_th]:font-bold [&_th]:text-[var(--breeze-ink-muted)]",
});
const cellStyle = tv({
  base: 'grid h-11 w-full place-items-center text-center font-[family-name:var(--breeze-font-body)] text-base font-normal outline-none data-[focused]:outline-2 data-[focused]:outline-offset-[-2px] data-[focused]:outline-[var(--breeze-focus)] data-[hovered]:bg-[var(--breeze-primary-soft)] data-[selected]:bg-[var(--breeze-primary)] data-[selected]:font-bold data-[selected]:text-white data-[disabled]:opacity-40 data-[outside-month]:invisible data-[unavailable]:line-through',
});

/** Props for a calendar navigation header. */
export interface CalendarHeaderPartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Navigation buttons and visible month heading. */ children?: ReactNode;
  /** Ref to the rendered header. */ ref?: Ref<HTMLDivElement>;
}
/** Props for a calendar navigation button. */
export interface CalendarButtonPartProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'style'> {
  /** Visible button content. Defaults to the directional Breeze arrow icon. */ children?: ReactNode;
  /** Ref to the rendered navigation button. */ ref?: Ref<HTMLButtonElement>;
}
/** Props for the locale-formatted calendar heading. */
export interface CalendarHeadingPartProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'children' | 'style'> {
  /** Ref to the rendered heading. */ ref?: Ref<HTMLHeadingElement>;
}
/** Props for a Breeze-owned calendar grid. */
export interface CalendarGridPartProps
  extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children' | 'style'> {
  /** Ref to the rendered calendar table. */ ref?: Ref<HTMLTableElement>;
  /** Locale weekday label width. Defaults to `short`. */ weekdayStyle?:
    | 'long'
    | 'narrow'
    | 'short';
}

export function CalendarHeaderPart({
  className,
  ref,
  ...props
}: CalendarHeaderPartProps): ReactElement {
  return createElement('div', {
    ...props,
    className: headerStyle({ class: className }),
    ref: useForwardedRef(ref),
  });
}
export function CalendarPreviousButtonPart({
  'aria-label': ariaLabel,
  children,
  className,
  ref,
  ...props
}: CalendarButtonPartProps): ReactElement {
  return createElement(
    AriaButton,
    {
      ...props,
      'aria-label': ariaLabel,
      className: buttonStyle({ class: className }),
      ref: useForwardedRef(ref),
      slot: 'previous',
    } as unknown as ComponentProps<typeof AriaButton>,
    children === undefined
      ? createElement(ArrowLeftIcon, {
          className: 'rtl:rotate-180',
          size: '1.25rem',
        })
      : children,
  );
}
export function CalendarNextButtonPart({
  'aria-label': ariaLabel,
  children,
  className,
  ref,
  ...props
}: CalendarButtonPartProps): ReactElement {
  return createElement(
    AriaButton,
    {
      ...props,
      'aria-label': ariaLabel,
      className: buttonStyle({ class: className }),
      ref: useForwardedRef(ref),
      slot: 'next',
    } as unknown as ComponentProps<typeof AriaButton>,
    children === undefined
      ? createElement(ArrowRightIcon, {
          className: 'rtl:rotate-180',
          size: '1.25rem',
        })
      : children,
  );
}

function renderWeekday(day: string): ReactElement {
  return createElement(AriaCalendarHeaderCell, null, day);
}

function renderCalendarDate(date: CalendarDate): ReactElement {
  return createElement(AriaCalendarCell, {
    className: cellStyle(),
    date,
  });
}
export function CalendarHeadingPart({
  className,
  ref,
  ...props
}: CalendarHeadingPartProps): ReactElement {
  return createElement(AriaCalendarHeading, {
    ...props,
    className: headingStyle({ class: className }),
    ref: useForwardedRef(ref),
  });
}
export function CalendarGridPart({
  className,
  ref,
  weekdayStyle = 'short',
  ...props
}: CalendarGridPartProps): ReactElement {
  return createElement(
    AriaCalendarGrid,
    {
      ...props,
      className: gridStyle({ class: className }),
      ref: useForwardedRef(ref),
      weekdayStyle,
    },
    createElement(
      AriaCalendarGridHeader,
      null,
      renderWeekday as unknown as ReactNode,
    ),
    createElement(
      AriaCalendarGridBody,
      null,
      renderCalendarDate as unknown as ReactNode,
    ),
  );
}
