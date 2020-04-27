import { useMutation, useQuery } from '@apollo/react-hooks';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import PurchaseForm, { FormSchema } from '../../../components/PurchaseForm';
import GET_BALANCE from '../../../graphql/balance/GET_BALANCE';
import UPDATE_TRANSACTION, {
  IUpdateTransactionInput,
  IUpdateTransactionOutput,
} from '../../../graphql/transaction/UPDATE_TRANSACTION';
import withLayout from '../../../hoc/withLayout';

interface IQueryInput {
  companyId: string;
  transactionId: string;
}

interface IQueryOutput {
  getSettings: {
    categories: {
      name: string;
      vatRate: number;
    }[];
  };
  getTransaction: {
    amount: number;
    category: string;
    companyId: string;
    date: string;
    description: string;
    id: string;
    name: string;
    status: string;
    vat: number;
  };
}

export const query = gql`
  query ViewPurchase($companyId: ID!, $transactionId: ID!) {
    getSettings(id: $companyId) {
      categories {
        name
        vatRate
      }
    }
    getTransaction(id: $transactionId) {
      amount
      category
      companyId
      date
      description
      id
      name
      status
      vat
    }
  }
`;

interface IViewPurchaseParams {
  companyId: string;
  transactionId: string;
}

const ViewPurchase: FC = () => {
  const history = useHistory();
  const { add } = useToast();
  const { companyId, transactionId } = useParams<IViewPurchaseParams>();
  const { t } = useTranslation('accounts');
  const backTo = (id: string) => `/my-companies/accounts/${id}`;
  const { error, data, loading } = useQuery<IQueryOutput, IQueryInput>(query, {
    variables: {
      companyId,
      transactionId,
    },
  });
  const [
    mutation,
    { error: mutationError, loading: mutationLoading },
  ] = useMutation<IUpdateTransactionOutput, IUpdateTransactionInput>(
    UPDATE_TRANSACTION,
    {
      awaitRefetchQueries: true,
      onCompleted: ({ updateTransaction }) => {
        add({
          colour: 'success',
          message: t('view-purchase.success'),
        });

        history.push(backTo(updateTransaction.companyId));
      },
      refetchQueries: () => [
        {
          query: GET_BALANCE,
          variables: {
            id: companyId,
          },
        },
      ],
    },
  );

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
    <Connected error={error || mutationError} loading={loading}>
      {data && (
        <>
          <PageTitle
            title={t('view-purchase.title')}
            subTitle={t('view-purchase.sub-title')}
          />

          <PurchaseForm
            backTo={backTo(companyId)}
            categories={data.getSettings.categories.map(
              ({ name, vatRate }) => ({
                name,
                value: vatRate.toFixed(2),
              }),
            )}
            companyId={companyId}
            initialValues={data.getTransaction}
            loading={mutationLoading}
            onSave={save}
          />
        </>
      )}
    </Connected>
  );
};

export default withLayout(ViewPurchase);
