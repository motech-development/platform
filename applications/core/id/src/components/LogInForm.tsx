import { Button, Card, TextBox } from '@motech-development/breeze-ui';
import { Form, Formik } from 'formik';
import React, { FC, memo } from 'react';
import { object, string } from 'yup';

const formSchema = {
  password: '',
  username: '',
};

export type FormSchema = typeof formSchema;

export interface ILogInFormProps {
  loading: boolean;
  onSubmit(value: FormSchema): void;
}

const validationSchema = object<FormSchema>()
  .shape({
    password: string().required('Password is required'),
    username: string()
      .email('Email address is invalid')
      .required('Email address is required'),
  })
  .required();

const LogInForm: FC<ILogInFormProps> = ({ loading, onSubmit }) => (
  <Formik
    validateOnMount
    initialValues={formSchema}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({ isValid }) => (
      <Form>
        <Card padding="lg">
          <TextBox type="email" name="username" label="Email address" />

          <TextBox type="password" name="password" label="Password" />
        </Card>

        <Button
          block
          type="submit"
          size="lg"
          disabled={!isValid}
          loading={loading}
        >
          Log in
        </Button>
      </Form>
    )}
  </Formik>
);

export default memo(LogInForm);
