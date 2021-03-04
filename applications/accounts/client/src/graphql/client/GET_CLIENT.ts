import { gql } from '@apollo/client';

export interface IGetClientInput {
  id: string;
}

export interface IGetClientOutput {
  getClient?: {
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

const GET_CLIENT = gql`
  query GetClient($id: ID!) {
    getClient(id: $id) {
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

export default GET_CLIENT;
