import { describe, expect, it } from 'vitest';
import { monthNames } from './month-names';

describe('monthNames', () => {
  it('uses the requested locale', () => {
    expect(monthNames('en-GB')).toEqual([
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]);
    expect(monthNames('fr-FR')[0]).toBe('janvier');
  });
});
