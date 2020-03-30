import { gql } from 'apollo-boost';

export interface IGetBankSettingsInput {
  id: string;
}

export interface IGetBankSettingsOutput {
  getBankSettings: {
    id: string;
    user: string;
  };
}

const GET_BANK_SETTINGS = gql`
  query GetBankSettings($id: ID!) {
    getBankSettings(id: $id) {
      id
      user
    }
  }
`;

export default GET_BANK_SETTINGS;
