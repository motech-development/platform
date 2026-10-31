import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Handler } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import type { InferType } from 'yup';
import { number, object, string } from 'yup';
import padNumber from '../shared/padNumber';
import {
  hasQueryContinuationKey,
  writeReportQueryPages,
} from '../shared/report-payload';
import Status from '../shared/status';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileLifecycle: 'trace',
  profileSessionSampleRate: 1,
  tracesSampleRate: 1,
});

const client = new DynamoDBClient({});

const schema = object({
  companyId: string().required(),
  currency: string().required(),
  owner: string().required(),
  status: string().oneOf([Status.Confirmed, Status.Pending]).required(),
  year: number().required(),
  yearEnd: object({
    day: number().max(31).required(),
    month: number().max(11).required(),
  }).required(),
}).required();

export type IEvent = InferType<typeof schema>;

export type IOutput =
  | {
      complete: true;
    }
  | {
      complete: false;
      companyId: string;
      currency: string;
      owner: string;
      payloadKey: string;
    };

export const handler: Handler<IEvent, IOutput> = wrapHandler(async (event) => {
  const { REPORT_BUCKET, TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  if (!REPORT_BUCKET) {
    throw new Error('No report bucket set');
  }

  const result = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });
  const data = `${result.owner}:${result.companyId}:${result.status}`;
  const queryPage = async (
    ExclusiveStartKey?: QueryCommandInput['ExclusiveStartKey'],
    abortSignal?: AbortSignal,
  ) => {
    const command = new QueryCommand({
      ExpressionAttributeNames: {
        '#data': 'data',
        '#owner': 'owner',
        '#typename': '__typename',
      },
      ExpressionAttributeValues: {
        ':lower': `${data}:${result.year}-${padNumber(
          result.yearEnd.month + 1,
          2,
        )}-${padNumber(result.yearEnd.day + 1, 2)}T00:00:00Z`,
        ':owner': result.owner,
        ':typename': 'Transaction',
        ':upper': `${data}:${result.year + 1}-${padNumber(
          result.yearEnd.month + 1,
          2,
        )}-${padNumber(result.yearEnd.day, 2)}T23:59:59Z`,
      },
      FilterExpression: '#owner = :owner',
      IndexName: '__typename-data-index',
      KeyConditionExpression:
        '#typename = :typename AND #data BETWEEN :lower AND :upper',
      ScanIndexForward: false,
      ...(hasQueryContinuationKey(ExclusiveStartKey)
        ? { ExclusiveStartKey }
        : {}),
      TableName: TABLE,
    });

    return client.send(command, abortSignal ? { abortSignal } : undefined);
  };

  const firstPage = await queryPage();

  if (
    !firstPage.Items?.length &&
    !hasQueryContinuationKey(firstPage.LastEvaluatedKey)
  ) {
    return {
      complete: true,
    };
  }

  const payloadKey = `${result.owner}/${result.companyId}/report-data/${uuid()}.json`;
  const transactionCount = await writeReportQueryPages(
    REPORT_BUCKET,
    payloadKey,
    firstPage,
    queryPage,
  );

  if (transactionCount === 0) {
    return {
      complete: true,
    };
  }

  return {
    companyId: result.companyId,
    complete: false,
    currency: result.currency,
    owner: result.owner,
    payloadKey,
  };
});
