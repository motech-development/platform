import { gql } from '@apollo/client';

export interface IDeleteBankConnectionInput {
  id: string;
}

export interface IDeleteBankConnectionOutput {
  deleteBankConnection: {
    account: string;
    bank: string;
    id: string;
    user: string;
  };
}

const DELETE_BANK_CONNECTION = gql`
  mutation DeleteBankConnection($id: ID!) {
    deleteBankConnection(id: $id) {
      account
      bank
      id
      user
    }
  }
`;

export default DELETE_BANK_CONNECTION;
