import { Form, TextBox } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { object, string } from 'yup';

const initialValues = {
  emailAddress: '',
  password: '',
};

const validationSchema = object().shape({
  emailAddress: string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: string().required('Password is required'),
});

export interface ILoginForm {
  onSubmit(): void;
}

const LoginForm: FC<ILoginForm> = ({ onSubmit }) => (
  <Form
    submitLabel="Log in"
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    <TextBox name="emailAddress" label="Email address" />

    <TextBox name="password" label="Password" type="password" />
  </Form>
);

export default memo(LoginForm);
