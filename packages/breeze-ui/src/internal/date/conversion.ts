import {
  type CalendarDate,
  parseAbsolute,
  parseDate,
  parseTime,
  type Time,
  type ZonedDateTime,
} from '@internationalized/date';
import type { DateRangeValue } from '../types/date';

const EXPLICIT_OFFSET = /(?:Z|[+-]\d{2}:\d{2})$/;

const pad = (value: number): string => String(value).padStart(2, '0');

/** Internal parsed date range used only at the React Aria boundary. */
export interface InternalDateRange {
  start: CalendarDate;
  end: CalendarDate;
}

export function parseDateValue(value: string | null): CalendarDate | null {
  return value === null ? null : parseDate(value);
}

export function formatDateValue(value: CalendarDate | null): string | null {
  return value?.toString() ?? null;
}

export function parseTimeValue(value: string | null): Time | null {
  return value === null ? null : parseTime(value);
}

export function formatTimeValue(value: Time | null): string | null {
  if (value === null) {
    return null;
  }

  const base = `${pad(value.hour)}:${pad(value.minute)}`;

  return value.second === 0 ? base : `${base}:${pad(value.second)}`;
}

export function parseDateRangeValue(
  value: DateRangeValue | null,
): InternalDateRange | null {
  return value === null
    ? null
    : {
        end: parseDate(value.end),
        start: parseDate(value.start),
      };
}

export function formatDateRangeValue(
  value: InternalDateRange | null,
): DateRangeValue | null {
  return value === null
    ? null
    : {
        end: value.end.toString(),
        start: value.start.toString(),
      };
}

export function parseDateTimeValue(
  value: string | null,
  timeZone: string,
): ZonedDateTime | null {
  if (value === null) {
    return null;
  }

  if (!EXPLICIT_OFFSET.test(value)) {
    throw new Error(
      'DateTimePicker values require an explicit ISO 8601 offset.',
    );
  }

  return parseAbsolute(value, timeZone);
}

export function formatDateTimeValue(
  value: ZonedDateTime | null,
): string | null {
  if (value === null) {
    return null;
  }

  const offsetMinutes = value.offset / 60_000;
  const sign = offsetMinutes < 0 ? '-' : '+';
  const absoluteOffset = Math.abs(offsetMinutes);
  const offset = `${sign}${pad(Math.floor(absoluteOffset / 60))}:${pad(
    absoluteOffset % 60,
  )}`;

  return `${value.year}-${pad(value.month)}-${pad(value.day)}T${pad(
    value.hour,
  )}:${pad(value.minute)}:${pad(value.second)}${offset}`;
}
