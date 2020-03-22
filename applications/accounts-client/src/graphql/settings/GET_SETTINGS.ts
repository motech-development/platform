import { gql } from 'apollo-boost';

export interface IGetSettingsInput {
  id: string;
}

export interface IGetSettingsOutput {
  getCompany: {
    id: string;
    name: string;
  };
  getSettings: {
    categories: {
      name: string;
      vatRate: number;
    }[];
    id: string;
    vat: {
      charge: number;
      pay: number;
    };
  };
}

const GET_SETTINGS = gql`
  query GetSettings($id: ID!) {
    getCompany(id: $id) {
      id
      name
    }
    getSettings(id: $id) {
      categories {
        name
        vatRate
      }
      id
      vat {
        charge
        pay
      }
    }
  }
`;

export default GET_SETTINGS;
