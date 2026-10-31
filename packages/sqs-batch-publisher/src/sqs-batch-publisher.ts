import {
  type BatchResultErrorEntry,
  SendMessageBatchCommand,
  type SendMessageBatchRequestEntry,
  SQSClient,
} from '@aws-sdk/client-sqs';

const maxAttempts = 3;
const baseDelayMs = 50;

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const describeFailures = (failures: BatchResultErrorEntry[]) =>
  failures.map(({ Id, Code }) => [Id, Code ?? 'unknown'].join(':')).join(', ');

const sendSqsBatchWithRetry = async (
  client: SQSClient,
  queueUrl: string,
  entries: SendMessageBatchRequestEntry[],
): Promise<void> => {
  const sendFailedEntries = async (
    pending: SendMessageBatchRequestEntry[],
    attempt: number,
  ): Promise<void> => {
    if (pending.length === 0) return;

    const { Failed = [] } = await client.send(
      new SendMessageBatchCommand({
        Entries: pending,
        QueueUrl: queueUrl,
      }),
    );

    if (Failed.length === 0) return;

    const failedIds = new Set(Failed.map(({ Id }) => Id));
    const failedEntries = pending.filter(({ Id }) => failedIds.has(Id));

    if (
      failedEntries.length !== Failed.length ||
      Failed.some(({ Id }) => !Id)
    ) {
      throw new Error('SQS returned an invalid batch failure response');
    }

    const senderFault = Failed.find(({ SenderFault }) => SenderFault);

    if (senderFault) {
      throw new Error(
        `SQS rejected entry ${senderFault.Id}: ${senderFault.Code ?? 'sender fault'}`,
      );
    }

    if (attempt + 1 >= maxAttempts) {
      throw new Error(
        `SQS batch send failed after ${maxAttempts} attempts: ${describeFailures(Failed)}`,
      );
    }

    await delay(baseDelayMs * 2 ** attempt);
    await sendFailedEntries(failedEntries, attempt + 1);
  };

  return sendFailedEntries(entries, 0);
};

export default sendSqsBatchWithRetry;
