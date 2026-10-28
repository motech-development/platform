import { AttributeValue as DdbAttributeValue } from '@aws-sdk/client-dynamodb';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import logger from '@motech-development/node-logger';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { AWSAppSyncClient } from 'aws-appsync';
import type { DynamoDBStreamHandler } from 'aws-lambda';
import gql from 'graphql-tag';
import type {
  Notification,
  NotificationBeaconMutation,
  NotificationBeaconMutationVariables,
} from '../graphql/graphql';
import { isStreamInsertRecord } from '../shared/utils';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

type IRecord = Pick<
  Notification,
  'createdAt' | 'id' | 'message' | 'owner' | 'payload'
> & {
  __typename: 'Notification';
};

const isNotificationRecord = (value: unknown): value is IRecord => {
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

export const handler: DynamoDBStreamHandler = wrapHandler(async (event) => {
  const credentials = fromNodeProviderChain({});

  const { AWS_REGION, ENDPOINT } = process.env;

  if (!AWS_REGION) {
    throw new Error('No region set');
  }

  if (!ENDPOINT) {
    throw new Error('No endpoint set');
  }

  const { Records } = event;
  const client = new AWSAppSyncClient({
    auth: {
      credentials,
      type: 'AWS_IAM',
    },
    disableOffline: true,
    region: AWS_REGION,
    url: ENDPOINT,
  });
  const mutations = Records.filter(isStreamInsertRecord)
    .map(({ dynamodb }) => {
      const { NewImage } = dynamodb;

      const item: unknown = unmarshall(
        NewImage as Record<string, DdbAttributeValue>,
      );

      return item;
    })
    .filter(isNotificationRecord)
    .map(({ createdAt, id, owner, payload, message }) => {
      const variables: NotificationBeaconMutationVariables = {
        id: owner,
        input: {
          createdAt,
          id,
          message,
          owner,
          payload,
          read: false,
        },
      };

      return client.mutate<
        NotificationBeaconMutation,
        NotificationBeaconMutationVariables
      >({
        mutation,
        variables,
      });
    });

  try {
    await Promise.all(mutations);
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
    } else {
      logger.error('Unhandled exception', e);
    }
  }
});
