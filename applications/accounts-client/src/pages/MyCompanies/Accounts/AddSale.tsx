import { useQuery } from '@apollo/react-hooks';
import { PageTitle } from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import SaleForm from '../../../components/SaleForm';
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
  const { companyId } = useParams<IAddSaleParams>();
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
            loading={false}
            vat={data.getSettings.vat.pay}
            onSave={save}
          />
        </>
      )}
    </Connected>
  );
};

export default withLayout(AddSale);
