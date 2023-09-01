/* eslint-disable @typescript-eslint/naming-convention */
import { AttributeValue as DdbAttributeValue } from '@aws-sdk/client-dynamodb';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AWSLambda } from '@sentry/serverless';
import logger from '@motech-development/node-logger';
import { AWSAppSyncClient } from 'aws-appsync';
import {
  AttributeValue,
  DynamoDBRecord,
  DynamoDBStreamHandler,
} from 'aws-lambda';
import gql from 'graphql-tag';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// TODO: Use generated types instead
interface IRecord {
  __typename: string;
  createdAt: string;
  id: string;
  message: string;
  owner: string;
  payload: string;
}

interface IFilteredRecord {
  eventName: 'INSERT';
  dynamodb: {
    NewImage: Record<string, AttributeValue>;
  };
}

const isStreamRecord = (value: DynamoDBRecord): value is IFilteredRecord => {
  if (value.eventName === 'INSERT') {
    return !!value.dynamodb?.NewImage;
  }

  return false;
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

export const handler: DynamoDBStreamHandler = AWSLambda.wrapHandler(
  async (event) => {
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
    const mutations = Records.filter(isStreamRecord)
      .map(({ dynamodb }) => {
        const { NewImage } = dynamodb;
        const { __typename, createdAt, id, message, owner, payload } =
          unmarshall(NewImage as Record<string, DdbAttributeValue>) as IRecord;

        return {
          __typename,
          createdAt,
          id,
          message,
          owner,
          payload,
        };
      })
      .filter(({ __typename }) => __typename === 'Notification')
      .map(({ createdAt, id, owner, payload, message }) =>
        client.mutate({
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
        }),
      );

    try {
      await Promise.all(mutations);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      } else {
        logger.error('Unhandled exception', e);
      }
    }
  },
);
