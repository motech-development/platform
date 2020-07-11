import { SQSRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { join } from 'path';

const updateAttachments = (
  documentClient: DocumentClient,
  tableName: string,
  bucket: string,
  records: SQSRecord[],
) => {
  const transactionItems = records
    .filter(({ messageAttributes }) => {
      const { key, metadata, source } = messageAttributes;

      if (
        source.stringValue !== bucket ||
        !metadata.stringValue ||
        !key.stringValue
      ) {
        return false;
      }

      const { id } = JSON.parse(metadata.stringValue as string);

      return !!id;
    })
    .map(({ messageAttributes }) => {
      const { key, metadata } = messageAttributes;
      const pathParts = (key.stringValue as string).split('/').slice(1);
      const attachment = join(...pathParts);
      const { id, typename } = JSON.parse(metadata.stringValue as string);

      return documentClient
        .update({
          ConditionExpression: '#attachment = :attachment',
          ExpressionAttributeNames: {
            '#attachment': 'attachment',
          },
          ExpressionAttributeValues: {
            ':attachment': attachment,
          },
          Key: {
            __typename: typename,
            id,
          },
          TableName: tableName,
          UpdateExpression: 'REMOVE #attachment',
        })
        .promise();
    });

  return transactionItems;
};

export default updateAttachments;
