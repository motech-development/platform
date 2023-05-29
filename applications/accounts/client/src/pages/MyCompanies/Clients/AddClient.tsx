import { useMutation } from '@apollo/client';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ClientForm, { FormSchema } from '../../../components/ClientForm';
import Connected from '../../../components/Connected';
import ADD_CLIENT, {
  IAddClientInput,
  IAddClientOutput,
  updateCache,
} from '../../../graphql/client/ADD_CLIENT';
import invariant from '../../../utils/invariant';

function AddClient() {
  const navigate = useNavigate();
  const { companyId } = useParams();

  invariant(companyId);

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

        navigate(backTo(id));
      } else {
        add({
          colour: 'danger',
          message: t('add-client.retry'),
        });

        navigate(backTo(companyId));
      }
    },
  });
  const save = (input: FormSchema) => {
    mutation({
      update: updateCache,
      variables: {
        input,
      },
    }).catch(() => {});
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
}

export default AddClient;
