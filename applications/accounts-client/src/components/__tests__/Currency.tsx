import { render } from '@testing-library/react';
import React from 'react';
import Currency from '../Currency';

describe('Currency', () => {
  it('should output GBP', () => {
    const { container } = render(<Currency currency="GBP" value="11.99" />);

    expect(container).toHaveTextContent('£11.99');
  });

  it('should output EUR', () => {
    const { container } = render(<Currency currency="EUR" value="12" />);

    expect(container).toHaveTextContent('€12.00');
  });

  it('should output USD', () => {
    const { container } = render(<Currency currency="USD" value="20.195" />);

    expect(container).toHaveTextContent('$20.20');
  });

  it('should use fallback if currency is not recognised', () => {
    const { container } = render(<Currency currency="LYD" value="200" />);

    expect(container).toHaveTextContent('LYD200');
  });
});
