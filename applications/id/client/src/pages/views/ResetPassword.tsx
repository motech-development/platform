import { usePost } from '@motech-development/axios-hooks';
import { useToast } from '@motech-development/breeze-ui';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import ResetPasswordForm, {
  FormSchema,
} from '../../components/ResetPasswordForm';

export interface IResetPasswordProps {
  setView(view: string): void;
}

const ResetPassword: FC<IResetPasswordProps> = ({ setView }) => {
  const { t } = useTranslation('reset');
  const { add } = useToast();
  const [reset, { loading }] = usePost({
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
};

export default memo(ResetPassword);
