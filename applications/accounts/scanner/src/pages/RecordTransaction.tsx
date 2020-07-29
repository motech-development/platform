import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Page from '../components/Page';
import TransactionForm from '../components/TransactionForm';

interface IRecordTransactionParams {
  companyId: string;
}

const RecordTransaction: FC = () => {
  const { t } = useTranslation('record-transaction');
  const { companyId } = useParams<IRecordTransactionParams>();

  return (
    <Page defaultHref={`/transactions/${companyId}`} title={t('title')}>
      <TransactionForm />
    </Page>
  );
};

export default memo(RecordTransaction);
