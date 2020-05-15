import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { moveFile } from '../shared/file-operations';

const s3 = new S3();

interface IEvent {
  from: string;
  key: string;
  to: string;
}

export const handler: Handler<IEvent> = async event => {
  const { from, key, to } = event;

  await moveFile(s3, from, to, key);
};
