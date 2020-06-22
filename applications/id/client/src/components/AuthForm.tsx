import { Card, TextBox, Typography } from '@motech-development/breeze-ui';
import { Form, Formik } from 'formik';
import React, { FC, memo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import FormFooter from './FormFooter';

const formSchema = {
  password: '',
  userMetadata: {
    family_name: '',
    given_name: '',
  },
  username: '',
};

export type FormSchema = typeof formSchema;

export interface IAuthFormProps {
  change: string;
  helpText?: ReactNode;
  loading: boolean;
  name?: boolean;
  submit: string;
  onChange(): void;
  onSubmit(value: FormSchema): void;
}

const AuthForm: FC<IAuthFormProps> = ({
  change,
  helpText,
  loading,
  name = false,
  onChange,
  onSubmit,
  submit,
}) => {
  const { t } = useTranslation('forms');
  const validationSchema = object<FormSchema>()
    .shape({
      ...(name
        ? {
            userMetadata: object()
              .shape({
                family_name: string().required(t('family-name.required')),
                given_name: string().required(t('given-name.required')),
              })
              .required(),
          }
        : {}),
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
            {name && (
              <>
                <TextBox
                  type="text"
                  name="userMetadata.given_name"
                  label={t('given-name.label')}
                />

                <TextBox
                  type="text"
                  name="userMetadata.family_name"
                  label={t('family-name.label')}
                />
              </>
            )}

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

export default memo(AuthForm);
