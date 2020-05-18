import { gql } from 'apollo-boost';

export interface IRequestUploadInput {
  input: {
    companyId: string;
    extension: string;
  };
}

export interface IRequestUploadOutput {
  requestUpload: {
    id: string;
    url: string;
  };
}

const REQUEST_UPLOAD = gql`
  mutation RequestUpload($input: UploadInput!) {
    requestUpload(input: $input) {
      id
      url
    }
  }
`;

export default REQUEST_UPLOAD;
