import { useMutation, useQuery } from '@apollo/react-hooks';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import TransactionForm, {
  FormSchema,
} from '../../../components/TransactionForm';
import GET_BALANCE from '../../../graphql/balance/GET_BALANCE';
import ADD_TRANSACTION, {
  IAddTransactionInput,
  IAddTransactionOutput,
  updateCache,
} from '../../../graphql/transaction/ADD_TRANSACTION';
import withLayout from '../../../hoc/withLayout';
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
    awaitRefetchQueries: true,
    onCompleted: ({ addTransaction }) => {
      add({
        colour: 'success',
        message: t('record-transaction.success'),
      });

      history.push(backTo(addTransaction.companyId));
    },
    refetchQueries: () => [
      {
        query: GET_BALANCE,
        variables: {
          id: companyId,
        },
      },
    ],
  });
  const backTo = (id: string) => `/my-companies/accounts/${id}`;
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
            loading={addLoading}
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

export default withLayout(RecordTransaction);
