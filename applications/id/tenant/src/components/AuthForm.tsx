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
import { useTranslation } from 'react-i18next';
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

const AuthForm: FC<IAuthFormProps> = ({
  change,
  helpText,
  loading,
  onChange,
  onSubmit,
  submit,
}) => {
  const { t } = useTranslation('auth-form');
  const validationSchema = object<FormSchema>()
    .shape({
      password: string().required(t('password.required')),
      username: string()
        .email(t('username.invalid'))
        .required(t('username.required')),
    })
    .required();

  return (
    <Formik
      validateOnMount
      initialValues={formSchema}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isValid }) => (
        <Form>
          <Card padding="lg">
            <TextBox type="email" name="username" label={t('username.label')} />

            <TextBox
              type="password"
              name="password"
              label={t('password.label')}
            />

            {helpText && (
              <Typography
                component="p"
                variant="p"
                align="center"
                margin="none"
              >
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
};

export default memo(AuthForm);
