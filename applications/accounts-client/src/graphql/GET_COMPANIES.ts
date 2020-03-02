import { gql } from 'apollo-boost';

export interface IGetCompaniesOutput {
  getCompanies: {
    items: {
      companyNumber: string;
      id: string;
      name: string;
      vatRegistration: string;
    }[];
  };
}

const GET_COMPANIES = gql`
  query GetCompanies {
    getCompanies {
      items {
        companyNumber
        id
        name
        vatRegistration
      }
    }
  }
`;

export default GET_COMPANIES;
