import { useMutation, useQuery } from '@apollo/react-hooks';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import Connected from '../../components/Connected';
import SettingsForm, { FormSchema } from '../../components/SettingsForm';
import GET_SETTINGS, {
  IGetSettingsInput,
  IGetSettingsOutput,
} from '../../graphql/settings/GET_SETTINGS';
import UPDATE_SETTINGS, {
  IUpdateSettingsInput,
  IUpdateSettingsOutput,
} from '../../graphql/settings/UPDATE_SETTINGS';
import withLayout from '../../hoc/withLayout';

interface ISettingsParams {
  companyId: string;
}

const Settings: FC = () => {
  const backTo = (id: string) => `/my-companies/dashboard/${id}`;
  const { companyId } = useParams<ISettingsParams>();
  const history = useHistory();
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
  const [
    mutation,
    { error: updateError, loading: updateLoading },
  ] = useMutation<IUpdateSettingsOutput, IUpdateSettingsInput>(
    UPDATE_SETTINGS,
    {
      onCompleted: ({ updateSettings }) => {
        const { id } = updateSettings;

        add({
          colour: 'success',
          message: t('settings.success'),
        });

        history.push(backTo(id));
      },
    },
  );
  const save = (input: FormSchema) => {
    (async () => {
      await mutation({
        variables: {
          input,
        },
      });
    })();
  };

  return (
    <Connected error={error || updateError} loading={loading}>
      {data && (
        <>
          <PageTitle
            title={t('settings.title')}
            subTitle={data.getCompany.name}
          />

          <SettingsForm
            backTo={backTo(companyId)}
            initialValues={data.getSettings}
            loading={updateLoading}
            onSave={save}
          />
        </>
      )}
    </Connected>
  );
};

export default withLayout(Settings);
