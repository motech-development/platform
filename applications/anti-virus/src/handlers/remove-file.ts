import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { deleteFile } from '../shared/file-operations';

const s3 = new S3();

interface IEvent {
  from: string;
  key: string;
}

export const handler: Handler<IEvent> = async event => {
  const { from, key } = event;

  await deleteFile(s3, from, key);
};
