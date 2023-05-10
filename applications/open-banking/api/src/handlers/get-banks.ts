import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';
import client from '../shared/document-client';

interface IItem {
  name: string;
  pk: string;
}

const documentClient = client();

const isItem = (
  attributeMap: Record<string, NativeAttributeValue>,
): attributeMap is IItem => !!attributeMap.name && !!attributeMap.pk;

export const handler = apiGatewayHandler(async () => {
  const TABLE = paramCheck(process.env.TABLE, 'No table set', 400);
  const command = new QueryCommand({
    ExpressionAttributeNames: {
      '#name': 'name',
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':sk': 'Bank',
    },
    IndexName: 'sk-data-index',
    KeyConditionExpression: '#sk = :sk',
    ProjectionExpression: '#name, #pk',
    TableName: TABLE,
  });
  const { Items } = await documentClient.send(command);

  const items = Items
    ? Items.filter(isItem).map((item) => ({
        id: item.pk,
        name: item.name,
      }))
    : [];

  return response(
    {
      items,
    },
    200,
  );
});
