import { Handler } from 'aws-lambda';
import { deleteFile } from '../shared/file-operations';

export interface IEvent {
  from: string;
  key: string;
}

export const handler: Handler<IEvent> = async event => {
  const { from, key } = event;

  await deleteFile(from, key);
};
