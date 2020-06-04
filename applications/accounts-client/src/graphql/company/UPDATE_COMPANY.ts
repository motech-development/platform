import { gql } from 'apollo-boost';

export interface IUpdateCompanyInput {
  input: {
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

export interface IUpdateCompanyOutput {
  updateCompany: {
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

const UPDATE_COMPANY = gql`
  mutation UpdateCompany($input: CompanyInput!) {
    updateCompany(input: $input) {
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

export default UPDATE_COMPANY;
