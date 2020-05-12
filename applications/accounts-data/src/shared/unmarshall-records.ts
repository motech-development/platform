import { DynamoDBRecord, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { ITransaction } from './transaction';

const getRecords = (records: DynamoDBRecord[]) =>
  records
    .filter(record => record.dynamodb !== undefined)
    .map(record => record.dynamodb as StreamRecord);

export const unmarshallAllRecords = (
  records: DynamoDBRecord[],
  typename: string,
) =>
  getRecords(records)
    .filter(record => {
      const { NewImage, OldImage } = record;

      return NewImage !== undefined && OldImage !== undefined;
    })
    .map(record => {
      const { NewImage, OldImage } = record;

      return {
        NewImage: DynamoDB.Converter.unmarshall(
          NewImage as DynamoDB.AttributeMap,
        ) as ITransaction,
        OldImage: DynamoDB.Converter.unmarshall(
          OldImage as DynamoDB.AttributeMap,
        ) as ITransaction,
      };
    })
    .filter(
      ({ NewImage, OldImage }) =>
        // eslint-disable-next-line no-underscore-dangle
        NewImage.__typename === typename && OldImage.__typename === typename,
    );

export const unmarshallNewRecords = (
  records: DynamoDBRecord[],
  typename: string,
) =>
  getRecords(records)
    .filter(record => {
      const { NewImage } = record;

      return NewImage !== undefined;
    })
    .map(record => {
      const { NewImage } = record;

      return {
        NewImage: DynamoDB.Converter.unmarshall(
          NewImage as DynamoDB.AttributeMap,
        ) as ITransaction,
      };
    })
    .filter(
      ({ NewImage }) =>
        // eslint-disable-next-line no-underscore-dangle
        NewImage.__typename === typename,
    );

export const unmarshallOldRecords = (
  records: DynamoDBRecord[],
  typename: string,
) =>
  getRecords(records)
    .filter(record => {
      const { OldImage } = record;

      return OldImage !== undefined;
    })
    .map(record => {
      const { OldImage } = record;

      return {
        OldImage: DynamoDB.Converter.unmarshall(
          OldImage as DynamoDB.AttributeMap,
        ) as ITransaction,
      };
    })
    .filter(
      ({ OldImage }) =>
        // eslint-disable-next-line no-underscore-dangle
        OldImage.__typename === typename,
    );
