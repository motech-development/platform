import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Col, Form, Row, TextBox } from '@motech-development/breeze-ui';
import { register } from '@motech-development/schema';
import React, { FC, memo } from 'react';

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
      validationSchema={register}
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
