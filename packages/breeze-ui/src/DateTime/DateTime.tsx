import moment from 'moment';
import React, { FC, memo } from 'react';

export interface IDateTime {
  format?: string;
  value: string;
}

const DateTime: FC<IDateTime> = ({ format = 'DD/MM/YYYY', value }) => {
  const date = moment(value);

  return <time dateTime={date.toISOString()}>{date.format(format)}</time>;
};

export default memo(DateTime);
