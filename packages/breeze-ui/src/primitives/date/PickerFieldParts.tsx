import type { ReactElement } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import { CalendarIcon } from '../../icons';
import { DateInputPart, type DateInputPartProps } from './DateInput';
import {
  PickerGroupPart,
  type PickerGroupPartProps,
  PickerTriggerPart,
  type PickerTriggerPartProps,
} from './PickerParts';

export const pickerFieldRootStyle = tv({
  base: 'group/picker-field flex w-full min-w-0 flex-col gap-1.5',
});
const pickerFieldGroupStyle = tv({
  base: 'flex min-h-11 w-full min-w-0 items-stretch border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-[var(--breeze-ink)] outline-none transition-colors duration-[var(--breeze-duration-fast)] data-[disabled]:cursor-not-allowed data-[disabled]:bg-[var(--breeze-surface-subtle)] data-[disabled]:opacity-70 data-[focus-within]:outline-2 data-[focus-within]:outline-offset-[-2px] data-[focus-within]:outline-[var(--breeze-focus)] data-[hovered]:border-[var(--breeze-primary)] data-[invalid]:!border-[var(--breeze-danger)] group-data-[readonly]/picker-field:bg-[var(--breeze-surface-subtle)] group-data-[readonly]/picker-field:opacity-70',
});
const pickerFieldInputStyle = tv({
  base: 'min-h-11 min-w-0 flex-1 border-0 bg-transparent px-2 font-[family-name:var(--breeze-font-body)] text-base font-normal leading-[1.4] data-[focus-within]:outline-none data-[invalid]:border-0 [&_[data-type]]:px-0 sm:px-3',
});
const pickerFieldTriggerStyle = tv({
  base: 'min-h-11 shrink-0 border-0 bg-transparent px-2 text-[var(--breeze-primary)] outline-none data-[disabled]:cursor-not-allowed data-[focus-visible]:outline-none sm:px-3',
});

export type PickerFieldGroupPartProps = PickerGroupPartProps;
export type PickerFieldInputPartProps = DateInputPartProps;
export type PickerFieldTriggerPartProps = PickerTriggerPartProps;

export function PickerFieldGroupPart({
  className,
  ...props
}: Readonly<PickerFieldGroupPartProps>): ReactElement {
  return createElement(PickerGroupPart, {
    ...props,
    className: pickerFieldGroupStyle({ class: className }),
  });
}

export function PickerFieldInputPart({
  className,
  ...props
}: Readonly<PickerFieldInputPartProps>): ReactElement {
  return createElement(DateInputPart, {
    ...props,
    className: pickerFieldInputStyle({ class: className }),
  });
}

export function PickerFieldTriggerPart({
  children,
  className,
  ...props
}: Readonly<PickerFieldTriggerPartProps>): ReactElement {
  return createElement(
    PickerTriggerPart,
    {
      ...props,
      className: pickerFieldTriggerStyle({ class: className }),
    },
    children === undefined
      ? createElement(CalendarIcon, { size: '1.25rem' })
      : children,
  );
}
