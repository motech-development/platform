import React, { FC, memo } from 'react';

const output = (currency: string) => {
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
  value: string;
}

const Currency: FC<ICurrencyProps> = ({ currency, value }) => {
  const prefix = output(currency);
  const balance = parseFloat(value).toFixed(2);

  return <>{`${prefix}${balance}`}</>;
};

export default memo(Currency);
