import { gql } from 'apollo-boost';

export interface IGetBankAccountsInput {
  id: string;
}

export interface IGetBankAccountsOutput {
  getBankAccounts: {
    items: {
      accountIdentifications: {
        identification: string;
        type: string;
      }[];
      balance: string;
      currency: string;
      id: string;
      type: string;
    }[];
  };
}

const GET_BANK_ACCOUNTS = gql`
  query GetBankAccounts($id: ID!) {
    getBankAccounts(id: $id) {
      items {
        accountIdentifications {
          identification
          type
        }
        balance
        currency
        id
        type
      }
    }
  }
`;

export default GET_BANK_ACCOUNTS;
