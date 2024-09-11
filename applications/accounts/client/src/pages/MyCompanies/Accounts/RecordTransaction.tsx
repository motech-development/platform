import {
  ApolloCache,
  MutationUpdaterFunction,
  Reference,
  useMutation,
  useQuery,
} from '@apollo/client';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import TransactionForm, {
  FormSchema,
} from '../../../components/TransactionForm';
import { gql } from '../../../graphql';
import {
  AddTransactionMutation,
  MutationAddTransactionArgs,
} from '../../../graphql/graphql';
import invariant from '../../../utils/invariant';
import { findUnique, setItems, spread } from '../../../utils/transactions';
import UploadAttachment from './shared/UploadAttachment';
import ViewAttachment from './shared/ViewAttachment';

export const update: MutationUpdaterFunction<
  AddTransactionMutation,
  MutationAddTransactionArgs,
  unknown,
  ApolloCache<unknown>
> = (cache, { data }) => {
  if (data?.addTransaction) {
    const { addTransaction } = data;

    cache.modify({
      fields: {
        purchases: (items: string[] | Reference) => {
          const descriptions = setItems(items);
          const unique = !descriptions.some(
            findUnique(addTransaction, 'description'),
          );

          if (spread(addTransaction.category !== 'Sales', unique)) {
            return [...descriptions, addTransaction.description].sort((a, b) =>
              a.localeCompare(b),
            );
          }

          return descriptions;
        },
        sales: (items: string[] | Reference) => {
          const descriptions = setItems(items);
          const unique = !descriptions.some(
            findUnique(addTransaction, 'description'),
          );

          if (spread(addTransaction.category === 'Sales', unique)) {
            return [...descriptions, addTransaction.description].sort((a, b) =>
              a.localeCompare(b),
            );
          }

          return descriptions;
        },
        suppliers: (items: string[] | Reference) => {
          const suppliers = setItems(items);
          const unique = !suppliers.some(findUnique(addTransaction, 'name'));

          if (spread(addTransaction.category !== 'Sales', unique)) {
            return [...suppliers, addTransaction.name].sort((a, b) =>
              a.localeCompare(b),
            );
          }

          return suppliers;
        },
      },
      id: cache.identify({
        __typename: 'Typeahead',
        id: addTransaction.companyId,
      }),
    });

    cache.modify({
      fields: {
        items: (refs: readonly Reference[], { readField }) => {
          if (refs.some((ref) => readField('id', ref) === addTransaction.id)) {
            return [...refs];
          }

          const newRef = cache.writeFragment({
            data: addTransaction,
            fragment: gql(/* GraphQL */ `
              fragment NewTransaction on Transaction {
                amount
                attachment
                date
                description
                id
                name
                scheduled
              }
            `),
          });

          if (!newRef) {
            return [...refs];
          }

          return [...refs, newRef].sort((a, b) => {
            const readA = readField<string>('date', a);
            const readB = readField<string>('date', b);

            if (readA && readB) {
              return readA.localeCompare(readB);
            }

            return 0;
          });
        },
      },
      id: cache.identify({
        __typename: 'Transactions',
        id: addTransaction.companyId,
        status: addTransaction.status,
      }),
    });
  }
};

export const RECORD_TRANSACTION = gql(/* GraphQL */ `
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
`);

export const ADD_TRANSACTION = gql(/* GraphQL */ `
  mutation AddTransaction($input: TransactionInput!) {
    addTransaction(input: $input) {
      amount
      attachment
      category
      companyId
      date
      description
      id
      name
      refund
      scheduled
      status
      vat
    }
  }
`);

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
  const { data, error, loading } = useQuery(RECORD_TRANSACTION, {
    variables: {
      id: companyId,
    },
  });
  const [mutation, { error: addError, loading: addLoading }] = useMutation(
    ADD_TRANSACTION,
    {
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
    },
  );
  const save = (input: FormSchema) => {
    mutation({
      update,
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
