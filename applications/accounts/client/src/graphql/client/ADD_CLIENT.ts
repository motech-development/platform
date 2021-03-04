import { gql, MutationUpdaterFn, Reference } from '@apollo/client';

export interface IAddClientInput {
  input: {
    address: {
      line1: string;
      line2: string;
      line3: string;
      line4: string;
      line5: string;
    };
    companyId: string;
    contact: {
      email: string;
      telephone: string;
    };
    id: string;
    name: string;
  };
}

export interface IAddClientOutput {
  createClient?: {
    address: {
      line1: string;
      line2: string;
      line3: string;
      line4: string;
      line5: string;
    };
    companyId: string;
    contact: {
      email: string;
      telephone: string;
    };
    id: string;
    name: string;
  };
}

export const updateCache: MutationUpdaterFn<IAddClientOutput> = (
  cache,
  { data },
) => {
  if (data?.createClient) {
    const { createClient } = data;

    cache.modify({
      fields: {
        items: (refs: Reference[], { readField }) => {
          if (refs.some(ref => readField('id', ref) === createClient.id)) {
            return refs;
          }

          const newRef = cache.writeFragment({
            data: createClient,
            fragment: gql`
              fragment NewClient on Client {
                address {
                  line1
                  line2
                  line3
                  line4
                  line5
                }
                companyId
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
        __typename: 'Clients',
        id: createClient.companyId,
      }),
    });
  }
};

const ADD_CLIENT = gql`
  mutation CreateClient($input: ClientInput!) {
    createClient(input: $input) {
      address {
        line1
        line2
        line3
        line4
        line5
      }
      companyId
      contact {
        email
        telephone
      }
      id
      name
    }
  }
`;

export default ADD_CLIENT;
