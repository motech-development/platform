import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import type { AppSyncResolverHandler } from 'aws-lambda';

export interface ITransactionStateArguments {
  companyId: string;
  transactionId: string;
}

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler: AppSyncResolverHandler<
  ITransactionStateArguments,
  Record<string, unknown> | null
> = async ({ arguments: { companyId, transactionId }, identity }) => {
  if (
    !identity ||
    !('sub' in identity) ||
    typeof identity.sub !== 'string' ||
    !identity.sub
  ) {
    throw new Error('Unauthorized');
  }

  const { TABLE } = process.env;
  if (!TABLE) throw new Error('No table set');

  const { Item } = await documentClient.send(
    new GetCommand({
      ConsistentRead: true,
      Key: { __typename: 'Transaction', id: transactionId },
      TableName: TABLE,
    }),
  );

  // Deleted, moved and inaccessible transactions have the same nullable result.
  if (Item?.companyId !== companyId || Item.owner !== identity.sub) {
    return null;
  }

  return Item;
};
