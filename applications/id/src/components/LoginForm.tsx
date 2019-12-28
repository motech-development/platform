import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Form, TextBox } from '@motech-development/breeze-ui';
import { logIn } from '@motech-development/schema';
import React, { FC, memo } from 'react';

export interface IInitialValues {
  password: string;
  username: string;
}

const initialValues = {
  password: '',
  username: '',
};

export interface ILoginForm {
  alert: string;
  onSubmit(value: IInitialValues): void;
}

const LoginForm: FC<ILoginForm> = ({ alert, onSubmit }) => (
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
      submitLabel="Log in"
      initialValues={initialValues}
      validationSchema={logIn}
      onSubmit={onSubmit}
    >
      <TextBox name="username" label="Email address" />

      <TextBox name="password" label="Password" type="password" />
    </Form>
  </>
);

export default memo(LoginForm);
