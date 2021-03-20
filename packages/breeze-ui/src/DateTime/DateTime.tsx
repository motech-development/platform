import moment from 'moment';
import { FC } from 'react';

const defaultFormat = 'DD/MM/YYYY';

export const formatDateTime = (value: string, format = defaultFormat) => {
  const date = moment.utc(value);

  return {
    ISOString: date.toISOString(),
    formatted: date.format(format),
  };
};

export interface IDateTimeProps {
  format?: string;
  value: string;
}

const DateTime: FC<IDateTimeProps> = ({ format = defaultFormat, value }) => {
  const { ISOString, formatted } = formatDateTime(value, format);

  return <time dateTime={ISOString}>{formatted}</time>;
};

export default DateTime;
