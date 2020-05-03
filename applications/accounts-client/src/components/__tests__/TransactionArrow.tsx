import { render } from '@testing-library/react';
import React from 'react';
import TransactionArrow from '../TransactionArrow';

describe('TransactionArrow', () => {
  it('should display a red arrow pointing to the left when value is negative', () => {
    const { container } = render(<TransactionArrow value={-10} />);
    const arrow = container.querySelector('[data-icon="arrow-left"]');

    expect(arrow).toHaveStyle(`
      color: rgb(199,56,79);
    `);
  });

  it('should display a green arrow pointing to the right when value is positive', () => {
    const { container } = render(<TransactionArrow value={10} />);
    const arrow = container.querySelector('[data-icon="arrow-right"]');

    expect(arrow).toHaveStyle(`
      color: rgb(0,128,93);
    `);
  });
});
