import { Form as FormikForm, Formik, FormikValues } from 'formik';
import React, { FC, memo, ReactNode } from 'react';
import Button from '../Button/Button';

export interface IFormProps<T extends FormikValues = FormikValues> {
  children: ReactNode;
  initialValues: T;
  onSubmit(value: T): void;
  submitLabel: string;
  validationSchema: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Form: FC<IFormProps> = ({
  children,
  initialValues,
  onSubmit,
  submitLabel,
  validationSchema,
}) => (
  <Formik
    validateOnMount
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({ isValid }) => (
      <FormikForm autoComplete="off">
        {children}

        <Button type="submit" disabled={!isValid}>
          {submitLabel}
        </Button>
      </FormikForm>
    )}
  </Formik>
);

export default memo(Form);
