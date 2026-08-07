import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('uses the Accounts locale and supplied currency', () => {
    expect(formatCurrency(1234.5, 'GBP')).toBe('£1,234.50');
  });

  it('can make incoming amounts explicit', () => {
    expect(formatCurrency(25, 'GBP', 'always')).toBe('+£25.00');
  });
});
