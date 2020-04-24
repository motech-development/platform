import { useMutation, useQuery } from '@apollo/react-hooks';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import PurchaseForm, { FormSchema } from '../../../components/PurchaseForm';
import ADD_TRANSACTION, {
  IAddTransactionInput,
  IAddTransactionOutput,
} from '../../../graphql/transaction/ADD_TRANSACTION';
import withLayout from '../../../hoc/withLayout';

interface IQueryInput {
  id: string;
}

interface IQueryOutput {
  getSettings: {
    categories: {
      name: string;
      vatRate: number;
    }[];
  };
}

export const query = gql`
  query AddPurchase($id: ID!) {
    getSettings(id: $id) {
      categories {
        name
        vatRate
      }
    }
  }
`;

interface IAddPurchaseParams {
  companyId: string;
}

const AddPurchase: FC = () => {
  const history = useHistory();
  const { add } = useToast();
  const { companyId } = useParams<IAddPurchaseParams>();
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
    onCompleted: ({ addTransaction }) => {
      add({
        colour: 'success',
        message: t('add-purchase.success'),
      });

      history.push(backTo(addTransaction.companyId));
    },
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
            title={t('add-purchase.title')}
            subTitle={t('add-purchase.sub-title')}
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
            loading={addLoading}
            onSave={save}
          />
        </>
      )}
    </Connected>
  );
};

export default withLayout(AddPurchase);
