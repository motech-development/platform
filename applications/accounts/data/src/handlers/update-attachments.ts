import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import logger from '@motech-development/node-logger';
import type {
  SQSMessageAttribute,
  SQSMessageAttributes,
  SQSRecord,
} from 'aws-lambda';
import { DateTime } from 'luxon';

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
  attachment: string;
  id: string;
  owner: string;
}

interface IMetadata {
  typename: string;
}

const logAndSkip = (record: SQSRecord, reason: string) => {
  logger.error('Skipping attachment cleanup message', {
    messageId: record.messageId,
    reason,
  });
};

const hasStringValues = (
  messageAttributes: SQSMessageAttributes,
): messageAttributes is IData => {
  const { key, metadata, source } = messageAttributes;

  return (
    typeof key?.stringValue === 'string' &&
    key.stringValue.length > 0 &&
    key.dataType === 'String' &&
    typeof metadata?.stringValue === 'string' &&
    metadata.stringValue.length > 0 &&
    metadata.dataType === 'String' &&
    typeof source?.stringValue === 'string' &&
    source.stringValue.length > 0 &&
    source.dataType === 'String'
  );
};

const hasObjectAttributes = (
  attribute: Record<string, NativeAttributeValue>,
  typename: string,
  owner: string,
  attachment: string,
): attribute is IFilteredData =>
  attribute.__typename === typename &&
  typeof attribute.id === 'string' &&
  attribute.id.length > 0 &&
  attribute.owner === owner &&
  attribute.attachment === attachment;

const notificationId = (messageId: string, typename: string, id: string) =>
  createHash('sha256')
    .update(JSON.stringify([messageId, typename, id]))
    .digest('hex');

const removeAttachmentAndNotify = async (
  documentClient: DynamoDBClient,
  tableName: string,
  record: SQSRecord,
  item: IFilteredData,
) => {
  const createdAt = DateTime.utc().toISO();
  const id = notificationId(record.messageId, item.__typename, item.id);

  try {
    await documentClient.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Update: {
              ConditionExpression:
                '#owner = :owner AND #attachment = :attachment',
              ExpressionAttributeNames: {
                '#attachment': 'attachment',
                '#owner': 'owner',
              },
              ExpressionAttributeValues: {
                ':attachment': item.attachment,
                ':owner': item.owner,
              },
              Key: {
                __typename: item.__typename,
                id: item.id,
              },
              TableName: tableName,
              UpdateExpression: 'REMOVE #attachment',
            },
          },
          {
            Put: {
              ConditionExpression: 'attribute_not_exists(#id)',
              ExpressionAttributeNames: {
                '#id': 'id',
              },
              Item: {
                __typename: 'Notification',
                createdAt,
                data: `${item.owner}:Notification:${createdAt}`,
                id,
                message: 'VIRUS_SCAN_FAIL',
                owner: item.owner,
                read: false,
              },
              TableName: tableName,
            },
          },
        ],
      }),
    );
  } catch (error) {
    let current;

    try {
      ({ Item: current } = await documentClient.send(
        new GetCommand({
          ConsistentRead: true,
          Key: {
            __typename: item.__typename,
            id: item.id,
          },
          TableName: tableName,
        }),
      ));
    } catch (recoveryError) {
      logger.error('Failed to check attachment cleanup transaction', {
        error,
        messageId: record.messageId,
        recoveryError,
      });

      throw recoveryError;
    }

    if (
      current?.owner !== item.owner ||
      current?.attachment !== item.attachment
    ) {
      return;
    }

    throw error;
  }
};

const updateAttachments = async (
  documentClient: DynamoDBClient,
  tableName: string,
  bucket: string,
  record: SQSRecord,
): Promise<void> => {
  const { messageAttributes } = record;

  if (
    !record.messageId ||
    !messageAttributes ||
    !hasStringValues(messageAttributes)
  ) {
    logAndSkip(record, 'Missing message ID or required message attributes');

    return;
  }

  const { key, metadata, source } = messageAttributes;

  if (source.stringValue !== bucket) {
    logAndSkip(record, 'Source bucket does not match the configured bucket');

    return;
  }

  let parts: string[];
  let parsedMetadata: unknown;

  try {
    parts = decodeURIComponent(key.stringValue).split('/');
    parsedMetadata = JSON.parse(metadata.stringValue) as unknown;
  } catch {
    logAndSkip(record, 'Invalid encoded key or metadata JSON');

    return;
  }

  if (
    parts.length !== 3 ||
    parts.some((part) => part.length === 0) ||
    typeof parsedMetadata !== 'object' ||
    parsedMetadata === null ||
    !('typename' in parsedMetadata) ||
    typeof parsedMetadata.typename !== 'string' ||
    parsedMetadata.typename.length === 0
  ) {
    logAndSkip(record, 'Invalid key or metadata shape');

    return;
  }

  const [owner, companyId, fileName] = parts;
  const { typename } = parsedMetadata as IMetadata;
  const attachment = join(companyId, fileName);
  const query = {
    ExpressionAttributeNames: {
      '#attachment': 'attachment',
      '#data': 'data',
      '#owner': 'owner',
      '#typename': '__typename',
    },
    ExpressionAttributeValues: {
      ':attachment': attachment,
      ':data': `${owner}:${companyId}`,
      ':owner': owner,
      ':typename': typename,
    },
    FilterExpression: '#owner = :owner AND #attachment = :attachment',
    IndexName: '__typename-data-index',
    KeyConditionExpression:
      '#typename = :typename AND begins_with(#data, :data)',
    ProjectionExpression: '#attachment, id, #owner, #typename',
    TableName: tableName,
  };

  const matches: IFilteredData[] = [];

  const queryPage = async (
    ExclusiveStartKey?: Record<string, NativeAttributeValue>,
  ): Promise<void> => {
    const { Items, LastEvaluatedKey } = await documentClient.send(
      new QueryCommand({
        ...query,
        ...(ExclusiveStartKey ? { ExclusiveStartKey } : {}),
      }),
    );

    matches.push(
      ...(Items ?? []).filter((item) =>
        hasObjectAttributes(item, typename, owner, attachment),
      ),
    );
    if (LastEvaluatedKey && Object.keys(LastEvaluatedKey).length > 0) {
      await queryPage(LastEvaluatedKey);
    }
  };

  await queryPage();

  await Promise.all(
    matches.map((item) =>
      removeAttachmentAndNotify(documentClient, tableName, record, item),
    ),
  );
};

export default updateAttachments;
