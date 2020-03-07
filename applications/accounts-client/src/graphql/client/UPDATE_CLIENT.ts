import { gql } from 'apollo-boost';

export interface IUpdateClientInput {
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

export interface IUpdateClientOutput {
  updateClient: {
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

const UPDATE_CLIENT = gql`
  mutation UpdateClient($input: ClientInput!) {
    updateClient(input: $input) {
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

export default UPDATE_CLIENT;
