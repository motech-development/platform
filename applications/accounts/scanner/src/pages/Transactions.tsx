import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import React, { FC, memo } from 'react';
// import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../components/Connected';
import Page from '../components/Page';

interface IGetTransactionsInput {
  id: string;
}

interface IGetTransactionsOutput {
  getCompany: {
    id: string;
    name: string;
  };
}

const GET_TRANSACTIONS = gql`
  query GetTransactions($id: ID!) {
    getCompany(id: $id) {
      id
      name
    }
  }
`;

interface ITransactionsParams {
  companyId: string;
}

const Transactions: FC = () => {
  // const { t } = useTranslation('transactions');
  const { companyId } = useParams<ITransactionsParams>();
  const { data, error, loading } = useQuery<
    IGetTransactionsOutput,
    IGetTransactionsInput
  >(GET_TRANSACTIONS, {
    variables: {
      id: companyId,
    },
  });

  return (
    <Connected error={error} loading={loading}>
      {data && (
        <Page title={data.getCompany.name} defaultHref="/my-companies">
          <div>Loaded</div>
        </Page>
      )}
    </Connected>
  );
};

export default memo(Transactions);
