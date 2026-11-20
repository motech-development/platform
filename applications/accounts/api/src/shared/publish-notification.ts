import gql from 'graphql-tag';
import type {
  Notification,
  NotificationBeaconMutation,
  NotificationBeaconMutationVariables,
} from '../graphql/graphql';
import createAppSyncClient from './appsync-client';

type IRecord = Pick<
  Notification,
  'createdAt' | 'id' | 'message' | 'owner' | 'payload'
> & {
  __typename: 'Notification';
};

export const isNotificationRecord = (value: unknown): value is IRecord => {
  if (typeof value !== 'object' || value === null || !('__typename' in value)) {
    return false;
  }

  const { __typename: typename } = value;

  return (
    typename === 'Notification' &&
    'createdAt' in value &&
    typeof value.createdAt === 'string' &&
    'id' in value &&
    typeof value.id === 'string' &&
    'message' in value &&
    typeof value.message === 'string' &&
    'owner' in value &&
    typeof value.owner === 'string' &&
    (!('payload' in value) ||
      value.payload === undefined ||
      value.payload === null ||
      typeof value.payload === 'string')
  );
};

export const mutation = gql`
  mutation NotificationBeacon($id: ID!, $input: NotificationInput!) {
    notificationBeacon(id: $id, input: $input) {
      createdAt
      id
      message
      owner
      payload
      read
    }
  }
`;

const publishNotification = async ({
  createdAt,
  id,
  message,
  owner,
  payload,
}: IRecord): ReturnType<ReturnType<typeof createAppSyncClient>['mutate']> =>
  createAppSyncClient().mutate<
    NotificationBeaconMutation,
    NotificationBeaconMutationVariables
  >({
    mutation,
    variables: {
      id: owner,
      input: {
        createdAt,
        id,
        message,
        owner,
        payload,
        read: false,
      },
    },
  });

export default publishNotification;
