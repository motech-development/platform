import { gql, MutationUpdaterFn, Reference } from '@apollo/client';

export interface IDeleteClientInput {
  id: string;
}

export interface IDeleteClientOutput {
  deleteClient?: {
    companyId: string;
    id: string;
    name: string;
  };
}

export const updateCache: MutationUpdaterFn<IDeleteClientOutput> = (
  cache,
  { data },
) => {
  if (data?.deleteClient) {
    const { deleteClient } = data;

    cache.modify({
      fields: {
        items: (refs: Reference[], { readField }) =>
          refs.filter(ref => readField('id', ref) !== deleteClient.id),
      },
      id: cache.identify({
        __typename: 'Clients',
        id: deleteClient.companyId,
      }),
    });
  }
};

const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id) {
      companyId
      id
      name
    }
  }
`;

export default DELETE_CLIENT;
