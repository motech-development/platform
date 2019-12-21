import { Form as FormikForm, Formik } from 'formik';
import React, { FC, memo, ReactNode } from 'react';
import { ObjectSchema } from 'yup';
import Button from '../Button/Button';

export interface IFormProps<T extends object = object> {
  children: ReactNode;
  initialValues: T;
  onSubmit(): void;
  submitLabel: string;
  validationSchema: ObjectSchema<T>;
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
