import { Handler } from 'aws-lambda';
import documentClient from '../shared/document-client';

export const get: Handler = async () => {
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
};
