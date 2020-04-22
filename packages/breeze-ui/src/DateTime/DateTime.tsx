import moment from 'moment';
import React, { FC, memo } from 'react';

const defaultFormat = 'DD/MM/YYYY';

export const formatDateTime = (value: string, format = defaultFormat) => {
  const date = moment(value);

  return {
    ISOString: date.toISOString(),
    formatted: date.format(format),
  };
};

export interface IDateTime {
  format?: string;
  value: string;
}

const DateTime: FC<IDateTime> = ({ format = defaultFormat, value }) => {
  const { ISOString, formatted } = formatDateTime(value, format);

  return <time dateTime={ISOString}>{formatted}</time>;
};

export default memo(DateTime);
