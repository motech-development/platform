import React, { FC, memo } from 'react';
import TextBox from '../TextBox/TextBox';

export interface IDatePicker {
  label: string;
  name: string;
}

const DatePicker: FC<IDatePicker> = ({ label, name }) => (
  <TextBox label={label} name={name} />
);

export default memo(DatePicker);
