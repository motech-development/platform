import { gql } from '@apollo/client';

export interface IGetBankSettingsInput {
  id: string;
}

export interface IGetBankSettingsOutput {
  getBankSettings?: {
    account: string;
    id: string;
    user: string;
  };
}

const GET_BANK_SETTINGS = gql`
  query GetBankSettings($id: ID!) {
    getBankSettings(id: $id) {
      account
      id
      user
    }
  }
`;

export default GET_BANK_SETTINGS;
