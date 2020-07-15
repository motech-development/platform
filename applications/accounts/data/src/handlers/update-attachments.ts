import { SQSRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

const updateAttachments = async (
  documentClient: DocumentClient,
  tableName: string,
  bucket: string,
  records: SQSRecord[],
) => {
  const now = new Date();
  const query = records
    .filter(({ messageAttributes }) => {
      const { key, metadata, source } = messageAttributes;

      if (
        source.stringValue !== bucket ||
        !metadata.stringValue ||
        !key.stringValue
      ) {
        return false;
      }

      return true;
    })
    .map(({ messageAttributes }) => {
      const { key, metadata } = messageAttributes;
      const [owner, id, name] = decodeURIComponent(
        key.stringValue as string,
      ).split('/');
      const attachment = join(id, name);
      const { typename } = JSON.parse(metadata.stringValue as string);

      return documentClient
        .query({
          ExpressionAttributeNames: {
            '#attachment': 'attachment',
            '#data': 'data',
            '#owner': 'owner',
            '#typename': '__typename',
          },
          ExpressionAttributeValues: {
            ':attachment': attachment,
            ':data': `${owner}:${id}`,
            ':owner': owner,
            ':typename': typename,
          },
          FilterExpression: '#owner = :owner AND #attachment = :attachment',
          IndexName: '__typename-data-index',
          KeyConditionExpression:
            '#typename = :typename AND begins_with(#data, :data)',
          ProjectionExpression: 'id, #owner, #typename',
          TableName: tableName,
        })
        .promise();
    });

  const results = await Promise.all(query);
  const filtered = results
    .filter(({ Items }) => Items && Items.length > 0)
    .map(({ Items }) => Items as DocumentClient.ItemList)
    .reduce((acc, items) => acc.concat(items), []);

  const update = filtered.map(({ __typename, id }) =>
    documentClient
      .update({
        ExpressionAttributeNames: {
          '#attachment': 'attachment',
        },
        Key: {
          __typename,
          id,
        },
        TableName: tableName,
        UpdateExpression: 'REMOVE #attachment',
      })
      .promise(),
  );

  const notification = filtered.map(({ owner }) =>
    documentClient
      .update({
        ExpressionAttributeNames: {
          '#createdAt': 'createdAt',
          '#data': 'data',
          '#message': 'message',
          '#owner': 'owner',
          '#read': 'read',
        },
        ExpressionAttributeValues: {
          ':createdAt': now.toISOString(),
          ':data': `${owner}:Notification:${now.toISOString()}`,
          ':message': 'VIRUS_SCAN_FAIL',
          ':owner': owner,
          ':read': false,
        },
        Key: {
          __typename: 'Notification',
          id: uuid(),
        },
        TableName: tableName,
        UpdateExpression:
          'SET #createdAt = :createdAt, #data = :data, #message = :message, #owner = :owner, #read = :read',
      })
      .promise(),
  );

  return [...notification, ...update];
};

export default updateAttachments;
