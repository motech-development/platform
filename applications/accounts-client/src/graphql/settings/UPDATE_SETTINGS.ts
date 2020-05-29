import { gql } from 'apollo-boost';

export interface IUpdateSettingsInput {
  input: {
    categories: {
      name: string;
      protect: boolean;
      vatRate: number;
    }[];
    id: string;
    vat: {
      charge: number;
      pay: number;
    };
  };
}

export interface IUpdateSettingsOutput {
  updateSettings: {
    categories: {
      name: string;
      protect: boolean;
      vatRate: number;
    }[];
    id: string;
    vat: {
      charge: number;
      pay: number;
    };
  };
}

const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($input: SettingsInput!) {
    updateSettings(input: $input) {
      categories {
        name
        protect
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

export default UPDATE_SETTINGS;
