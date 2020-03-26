import { Handler } from 'aws-lambda';
import { object, string } from 'yup';

const schema = object().shape({
  bank: string().required(),
  callback: string().required(),
  id: string().required(),
  user: string().nullable(),
});

export interface IEvent {
  bank: string;
  callback: string;
  id: string;
  user: string;
}

export const handler: Handler<IEvent> = async event => {
  await schema.validate(event, {
    stripUnknown: true,
  });

  return {
    ...event,
  };
};
