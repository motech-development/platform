import { gql, useMutation, useQuery } from '@apollo/client';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import TransactionForm, {
  FormSchema,
} from '../../../components/TransactionForm';
import ADD_TRANSACTION, {
  IAddTransactionInput,
  IAddTransactionOutput,
  updateCache,
} from '../../../graphql/transaction/ADD_TRANSACTION';
import invariant from '../../../utils/invariant';
import UploadAttachment from './shared/UploadAttachment';
import ViewAttachment from './shared/ViewAttachment';

interface IRecordTransactionInput {
  id: string;
}

interface IRecordTransactionOutput {
  getClients?: {
    items: {
      id: string;
      name: string;
    }[];
  };
  getSettings?: {
    categories: {
      name: string;
      vatRate: number;
    }[];
    vat: {
      pay: number;
    };
  };
  getTypeahead?: {
    purchases: string[];
    sales: string[];
    suppliers: string[];
  };
}

export const RECORD_TRANSACTION = gql`
  query RecordTransaction($id: ID!) {
    getClients(id: $id) {
      id
      items {
        id
        name
      }
    }
    getSettings(id: $id) {
      categories {
        name
        vatRate
      }
      id
      vat {
        pay
      }
    }
    getTypeahead(id: $id) {
      id
      purchases
      sales
      suppliers
    }
  }
`;

function RecordTransaction() {
  const navigate = useNavigate();
  const { companyId } = useParams();

  invariant(companyId);

  const [attachment, setAttachment] = useState('');
  const { t } = useTranslation('accounts');
  const { add } = useToast();
  const backTo = (id: string, status?: string) => {
    const pending = status === 'pending';
    const location = `/my-companies/accounts/${id}`;

    if (pending) {
      return `${location}/pending-transactions`;
    }

    return location;
  };
  const { data, error, loading } = useQuery<
    IRecordTransactionOutput,
    IRecordTransactionInput
  >(RECORD_TRANSACTION, {
    variables: {
      id: companyId,
    },
  });
  const [mutation, { error: addError, loading: addLoading }] = useMutation<
    IAddTransactionOutput,
    IAddTransactionInput
  >(ADD_TRANSACTION, {
    onCompleted: ({ addTransaction }) => {
      if (addTransaction) {
        add({
          colour: 'success',
          message: t('record-transaction.success'),
        });

        navigate(backTo(addTransaction.companyId, addTransaction.status));
      } else {
        add({
          colour: 'danger',
          message: t('record-transaction.retry'),
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
    <Connected error={error || addError} loading={loading}>
      {data?.getClients && data?.getSettings && (
        <>
          <PageTitle
            title={t('record-transaction.title')}
            subTitle={t('record-transaction.sub-title')}
          />

          <TransactionForm
            attachment={attachment}
            attachmentView={
              <ViewAttachment
                id={companyId}
                path={attachment}
                onDelete={setAttachment}
              />
            }
            backTo={backTo(companyId)}
            categories={data.getSettings.categories.map(
              ({ name, vatRate }) => ({
                name,
                value: vatRate.toFixed(2),
              }),
            )}
            clients={data.getClients.items.map(({ name }) => ({
              name,
              value: name,
            }))}
            companyId={companyId}
            loading={addLoading}
            purchases={data.getTypeahead?.purchases}
            sales={data.getTypeahead?.sales}
            suppliers={data.getTypeahead?.suppliers}
            uploader={
              <UploadAttachment
                id={companyId}
                name="attachment"
                onUpload={setAttachment}
              />
            }
            vat={data.getSettings.vat.pay}
            onSave={save}
          />
        </>
      )}
    </Connected>
  );
}

export default RecordTransaction;
