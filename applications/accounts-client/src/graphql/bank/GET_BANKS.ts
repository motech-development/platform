import { gql } from 'apollo-boost';

export interface IGetBanksInput {
  id: string;
}

export interface IGetBanksOutput {
  getBanks: {
    items: {
      id: string;
      name: string;
    }[];
  };
  getBankSettings: {
    id: string;
    user: string;
  };
}

const GET_BANKS = gql`
  query GetBanks($id: ID!) {
    getBanks {
      items {
        id
        name
      }
    }
    getBankSettings(id: $id) {
      id
      user
    }
  }
`;

export default GET_BANKS;
