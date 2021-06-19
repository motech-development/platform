import { useMutation } from '@apollo/client';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import ClientForm, { FormSchema } from '../../../components/ClientForm';
import Connected from '../../../components/Connected';
import ADD_CLIENT, {
  IAddClientInput,
  IAddClientOutput,
  updateCache,
} from '../../../graphql/client/ADD_CLIENT';

interface IAddClientParams {
  companyId: string;
}

const AddClient: FC = () => {
  const history = useHistory();
  const { companyId } = useParams<IAddClientParams>();
  const { t } = useTranslation('clients');
  const { add } = useToast();
  const backTo = (id: string) => `/my-companies/clients/${id}`;
  const [mutation, { error, loading }] = useMutation<
    IAddClientOutput,
    IAddClientInput
  >(ADD_CLIENT, {
    onCompleted: ({ createClient }) => {
      if (createClient) {
        const { companyId: id, name } = createClient;

        add({
          colour: 'success',
          message: t('add-client.success', {
            name,
          }),
        });

        history.push(backTo(id));
      } else {
        add({
          colour: 'danger',
          message: t('add-client.retry'),
        });

        history.push(backTo(companyId));
      }
    },
  });
  const save = async (input: FormSchema) => {
    await mutation({
      update: updateCache,
      variables: {
        input,
      },
    });
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

export default AddClient;
