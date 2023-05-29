import { useMutation, useQuery } from '@apollo/client';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import DELETE_BANK_CONNECTION, {
  IDeleteBankConnectionInput,
  IDeleteBankConnectionOutput,
} from '../../../graphql/bank/DELETE_BANK_CONNECTION';
import SettingsForm, { FormSchema } from '../../../components/SettingsForm';
import GET_SETTINGS, {
  IGetSettingsInput,
  IGetSettingsOutput,
} from '../../../graphql/settings/GET_SETTINGS';
import UPDATE_SETTINGS, {
  IUpdateSettingsInput,
  IUpdateSettingsOutput,
} from '../../../graphql/settings/UPDATE_SETTINGS';
import invariant from '../../../utils/invariant';

function Settings() {
  const backTo = (id: string) => `/my-companies/dashboard/${id}`;
  const [connected, setConnected] = useState(false);
  const { companyId } = useParams();

  invariant(companyId);

  const navigate = useNavigate();
  const { t } = useTranslation('settings');
  const { add } = useToast();
  const { data, error, loading } = useQuery<
    IGetSettingsOutput,
    IGetSettingsInput
  >(GET_SETTINGS, {
    variables: {
      id: companyId,
    },
  });
  const [mutation, { error: updateError, loading: updateLoading }] =
    useMutation<IUpdateSettingsOutput, IUpdateSettingsInput>(UPDATE_SETTINGS, {
      onCompleted: ({ updateSettings }) => {
        if (updateSettings) {
          const { id } = updateSettings;

          add({
            colour: 'success',
            message: t('settings.success'),
          });

          navigate(backTo(id));
        } else {
          add({
            colour: 'danger',
            message: t('settings.retry'),
          });

          navigate(backTo(companyId));
        }
      },
    });
  const [disconnect, { loading: disconnectLoading }] = useMutation<
    IDeleteBankConnectionOutput,
    IDeleteBankConnectionInput
  >(DELETE_BANK_CONNECTION, {
    onCompleted: () => {
      add({
        colour: 'success',
        message: t('settings.bank-disconnected'),
      });
    },
    onError: () => {
      add({
        colour: 'danger',
        message: t('settings.bank-disconnected-error'),
      });
    },
  });
  const save = (input: FormSchema) => {
    mutation({
      variables: {
        input,
      },
    }).catch(() => {});
  };
  const onDisconnect = (id: string) => {
    disconnect({
      variables: {
        id,
      },
    }).catch(() => {});
  };

  useEffect(() => {
    if (data?.getBankSettings) {
      setConnected(!!data.getBankSettings.account);
    }
  }, [data]);

  return (
    <Connected error={error || updateError} loading={loading}>
      {data && (
        <>
          {data.getCompany && (
            <PageTitle
              title={t('settings.title')}
              subTitle={data.getCompany.name}
            />
          )}

          {data.getBankSettings && data.getSettings && (
            <SettingsForm
              backTo={backTo(companyId)}
              bank={{
                connected,
                disconnectLoading,
                link: `/my-companies/settings/${companyId}/bank`,
                name: data.getBankSettings.bank,
                onDisconnect: () => onDisconnect(companyId),
              }}
              initialValues={data.getSettings}
              loading={updateLoading}
              onSave={save}
            />
          )}
        </>
      )}
    </Connected>
  );
}

export default Settings;
