import { gql } from 'apollo-boost';

export interface IGetClientsInput {
  count?: number;
  id: string;
  nextToken?: string;
}

export interface IGetClientsOutput {
  getClients: {
    id: string;
    items: {
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
    }[];
  };
  getCompany: {
    id: string;
    name: string;
  };
}

const GET_CLIENTS = gql`
  query GetClients($id: ID!) {
    getClients(companyId: $id) {
      id
      items {
        address {
          line1
          line2
          line3
          line4
          line5
        }
        contact {
          email
          telephone
        }
        id
        name
      }
    }
    getCompany(id: $id) {
      id
      name
    }
  }
`;

export default GET_CLIENTS;
