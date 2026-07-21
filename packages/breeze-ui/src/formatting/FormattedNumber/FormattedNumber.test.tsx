import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { FormattedNumber } from './FormattedNumber';

describe('FormattedNumber', () => {
  it('uses the provider locale and supplied Intl options', () => {
    renderBreeze(
      <FormattedNumber
        data-testid="number"
        options={{ currency: 'GBP', style: 'currency' }}
        value={1234.5}
      />,
    );

    expect(screen.getByTestId('number')).toHaveTextContent('£1,234.50');
  });
});
