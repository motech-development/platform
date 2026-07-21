import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { FormattedDateTime } from './FormattedDateTime';

describe('FormattedDateTime', () => {
  it('uses provider locale and time zone while retaining the ISO value', () => {
    renderBreeze(
      <FormattedDateTime
        options={{ dateStyle: 'medium', timeStyle: 'short' }}
        value="2026-07-12T08:42:00+00:00"
      />,
      { timeZone: 'Europe/London' },
    );

    const output = screen.getByText('12 Jul 2026, 09:42');

    expect(output).toHaveAttribute('datetime', '2026-07-12T08:42:00+00:00');
  });
});
