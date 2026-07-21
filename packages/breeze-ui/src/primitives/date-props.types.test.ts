import { describe, expectTypeOf, it } from 'vitest';
import type { DateRangeValue } from '../internal/types/date';
import type {
  CalendarButtonProps,
  CalendarRootProps,
} from './Calendar/Calendar';
import type { DateFieldRootProps } from './DateField/DateField';
import type {
  DatePickerPopoverProps,
  DatePickerRootProps,
  DatePickerTriggerProps,
} from './DatePicker/DatePicker';
import type {
  DateRangePickerRootProps,
  DateRangePickerSeparatorProps,
  DateRangePickerTriggerProps,
} from './DateRangePicker/DateRangePicker';
import type {
  DateTimePickerRootProps,
  DateTimePickerTriggerProps,
} from './DateTimePicker/DateTimePicker';
import type {
  RangeCalendarButtonProps,
  RangeCalendarRootProps,
} from './RangeCalendar/RangeCalendar';
import type { TimeFieldRootProps } from './TimeField/TimeField';

type DefaultIconControlProps = Record<string, never>;

describe('date and time public contracts', () => {
  it('enforces stable controlled, uncontrolled, and read-only values', () => {
    expectTypeOf<{
      children: null;
      onChange: (value: string | null) => void;
      value: string | null;
    }>().toMatchTypeOf<DateFieldRootProps>();
    expectTypeOf<{
      children: null;
      readOnly: true;
      value: string | null;
    }>().toMatchTypeOf<TimeFieldRootProps>();
    expectTypeOf<{
      children: null;
      defaultValue: string;
    }>().toMatchTypeOf<DatePickerRootProps>();
    expectTypeOf<{
      children: null;
      value: string;
    }>().not.toMatchTypeOf<DateTimePickerRootProps>();
    expectTypeOf<{
      children: null;
      onChange: (value: DateRangeValue | null) => void;
      value: DateRangeValue | null;
    }>().toMatchTypeOf<DateRangePickerRootProps>();
    expectTypeOf<{
      children: null;
      defaultValue: DateRangeValue;
      endName: string;
      startName: string;
    }>().toMatchTypeOf<DateRangePickerRootProps>();
    expectTypeOf<{
      children: null;
      startName: string;
    }>().not.toMatchTypeOf<DateRangePickerRootProps>();
    expectTypeOf<{
      children: null;
      endName: string;
    }>().not.toMatchTypeOf<DateRangePickerRootProps>();
    expectTypeOf<{
      children: null;
      defaultValue: DateRangeValue;
    }>().toMatchTypeOf<RangeCalendarRootProps>();
    expectTypeOf<{
      children: null;
      readOnly: true;
      value: string;
    }>().toMatchTypeOf<CalendarRootProps>();
  });

  it('does not expose React Aria or internationalized date props', () => {
    expectTypeOf<DateFieldRootProps>().not.toHaveProperty('isDisabled');
    expectTypeOf<DatePickerRootProps>().not.toHaveProperty('validationState');
    expectTypeOf<DateRangePickerRootProps>().not.toHaveProperty(
      'visibleDuration',
    );
    expectTypeOf<DateRangePickerRootProps>().not.toHaveProperty('name');
    expectTypeOf<DateTimePickerRootProps>().not.toHaveProperty('granularity');
    expectTypeOf<CalendarRootProps>().not.toHaveProperty('visibleDuration');
    expectTypeOf<RangeCalendarRootProps>().not.toHaveProperty('createCalendar');
  });

  it('exposes typed logical picker popover placement', () => {
    expectTypeOf<{
      children: null;
      placement: 'bottom end';
    }>().toMatchTypeOf<DatePickerPopoverProps>();
    expectTypeOf<{
      children: null;
      placement: 'center';
    }>().not.toMatchTypeOf<DatePickerPopoverProps>();
  });

  it('allows shared calendar controls to use their default icons', () => {
    expectTypeOf<DefaultIconControlProps>().toMatchTypeOf<CalendarButtonProps>();
    expectTypeOf<DefaultIconControlProps>().toMatchTypeOf<RangeCalendarButtonProps>();
    expectTypeOf<DefaultIconControlProps>().toMatchTypeOf<DatePickerTriggerProps>();
    expectTypeOf<DefaultIconControlProps>().toMatchTypeOf<DateRangePickerTriggerProps>();
    expectTypeOf<DefaultIconControlProps>().toMatchTypeOf<DateRangePickerSeparatorProps>();
    expectTypeOf<DefaultIconControlProps>().toMatchTypeOf<DateTimePickerTriggerProps>();
  });
});
