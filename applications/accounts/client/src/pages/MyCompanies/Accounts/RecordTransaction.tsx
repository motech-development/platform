import { useMutation, useQuery } from '@apollo/react-hooks';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import React, { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import TransactionForm, {
  FormSchema,
} from '../../../components/TransactionForm';
import ADD_TRANSACTION, {
  IAddTransactionInput,
  IAddTransactionOutput,
  updateCache,
} from '../../../graphql/transaction/ADD_TRANSACTION';
import UploadAttachment from './shared/UploadAttachment';
import ViewAttachment from './shared/ViewAttachment';

interface IRecordTransactionInput {
  id: string;
}

interface IRecordTransactionOutput {
  getClients: {
    items: {
      id: string;
      name: string;
    }[];
  };
  getSettings: {
    categories: {
      name: string;
      vatRate: number;
    }[];
    vat: {
      pay: number;
    };
  };
  getTypeahead: {
    descriptions: string[];
    suppliers: string[];
  };
}

export const RECORD_TRANSACTION = gql`
  query RecordTransaction($id: ID!) {
    getClients(companyId: $id) {
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
      descriptions
      suppliers
    }
  }
`;

interface IRecordTransactionParams {
  companyId: string;
}

const RecordTransaction: FC = () => {
  const history = useHistory();
  const { companyId } = useParams<IRecordTransactionParams>();
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
      add({
        colour: 'success',
        message: t('record-transaction.success'),
      });

      history.push(backTo(addTransaction.companyId, addTransaction.status));
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
    <Connected error={error || addError} loading={loading}>
      {data && (
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
            descriptions={data.getTypeahead.descriptions}
            loading={addLoading}
            suppliers={data.getTypeahead.suppliers}
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
};

export default memo(RecordTransaction);
