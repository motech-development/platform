import { describe, expect, it } from 'vitest';
import { formatDateTimeValue, parseDateTimeValue } from './conversion';

describe('date conversion boundary', () => {
  it('normalises explicit-offset instants into the provider time zone', () => {
    const value = parseDateTimeValue(
      '2026-07-13T12:30:00+00:00',
      'Europe/London',
    );

    expect(formatDateTimeValue(value)).toBe('2026-07-13T13:30:00+01:00');
  });
});
