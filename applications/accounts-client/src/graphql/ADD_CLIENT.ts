import { gql, MutationUpdaterFn } from 'apollo-boost';
import GET_CLIENTS, {
  IGetClientsInput,
  IGetClientsOutput,
} from './GET_CLIENTS';

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
  createClient: {
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
  client,
  { data },
) => {
  const { createClient } = data as IAddClientOutput;
  const id = createClient.companyId;
  const cache = client.readQuery<IGetClientsOutput, IGetClientsInput>({
    query: GET_CLIENTS,
    variables: {
      id,
    },
  }) as IGetClientsOutput;

  cache.getClients.items = [
    ...cache.getClients.items,
    createClient,
  ].sort((a, b) => a.name.localeCompare(b.name));

  client.writeQuery<IGetClientsOutput, IGetClientsInput>({
    data: cache,
    query: GET_CLIENTS,
    variables: {
      id,
    },
  });
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
