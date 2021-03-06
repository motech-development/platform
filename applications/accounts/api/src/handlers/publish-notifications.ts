import { AWSAppSyncClient } from 'aws-appsync';
import { DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import { config, DynamoDB } from 'aws-sdk';
import 'cross-fetch/polyfill';
import gql from 'graphql-tag';

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
  const { AWS_REGION, ENDPOINT } = process.env;

  if (!AWS_REGION) {
    throw new Error('No region set');
  }

  if (!ENDPOINT) {
    throw new Error('No endpoint set');
  }

  if (!config.credentials) {
    throw new Error('No AWS credentials set');
  }

  const { Records } = event;
  const client = new AWSAppSyncClient({
    auth: {
      credentials: config.credentials,
      type: 'AWS_IAM',
    },
    disableOffline: true,
    region: AWS_REGION,
    url: ENDPOINT,
  });
  const mutations = Records.filter(
    ({ dynamodb, eventName }) =>
      eventName === 'INSERT' && dynamodb && dynamodb.NewImage,
  )
    .map(({ dynamodb }) => {
      const { NewImage } = dynamodb as StreamRecord;
      const {
        __typename,
        createdAt,
        id,
        message,
        owner,
        payload,
      } = DynamoDB.Converter.unmarshall(NewImage as DynamoDB.AttributeMap);

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
    // eslint-disable-next-line no-console
    console.error(e.message);
  }
};
