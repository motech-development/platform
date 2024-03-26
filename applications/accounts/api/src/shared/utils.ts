import { AttributeValue, DynamoDBRecord } from 'aws-lambda';

export interface IFilteredRecord {
  eventName: 'INSERT';
  dynamodb: {
    NewImage: Record<string, AttributeValue>;
  };
}

export const isStreamRecord = (
  value: DynamoDBRecord,
): value is IFilteredRecord => {
  if (value.eventName === 'INSERT') {
    return !!value.dynamodb?.NewImage;
  }

  return false;
};
