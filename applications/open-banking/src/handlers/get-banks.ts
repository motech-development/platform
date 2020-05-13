import proxyHandler from '@motech-development/api-gateway-handler';
import client from '../shared/document-client';

const documentClient = client();

export const handler = proxyHandler(async () => {
  const { TABLE } = process.env;

  if (!TABLE) {
    const response = {
      body: JSON.stringify({
        message: 'No table set',
        statusCode: 500,
      }),
      statusCode: 500,
    };

    throw response;
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
