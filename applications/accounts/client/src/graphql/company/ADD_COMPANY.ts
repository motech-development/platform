import { gql, MutationUpdaterFn } from '@apollo/client';
import GET_COMPANIES, { IGetCompaniesOutput } from './GET_COMPANIES';

export interface IAddCompanyInput {
  input: {
    balance: {
      balance: number;
      vat: {
        owed: number;
        paid: number;
      };
    };
    company: {
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
  };
}

export const updateCache: MutationUpdaterFn<IAddCompanyOutput> = (
  client,
  { data },
) => {
  if (data) {
    const { createCompany } = data;

    try {
      const cache = client.readQuery<IGetCompaniesOutput>({
        query: GET_COMPANIES,
      });

      if (cache) {
        const items = [
          ...cache.getCompanies.items,
          createCompany,
        ].sort((a, b) => a.name.localeCompare(b.name));

        client.writeQuery<IGetCompaniesOutput>({
          data: {
            getCompanies: {
              ...cache.getCompanies,
              items,
            },
          },
          query: GET_COMPANIES,
        });
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
};

const ADD_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
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
    }
  }
`;

export default ADD_COMPANY;
