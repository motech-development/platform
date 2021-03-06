import { useMutation } from '@apollo/client';
import { Loader } from '@motech-development/breeze-ui';
import { useQueryString } from '@motech-development/query-string-hook';
import { FC, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import ErrorCard from '../../../../components/ErrorCard';
import UPDATE_BANK_SETTINGS, {
  IUpdateBankSettingsInput,
  IUpdateBankSettingsOutput,
} from '../../../../graphql/bank/UPDATE_BANK_SETTINGS';

interface ICallbackParams {
  companyId: string;
}

const Callback: FC = () => {
  const history = useHistory();
  const { companyId } = useParams<ICallbackParams>();
  const { t } = useTranslation('settings');
  const [error, setError] = useState(false);
  const query = useQueryString();
  const [mutation] = useMutation<
    IUpdateBankSettingsOutput,
    IUpdateBankSettingsInput
  >(UPDATE_BANK_SETTINGS, {
    onCompleted: ({ updateBankSettings }) => {
      if (updateBankSettings) {
        const { id, user } = updateBankSettings;

        if (user) {
          history.push(`/my-companies/settings/${id}/bank/select-account`);
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    },
  });

  useEffect(() => {
    (async () => {
      const bank = query.get('institution');
      const consent = query.get('consent');
      const user = query.get('user-uuid');

      await mutation({
        variables: {
          input: {
            bank,
            consent,
            id: companyId,
            user,
          },
        },
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <ErrorCard
        backTo={`/my-companies/settings/${companyId}`}
        title={t('callback.error')}
        description={t('callback.error-lead')}
      />
    );
  }

  return <Loader />;
};

export default memo(Callback);
