import { DateTime as Luxon } from 'luxon';
import { FC } from 'react';

const defaultFormat = 'dd/MM/yyyy';

export const formatDateTime = (
  value: string | number,
  format = defaultFormat,
) => {
  const date =
    typeof value === 'string' ? Luxon.fromISO(value) : Luxon.fromSeconds(value);

  return {
    ISOString: date.toUTC().toISO(),
    formatted: date.toFormat(format),
  };
};

export interface IDateTimeProps {
  format?: string;
  value: string | number;
}

const DateTime: FC<IDateTimeProps> = ({ format = defaultFormat, value }) => {
  const { ISOString, formatted } = formatDateTime(value, format);

  return <time dateTime={ISOString}>{formatted}</time>;
};

export default DateTime;
