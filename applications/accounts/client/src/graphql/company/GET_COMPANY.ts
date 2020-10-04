import { gql } from '@apollo/client';

export interface IGetCompanyInput {
  id: string;
}

export interface IGetCompanyOutput {
  getCompany: {
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
  };
}

const GET_COMPANY = gql`
  query GetCompany($id: ID!) {
    getCompany(id: $id) {
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
`;

export default GET_COMPANY;
