import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  schemaFieldErrors,
  schemaValuesValid,
  validationMessage,
  visibleValidationErrors,
} from './form-errors';

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

  it('reads current schema errors for nested and array fields', () => {
    const schema = z.object({
      categories: z.array(
        z.object({ name: z.string().min(1, 'Category name is required') }),
      ),
      contact: z.object({ email: z.email('Enter a valid email address') }),
    });
    const values = {
      categories: [{ name: '' }],
      contact: { email: 'invalid' },
    };

    expect(
      validationMessage(
        schemaFieldErrors(schema, values, 'categories[0].name'),
      ),
    ).toBe('Category name is required');
    expect(
      validationMessage(schemaFieldErrors(schema, values, 'contact.email')),
    ).toBe('Enter a valid email address');
    expect(schemaValuesValid(schema, values)).toBe(false);
    expect(
      schemaValuesValid(schema, {
        categories: [{ name: 'Travel' }],
        contact: { email: 'owner@example.com' },
      }),
    ).toBe(true);
  });
});
