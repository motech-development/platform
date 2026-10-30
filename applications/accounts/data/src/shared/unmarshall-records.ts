import { NativeAttributeValue, unmarshall } from '@aws-sdk/util-dynamodb';
import type { DynamoDBRecord, StreamRecord } from 'aws-lambda';

interface IUnmarshallAllRecords<T> {
  eventID?: string;
  eventSourceARN?: string;
  NewImage: T;
  OldImage: T;
}

interface IUnmarshallNewRecords<T> {
  eventID?: string;
  eventSourceARN?: string;
  NewImage: T;
}

interface IUnmarshallOldRecords<T> {
  eventID?: string;
  eventSourceARN?: string;
  OldImage: T;
}

interface IRecord {
  __typename: string;
}

const getRecords = (
  records: DynamoDBRecord[],
): (DynamoDBRecord & { dynamodb: StreamRecord })[] =>
  records.filter(
    (record): record is DynamoDBRecord & { dynamodb: StreamRecord } =>
      record.dynamodb !== undefined,
  );

export const unmarshallAllRecords = <T extends IRecord>(
  records: DynamoDBRecord[],
  typename: string,
): IUnmarshallAllRecords<T>[] =>
  getRecords(records)
    .filter((record) => {
      const { NewImage, OldImage } = record.dynamodb;

      return NewImage !== undefined && OldImage !== undefined;
    })
    .map((record) => {
      const { NewImage, OldImage } = record.dynamodb;

      return {
        ...(record.eventID ? { eventID: record.eventID } : {}),
        ...(record.eventSourceARN
          ? { eventSourceARN: record.eventSourceARN }
          : {}),
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
        NewImage.__typename === typename && OldImage.__typename === typename,
    );

export const unmarshallNewRecords = <T extends IRecord>(
  records: DynamoDBRecord[],
  typename: string,
): IUnmarshallNewRecords<T>[] =>
  getRecords(records)
    .filter((record) => {
      const { NewImage } = record.dynamodb;

      return NewImage !== undefined;
    })
    .map((record) => {
      const { NewImage } = record.dynamodb;

      return {
        ...(record.eventID ? { eventID: record.eventID } : {}),
        ...(record.eventSourceARN
          ? { eventSourceARN: record.eventSourceARN }
          : {}),
        NewImage: unmarshall(
          NewImage as Record<string, NativeAttributeValue>,
        ) as T,
      };
    })
    .filter(({ NewImage }) => NewImage.__typename === typename);

export const unmarshallOldRecords = <T extends IRecord>(
  records: DynamoDBRecord[],
  typename: string,
): IUnmarshallOldRecords<T>[] =>
  getRecords(records)
    .filter((record) => {
      const { OldImage } = record.dynamodb;

      return OldImage !== undefined;
    })
    .map((record) => {
      const { OldImage } = record.dynamodb;

      return {
        ...(record.eventID ? { eventID: record.eventID } : {}),
        ...(record.eventSourceARN
          ? { eventSourceARN: record.eventSourceARN }
          : {}),
        OldImage: unmarshall(
          OldImage as Record<string, NativeAttributeValue>,
        ) as T,
      };
    })
    .filter(({ OldImage }) => OldImage.__typename === typename);
