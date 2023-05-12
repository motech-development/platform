import { NativeAttributeValue, unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBRecord, StreamRecord } from 'aws-lambda';

interface IUnmarshallAllRecords<T> {
  NewImage: T;
  OldImage: T;
}

interface IUnmarshallNewRecords<T> {
  NewImage: T;
}

interface IUnmarshallOldRecords<T> {
  OldImage: T;
}

interface IRecord {
  __typename: string;
}

const getRecords = (records: DynamoDBRecord[]) =>
  records
    .filter((record) => record.dynamodb !== undefined)
    .map((record) => record.dynamodb as StreamRecord);

export const unmarshallAllRecords = <T extends IRecord>(
  records: DynamoDBRecord[],
  typename: string,
): IUnmarshallAllRecords<T>[] =>
  getRecords(records)
    .filter((record) => {
      const { NewImage, OldImage } = record;

      return NewImage !== undefined && OldImage !== undefined;
    })
    .map((record) => {
      const { NewImage, OldImage } = record;

      return {
        NewImage: unmarshall(
          NewImage as Record<string, NativeAttributeValue>,
        ) as T,
        OldImage: unmarshall(
          OldImage as Record<string, NativeAttributeValue>,
        ) as T,
      };
    })
    .filter(
      ({ NewImage, OldImage }) =>
        // eslint-disable-next-line no-underscore-dangle
        NewImage.__typename === typename && OldImage.__typename === typename,
    );

export const unmarshallNewRecords = <T extends IRecord>(
  records: DynamoDBRecord[],
  typename: string,
): IUnmarshallNewRecords<T>[] =>
  getRecords(records)
    .filter((record) => {
      const { NewImage } = record;

      return NewImage !== undefined;
    })
    .map((record) => {
      const { NewImage } = record;

      return {
        NewImage: unmarshall(
          NewImage as Record<string, NativeAttributeValue>,
        ) as T,
      };
    })
    .filter(
      ({ NewImage }) =>
        // eslint-disable-next-line no-underscore-dangle
        NewImage.__typename === typename,
    );

export const unmarshallOldRecords = <T extends IRecord>(
  records: DynamoDBRecord[],
  typename: string,
): IUnmarshallOldRecords<T>[] =>
  getRecords(records)
    .filter((record) => {
      const { OldImage } = record;

      return OldImage !== undefined;
    })
    .map((record) => {
      const { OldImage } = record;

      return {
        OldImage: unmarshall(
          OldImage as Record<string, NativeAttributeValue>,
        ) as T,
      };
    })
    .filter(
      ({ OldImage }) =>
        // eslint-disable-next-line no-underscore-dangle
        OldImage.__typename === typename,
    );
