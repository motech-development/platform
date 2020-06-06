import { gql } from 'apollo-boost';

export interface IGetBanksInput {
  id: string;
}

export interface IGetBanksOutput {
  getBankSettings: {
    id: string;
    user: string;
  };
  getBanks: {
    items: {
      id: string;
      name: string;
    }[];
  };
}

const GET_BANKS = gql`
  query GetBanks($id: ID!) {
    getBankSettings(id: $id) {
      id
      user
    }
    getBanks {
      items {
        id
        name
      }
    }
  }
`;

export default GET_BANKS;
