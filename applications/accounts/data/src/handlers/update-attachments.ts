import { SQSRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { join } from 'path';

const updateAttachments = async (
  documentClient: DocumentClient,
  tableName: string,
  bucket: string,
  records: SQSRecord[],
) => {
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
          ProjectionExpression: 'id, #typename',
          TableName: tableName,
        })
        .promise();
    });

  const results = await Promise.all(query);

  const transactionItems = results
    .filter(({ Items }) => Items && Items.length > 0)
    .map(({ Items }) => Items as DocumentClient.ItemList)
    .reduce((acc, items) => acc.concat(items), [])
    .map(({ __typename, id }) =>
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

  return transactionItems;
};

export default updateAttachments;
