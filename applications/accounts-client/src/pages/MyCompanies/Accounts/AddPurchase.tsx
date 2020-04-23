import { PageTitle } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import PurchaseForm from '../../../components/PurchaseForm';
import withLayout from '../../../hoc/withLayout';

const data = {
  getSettings: {
    categories: [
      {
        name: 'Accommodation',
        vatRate: 20,
      },
      {
        name: 'Travel',
        vatRate: 0,
      },
    ],
  },
};

interface IAddPurchaseParams {
  companyId: string;
}

const AddPurchase: FC = () => {
  const { companyId } = useParams<IAddPurchaseParams>();
  const { t } = useTranslation('accounts');
  const backTo = (id: string) => `/my-companies/accounts/${id}`;
  const save = () => {};

  return (
    <Connected error={undefined} loading={false}>
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
