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

export interface IRegistrationForm {
  onSubmit(): void;
}

const RegistrationForm: FC<IRegistrationForm> = ({ onSubmit }) => (
  <Form
    submitLabel="Register"
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    <TextBox name="emailAddress" label="Email address" />

    <TextBox name="password" label="Password" />
  </Form>
);

export default memo(RegistrationForm);
