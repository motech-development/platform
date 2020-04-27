import { useMutation, useQuery } from '@apollo/react-hooks';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import SaleForm, { FormSchema } from '../../../components/SaleForm';
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
  getClients: {
    items: {
      name: string;
    }[];
  };
  getSettings: {
    vat: {
      pay: number;
    };
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
  query ViewSale($companyId: ID!, $transactionId: ID!) {
    getClients(companyId: $companyId) {
      items {
        id
        name
      }
    }
    getSettings(id: $companyId) {
      vat {
        pay
      }
    }
    getTransaction(id: $transactionId) {
      amount
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

interface IViewSaleParams {
  companyId: string;
  transactionId: string;
}

const ViewSale: FC = () => {
  const history = useHistory();
  const { add } = useToast();
  const { companyId, transactionId } = useParams<IViewSaleParams>();
  const { t } = useTranslation('accounts');
  const backTo = (id: string) => `/my-companies/accounts/${id}`;
  const { error, data, loading } = useQuery<IQueryOutput, IQueryInput>(query, {
    variables: {
      companyId,
      transactionId,
    },
  });
  const [mutation, { error: addError, loading: addLoading }] = useMutation<
    IUpdateTransactionOutput,
    IUpdateTransactionInput
  >(UPDATE_TRANSACTION, {
    awaitRefetchQueries: true,
    onCompleted: ({ updateTransaction }) => {
      add({
        colour: 'success',
        message: t('view-sale.success'),
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
    <Connected error={error || addError} loading={loading}>
      {data && (
        <>
          <PageTitle
            title={t('view-sale.title')}
            subTitle={t('view-sale.sub-title')}
          />

          <SaleForm
            backTo={backTo(companyId)}
            clients={data.getClients.items.map(({ name }) => ({
              name,
              value: name,
            }))}
            companyId={companyId}
            initialValues={data.getTransaction}
            loading={addLoading}
            vat={data.getSettings.vat.pay}
            onSave={save}
          />
        </>
      )}
    </Connected>
  );
};

export default withLayout(ViewSale);
