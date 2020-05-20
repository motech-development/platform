import { gql } from 'apollo-boost';

export interface IRequestUploadInput {
  id: string;
  extension: string;
}

export interface IRequestUploadOutput {
  requestUpload: {
    id: string;
    url: string;
  };
}

const REQUEST_UPLOAD = gql`
  mutation RequestUpload($id: ID!, $extension: String!) {
    requestUpload(id: $id, extension: $extension) {
      id
      url
    }
  }
`;

export default REQUEST_UPLOAD;
