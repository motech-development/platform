import { FormikProps, FormikValues } from 'formik';
import { ChangeEvent, FC } from 'react';
import TSpacing from '../utils/spacing';

export interface ITextBoxProps {
  decimalScale?: number;
  disabled?: boolean;
  format?: string;
  helpText?: string;
  label: string;
  name: string;
  placeholder?: string;
  prefix?: string;
  readOnly?: boolean;
  spacing?: TSpacing;
  suffix?: string;
  type?: 'email' | 'number' | 'password' | 'text';
  onChange?(
    e: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ): Promise<void> | void;
}

// {
//   decimalScale,
//   disabled = false,
//   format,
//   helpText = null,
//   label,
//   name,
//   onChange,
//   placeholder = '',
//   prefix,
//   readOnly = false,
//   spacing = 'md',
//   suffix,
//   type = 'text',
// }
const TextBox: FC<ITextBoxProps> = () => <div />;

export default TextBox;
