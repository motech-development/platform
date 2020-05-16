import { Handler } from 'aws-lambda';
import { moveFile } from '../shared/file-operations';

export interface IEvent {
  from: string;
  key: string;
  to: string;
}

export const handler: Handler<IEvent> = async event => {
  const { from, key, to } = event;

  await moveFile(from, to, key);
};
