import { usePost } from '@motech-development/axios-hooks';
import { useToast } from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import ResetPasswordForm, {
  FormSchema,
} from '../../components/ResetPasswordForm';

interface IError {
  message: string;
}

export interface IResetPasswordProps {
  setView(view: string): void;
}

function ResetPassword({ setView }: IResetPasswordProps) {
  const { t } = useTranslation('reset');
  const { add } = useToast();
  const [reset, { loading }] = usePost<unknown, FormSchema, IError>({
    onCompleted: () => {
      setView('success');
    },
    onError: (e) => {
      add({
        colour: 'danger',
        message: e.response?.data.message || t('error'),
      });
    },
  });
  const resetPassword = async (value: FormSchema) => {
    await reset('/lo/reset', value);
  };

  return (
    <ResetPasswordForm
      loading={loading}
      submit={t('reset-password')}
      onSubmit={resetPassword}
    />
  );
}

export default ResetPassword;
