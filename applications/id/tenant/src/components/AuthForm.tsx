import {
  Button,
  Card,
  Col,
  Row,
  TextBox,
  Typography,
} from '@motech-development/breeze-ui';
import { Form, Formik } from 'formik';
import React, { FC, memo } from 'react';
import { object, string } from 'yup';

const formSchema = {
  password: '',
  username: '',
};

export type FormSchema = typeof formSchema;

export interface IAuthFormProps {
  change: string;
  helpText?: string;
  loading: boolean;
  submit: string;
  onChange(): void;
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

const AuthForm: FC<IAuthFormProps> = ({
  change,
  helpText,
  loading,
  onChange,
  onSubmit,
  submit,
}) => (
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

          {helpText && (
            <Typography component="p" variant="p" margin="none">
              {helpText}
            </Typography>
          )}
        </Card>

        <Row gutter="0">
          <Col xs={6}>
            <Button
              block
              colour="success"
              type="submit"
              size="lg"
              disabled={!isValid}
              loading={loading}
            >
              {submit}
            </Button>
          </Col>

          <Col xs={6}>
            <Button block size="lg" onClick={onChange}>
              {change}
            </Button>
          </Col>
        </Row>
      </Form>
    )}
  </Formik>
);

export default memo(AuthForm);
