import { gql } from 'apollo-boost';

export interface IGetTypeaheadInput {
  id: string;
}

export interface IGetTypeaheadOutput {
  getTypeahead: {
    descriptions: string[];
    suppliers: string[];
  };
}

const GET_TYPEAHEAD = gql`
  query GetTypeahead($id: ID!) {
    getTypeahead(id: $id) {
      descriptions
      suppliers
    }
  }
`;

export default GET_TYPEAHEAD;
