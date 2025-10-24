import { useMutation } from '@apollo/client';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ClientForm, { FormSchema } from '../../../components/ClientForm';
import Connected from '../../../components/Connected';
import { gql } from '../../../graphql';
import invariant from '../../../utils/invariant';

export const ADD_CLIENT = gql(/* GraphQL */ `
  mutation CreateClient($input: ClientInput!) {
    createClient(input: $input) {
      address {
        line1
        line2
        line3
        line4
        line5
      }
      companyId
      contact {
        email
        telephone
      }
      id
      name
    }
  }
`);

function AddClient() {
  const navigate = useNavigate();
  const { companyId } = useParams();

  invariant(companyId);

  const { t } = useTranslation('clients');
  const { add } = useToast();
  const backTo = (id: string) => `/my-companies/clients/${id}`;
  const [mutation, { error, loading }] = useMutation(ADD_CLIENT, {
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
