import { gql, MutationUpdaterFn } from 'apollo-boost';
import GET_COMPANIES, { IGetCompaniesOutput } from './GET_COMPANIES';

export interface IAddCompanyInput {
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
    vatRegistration: string;
  };
}

export interface IAddCompanyOutput {
  createCompany: {
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
    vatRegistration: string;
  };
}

export const updateCache: MutationUpdaterFn<IAddCompanyOutput> = (
  client,
  { data },
) => {
  const cache = client.readQuery<IGetCompaniesOutput>({
    query: GET_COMPANIES,
  }) as IGetCompaniesOutput;
  const { createCompany } = data as IAddCompanyOutput;

  cache.getCompanies.items = [...cache.getCompanies.items, createCompany];

  client.writeQuery<IGetCompaniesOutput>({
    data: cache,
    query: GET_COMPANIES,
  });
};

const ADD_COMPANY = gql`
  mutation CreateCompany($input: CompanyInput!) {
    createCompany(input: $input) {
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
      vatRegistration
    }
  }
`;

export default ADD_COMPANY;
