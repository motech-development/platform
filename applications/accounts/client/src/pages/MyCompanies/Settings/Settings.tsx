import { useMutation, useQuery } from '@apollo/client';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import SettingsForm, { FormSchema } from '../../../components/SettingsForm';
import { gql } from '../../../graphql';
import invariant from '../../../utils/invariant';

export const GET_SETTINGS = gql(/* GraphQL */ `
  query GetSettings($id: ID!) {
    getCompany(id: $id) {
      id
      name
    }
    getSettings(id: $id) {
      categories {
        name
        protect
        vatRate
      }
      id
      vat {
        charge
        pay
        registration
        scheme
      }
      yearEnd {
        day
        month
      }
    }
  }
`);

export const UPDATE_SETTINGS = gql(/* GraphQL */ `
  mutation UpdateSettings($input: SettingsInput!) {
    updateSettings(input: $input) {
      categories {
        name
        protect
        vatRate
      }
      id
      vat {
        charge
        pay
        registration
        scheme
      }
      yearEnd {
        day
        month
      }
    }
  }
`);

function Settings() {
  const backTo = (id: string) => `/my-companies/dashboard/${id}`;
  const { companyId } = useParams();

  invariant(companyId);

  const navigate = useNavigate();
  const { t } = useTranslation('settings');
  const { add } = useToast();
  const { data, error, loading } = useQuery(GET_SETTINGS, {
    variables: {
      id: companyId,
    },
  });
  const [mutation, { error: updateError, loading: updateLoading }] =
    useMutation(UPDATE_SETTINGS, {
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
  const save = (input: FormSchema) => {
    mutation({
      variables: {
        input,
      },
    }).catch(() => {});
  };

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

          {data.getSettings && (
            <SettingsForm
              backTo={backTo(companyId)}
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
