import { gql, MutationUpdaterFn } from '@apollo/client';
import GET_COMPANIES, {
  IGetCompaniesInput,
  IGetCompaniesOutput,
} from './GET_COMPANIES';

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
    owner: string;
  };
}

export const updateCache: MutationUpdaterFn<IAddCompanyOutput> = (
  client,
  { data },
) => {
  if (data) {
    const { createCompany } = data;

    try {
      const cache = client.readQuery<IGetCompaniesOutput, IGetCompaniesInput>({
        query: GET_COMPANIES,
        variables: {
          id: createCompany.owner,
        },
      });

      if (cache) {
        const items = [
          ...cache.getCompanies.items,
          createCompany,
        ].sort((a, b) => a.name.localeCompare(b.name));

        client.writeQuery<IGetCompaniesOutput, IGetCompaniesInput>({
          data: {
            getCompanies: {
              ...cache.getCompanies,
              items,
            },
          },
          query: GET_COMPANIES,
          variables: {
            id: createCompany.owner,
          },
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
      owner
    }
  }
`;

export default ADD_COMPANY;
