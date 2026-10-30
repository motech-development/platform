import { join } from 'node:path';
import { SendMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs';
import type { DynamoDBRecord } from 'aws-lambda';
import { ITransaction } from '../shared/transaction';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const maxEntriesPerBatch = 10;
const maxAttempts = 3;
const baseDelayMs = 50;

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const sendBatch = async (
  sqs: SQSClient,
  queueUrl: string,
  entries: NonNullable<
    ConstructorParameters<typeof SendMessageBatchCommand>[0]['Entries']
  >,
): Promise<void> => {
  const sendFailedEntries = async (
    pending: typeof entries,
    attempt: number,
  ): Promise<void> => {
    if (pending.length === 0) return;

    const { Failed = [] } = await sqs.send(
      new SendMessageBatchCommand({
        Entries: pending,
        QueueUrl: queueUrl,
      }),
    );

    if (Failed.length === 0) return;

    const failures = new Map(Failed.map((failure) => [failure.Id, failure]));
    const failedEntries = pending.filter((entry) => failures.has(entry.Id));

    if (
      failedEntries.length !== Failed.length ||
      Failed.some((failure) => !failure.Id || !failures.has(failure.Id))
    ) {
      throw new Error('SQS returned an invalid batch failure response');
    }

    const senderFault = Failed.find((failure) => failure.SenderFault);

    if (senderFault) {
      throw new Error(
        `SQS rejected entry ${senderFault.Id}: ${senderFault.Code ?? 'sender fault'}`,
      );
    }

    if (attempt + 1 >= maxAttempts) {
      throw new Error(
        `SQS batch send failed after ${maxAttempts} attempts: ${Failed.map(({ Id, Code }) => `${Id}:${Code ?? 'unknown'}`).join(', ')}`,
      );
    }

    await delay(baseDelayMs * 2 ** attempt);
    await sendFailedEntries(failedEntries, attempt + 1);
  };

  return sendFailedEntries(entries, 0);
};

const deleteAttachments = (
  sqs: SQSClient,
  queueUrl: string,
  records: DynamoDBRecord[],
): Promise<void> => {
  const unmarshalledRecords = unmarshallOldRecords<ITransaction>(
    records,
    'Transaction',
  );
  const entries = unmarshalledRecords
    .filter(({ OldImage }) => !!OldImage.attachment)
    .map(({ OldImage }, index) => ({
      DelaySeconds: 300,
      Id: `message-${index}`,
      MessageAttributes: {
        key: {
          DataType: 'String',
          StringValue: join(OldImage.owner, OldImage.attachment),
        },
      },
      MessageBody: `Delete ${OldImage.attachment}`,
    }));

  const batches = [];

  for (let start = 0; start < entries.length; start += maxEntriesPerBatch) {
    batches.push(entries.slice(start, start + maxEntriesPerBatch));
  }

  return batches.reduce<Promise<void>>(
    (previous, batch) => previous.then(() => sendBatch(sqs, queueUrl, batch)),
    Promise.resolve(),
  );
};

export default deleteAttachments;
