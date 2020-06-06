import { gql } from 'apollo-boost';

export interface IUpdateBankSettingsInput {
  input: {
    account?: string | null;
    bank?: string | null;
    consent?: string | null;
    id: string;
    user?: string | null;
  };
}

export interface IUpdateBankSettingsOutput {
  updateBankSettings: {
    account: string;
    id: string;
    user: string;
  };
}

const UPDATE_BANK_SETTINGS = gql`
  mutation UpdateBankSettings($input: BankSettingsInput!) {
    updateBankSettings(input: $input) {
      account
      id
      user
    }
  }
`;

export default UPDATE_BANK_SETTINGS;
