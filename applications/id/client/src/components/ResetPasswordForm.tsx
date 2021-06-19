import { Button, Card, TextBox } from '@motech-development/breeze-ui';
import { Form, Formik } from 'formik';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { object, ref, string } from 'yup';

const formSchema = {
  _csrf: window.passwordReset?.csrfToken,
  confirmNewPassword: '',
  newPassword: '',
  'password-policy': window.passwordReset?.passwordPolicy,
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
      confirmNewPassword: string()
        .oneOf([ref('newPassword')], t('confirm-password.invalid'))
        .required(t('confirm-password.required')),
      newPassword: string().required(t('password.required')),
      'password-policy': string().required(),
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
              name="newPassword"
              label={t('password.label')}
            />

            <TextBox
              type="password"
              name="confirmNewPassword"
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

export default ResetPasswordForm;
