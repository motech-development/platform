import { AWSError } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

export type TPublishNotification = PromiseResult<
  DocumentClient.UpdateItemOutput,
  AWSError
>;

const publishNotification = (
  documentClient: DocumentClient,
  tableName: string,
  owner: string,
  message: string,
): Promise<TPublishNotification> => {
  const now = DateTime.utc();

  return documentClient
    .update({
      ExpressionAttributeNames: {
        '#createdAt': 'createdAt',
        '#data': 'data',
        '#message': 'message',
        '#owner': 'owner',
        '#read': 'read',
      },
      ExpressionAttributeValues: {
        ':createdAt': now.toISO(),
        ':data': `${owner}:Notification:${now.toISO()}`,
        ':message': message,
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
    .promise();
};

export default publishNotification;
