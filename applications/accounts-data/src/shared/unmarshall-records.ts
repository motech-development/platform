import { DynamoDBRecord, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const unmarshallRecords = (records: DynamoDBRecord[], typename: string) =>
  records
    .filter(record => record.dynamodb !== undefined)
    .filter(record => {
      const { NewImage, OldImage } = record.dynamodb as StreamRecord;

      return NewImage !== undefined && OldImage !== undefined;
    })
    .map(record => {
      const { NewImage, OldImage } = record.dynamodb as StreamRecord;

      return {
        NewImage: DynamoDB.Converter.unmarshall(
          NewImage as DynamoDB.AttributeMap,
        ),
        OldImage: DynamoDB.Converter.unmarshall(
          OldImage as DynamoDB.AttributeMap,
        ),
      };
    })
    .filter(
      ({ NewImage, OldImage }) =>
        // eslint-disable-next-line no-underscore-dangle
        NewImage.__typename === typename && OldImage.__typename === typename,
    );

export default unmarshallRecords;
