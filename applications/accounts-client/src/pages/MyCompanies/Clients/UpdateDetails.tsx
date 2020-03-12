import { useMutation, useQuery } from '@apollo/react-hooks';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import ClientForm, { FormSchema } from '../../../components/ClientForm';
import Connected from '../../../components/Connected';
import GET_CLIENT, {
  IGetClientInput,
  IGetClientOutput,
} from '../../../graphql/client/GET_CLIENT';
import UPDATE_CLIENT, {
  IUpdateClientInput,
  IUpdateClientOutput,
} from '../../../graphql/client/UPDATE_CLIENT';
import withLayout from '../../../hoc/withLayout';

interface IUpdateDetailsParams {
  clientId: string;
  companyId: string;
}

const UpdateDetails: FC = () => {
  const backTo = (id: string) => `/my-companies/clients/${id}`;
  const history = useHistory();
  const { t } = useTranslation('clients');
  const { add } = useToast();
  const { clientId } = useParams<IUpdateDetailsParams>();
  const { data, error, loading } = useQuery<IGetClientOutput, IGetClientInput>(
    GET_CLIENT,
    {
      variables: {
        id: clientId,
      },
    },
  );
  const [
    mutation,
    { error: updateError, loading: updateLoading },
  ] = useMutation<IUpdateClientOutput, IUpdateClientInput>(UPDATE_CLIENT, {
    onCompleted: ({ updateClient }) => {
      const { companyId, name } = updateClient;

      add({
        colour: 'success',
        message: t('update-details.success', {
          name,
        }),
      });

      history.push(backTo(companyId));
    },
  });
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
            title={data.getClient.name}
            subTitle={t('update-details.sub-title')}
          />

          <ClientForm
            backTo={backTo(data.getClient.companyId)}
            initialValues={data.getClient}
            loading={updateLoading}
            onSave={save}
          />
        </>
      )}
    </Connected>
  );
};

export default withLayout(UpdateDetails);
