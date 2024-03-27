/* eslint-disable @typescript-eslint/naming-convention */
import { AttributeValue as DdbAttributeValue } from '@aws-sdk/client-dynamodb';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import logger from '@motech-development/node-logger';
import { AWSAppSyncClient } from 'aws-appsync';
import { DynamoDBStreamHandler } from 'aws-lambda';
import gql from 'graphql-tag';
import { isStreamInsertRecord } from '../shared/utils';

// TODO: Use generated types instead
interface IRecord {
  __typename: string;
  createdAt: string;
  id: string;
  message: string;
  owner: string;
  payload: string;
}

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

export const handler: DynamoDBStreamHandler = async (event) => {
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
      const { __typename, createdAt, id, message, owner, payload } = unmarshall(
        NewImage as Record<string, DdbAttributeValue>,
      ) as IRecord;

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
};
