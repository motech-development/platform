import { gql } from 'apollo-boost';

export interface IConnectToBankInput {
  input: {
    bank: string;
    callback: string;
    companyId: string;
  };
}

export interface IConnectToBankOutput {
  connectToBank: {
    authorisationUrl: string;
    status: string;
  };
}

const CONNECT_TO_BANK = gql`
  mutation ConnectToBank($input: BankConnectInput!) {
    connectToBank(input: $input) {
      status
    }
  }
`;

export default CONNECT_TO_BANK;
