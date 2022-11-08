import { Handler } from 'aws-lambda';
import getBalance from './handlers/get-balance';
import { ITransformedBalance } from './shared/transform-balance';

export interface IEvent {
  args: {
    id: string;
    owner: string;
  };
  field: string;
}

export const handler: Handler<IEvent, ITransformedBalance> = async (event) => {
  const { args, field } = event;

  if (field === 'getBalance') {
    return getBalance(args);
  }

  throw new Error('Unrecognised field');
};
