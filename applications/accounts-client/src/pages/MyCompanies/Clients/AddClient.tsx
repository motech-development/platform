import { useMutation } from '@apollo/react-hooks';
import { PageTitle } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import ClientForm, { FormSchema } from '../../../components/ClientForm';
import Connected from '../../../components/Connected';
import ADD_CLIENT, {
  IAddClientInput,
  IAddClientOutput,
  updateCache,
} from '../../../graphql/client/ADD_CLIENT';
import withLayout from '../../../hoc/withLayout';

interface IAddClientParams {
  companyId: string;
}

const AddClient: FC = () => {
  const history = useHistory();
  const { companyId } = useParams<IAddClientParams>();
  const { t } = useTranslation('clients');
  const backTo = (id: string) => `/my-companies/clients/${id}`;
  const [mutation, { error, loading }] = useMutation<
    IAddClientOutput,
    IAddClientInput
  >(ADD_CLIENT, {
    onCompleted: ({ createClient }) => {
      history.push(backTo(createClient.companyId));
    },
  });
  const save = (input: FormSchema) => {
    (async () => {
      await mutation({
        update: updateCache,
        variables: {
          input,
        },
      });
    })();
  };

  return (
    <Connected error={error} loading={false}>
      <PageTitle
        title={t('add-client.title')}
        subTitle={t('add-client.sub-title')}
      />

      <ClientForm
        companyId={companyId}
        backTo={backTo(companyId)}
        loading={loading}
        onSave={save}
      />
    </Connected>
  );
};

export default withLayout(AddClient);
