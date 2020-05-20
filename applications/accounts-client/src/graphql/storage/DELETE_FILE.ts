import { gql } from 'apollo-boost';

export interface IDeleteFileInput {
  path: string;
}

export interface IDeleteFileOutput {
  deleteFile: {
    path: string;
  };
}

const DELETE_FILE = gql`
  mutation DeleteFile($path: ID!) {
    deleteFile(path: $path) {
      path
    }
  }
`;

export default DELETE_FILE;
