import { Handler } from 'aws-lambda';
import queueCompanyDelete from './handlers/queue-company-delete';

interface IEvent {
  arguments: {
    id: string;
    owner: string;
  };
  field: string;
}

export const handler: Handler<IEvent> = async event => {
  const { field } = event;

  switch (field) {
    case 'queueCompanyDelete':
      return queueCompanyDelete(event.arguments);
    default:
      throw new Error('Unrecognised field');
  }
};
