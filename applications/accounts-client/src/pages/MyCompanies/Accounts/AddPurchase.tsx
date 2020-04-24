import { useQuery } from '@apollo/react-hooks';
import { PageTitle } from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import PurchaseForm from '../../../components/PurchaseForm';
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
  const { companyId } = useParams<IAddPurchaseParams>();
  const { t } = useTranslation('accounts');
  const { error, data, loading } = useQuery<IQueryOutput, IQueryInput>(query, {
    variables: {
      id: companyId,
    },
  });
  const backTo = (id: string) => `/my-companies/accounts/${id}`;
  const save = () => {};

  return (
    <Connected error={error} loading={loading}>
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
            loading={false}
            onSave={save}
          />
        </>
      )}
    </Connected>
  );
};

export default withLayout(AddPurchase);
