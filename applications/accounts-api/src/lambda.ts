import { Handler } from 'aws-lambda';
import getBalance from './handlers/get-balance';

export interface IEvent {
  args: {
    id: string;
    owner: string;
  };
  field: string;
}

export const handler: Handler<IEvent> = async event => {
  const { args, field } = event;

  switch (field) {
    case 'getBalance':
      return getBalance(args);
    default:
      throw new Error('Unrecognised field');
  }
};
