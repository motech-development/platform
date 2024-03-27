import { gql } from '@apollo/client';

export interface IDeleteTransactionInput {
  id: string;
}

export interface IDeleteTransactionOutput {
  deleteTransaction?: {
    companyId: string;
    id: string;
    status: string;
  };
}

const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      companyId
      id
      status
    }
  }
`;

export default DELETE_TRANSACTION;
