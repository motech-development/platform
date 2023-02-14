const currencySymbol = (currency: string) => {
  switch (currency) {
    case 'GBP':
      return '£';
    case 'EUR':
      return '€';
    case 'USD':
      return '$';
    default:
      return currency;
  }
};

export const formatCurrency = (currency: string, value: number) => {
  const prefix = currencySymbol(currency);
  const isNegative = value < 0;
  const output = isNegative ? Math.abs(value).toFixed(2) : value.toFixed(2);

  if (isNegative) {
    return `-${prefix}${output}`;
  }

  return `${prefix}${output}`;
};

export interface ICurrencyProps {
  currency: string;
  value: number;
}

function Currency({ currency, value }: ICurrencyProps) {
  const output = formatCurrency(currency, value);

  return <>{output}</>;
}

export default Currency;
