import {
  SQSMessageAttribute,
  SQSMessageAttributes,
  SQSRecord,
} from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { join } from 'path';
import publishNotification, {
  TPublishNotification,
} from '../shared/publish-notification';

interface IData extends SQSMessageAttributes {
  key: SQSMessageAttribute & {
    stringValue: string;
  };
  metadata: SQSMessageAttribute & {
    stringValue: string;
  };
  source: SQSMessageAttribute & {
    stringValue: string;
  };
}

interface IFilteredData extends DocumentClient.AttributeMap {
  __typename: string;
  id: string;
  owner: string;
}

interface IMetadata {
  id: string;
  typename: string;
}

const hasStringValues = (
  messageAttributes: SQSMessageAttributes,
): messageAttributes is IData => {
  const { key, metadata, source } = messageAttributes;

  return !!key.stringValue && !!metadata.stringValue && !!source.stringValue;
};

const hasObjectAttributes = (
  attribute: DocumentClient.AttributeMap,
): attribute is IFilteredData =>
  !!attribute.__typename && !!attribute.id && !!attribute.owner;

const updateAttachments = async (
  documentClient: DocumentClient,
  tableName: string,
  bucket: string,
  records: SQSRecord[],
): Promise<Promise<TPublishNotification>[]> => {
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
    .map(({ messageAttributes }) => messageAttributes)
    .filter(hasStringValues)
    .map((messageAttributes) => {
      const { key, metadata } = messageAttributes;
      const [owner, id, name] = decodeURIComponent(key.stringValue).split('/');
      const attachment = join(id, name);
      const { typename } = JSON.parse(metadata.stringValue) as IMetadata;

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
    .reduce((acc, items) => acc.concat(items), [])
    .filter(hasObjectAttributes);

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
    publishNotification(documentClient, tableName, owner, 'VIRUS_SCAN_FAIL'),
  );

  return [...notification, ...update];
};

export default updateAttachments;
