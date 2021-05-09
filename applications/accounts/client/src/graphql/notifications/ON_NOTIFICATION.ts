import { gql } from '@apollo/client';

export interface IOnNotificationInput {
  owner: string;
}

export interface IOnNotificationOutput {
  onNotification?: {
    createdAt: string;
    id: string;
    message: string;
    owner: string;
    payload: string;
    read: boolean;
  };
}

const ON_NOTIFICATION = gql`
  subscription OnNotification($owner: String!) {
    onNotification(owner: $owner) {
      createdAt
      id
      message
      owner
      payload
      read
    }
  }
`;

export default ON_NOTIFICATION;
