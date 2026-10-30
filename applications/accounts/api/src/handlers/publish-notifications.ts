import { AttributeValue as DdbAttributeValue } from '@aws-sdk/client-dynamodb';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import logger from '@motech-development/node-logger';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { AWSAppSyncClient } from 'aws-appsync';
import type {
  DynamoDBBatchResponse,
  DynamoDBRecord,
  DynamoDBStreamHandler,
} from 'aws-lambda';
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNotificationRecord = (value: unknown): value is IRecord => {
  if (!isRecord(value)) return false;

  const { __typename: typename } = value;

  if (typename !== 'Notification') return false;

  const { createdAt, id, message, owner, payload } = value;

  return (
    typeof createdAt === 'string' &&
    createdAt.length > 0 &&
    typeof id === 'string' &&
    id.length > 0 &&
    typeof message === 'string' &&
    message.length > 0 &&
    typeof owner === 'string' &&
    owner.length > 0 &&
    (!('payload' in value) ||
      payload === undefined ||
      payload === null ||
      typeof payload === 'string')
  );
};

const isPublishedNotification = (
  value: unknown,
  input: IRecord,
): value is Record<string, unknown> => {
  if (!isRecord(value)) return false;

  const { createdAt, id, message, owner, payload, read } = value;

  return (
    createdAt === input.createdAt &&
    id === input.id &&
    message === input.message &&
    owner === input.owner &&
    (payload ?? null) === (input.payload ?? null) &&
    read === false &&
    (payload === undefined || payload === null || typeof payload === 'string')
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

const createClient = (region: string, url: string) =>
  new AWSAppSyncClient({
    auth: {
      credentials: fromNodeProviderChain({}),
      type: 'AWS_IAM',
    },
    disableOffline: true,
    region,
    url,
  });

const publishRecord = async (
  client: ReturnType<typeof createClient>,
  record: DynamoDBRecord,
) => {
  const keys = record.dynamodb?.Keys;
  const sequenceNumber = record.dynamodb?.SequenceNumber;

  if (!isStreamInsertRecord(record)) return;

  let item: unknown;

  try {
    item = unmarshall(
      record.dynamodb.NewImage as Record<string, DdbAttributeValue>,
    );
  } catch (error) {
    logger.error('Skipping malformed notification stream image', {
      error,
      keys,
      sequenceNumber,
    });

    return;
  }

  if (!isRecord(item)) return;

  const { __typename: typename } = item;

  if (typename !== 'Notification') return;

  if (!isNotificationRecord(item)) {
    logger.error('Skipping notification without valid required fields', {
      keys,
      sequenceNumber,
    });

    return;
  }

  const { createdAt, id, owner, payload, message } = item;
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

  const result: unknown = await client.mutate<
    NotificationBeaconMutation,
    NotificationBeaconMutationVariables
  >({
    mutation,
    variables,
  });

  if (!isRecord(result)) {
    throw new Error('Notification beacon returned an invalid GraphQL response');
  }

  if (
    result.errors !== undefined &&
    (!Array.isArray(result.errors) || result.errors.length > 0)
  ) {
    const graphQLErrors = Array.isArray(result.errors) ? result.errors : [];
    const errors = graphQLErrors.map((error) =>
      isRecord(error) && typeof error.message === 'string'
        ? error.message
        : 'Unknown GraphQL error',
    );

    throw new Error(
      `Notification beacon returned GraphQL errors: ${errors.join('; ')}`,
    );
  }

  const { data } = result;

  if (
    !isRecord(data) ||
    !isPublishedNotification(data.notificationBeacon, item)
  ) {
    throw new Error(
      'Notification beacon returned an invalid notification result',
    );
  }
};

export const handler: DynamoDBStreamHandler = wrapHandler(async (event) => {
  const { AWS_REGION, ENDPOINT } = process.env;

  if (!AWS_REGION) {
    throw new Error('No region set');
  }

  if (!ENDPOINT) {
    throw new Error('No endpoint set');
  }

  const client = createClient(AWS_REGION, ENDPOINT);

  return event.Records.reduce<Promise<DynamoDBBatchResponse>>(
    async (previous, record) => {
      const result = await previous;

      if (result.batchItemFailures.length > 0) return result;

      try {
        await publishRecord(client, record);

        return {
          batchItemFailures: [],
        };
      } catch (error) {
        logger.error('Failed to publish notification stream record', {
          error,
          keys: record.dynamodb?.Keys,
          sequenceNumber: record.dynamodb?.SequenceNumber,
        });

        const sequenceNumber = record.dynamodb?.SequenceNumber;

        if (!sequenceNumber) throw error;

        return {
          batchItemFailures: [
            {
              itemIdentifier: sequenceNumber,
            },
          ],
        };
      }
    },
    Promise.resolve({
      batchItemFailures: [],
    }),
  );
});
