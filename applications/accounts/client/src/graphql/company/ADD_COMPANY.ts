import { gql, MutationUpdaterFn, Reference } from '@apollo/client';

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
  createCompany?: {
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
  cache,
  { data },
) => {
  if (data?.createCompany) {
    const { createCompany } = data;

    cache.modify({
      fields: {
        items: (refs: Reference[], { readField }) => {
          if (refs.some((ref) => readField('id', ref) === createCompany.id)) {
            return refs;
          }

          const newRef = cache.writeFragment({
            data: createCompany,
            fragment: gql`
              fragment NewCompany on Company {
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
            `,
          });

          return [...refs, newRef].sort((a, b) =>
            readField<string>('name', a)!.localeCompare(
              readField<string>('name', b)!,
            ),
          );
        },
      },
      id: cache.identify({
        __typename: 'Companies',
        id: createCompany.owner,
      }),
    });
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
