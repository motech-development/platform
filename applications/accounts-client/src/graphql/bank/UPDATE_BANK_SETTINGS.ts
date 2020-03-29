import { gql } from 'apollo-boost';

export interface IUpdateBankSettingsInput {
  input: {
    account?: string;
    bank?: string;
    consent?: string;
    id: string;
    user?: string;
  };
}

export interface IUpdateBankSettingsOutput {
  updateBankSettings: {
    id: string;
  };
}

const UPDATE_BANK_SETTINGS = gql`
  mutation UpdateBankSettings($input: BankSettingsInput!) {
    updateBankSettings(input: $input) {
      id
    }
  }
`;

export default UPDATE_BANK_SETTINGS;
