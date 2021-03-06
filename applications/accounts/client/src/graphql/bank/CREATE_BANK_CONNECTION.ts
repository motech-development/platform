import { gql } from '@apollo/client';

export interface ICreateBankConnectionInput {
  input: {
    bank: string;
    callback: string;
    companyId: string;
    user?: string;
  };
}

export interface ICreateBankConnectionOutput {
  createBankConnection?: {
    status: string;
  };
}

const CREATE_BANK_CONNECTION = gql`
  mutation CreateBankConnection($input: BankConnectionInput!) {
    createBankConnection(input: $input) {
      status
    }
  }
`;

export default CREATE_BANK_CONNECTION;
