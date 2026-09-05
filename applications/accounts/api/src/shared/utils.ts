import type { AttributeValue, DynamoDBRecord } from 'aws-lambda';

export interface IFilteredInsertRecord {
  eventName: 'INSERT';
  dynamodb: {
    NewImage: Record<string, AttributeValue>;
  };
}

export const isStreamInsertRecord = (
  value: DynamoDBRecord,
): value is IFilteredInsertRecord => {
  if (value.eventName === 'INSERT') {
    return !!value.dynamodb?.NewImage;
  }

  return false;
};
