import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { init, wrapHandler } from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Handler } from 'aws-lambda';
import { number, object, string } from 'yup';
import padNumber from '../shared/padNumber';
import Status from '../shared/status';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
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

export interface IEvent {
  companyId: string;
  currency: string;
  owner: string;
  status: Status;
  year: number;
  yearEnd: {
    day: number;
    month: number;
  };
}

export const handler: Handler<IEvent> = wrapHandler(async (event) => {
  const { TABLE } = process.env;

  if (!TABLE) {
    throw new Error('No table set');
  }

  const result = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });
  const data = `${result.owner}:${result.companyId}:${result.status}`;
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
    TableName: TABLE,
  });
  const transactions = await client.send(command);

  if (transactions.Items && transactions.Items.length > 0) {
    return {
      companyId: result.companyId,
      complete: false,
      currency: result.currency,
      items: transactions.Items,
      owner: result.owner,
    };
  }

  return {
    complete: true,
  };
});
