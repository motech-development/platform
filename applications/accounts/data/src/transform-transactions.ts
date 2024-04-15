import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import logger from '@motech-development/node-logger';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { getBalance } from './shared/balance';
import extractStream from './shared/extract-stream';
import { IBalance } from './shared/transform-transactions';
import { unmarshallAllRecords } from './shared/unmarshall-records';

const documentClient = new DynamoDBClient({});

export const handler: DynamoDBStreamHandler = async (event) => {
  const { TABLE } = extractStream(event);

  const unmarshalledRecords = unmarshallAllRecords<IBalance>(
    event.Records,
    'Balance',
  );

  const transactions = unmarshalledRecords
    .filter(
      ({ NewImage, OldImage }) => NewImage.updatedAt !== OldImage.updatedAt,
    )
    .map(({ NewImage }) => getBalance(documentClient, TABLE, NewImage));

  try {
    await Promise.all(transactions);
  } catch (e) {
    logger.error('An error occurred', e);
  }
};
