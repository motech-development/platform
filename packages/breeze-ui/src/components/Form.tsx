import { FormikValues } from 'formik';
import { FC, ReactNode } from 'react';

export interface IFormProps {
  children: ReactNode;
  cancel?: ReactNode;
  initialValues: FormikValues;
  loading?: boolean;
  onPreSubmit?(values: FormikValues): FormikValues | Promise<FormikValues>;
  onSubmit(values: FormikValues): void | Promise<void>;
  submitLabel: string;
  // TODO: Use built in Yup types
  // validationSchema: ObjectSchema<FormikValues>;
}

// {
//   children,
//   cancel = null,
//   initialValues,
//   loading = false,
//   onPreSubmit = null,
//   onSubmit,
//   submitLabel,
//   validationSchema,
// }
const Form: FC<IFormProps> = () => <div />;

export default Form;
