import { FC } from 'react';
import TSpacing from '../utils/spacing';

export interface IDatePickerProps {
  disabled?: boolean;
  helpText?: string;
  label: string;
  name: string;
  readOnly?: boolean;
  spacing?: TSpacing;
}

// {
//   disabled = false,
//   helpText = null,
//   label,
//   name,
//   readOnly = false,
//   spacing = 'md',
// }
const DatePicker: FC<IDatePickerProps> = () => <div />;

export default DatePicker;
