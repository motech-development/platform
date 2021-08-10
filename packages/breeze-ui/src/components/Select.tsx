import { FormikProps, FormikValues } from 'formik';
import { ChangeEvent, FC } from 'react';
import IOption from '../utils/option';
import TSpacing from '../utils/spacing';

export interface ISelectProps {
  disabled?: boolean;
  helpText?: string;
  label: string;
  name: string;
  options: IOption[];
  placeholder: string;
  readOnly?: boolean;
  spacing?: TSpacing;
  onChange?(
    e: ChangeEvent<HTMLSelectElement>,
    form: FormikProps<FormikValues>,
  ): void;
}

// {
//   disabled = false,
//   helpText = null,
//   label,
//   name,
//   onChange,
//   options,
//   placeholder,
//   readOnly = false,
//   spacing = 'md',
// }
const Select: FC<ISelectProps> = () => <div />;

export default Select;
