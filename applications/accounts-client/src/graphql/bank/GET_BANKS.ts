import { gql } from 'apollo-boost';

export interface IGetBanksOutput {
  getBanks: {
    items: {
      id: string;
      name: string;
    }[];
  };
}

const GET_BANKS = gql`
  query GetBanks {
    getBanks {
      items {
        id
        name
      }
    }
  }
`;

export default GET_BANKS;
