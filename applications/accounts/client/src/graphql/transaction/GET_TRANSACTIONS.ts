import { gql } from '@apollo/client';

export interface IGetTransactionsInput {
  id: string;
  status: string;
}

export interface IGetTransactionsOutput {
  getBalance?: {
    currency: string;
    id: string;
  };
  getTransactions?: {
    id: string;
    items: {
      amount: number;
      attachment: string;
      date: string;
      description: string;
      id: string;
      name: string;
      scheduled: boolean;
    }[];
    status: string;
  };
}

const GET_TRANSACTIONS = gql`
  query GetTransactions($id: ID!, $status: TransactionStatus!) {
    getBalance(id: $id) {
      currency
      id
      transactions {
        items {
          id
        }
      }
    }
    getTransactions(id: $id, status: $status) {
      id
      items {
        amount
        attachment
        date
        description
        id
        name
        scheduled
      }
      status
    }
  }
`;

export default GET_TRANSACTIONS;
