import type {
  ButtonHTMLAttributes,
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement, useCallback } from 'react';
import {
  Button as AriaButton,
  Calendar as AriaCalendar,
  Group as AriaGroup,
  Popover as AriaPopover,
} from 'react-aria-components/DatePicker';
import { RangeCalendar as AriaRangeCalendar } from 'react-aria-components/DateRangePicker';
import { tv } from 'tailwind-variants';
import { CalendarIcon } from '../../icons';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';
import {
  CalendarGridPart,
  CalendarHeaderPart,
  CalendarHeadingPart,
  CalendarNextButtonPart,
  CalendarPreviousButtonPart,
} from './CalendarParts';

const groupStyle = tv({ base: 'flex items-stretch' });
const triggerStyle = tv({
  base: 'inline-flex min-h-11 items-center border border-l-0 border-[var(--breeze-border-strong)] px-3',
});
const popoverStyle = tv({
  base: 'z-50 w-88 max-w-[calc(100vw-2rem)] border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] p-3 [box-shadow:0_8px_0_rgb(6_12_24_/_18%)]',
});
const calendarStyle = tv({
  base: 'inline-flex w-full flex-col gap-2.5',
});

/** Supported logical picker popup placements. */
export type PickerPopoverPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top start'
  | 'top end'
  | 'bottom start'
  | 'bottom end';

/** Props for a picker input-and-trigger group. */
export interface PickerGroupPartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Segmented input and calendar trigger. */ children: ReactNode;
  /** Ref to the rendered group. */ ref?: Ref<HTMLDivElement>;
}
/** Props for a picker calendar trigger. */
export interface PickerTriggerPartProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'style'> {
  /** Visible trigger content. Defaults to the Breeze calendar icon. */ children?: ReactNode;
  /** Ref to the rendered trigger. */ ref?: Ref<HTMLButtonElement>;
}
/** Props for a picker calendar popover. */
export interface PickerPopoverPartProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Calendar content. */ children: ReactNode;
  /** Logical placement relative to the field trigger. */ placement?: PickerPopoverPlacement;
  /** Ref to the rendered popover. */ ref?: Ref<HTMLElement>;
}
/** Props for a Breeze-owned picker calendar. */
export interface PickerCalendarPartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  /** Ref to the rendered calendar. */ ref?: Ref<HTMLDivElement>;
}

export function PickerGroupPart({
  children,
  className,
  ref,
  ...props
}: PickerGroupPartProps): ReactElement {
  return createElement(
    AriaGroup,
    {
      ...props,
      className: groupStyle({ class: className }),
      ref: useForwardedRef(ref),
    } as ComponentProps<typeof AriaGroup>,
    children,
  );
}
export function PickerTriggerPart({
  children,
  className,
  ref,
  ...props
}: PickerTriggerPartProps): ReactElement {
  return createElement(
    AriaButton,
    {
      ...props,
      className: triggerStyle({ class: className }),
      ref: useForwardedRef(ref),
    } as unknown as ComponentProps<typeof AriaButton>,
    children === undefined ? createElement(CalendarIcon) : children,
  );
}
export function PickerPopoverPart({
  children,
  className,
  dir,
  placement,
  ref,
  ...props
}: PickerPopoverPartProps): ReactElement {
  const { direction } = useBreezeContext();
  const forwardedRef = useForwardedRef(ref);
  const resolvedDirection = dir ?? direction;
  const popoverRef = useCallback(
    (element: HTMLElement | null) => {
      element?.setAttribute('dir', resolvedDirection);
      forwardedRef(element);
    },
    [forwardedRef, resolvedDirection],
  );

  return createElement(
    AriaPopover,
    {
      ...props,
      className: popoverStyle({ class: className }),
      placement,
      ref: popoverRef,
    } as ComponentProps<typeof AriaPopover>,
    children,
  );
}
const calendarChildren = (): ReactElement[] => [
  createElement(
    CalendarHeaderPart,
    { className: '-mx-3 -mt-3 w-[calc(100%+1.5rem)]', key: 'header' },
    createElement(CalendarPreviousButtonPart, { key: 'previous' }),
    createElement(CalendarHeadingPart, { key: 'heading' }),
    createElement(CalendarNextButtonPart, { key: 'next' }),
  ),
  createElement(CalendarGridPart, { key: 'grid' }),
];
export function PickerCalendarPart({
  className,
  ref,
  ...props
}: PickerCalendarPartProps): ReactElement {
  return createElement(
    AriaCalendar,
    {
      ...props,
      className: calendarStyle({ class: className }),
      ref: useForwardedRef(ref),
    } as ComponentProps<typeof AriaCalendar>,
    calendarChildren(),
  );
}
export function PickerRangeCalendarPart({
  className,
  ref,
  ...props
}: PickerCalendarPartProps): ReactElement {
  return createElement(
    AriaRangeCalendar,
    {
      ...props,
      className: calendarStyle({ class: className }),
      ref: useForwardedRef(ref),
    } as ComponentProps<typeof AriaRangeCalendar>,
    calendarChildren(),
  );
}
