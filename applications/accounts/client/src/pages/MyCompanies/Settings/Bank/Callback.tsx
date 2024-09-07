import { useMutation } from '@apollo/client';
import { Loader } from '@motech-development/breeze-ui';
import { useQueryString } from '@motech-development/query-string-hook';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorCard from '../../../../components/ErrorCard';
import { gql } from '../../../../graphql';
import invariant from '../../../../utils/invariant';

export const UPDATE_BANK_SETTINGS = gql(/* GraphQL */ `
  mutation UpdateBankSettings($input: BankSettingsInput!) {
    updateBankSettings(input: $input) {
      account
      id
      user
    }
  }
`);

function Callback() {
  const navigate = useNavigate();
  const { companyId } = useParams();

  invariant(companyId);

  const { t } = useTranslation('settings');
  const [error, setError] = useState(false);
  const query = useQueryString();
  const [mutation] = useMutation(UPDATE_BANK_SETTINGS, {
    onCompleted: ({ updateBankSettings }) => {
      if (updateBankSettings) {
        const { id, user } = updateBankSettings;

        if (user) {
          navigate(`/my-companies/settings/${id}/bank/select-account`);
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
    })().catch(() => {});
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
}

export default Callback;
