import { gql, MutationUpdaterFn } from 'apollo-boost';
import GET_CLIENTS, {
  IGetClientsInput,
  IGetClientsOutput,
} from './GET_CLIENTS';

export interface IDeleteClientInput {
  id: string;
}

export interface IDeleteClientOutput {
  deleteClient: {
    companyId: string;
    id: string;
    name: string;
  };
}

export const updateCache: MutationUpdaterFn<IDeleteClientOutput> = (
  client,
  { data },
) => {
  if (data) {
    const { deleteClient } = data;

    try {
      const cache = client.readQuery<IGetClientsOutput, IGetClientsInput>({
        query: GET_CLIENTS,
        variables: {
          id: deleteClient.companyId,
        },
      });

      if (cache) {
        cache.getClients.items = cache.getClients.items.filter(
          ({ id }) => deleteClient.id !== id,
        );

        client.writeQuery<IGetClientsOutput, IGetClientsInput>({
          data: cache,
          query: GET_CLIENTS,
          variables: {
            id: deleteClient.companyId,
          },
        });
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
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
