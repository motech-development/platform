import { FormikProps, FormikValues } from 'formik';
import { FC } from 'react';
import TSpacing from '../utils/spacing';

export interface IFileUploadProps {
  accept?: string;
  buttonText: string;
  disabled?: boolean;
  helpText?: string;
  label: string;
  loading?: boolean;
  name: string;
  spacing?: TSpacing;
  onSelect(file: File, form: FormikProps<FormikValues>): void | Promise<void>;
}

// {
//   accept,
//   buttonText,
//   disabled = false,
//   helpText,
//   label,
//   loading = false,
//   name,
//   onSelect,
//   spacing = 'md',
// }
const FileUpload: FC<IFileUploadProps> = () => <div />;

export default FileUpload;
