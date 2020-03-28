import { gql } from 'apollo-boost';

export interface IOnConnectToBankOutput {
  onConnectToBank: {
    authorisationUrl: string;
  };
}

const ON_CONNECT_TO_BANK = gql`
  subscription OnConnectToBank {
    onConnectToBank {
      authorisationUrl
    }
  }
`;

export default ON_CONNECT_TO_BANK;
