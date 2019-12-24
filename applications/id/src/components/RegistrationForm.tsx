import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Col, Form, Row, TextBox } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { object, ref, string } from 'yup';

export interface IInitialValues {
  confirmPassword: string;
  email: string;
  // eslint-disable-next-line camelcase
  family_name: string;
  // eslint-disable-next-line camelcase
  given_name: string;
  password: string;
}

const initialValues: IInitialValues = {
  confirmPassword: '',
  email: '',
  family_name: '',
  given_name: '',
  password: '',
};

const validationSchema = object().shape({
  confirmPassword: string()
    .oneOf([ref('password'), null], 'Passwords to not match')
    .required('Please confirm your password'),
  email: string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  family_name: string().required('Your surname is required'),
  given_name: string().required('Your forename is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase character')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase character')
    .matches(
      /[^a-zA-Z\s]+/,
      'Password must contain at least 1 number or special character (!@#$%^&*)',
    )
    .required('Password is required'),
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
      <Row gutter="0 10px">
        <Col md={6}>
          <TextBox name="given_name" label="Forename" />
        </Col>
        <Col md={6}>
          <TextBox name="family_name" label="Surname" />
        </Col>
        <Col>
          <TextBox name="email" label="Email address" />
        </Col>
        <Col md={6}>
          <TextBox name="password" label="Password" type="password" />
        </Col>
        <Col md={6}>
          <TextBox
            name="confirmPassword"
            label="Confirm your password"
            type="password"
          />
        </Col>
      </Row>
    </Form>
  </>
);

export default memo(RegistrationForm);
