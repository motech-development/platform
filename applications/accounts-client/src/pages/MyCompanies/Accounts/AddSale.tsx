import { useMutation, useQuery } from '@apollo/react-hooks';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import SaleForm, { FormSchema } from '../../../components/SaleForm';
import GET_BALANCE from '../../../graphql/balance/GET_BALANCE';
import ADD_TRANSACTION, {
  IAddTransactionInput,
  IAddTransactionOutput,
} from '../../../graphql/transaction/ADD_TRANSACTION';
import withLayout from '../../../hoc/withLayout';

interface IQueryInput {
  id: string;
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
}

export const query = gql`
  query AddSale($id: ID!) {
    getClients(companyId: $id) {
      items {
        id
        name
      }
    }
    getSettings(id: $id) {
      vat {
        pay
      }
    }
  }
`;

interface IAddSaleParams {
  companyId: string;
}

const AddSale: FC = () => {
  const history = useHistory();
  const { add } = useToast();
  const { companyId } = useParams<IAddSaleParams>();
  const { t } = useTranslation('accounts');
  const backTo = (id: string) => `/my-companies/accounts/${id}`;
  const { error, data, loading } = useQuery<IQueryOutput, IQueryInput>(query, {
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
        message: t('add-sale.success'),
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
            title={t('add-sale.title')}
            subTitle={t('add-sale.sub-title')}
          />

          <SaleForm
            backTo={backTo(companyId)}
            clients={data.getClients.items.map(({ name }) => ({
              name,
              value: name,
            }))}
            companyId={companyId}
            loading={addLoading}
            vat={data.getSettings.vat.pay}
            onSave={save}
          />
        </>
      )}
    </Connected>
  );
};

export default withLayout(AddSale);
