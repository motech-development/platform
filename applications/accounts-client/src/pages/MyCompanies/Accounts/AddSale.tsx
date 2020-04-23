import { PageTitle } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import SaleForm from '../../../components/SaleForm';
import withLayout from '../../../hoc/withLayout';

const data = {
  getClients: {
    items: [
      {
        name: 'Client 1',
      },
      {
        name: 'Client 2',
      },
    ],
  },
  getSettings: {
    vat: {
      pay: 15.5,
    },
  },
};

interface IAddSaleParams {
  companyId: string;
}

const AddSale: FC = () => {
  const { companyId } = useParams<IAddSaleParams>();
  const { t } = useTranslation('accounts');
  const backTo = (id: string) => `/my-companies/accounts/${id}`;
  const save = () => {};

  return (
    <Connected error={undefined} loading={false}>
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
