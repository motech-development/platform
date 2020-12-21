import { gql } from '@apollo/client';

export interface IOnBankCallbackOutput {
  onBankCallback?: {
    authorisationUrl: string;
  };
}

const ON_BANK_CALLBACK = gql`
  subscription OnBackCallback {
    onBankCallback {
      authorisationUrl
    }
  }
`;

export default ON_BANK_CALLBACK;
