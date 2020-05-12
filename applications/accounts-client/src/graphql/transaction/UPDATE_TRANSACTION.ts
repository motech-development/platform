import { gql } from 'apollo-boost';

export interface IUpdateTransactionInput {
  input: {
    amount: number;
    category: string;
    companyId: string;
    date: string;
    description: string;
    id: string;
    name: string;
    status: string;
    vat: number;
  };
}

export interface IUpdateTransactionOutput {
  updateTransaction: {
    amount: number;
    category: string;
    companyId: string;
    date: string;
    description: string;
    id: string;
    name: string;
    status: string;
    vat: number;
  };
}

const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($input: TransactionInput!) {
    updateTransaction(input: $input) {
      amount
      category
      companyId
      date
      description
      id
      name
      status
      vat
    }
  }
`;

export default UPDATE_TRANSACTION;
