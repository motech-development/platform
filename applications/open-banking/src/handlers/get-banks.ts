import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';
import client from '../shared/document-client';

const documentClient = client();

export const handler = apiGatewayHandler(async () => {
  const TABLE = paramCheck(process.env.TABLE, 'No table set', 400);
  const { Items } = await documentClient
    .query({
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
    })
    .promise();

  const items = Items
    ? Items.map(item => ({
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
