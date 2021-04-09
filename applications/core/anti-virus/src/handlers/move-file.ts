import { moveFile } from '@motech-development/s3-file-operations';
import { Handler } from 'aws-lambda';

export interface IEvent {
  from: string;
  key: string;
  to: string;
}

export const handler: Handler<IEvent> = async (event) => {
  const { from, key, to } = event;

  await moveFile(from, to, key);
};
