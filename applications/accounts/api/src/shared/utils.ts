import { AttributeValue, DynamoDBRecord } from 'aws-lambda';

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

export interface IFilteredModifyRecord {
  eventName: 'MODIFY';
  dynamodb: {
    NewImage: Record<string, AttributeValue>;
  };
}

export const isStreamModifyRecord = (
  value: DynamoDBRecord,
): value is IFilteredModifyRecord => {
  if (value.eventName === 'MODIFY') {
    return !!value.dynamodb?.NewImage;
  }

  return false;
};
