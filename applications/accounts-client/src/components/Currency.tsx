import React, { FC, memo } from 'react';

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

export interface ICurrencyProps {
  currency: string;
  value: number;
}

const Currency: FC<ICurrencyProps> = ({ currency, value }) => {
  const prefix = currencySymbol(currency);
  const isNegative = value < 0;

  if (isNegative) {
    const output = Math.abs(value).toFixed(2);

    return <>{`-${prefix}${output}`}</>;
  }

  const output = value.toFixed(2);

  return <>{`${prefix}${output}`}</>;
};

export default memo(Currency);
