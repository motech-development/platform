import { Card, TextBox, Typography } from '@motech-development/breeze-ui';
import { Form, Formik } from 'formik';
import React, { FC, memo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import FormFooter from './FormFooter';

const formSchema = {
  email: '',
};

export type FormSchema = typeof formSchema;

export interface IForgottenPasswordFormProps {
  change: string;
  helpText?: ReactNode;
  loading: boolean;
  submit: string;
  onChange(): void;
  onSubmit(value: FormSchema): void;
}

const ForgottenPasswordForm: FC<IForgottenPasswordFormProps> = ({
  change,
  helpText,
  loading,
  onChange,
  onSubmit,
  submit,
}) => {
  const { t } = useTranslation('forms');
  const validationSchema = object<FormSchema>()
    .shape({
      email: string()
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
            {helpText && (
              <Typography component="p" variant="p" align="center" margin="lg">
                {helpText}
              </Typography>
            )}

            <TextBox type="email" name="email" label={t('username.label')} />
          </Card>

          <FormFooter
            change={change}
            isValid={isValid}
            loading={loading}
            submit={submit}
            onChange={onChange}
          />
        </Form>
      )}
    </Formik>
  );
};

export default memo(ForgottenPasswordForm);
