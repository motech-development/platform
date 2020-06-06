import { gql } from 'apollo-boost';

export interface IGetSettingsInput {
  id: string;
}

export interface IGetSettingsOutput {
  getBankSettings: {
    account: string;
    bank: string;
    id: string;
    user: string;
  };
  getCompany: {
    id: string;
    name: string;
  };
  getSettings: {
    categories: {
      name: string;
      protect: boolean;
      vatRate: number;
    }[];
    id: string;
    vat: {
      charge: number;
      pay: number;
      registration: string;
      scheme: string;
    };
    yearEnd: {
      day: number;
      month: number;
    };
  };
}

const GET_SETTINGS = gql`
  query GetSettings($id: ID!) {
    getBankSettings(id: $id) {
      account
      bank
      id
      user
    }
    getCompany(id: $id) {
      id
      name
    }
    getSettings(id: $id) {
      categories {
        name
        protect
        vatRate
      }
      id
      vat {
        charge
        pay
        registration
        scheme
      }
      yearEnd {
        day
        month
      }
    }
  }
`;

export default GET_SETTINGS;
