import { gql } from 'apollo-boost';

export interface IGetTransactionsInput {
  companyId: string;
  status: string;
}

export interface IGetTransactionsOutput {
  getBalance: {
    currency: string;
    id: string;
  };
  getTransactions: {
    id: string;
    items: {
      amount: number;
      attachment: string;
      date: string;
      description: string;
      id: string;
      name: string;
    }[];
  };
}

const GET_TRANSACTIONS = gql`
  query GetTransactions($companyId: ID!, $status: TransactionStatus!) {
    getBalance(id: $companyId) {
      currency
      id
    }
    getTransactions(companyId: $companyId, status: $status) {
      id
      items {
        amount
        attachment
        date
        description
        id
        name
      }
    }
  }
`;

export default GET_TRANSACTIONS;
