import { join } from 'node:path';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import type {
  SQSMessageAttribute,
  SQSMessageAttributes,
  SQSRecord,
} from 'aws-lambda';
import publishNotification from '../shared/publish-notification';

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

interface IFilteredData extends Record<string, NativeAttributeValue> {
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
  attribute: Record<string, NativeAttributeValue>,
): attribute is IFilteredData =>
  !!attribute.__typename || !!attribute.id || !!attribute.owner;

const queryPages = async (
  documentClient: DynamoDBClient,
  input: QueryCommandInput,
): Promise<Record<string, NativeAttributeValue>[]> => {
  const command = new QueryCommand(input);

  const { Items = [], LastEvaluatedKey } = await documentClient.send(command);

  if (!LastEvaluatedKey) {
    return Items;
  }

  const next = await queryPages(documentClient, {
    ...input,
    ExclusiveStartKey: LastEvaluatedKey,
  });

  return [...Items, ...next];
};

const updateAttachments = async (
  documentClient: DynamoDBClient,
  tableName: string,
  bucket: string,
  records: SQSRecord[],
): Promise<Promise<UpdateCommandOutput>[]> => {
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
      const input: QueryCommandInput = {
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
      };

      return queryPages(documentClient, input);
    });

  const results = await Promise.all(query);

  const filtered = results.flat().filter(hasObjectAttributes);

  const update = filtered.map(({ __typename, id }) => {
    const command = new UpdateCommand({
      ExpressionAttributeNames: {
        '#attachment': 'attachment',
      },
      Key: {
        __typename,
        id,
      },
      TableName: tableName,
      UpdateExpression: 'REMOVE #attachment',
    });

    return documentClient.send(command);
  });

  const notification = filtered.map(({ owner }) =>
    publishNotification(documentClient, tableName, owner, 'VIRUS_SCAN_FAIL'),
  );

  return [...notification, ...update];
};

export default updateAttachments;
