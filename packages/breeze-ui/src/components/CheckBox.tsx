import { FormikProps, FormikValues } from 'formik';
import { ChangeEvent, FC } from 'react';

import TSpacing from '../utils/spacing';

export interface ICheckBoxProps {
  disabled?: boolean;
  helpText?: string;
  label: string;
  legend: string;
  name: string;
  readOnly?: boolean;
  spacing?: TSpacing;
  onChange?(
    e: ChangeEvent<HTMLInputElement>,
    form: FormikProps<FormikValues>,
  ): void;
}

// {
//   disabled = false,
//   helpText = null,
//   label,
//   legend,
//   name,
//   onChange,
//   readOnly = false,
//   spacing = 'md',
// }
const CheckBox: FC<ICheckBoxProps> = () => <div />;

export default CheckBox;
