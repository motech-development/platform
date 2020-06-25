import { gql } from 'apollo-boost';

export interface IGetTypeaheadInput {
  id: string;
}

export interface IGetTypeaheadOutput {
  getTypeahead: {
    descriptions: string[];
    id: string;
    suppliers: string[];
  };
}

const GET_TYPEAHEAD = gql`
  query GetTypeahead($id: ID!) {
    getTypeahead(id: $id) {
      descriptions
      id
      suppliers
    }
  }
`;

export default GET_TYPEAHEAD;
