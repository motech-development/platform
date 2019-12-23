import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Form, TextBox } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { object, string } from 'yup';

export interface IInitialValues {
  email: string;
  name: string;
  password: string;
}

const initialValues: IInitialValues = {
  email: '',
  name: '',
  password: '',
};

const validationSchema = object().shape({
  email: string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  name: string().required('Your name is required'),
  password: string().required('Password is required'),
});

export interface IRegistrationForm {
  alert: string;
  onSubmit(value: IInitialValues): void;
}

const RegistrationForm: FC<IRegistrationForm> = ({ alert, onSubmit }) => (
  <>
    {alert && (
      <Alert
        message={alert}
        colour="danger"
        spacing="lg"
        icon={() => <FontAwesomeIcon icon={faExclamationTriangle} />}
      />
    )}

    <Form
      submitLabel="Register"
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <TextBox name="name" label="Full name" />

      <TextBox name="email" label="Email address" />

      <TextBox name="password" label="Password" type="password" />
    </Form>
  </>
);

export default memo(RegistrationForm);
