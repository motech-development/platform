import { gql } from 'apollo-boost';

export interface IGetCompaniesInput {
  count?: number;
  nextToken?: string;
}

export interface IGetCompaniesOutput {
  getCompanies: {
    items: {
      address: {
        line1: string;
        line2: string;
        line3: string;
        line4: string;
        line5: string;
      };
      bank: {
        accountNumber: string;
        sortCode: string;
      };
      companyNumber: string;
      contact: {
        email: string;
        telephone: string;
      };
      id: string;
      name: string;
    }[];
  };
}

const GET_COMPANIES = gql`
  query GetCompanies {
    getCompanies {
      items {
        address {
          line1
          line2
          line3
          line4
          line5
        }
        bank {
          accountNumber
          sortCode
        }
        companyNumber
        contact {
          email
          telephone
        }
        id
        name
      }
    }
  }
`;

export default GET_COMPANIES;
