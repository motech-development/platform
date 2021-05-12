import { deleteFile } from '@motech-development/s3-file-operations';
import { Handler } from 'aws-lambda';

export interface IEvent {
  from: string;
  key: string;
}

export const handler: Handler<IEvent> = async (event) => {
  const { from, key } = event;

  await deleteFile(from, key);
};
