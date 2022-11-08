import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';

interface IExtractStream {
  TABLE: string;
  inserts: DynamoDBRecord[];
  removals: DynamoDBRecord[];
  updates: DynamoDBRecord[];
}

const extractStream = (event: DynamoDBStreamEvent): IExtractStream => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  const inserts = event.Records.filter(
    ({ eventName }) => eventName === 'INSERT',
  );
  const updates = event.Records.filter(
    ({ eventName }) => eventName === 'MODIFY',
  );
  const removals = event.Records.filter(
    ({ eventName }) => eventName === 'REMOVE',
  );

  return {
    TABLE,
    inserts,
    removals,
    updates,
  };
};

export default extractStream;
