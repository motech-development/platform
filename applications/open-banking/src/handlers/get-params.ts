import { Handler } from 'aws-lambda';
import { object, string } from 'yup';

const schema = object().shape({
  bank: string().required(),
  callback: string().required(),
  id: string().required(),
});

export interface IEvent {
  bank: string;
  callback: string;
  id: string;
}

export const handler: Handler<IEvent> = async event => {
  await schema.validate(event, {
    stripUnknown: true,
  });

  return {
    ...event,
  };
};
