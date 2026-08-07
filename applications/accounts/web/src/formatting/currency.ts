export function formatCurrency(
  value: number,
  currency: string,
  signDisplay: 'auto' | 'always' = 'auto',
) {
  return new Intl.NumberFormat('en-GB', {
    currency,
    signDisplay,
    style: 'currency',
  })
    .format(value)
    .replace(/^-/, '−');
}
