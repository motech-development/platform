import { gql } from 'apollo-boost';

export interface IDeleteBankConnectionInput {
  id: string;
}

export interface IDeleteBankConnectionOutput {
  deleteBankConnection: {
    bank: string;
    id: string;
    user: string;
  };
}

const DELETE_BANK_CONNECTION = gql`
  mutation DeleteBankConnection($id: ID!) {
    deleteBankConnection(id: $id) {
      bank
      id
      user
    }
  }
`;

export default DELETE_BANK_CONNECTION;
