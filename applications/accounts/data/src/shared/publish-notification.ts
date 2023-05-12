import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommand, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

const publishNotification = (
  documentClient: DynamoDBClient,
  tableName: string,
  owner: string,
  message: string,
): Promise<UpdateCommandOutput> => {
  const now = DateTime.utc();
  const command = new UpdateCommand({
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
  });

  return documentClient.send(command);
};

export default publishNotification;
