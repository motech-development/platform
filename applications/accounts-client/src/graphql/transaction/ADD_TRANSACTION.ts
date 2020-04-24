import { gql } from 'apollo-boost';

export interface IAddTransactionInput {
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

export interface IAddTransactionOutput {
  addTransaction: {
    companyId: string;
    id: string;
  };
}

const ADD_TRANSACTION = gql`
  mutation AddTransaction($input: TransactionInput!) {
    addTransaction(input: $input) {
      id
      companyId
    }
  }
`;

export default ADD_TRANSACTION;
