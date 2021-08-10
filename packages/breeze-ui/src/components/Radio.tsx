import { FormikProps, FormikValues } from 'formik';
import { ChangeEvent, FC } from 'react';
import IOption from '../utils/option';
import TSpacing from '../utils/spacing';

export interface IRadioProps {
  disabled?: boolean;
  helpText?: string;
  label: string;
  name: string;
  options: IOption[];
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
//   name,
//   onChange,
//   options,
//   readOnly = false,
//   spacing = 'md',
// }
const Radio: FC<IRadioProps> = () => <div />;

export default Radio;
