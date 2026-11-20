import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { captureException, init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { AppSyncIdentity, AppSyncResolverHandler } from 'aws-lambda';
import type { QueryGetTransactionStateArgs } from '../graphql/graphql';
import transactionCompanyId from '../shared/transaction-company-id';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

export type ITransactionStateArguments = QueryGetTransactionStateArgs;

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const ownerIdClaim = 'https://motechdevelopment.co.uk/owner_id';

const ownerIdOf = (identity: AppSyncIdentity) => {
  if (!identity || !('sub' in identity)) {
    return undefined;
  }

  const claims = identity.claims as Record<string, unknown> | undefined;
  const claim = claims?.[ownerIdClaim];
  const ownerId: unknown =
    typeof claim === 'string' && claim ? claim : identity.sub;

  return typeof ownerId === 'string' && ownerId ? ownerId : undefined;
};

export const handler: AppSyncResolverHandler<
  ITransactionStateArguments,
  Record<string, unknown> | null
> = wrapHandler(
  async ({ arguments: { companyId, transactionId }, identity }) => {
    const ownerId = ownerIdOf(identity);

    if (!ownerId) {
      return {
        errorMessage: 'Unauthorized',
        errorType: 'UnauthorizedException',
      };
    }

    const { TABLE } = process.env;

    if (!TABLE)
      return {
        errorMessage: 'Transaction state is unavailable',
        errorType: 'ConfigurationError',
      };

    try {
      const command = new GetCommand({
        ConsistentRead: true,
        Key: {
          __typename: 'Transaction',
          id: transactionId,
        },
        TableName: TABLE,
      });

      const { Item } = await documentClient.send(command);

      // Deleted, moved and inaccessible transactions have the same nullable result.
      if (Item?.owner !== ownerId) {
        return null;
      }

      const currentCompanyId = transactionCompanyId(Item);

      if (currentCompanyId !== companyId) {
        return null;
      }

      return {
        ...Item,
        companyId: currentCompanyId,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        /^(ResourceNotFoundException|ValidationException|AccessDeniedException|UnrecognizedClientException)$/.test(
          error.name,
        )
      ) {
        captureException(error);

        return {
          errorMessage: 'Transaction state is unavailable',
          errorType: 'ConfigurationError',
        };
      }

      throw error;
    }
  },
);
