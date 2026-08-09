import { describe, expect, it } from 'vitest';
import { validationMessage, visibleValidationErrors } from './form-errors';

describe('form errors', () => {
  it('normalises and de-duplicates validation messages', () => {
    expect(
      validationMessage([
        'Required',
        { message: 'Required' },
        { message: 'Invalid' },
        null,
      ]),
    ).toBe('Required, Invalid');
  });

  it('uses a fallback for validation errors without a message', () => {
    expect(validationMessage([null], 'Check this value')).toBe(
      'Check this value',
    );
  });

  it('shows errors after touch or submission', () => {
    const errors = ['Required'];

    expect(visibleValidationErrors(errors, false, 0)).toEqual([]);
    expect(visibleValidationErrors(errors, true, 0)).toEqual(errors);
    expect(visibleValidationErrors(errors, false, 1)).toEqual(errors);
  });
});
