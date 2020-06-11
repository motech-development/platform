import { Button, Card, TextBox } from '@motech-development/breeze-ui';
import { Form, Formik } from 'formik';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { object, ref, string } from 'yup';

const formSchema = {
  _csrf: window.passwordReset?.csrfToken,
  confirmPassword: '',
  email: window.passwordReset?.email,
  password: '',
  ticket: window.passwordReset?.ticket,
};

export type FormSchema = typeof formSchema;

export interface IResetPasswordFormProps {
  loading: boolean;
  submit: string;
  onSubmit(value: FormSchema): void;
}

const ResetPasswordForm: FC<IResetPasswordFormProps> = ({
  loading,
  onSubmit,
  submit,
}) => {
  const { t } = useTranslation('forms');
  const validationSchema = object<FormSchema>()
    .shape({
      _csrf: string().required(),
      confirmPassword: string()
        .oneOf([ref('password')], t('confirm-password.invalid'))
        .required(t('confirm-password.required')),
      email: string()
        .email()
        .required(),
      password: string().required(t('password.required')),
      ticket: string().required(),
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
            <TextBox
              type="password"
              name="password"
              label={t('password.label')}
            />

            <TextBox
              type="password"
              name="confirmPassword"
              label={t('confirm-password.label')}
            />
          </Card>

          <Button
            block
            type="submit"
            colour="success"
            size="lg"
            disabled={!isValid}
            loading={loading}
          >
            {submit}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default memo(ResetPasswordForm);
