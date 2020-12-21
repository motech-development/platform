import { gql } from '@apollo/client';

export interface IGetTypeaheadInput {
  id: string;
}

export interface IGetTypeaheadOutput {
  getTypeahead?: {
    id: string;
    purchases: string[] | null;
    sales: string[] | null;
    suppliers: string[] | null;
  };
}

const GET_TYPEAHEAD = gql`
  query GetTypeahead($id: ID!) {
    getTypeahead(id: $id) {
      id
      purchases
      sales
      suppliers
    }
  }
`;

export default GET_TYPEAHEAD;
