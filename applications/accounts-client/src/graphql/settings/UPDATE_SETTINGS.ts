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
    yearEnd: {
      day: number;
      month: number;
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
    yearEnd: {
      day: number;
      month: number;
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
      yearEnd {
        day
        month
      }
    }
  }
`;

export default UPDATE_SETTINGS;
