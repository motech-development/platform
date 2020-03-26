import { Handler } from 'aws-lambda';
import documentClient from '../shared/document-client';
import proxyHandler from '../shared/proxy-handler';

export const get: Handler = proxyHandler(async () => {
  // TODO: Use proper error handling
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

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

  return {
    body: JSON.stringify({
      items,
    }),
    statusCode: 200,
  };
});
